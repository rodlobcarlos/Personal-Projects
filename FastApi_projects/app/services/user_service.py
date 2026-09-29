from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password
from app.models.user import User, UserRole
from app.schemas.user import UserCreate, UserUpdate


class AuthServiceError(Exception):
    pass


class DuplicateEmailError(AuthServiceError):
    pass


class InvalidCredentialsError(AuthServiceError):
    pass


class InactiveUserError(AuthServiceError):
    pass


def get_user_by_email(db: Session, email: str) -> User | None:
    stmt = select(User).where(func.lower(User.email) == email.lower())
    return db.execute(stmt).scalar_one_or_none()


def get_user_by_id(db: Session, user_id: int) -> User | None:
    return db.get(User, user_id)


def list_users(
    db: Session, *, skip: int = 0, limit: int = 100, search: str | None = None
) -> list[User]:
    stmt = select(User).order_by(User.id)
    if search:
        pattern = f"%{search.lower()}%"
        stmt = stmt.where(
            func.lower(User.email).like(pattern) | func.lower(User.full_name).like(pattern)
        )
    return list(db.execute(stmt.offset(skip).limit(limit)).scalars())


def count_users(db: Session, search: str | None = None) -> int:
    stmt = select(func.count()).select_from(User)
    if search:
        pattern = f"%{search.lower()}%"
        stmt = stmt.where(
            func.lower(User.email).like(pattern) | func.lower(User.full_name).like(pattern)
        )
    return db.execute(stmt).scalar_one()


def create_user(db: Session, payload: UserCreate) -> User:
    if get_user_by_email(db, payload.email):
        raise DuplicateEmailError(f"El email {payload.email} ya esta registrado")
    user = User(
        email=payload.email.lower(),
        full_name=payload.full_name,
        hashed_password=hash_password(payload.password),
        role=payload.role,
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def update_user(db: Session, user: User, payload: UserUpdate) -> User:
    data = payload.model_dump(exclude_unset=True)
    if data.get("email"):
        data["email"] = data["email"].lower()
        existing = get_user_by_email(db, data["email"])
        if existing and existing.id != user.id:
            raise DuplicateEmailError(f"El email {data['email']} ya esta registrado")
    if data.get("password"):
        user.hashed_password = hash_password(data.pop("password"))
    for field, value in data.items():
        setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return user


def delete_user(db: Session, user: User) -> None:
    db.delete(user)
    db.commit()


def authenticate(db: Session, email: str, password: str) -> User:
    user = get_user_by_email(db, email)
    if not user or not verify_password(password, user.hashed_password):
        raise InvalidCredentialsError("Email o contrasena incorrectos")
    if not user.is_active:
        raise InactiveUserError("El usuario esta desactivado")
    return user


def ensure_bootstrap_admin(db: Session, email: str, password: str) -> User:
    """Crea el usuario administrador inicial si la tabla esta vacia."""
    existing = get_user_by_email(db, email)
    if existing:
        return existing
    user = User(
        email=email.lower(),
        full_name="Administrator",
        hashed_password=hash_password(password),
        role=UserRole.ADMIN,
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
