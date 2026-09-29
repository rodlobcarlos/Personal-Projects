from typing import Annotated

from fastapi import APIRouter, HTTPException, Query, Response, status

from app.core.deps import CurrentUser, DbSession
from app.schemas.common import Page
from app.schemas.project import ProjectCreate, ProjectFilters, ProjectRead, ProjectUpdate
from app.schemas.task import ProjectStats
from app.services import project_service, task_service

router = APIRouter(prefix="/projects", tags=["projects"])

Filters = Annotated[ProjectFilters, Query(description="Filtros, orden y paginacion")]


def get_project_or_404(db, project_id: int):  # type: ignore[no-untyped-def]
    try:
        return project_service.get_project(db, project_id)
    except project_service.ProjectNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc


def ensure_access(project, user) -> None:  # type: ignore[no-untyped-def]
    try:
        project_service.check_can_modify(project, user)
    except project_service.PermissionDeniedError as exc:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(exc)) from exc


@router.get(
    "",
    response_model=Page[ProjectRead],
    summary="Listar proyectos con paginacion, filtros y busqueda",
)
def list_projects(db: DbSession, current_user: CurrentUser, filters: Filters) -> Page[ProjectRead]:
    items, total = project_service.list_projects(db, filters, current_user)
    return Page[ProjectRead].create(
        [project_service.project_to_read_model(db, item) for item in items], total, filters
    )


@router.post(
    "",
    response_model=ProjectRead,
    status_code=status.HTTP_201_CREATED,
    summary="Crear un proyecto",
)
def create_project(payload: ProjectCreate, db: DbSession, current_user: CurrentUser) -> ProjectRead:
    project = project_service.create_project(db, payload, current_user)
    return project_service.project_to_read_model(db, project)


@router.get("/{project_id}", response_model=ProjectRead, summary="Obtener un proyecto por id")
def get_project(project_id: int, db: DbSession, current_user: CurrentUser) -> ProjectRead:
    project = get_project_or_404(db, project_id)
    ensure_access(project, current_user)
    return project_service.project_to_read_model(db, project)


@router.put("/{project_id}", response_model=ProjectRead, summary="Actualizar un proyecto")
def update_project(
    project_id: int, payload: ProjectUpdate, db: DbSession, current_user: CurrentUser
) -> ProjectRead:
    project = get_project_or_404(db, project_id)
    ensure_access(project, current_user)
    return project_service.project_to_read_model(
        db, project_service.update_project(db, project, payload)
    )


@router.patch(
    "/{project_id}", response_model=ProjectRead, summary="Actualizar parcialmente un proyecto"
)
def patch_project(
    project_id: int, payload: ProjectUpdate, db: DbSession, current_user: CurrentUser
) -> ProjectRead:
    return update_project(project_id, payload, db, current_user)


@router.delete(
    "/{project_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Eliminar un proyecto"
)
def delete_project(project_id: int, db: DbSession, current_user: CurrentUser) -> Response:
    project = get_project_or_404(db, project_id)
    ensure_access(project, current_user)
    project_service.delete_project(db, project)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get(
    "/{project_id}/stats",
    response_model=ProjectStats,
    summary="Estadisticas agregadas de las tareas del proyecto",
)
def get_project_stats(project_id: int, db: DbSession, current_user: CurrentUser) -> ProjectStats:
    project = get_project_or_404(db, project_id)
    ensure_access(project, current_user)
    return task_service.project_stats(db, project_id)
