from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.core.deps import CurrentAdmin, CurrentUser, DbSession
from app.schemas.common import Message, Page, PageParams
from app.schemas.user import UserCreate, UserRead, UserUpdate
from app.services import user_service

router = APIRouter(prefix="/users", tags=["users"])


def _to_read(user) -> UserRead:  # type: ignore[no-untyped-def]
    return UserRead.model_validate(user)


@router.get(
    "",
    response_model=Page[UserRead],
    summary="Listar usuarios (solo administradores)",
)
def list_users(
    db: DbSession,
    _: CurrentAdmin,
    params: Annotated[PageParams, Depends()],
    search: Annotated[str | None, Query(max_length=100)] = None,
) -> Page[UserRead]:
    users = user_service.list_users(db, skip=params.offset, limit=params.limit, search=search)
    total = user_service.count_users(db, search=search)
    return Page[UserRead].create([_to_read(user) for user in users], total, params)


@router.post(
    "",
    response_model=UserRead,
    status_code=status.HTTP_201_CREATED,
    summary="Crear usuario (solo administradores)",
)
def create_user(payload: UserCreate, db: DbSession, _: CurrentAdmin) -> UserRead:
    try:
        return _to_read(user_service.create_user(db, payload))
    except user_service.DuplicateEmailError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc


@router.get("/me", response_model=UserRead, summary="Perfil del usuario autenticado")
def read_me(current_user: CurrentUser) -> UserRead:
    return _to_read(current_user)


@router.patch("/me", response_model=UserRead, summary="Actualizar mi perfil")
def update_me(payload: UserUpdate, db: DbSession, current_user: CurrentUser) -> UserRead:
    if payload.role is not None or payload.is_active is not None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo un administrador puede cambiar el rol o el estado",
        )
    try:
        return _to_read(user_service.update_user(db, current_user, payload))
    except user_service.DuplicateEmailError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc


@router.get("/{user_id}", response_model=UserRead, summary="Obtener un usuario")
def get_user(user_id: int, db: DbSession, current_user: CurrentUser) -> UserRead:
    if current_user.id != user_id and current_user.role.value != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="No puedes consultar otros usuarios"
        )
    user = user_service.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    return _to_read(user)


@router.patch("/{user_id}", response_model=UserRead, summary="Actualizar un usuario")
def update_user(
    user_id: int,
    payload: UserUpdate,
    db: DbSession,
    current_user: CurrentUser,
) -> UserRead:
    user = user_service.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    is_admin = current_user.role.value == "admin"
    if not is_admin and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="No puedes modificar otros usuarios"
        )
    if not is_admin and (payload.role is not None or payload.is_active is not None):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo un administrador puede cambiar el rol o el estado",
        )
    try:
        return _to_read(user_service.update_user(db, user, payload))
    except user_service.DuplicateEmailError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc


@router.delete("/{user_id}", response_model=Message, summary="Eliminar un usuario (admin)")
def delete_user(user_id: int, db: DbSession, current_admin: CurrentAdmin) -> Message:
    if current_admin.id == user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="No puedes eliminarte a ti mismo"
        )
    user = user_service.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    user_service.delete_user(db, user)
    return Message(detail="Usuario eliminado")


@router.post("/{user_id}/deactivate", response_model=UserRead, summary="Desactivar usuario (admin)")
def deactivate_user(user_id: int, db: DbSession, current_admin: CurrentAdmin) -> UserRead:
    user = user_service.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    user.is_active = False
    db.commit()
    db.refresh(user)
    return _to_read(user)
