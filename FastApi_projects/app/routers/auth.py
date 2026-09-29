from typing import Annotated

import jwt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from app.core.config import settings
from app.core.deps import CurrentUser, DbSession
from app.core.security import create_access_token, create_refresh_token, decode_token
from app.models.user import User
from app.schemas.user import LoginRequest, RefreshRequest, Token, UserCreate, UserRead
from app.services import user_service

router = APIRouter(prefix="/auth", tags=["auth"])


def _issue_token(db, email: str, password: str) -> Token:
    try:
        user = user_service.authenticate(db, email, password)
    except user_service.InvalidCredentialsError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contrasena incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc
    except user_service.InactiveUserError as exc:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(exc)) from exc
    return Token(
        access_token=create_access_token(user.id),
        refresh_token=create_refresh_token(user.id),
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, db: DbSession) -> User:
    try:
        return user_service.create_user(db, payload)
    except user_service.DuplicateEmailError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc


@router.post("/login", response_model=Token, summary="Iniciar sesion con email y contrasena")
def login(payload: LoginRequest, db: DbSession) -> Token:
    return _issue_token(db, payload.email, payload.password)


@router.post(
    "/token",
    response_model=Token,
    include_in_schema=False,
    summary="Login compatible con OAuth2PasswordRequestForm",
)
def login_form(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: DbSession) -> Token:
    return _issue_token(db, form_data.username, form_data.password)


@router.post("/refresh", response_model=Token, summary="Renovar el access token")
def refresh(payload: RefreshRequest, db: DbSession) -> Token:
    try:
        claims = decode_token(payload.refresh_token)
    except jwt.PyJWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token invalido"
        ) from exc
    if claims.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token invalido"
        )
    user = user_service.get_user_by_id(db, int(claims["sub"]))
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuario no disponible"
        )
    return Token(
        access_token=create_access_token(user.id),
        refresh_token=create_refresh_token(user.id),
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


@router.get("/me", response_model=UserRead, summary="Usuario autenticado")
def read_current_user(current_user: CurrentUser) -> User:
    return current_user
