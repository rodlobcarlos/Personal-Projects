from __future__ import annotations

from datetime import datetime

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    computed_field,
    field_validator,
)

from app.models.task import TaskPriority, TaskStatus
from app.schemas.common import PageParams


class TaskBase(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="forbid")

    title: str = Field(min_length=3, max_length=200, examples=["Crear frontend"])
    description: str | None = Field(default=None, max_length=2000)
    status: TaskStatus = TaskStatus.TODO
    priority: TaskPriority = TaskPriority.MEDIUM
    estimated_hours: int | None = Field(default=None, ge=0, le=1000)
    due_date: datetime | None = None


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="forbid")

    title: str | None = Field(default=None, min_length=3, max_length=200)
    description: str | None = Field(default=None, max_length=2000)
    status: TaskStatus | None = None
    priority: TaskPriority | None = None
    estimated_hours: int | None = Field(default=None, ge=0, le=1000)
    due_date: datetime | None = None
    is_completed: bool | None = None


class TaskRead(TaskBase):
    id: int
    project_id: int
    is_completed: bool
    completed_at: datetime | None = None
    created_at: datetime
    updated_at: datetime

    @computed_field  # type: ignore[prop-decorator]
    @property
    def is_overdue(self) -> bool:
        return bool(
            not self.is_completed
            and self.due_date
            and self.due_date < datetime.now(self.due_date.tzinfo)
        )


class TaskSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    status: TaskStatus
    priority: TaskPriority
    is_completed: bool
    project_id: int


class TaskFilters(PageParams):
    model_config = ConfigDict(extra="forbid")

    status: TaskStatus | None = None
    priority: TaskPriority | None = None
    is_completed: bool | None = None
    overdue: bool = False
    search: str | None = Field(default=None, max_length=100)
    order_by: str = Field(default="created_at")
    order: str = Field(default="desc", pattern="^(asc|desc)$")

    @field_validator("order_by")
    @classmethod
    def _validate_order_by(cls, value: str) -> str:
        allowed = {"id", "title", "status", "priority", "due_date", "created_at", "updated_at"}
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


class ProjectStats(BaseModel):
    total_tasks: int
    completed_tasks: int
    pending_tasks: int
    overdue_tasks: int
    completion_percentage: float
    estimated_hours: int
    by_status: dict[str, int]
    by_priority: dict[str, int]
