from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from app.models.user import UserRole

PASSWORD_MIN_LENGTH = 8


def validate_password_strength(value: str) -> str:
    if len(value) < PASSWORD_MIN_LENGTH:
        raise ValueError(f"La contrasena debe tener al menos {PASSWORD_MIN_LENGTH} caracteres")
    if not any(char.isalpha() for char in value):
        raise ValueError("La contrasena debe contener al menos una letra")
    if not any(char.isdigit() for char in value):
        raise ValueError("La contrasena debe contener al menos un numero")
    return value


class UserBase(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=2, max_length=120)


class UserCreate(UserBase):
    password: str = Field(min_length=PASSWORD_MIN_LENGTH, max_length=72)
    role: UserRole = UserRole.USER

    _check_password = field_validator("password")(validate_password_strength)


class UserUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    email: EmailStr | None = None
    full_name: str | None = Field(default=None, min_length=2, max_length=120)
    password: str | None = Field(default=None, min_length=PASSWORD_MIN_LENGTH, max_length=72)
    role: UserRole | None = None
    is_active: bool | None = None

    _check_password = field_validator("password")(validate_password_strength)


class UserRead(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    role: UserRole
    is_active: bool
    created_at: datetime
    updated_at: datetime


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class TokenPayload(BaseModel):
    sub: str
    type: str = "access"
    exp: int
    iat: int | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=72)


class RefreshRequest(BaseModel):
    refresh_token: str = Field(min_length=10)
