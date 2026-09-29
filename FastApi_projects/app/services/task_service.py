from __future__ import annotations

from datetime import UTC, datetime

from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.models.project import Project
from app.models.task import Task, TaskStatus
from app.schemas.task import ProjectStats, TaskCreate, TaskFilters, TaskUpdate
from app.services import project_service


class TaskNotFoundError(Exception):
    pass


def get_task(db: Session, task_id: int) -> Task:
    task = db.get(Task, task_id)
    if not task:
        raise TaskNotFoundError(f"Tarea {task_id} no encontrada")
    return task


def list_tasks(db: Session, project_id: int, filters: TaskFilters) -> tuple[list[Task], int]:
    conditions = [Task.project_id == project_id]
    if filters.status is not None:
        conditions.append(Task.status == filters.status)
    if filters.priority is not None:
        conditions.append(Task.priority == filters.priority)
    if filters.is_completed is not None:
        conditions.append(Task.is_completed.is_(filters.is_completed))
    if filters.overdue:
        conditions.extend(
            [
                Task.is_completed.is_(False),
                Task.due_date.is_not(None),
                Task.due_date < datetime.now(UTC),
            ]
        )
    if filters.search:
        pattern = f"%{filters.search.lower()}%"
        conditions.append(
            or_(func.lower(Task.title).like(pattern), func.lower(Task.description).like(pattern))
        )

    count_stmt = select(func.count()).select_from(Task).where(*conditions)
    total = db.execute(count_stmt).scalar_one()

    order_column = getattr(Task, filters.order_by)
    order = order_column.asc() if filters.order == "asc" else order_column.desc()
    stmt = (
        select(Task)
        .where(*conditions)
        .order_by(order, Task.id.desc())
        .offset(filters.offset)
        .limit(filters.limit)
    )
    return list(db.execute(stmt).scalars()), total


def create_task(db: Session, project: Project, payload: TaskCreate) -> Task:
    data = payload.model_dump()
    completed = data.get("status") is TaskStatus.DONE
    task = Task(
        **data,
        project_id=project.id,
        is_completed=completed,
        completed_at=datetime.now(UTC) if completed else None,
    )
    db.add(task)
    db.flush()
    project_service.recalculate_progress(db, project)
    db.commit()
    db.refresh(task)
    return task


def update_task(db: Session, task: Task, payload: TaskUpdate) -> Task:
    data = payload.model_dump(exclude_unset=True)
    if "status" in data and data["status"] is not None:
        completed = data["status"] is TaskStatus.DONE
        data["is_completed"] = completed
        data["completed_at"] = datetime.now(UTC) if completed else None
    elif data.get("is_completed") is True and not task.is_completed:
        data.setdefault("status", TaskStatus.DONE)
        data["completed_at"] = datetime.now(UTC)
    elif data.get("is_completed") is False:
        data.setdefault("status", TaskStatus.TODO)
        data["completed_at"] = None
    for field, value in data.items():
        setattr(task, field, value)
    db.flush()  # asegura que los agregados del proyecto tengan el estado actual
    project = db.get(Project, task.project_id)
    if project:
        project_service.recalculate_progress(db, project)
    db.commit()
    db.refresh(task)
    return task


def delete_task(db: Session, task: Task) -> None:
    project = db.get(Project, task.project_id)
    db.delete(task)
    db.flush()
    if project:
        db.expire(project, ["tasks"])
        project_service.recalculate_progress(db, project)
    db.commit()


def project_stats(db: Session, project_id: int) -> ProjectStats:
    total = db.execute(
        select(func.count(Task.id)).where(Task.project_id == project_id)
    ).scalar_one()
    done = db.execute(
        select(func.count(Task.id)).where(
            Task.project_id == project_id, Task.is_completed.is_(True)
        )
    ).scalar_one()
    overdue = db.execute(
        select(func.count(Task.id)).where(
            Task.project_id == project_id,
            Task.is_completed.is_(False),
            Task.due_date.is_not(None),
            Task.due_date < datetime.now(UTC),
        )
    ).scalar_one()
    hours = db.execute(
        select(func.coalesce(func.sum(Task.estimated_hours), 0)).where(
            Task.project_id == project_id
        )
    ).scalar_one()
    by_status = dict(
        db.execute(
            select(Task.status, func.count(Task.id))
            .where(Task.project_id == project_id)
            .group_by(Task.status)
        ).all()
    )
    by_priority = dict(
        db.execute(
            select(Task.priority, func.count(Task.id))
            .where(Task.project_id == project_id)
            .group_by(Task.priority)
        ).all()
    )
    return ProjectStats(
        total_tasks=total,
        completed_tasks=done,
        pending_tasks=total - done,
        overdue_tasks=overdue,
        completion_percentage=round((done / total) * 100, 2) if total else 0.0,
        estimated_hours=int(hours or 0),
        by_status={
            key.value if hasattr(key, "value") else str(key): value
            for key, value in by_status.items()
        },
        by_priority={
            key.value if hasattr(key, "value") else str(key): value
            for key, value in by_priority.items()
        },
    )
