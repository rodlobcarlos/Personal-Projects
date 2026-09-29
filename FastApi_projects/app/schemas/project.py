from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, Self

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    computed_field,
    field_validator,
    model_validator,
)

from app.models.project import ProjectStatus
from app.schemas.common import PageParams

TechnologyList = Annotated[list[str], Field(max_length=20)]


def _normalise_technologies(value: object) -> object:
    if isinstance(value, str):
        return [item.strip() for item in value.split(",") if item.strip()]
    return value


class ProjectBase(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="forbid")

    name: str = Field(min_length=3, max_length=150, examples=["Portfolio Personal"])
    description: str | None = Field(default=None, max_length=2000)
    technologies: list[str] = Field(default_factory=list, max_length=20)
    repository_url: str | None = Field(default=None, max_length=500)
    status: ProjectStatus = ProjectStatus.PLANNED
    start_date: date | None = None
    due_date: date | None = None

    _split_technologies = field_validator("technologies", mode="before")(_normalise_technologies)

    @field_validator("technologies")
    @classmethod
    def _clean_technologies(cls, value: list[str]) -> list[str]:
        cleaned: list[str] = []
        for item in value:
            item = item.strip()
            if not item:
                continue
            if len(item) > 50:
                raise ValueError("Cada tecnologia puede tener como maximo 50 caracteres")
            if item.lower() not in {existing.lower() for existing in cleaned}:
                cleaned.append(item)
        return cleaned

    @model_validator(mode="after")
    def _validate_dates(self) -> Self:
        if self.start_date and self.due_date and self.due_date < self.start_date:
            raise ValueError("due_date no puede ser anterior a start_date")
        return self

    @field_validator("repository_url")
    @classmethod
    def _validate_repository_url(cls, value: str | None) -> str | None:
        if value and not value.startswith(("http://", "https://")):
            raise ValueError("repository_url debe empezar por http:// o https://")
        return value


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="forbid")

    name: str | None = Field(default=None, min_length=3, max_length=150)
    description: str | None = Field(default=None, max_length=2000)
    technologies: list[str] | None = Field(default=None, max_length=20)
    repository_url: str | None = Field(default=None, max_length=500)
    status: ProjectStatus | None = None
    start_date: date | None = None
    due_date: date | None = None

    _split_technologies = field_validator("technologies", mode="before")(_normalise_technologies)

    @field_validator("technologies")
    @classmethod
    def _clean_technologies(cls, value: list[str] | None) -> list[str] | None:
        if value is None:
            return None
        return ProjectBase._clean_technologies(value)

    @field_validator("repository_url")
    @classmethod
    def _validate_repository_url(cls, value: str | None) -> str | None:
        return ProjectBase._validate_repository_url(value)


class ProjectRead(ProjectBase):
    id: int
    owner_id: int
    progress: int = Field(ge=0, le=100)
    completed_at: datetime | None = None
    created_at: datetime
    updated_at: datetime
    task_count: int = 0
    completed_task_count: int = 0

    @computed_field  # type: ignore[prop-decorator]
    @property
    def technology_list(self) -> str:
        return ", ".join(self.technologies)


class ProjectSummary(BaseModel):
    """Version ligera usada en listados."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    status: ProjectStatus
    progress: int
    owner_id: int
    task_count: int = 0
    completed_task_count: int = 0
    created_at: datetime


class ProjectFilters(PageParams):
    model_config = ConfigDict(extra="forbid")

    status: ProjectStatus | None = None
    technology: str | None = None
    search: str | None = Field(default=None, max_length=100)
    owner_id: int | None = None
    only_mine: bool = False
    order_by: str = Field(default="created_at")
    order: str = Field(default="desc", pattern="^(asc|desc)$")

    @field_validator("order_by")
    @classmethod
    def _validate_order_by(cls, value: str) -> str:
        allowed = {"id", "name", "status", "progress", "created_at", "updated_at", "due_date"}
        if value not in allowed:
            raise ValueError(f"order_by debe ser uno de: {', '.join(sorted(allowed))}")
        return value

    @field_validator("search")
    @classmethod
    def _clean_search(cls, value: str | None) -> str | None:
        if value is None:
            return None
        cleaned = value.strip()
        return cleaned or None
