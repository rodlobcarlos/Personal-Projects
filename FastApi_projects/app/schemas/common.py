from __future__ import annotations

import math
from typing import Generic, TypeVar

from pydantic import BaseModel, ConfigDict, Field

T = TypeVar("T")

DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100


class PageParams(BaseModel):
    """Parametros de paginacion reutilizables."""

    model_config = ConfigDict(extra="forbid")

    page: int = Field(default=1, ge=1, description="Numero de pagina (1-based)")
    page_size: int = Field(
        default=DEFAULT_PAGE_SIZE,
        ge=1,
        le=MAX_PAGE_SIZE,
        description="Elementos por pagina",
    )

    @property
    def offset(self) -> int:
        return (self.page - 1) * self.page_size

    @property
    def limit(self) -> int:
        return self.page_size


class PaginationMeta(BaseModel):
    page: int
    page_size: int
    total: int
    total_pages: int
    has_next: bool
    has_previous: bool


class Page(BaseModel, Generic[T]):
    """Respuesta paginada generica."""

    model_config = ConfigDict(from_attributes=True)

    items: list[T]
    pagination: PaginationMeta

    @classmethod
    def create(cls, items: list[T], total: int, params: PageParams) -> Page[T]:
        total_pages = math.ceil(total / params.page_size) if total else 0
        return cls(
            items=items,
            pagination=PaginationMeta(
                page=params.page,
                page_size=params.page_size,
                total=total,
                total_pages=total_pages,
                has_next=params.page < total_pages,
                has_previous=params.page > 1,
            ),
        )


class Message(BaseModel):
    detail: str


class ErrorDetail(BaseModel):
    code: str
    message: str
    context: dict | None = None


class ErrorResponse(BaseModel):
    error: ErrorDetail
