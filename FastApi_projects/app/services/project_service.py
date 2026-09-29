from __future__ import annotations

from datetime import UTC, datetime

from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session, selectinload

from app.models.project import Project, ProjectStatus
from app.models.task import Task
from app.models.user import User, UserRole
from app.schemas.project import ProjectCreate, ProjectFilters, ProjectUpdate


class ProjectNotFoundError(Exception):
    pass


class PermissionDeniedError(Exception):
    pass


def _task_counts(db: Session, project_ids: list[int]) -> dict[int, tuple[int, int]]:
    if not project_ids:
        return {}
    stmt = (
        select(
            Task.project_id,
            func.count(Task.id),
            func.count(Task.id).filter(Task.is_completed.is_(True)),
        )
        .where(Task.project_id.in_(project_ids))
        .group_by(Task.project_id)
    )
    return {pid: (total, done) for pid, total, done in db.execute(stmt).all()}


def get_project(db: Session, project_id: int) -> Project:
    project = db.execute(
        select(Project).options(selectinload(Project.tasks)).where(Project.id == project_id)
    ).scalar_one_or_none()
    if not project:
        raise ProjectNotFoundError(f"Proyecto {project_id} no encontrado")
    return project


def list_projects(
    db: Session, filters: ProjectFilters, current_user: User
) -> tuple[list[Project], int]:
    conditions = []
    if filters.only_mine or current_user.role is not UserRole.ADMIN:
        conditions.append(Project.owner_id == current_user.id)
    elif filters.owner_id is not None:
        conditions.append(Project.owner_id == filters.owner_id)
    if filters.status is not None:
        conditions.append(Project.status == filters.status)
    if filters.technology:
        conditions.append(func.lower(Project.technologies).like(f"%{filters.technology.lower()}%"))
    if filters.search:
        pattern = f"%{filters.search.lower()}%"
        conditions.append(
            or_(
                func.lower(Project.name).like(pattern),
                func.lower(Project.description).like(pattern),
            )
        )

    count_stmt = select(func.count()).select_from(Project).where(*conditions)
    total = db.execute(count_stmt).scalar_one()

    order_column = getattr(Project, filters.order_by)
    order = order_column.asc() if filters.order == "asc" else order_column.desc()
    stmt = (
        select(Project)
        .where(*conditions)
        .order_by(order, Project.id.desc())
        .offset(filters.offset)
        .limit(filters.limit)
    )
    items = list(db.execute(stmt).scalars().unique())
    return items, total


def create_project(db: Session, payload: ProjectCreate, owner: User) -> Project:
    data = payload.model_dump()
    technologies = data.pop("technologies", []) or []
    status = data.pop("status", ProjectStatus.PLANNED)
    project = Project(
        **data,
        technologies=", ".join(technologies) if technologies else None,
        status=status,
        completed_at=datetime.now(UTC) if status is ProjectStatus.COMPLETED else None,
        owner_id=owner.id,
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


def update_project(db: Session, project: Project, payload: ProjectUpdate) -> Project:
    data = payload.model_dump(exclude_unset=True)
    if "technologies" in data:
        technologies = data.pop("technologies") or []
        data["technologies"] = ", ".join(technologies) if technologies else None
    if data.get("status") == ProjectStatus.COMPLETED and project.completed_at is None:
        data["completed_at"] = datetime.now(UTC)
    if "status" in data and data["status"] != ProjectStatus.COMPLETED:
        data["completed_at"] = None
    for field, value in data.items():
        setattr(project, field, value)
    recalculate_progress(db, project)
    db.commit()
    db.refresh(project)
    return project


def delete_project(db: Session, project: Project) -> None:
    db.delete(project)
    db.commit()


def recalculate_progress(db: Session, project: Project) -> int:
    total = db.execute(
        select(func.count(Task.id)).where(Task.project_id == project.id)
    ).scalar_one()
    done = db.execute(
        select(func.count(Task.id)).where(
            Task.project_id == project.id, Task.is_completed.is_(True)
        )
    ).scalar_one()
    project.progress = round((done / total) * 100) if total else 0
    db.add(project)
    return project.progress


def check_can_modify(project: Project, user: User) -> None:
    if project.owner_id == user.id or user.role is UserRole.ADMIN:
        return
    raise PermissionDeniedError("No tienes permisos sobre este proyecto")


def project_to_read_model(db: Session, project: Project):  # type: ignore[no-untyped-def]
    from app.schemas.project import ProjectRead

    total = db.execute(
        select(func.count(Task.id)).where(Task.project_id == project.id)
    ).scalar_one()
    done = db.execute(
        select(func.count(Task.id)).where(
            Task.project_id == project.id, Task.is_completed.is_(True)
        )
    ).scalar_one()
    technologies = [
        item.strip() for item in (project.technologies or "").split(",") if item.strip()
    ]
    return ProjectRead(
        id=project.id,
        name=project.name,
        description=project.description,
        technologies=technologies,
        repository_url=project.repository_url,
        status=project.status,
        start_date=project.start_date,
        due_date=project.due_date,
        completed_at=project.completed_at,
        progress=project.progress,
        owner_id=project.owner_id,
        created_at=project.created_at,
        updated_at=project.updated_at,
        task_count=total,
        completed_task_count=done,
    )
