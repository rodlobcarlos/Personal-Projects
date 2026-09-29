from typing import Annotated

from fastapi import APIRouter, HTTPException, Query, Response, status

from app.core.deps import CurrentUser, DbSession
from app.routers.projects import ensure_access, get_project_or_404
from app.schemas.common import Page
from app.schemas.task import TaskCreate, TaskFilters, TaskRead, TaskUpdate
from app.services import task_service

router = APIRouter(tags=["tasks"])

Filters = Annotated[TaskFilters, Query(description="Filtros, orden y paginacion")]


def get_task_or_404(db, task_id: int):  # type: ignore[no-untyped-def]
    try:
        return task_service.get_task(db, task_id)
    except task_service.TaskNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc


# --- Tareas anidadas dentro de un proyecto --------------------------------


@router.get(
    "/projects/{project_id}/tasks",
    response_model=Page[TaskRead],
    summary="Listar las tareas de un proyecto",
)
def list_project_tasks(
    project_id: int, db: DbSession, current_user: CurrentUser, filters: Filters
) -> Page[TaskRead]:
    project = get_project_or_404(db, project_id)
    ensure_access(project, current_user)
    items, total = task_service.list_tasks(db, project_id, filters)
    return Page[TaskRead].create(items, total, filters)


@router.post(
    "/projects/{project_id}/tasks",
    response_model=TaskRead,
    status_code=status.HTTP_201_CREATED,
    summary="Crear una tarea en un proyecto",
)
def create_project_task(
    project_id: int, payload: TaskCreate, db: DbSession, current_user: CurrentUser
) -> TaskRead:
    project = get_project_or_404(db, project_id)
    ensure_access(project, current_user)
    return task_service.create_task(db, project, payload)


# --- Tareas por id ---------------------------------------------------------


@router.get("/tasks/{task_id}", response_model=TaskRead, summary="Obtener una tarea por id")
def get_task(task_id: int, db: DbSession, current_user: CurrentUser) -> TaskRead:
    task = get_task_or_404(db, task_id)
    project = get_project_or_404(db, task.project_id)
    ensure_access(project, current_user)
    return task


@router.put("/tasks/{task_id}", response_model=TaskRead, summary="Actualizar una tarea")
def update_task(
    task_id: int, payload: TaskUpdate, db: DbSession, current_user: CurrentUser
) -> TaskRead:
    task = get_task_or_404(db, task_id)
    project = get_project_or_404(db, task.project_id)
    ensure_access(project, current_user)
    return task_service.update_task(db, task, payload)


@router.patch(
    "/tasks/{task_id}", response_model=TaskRead, summary="Actualizar parcialmente una tarea"
)
def patch_task(
    task_id: int, payload: TaskUpdate, db: DbSession, current_user: CurrentUser
) -> TaskRead:
    return update_task(task_id, payload, db, current_user)


@router.delete(
    "/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Eliminar una tarea"
)
def delete_task(task_id: int, db: DbSession, current_user: CurrentUser) -> Response:
    task = get_task_or_404(db, task_id)
    project = get_project_or_404(db, task.project_id)
    ensure_access(project, current_user)
    task_service.delete_task(db, task)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
