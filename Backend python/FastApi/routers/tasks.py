from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router= APIRouter(prefix="/tasks",
                  responses={404: {"message": "Not found"}},
                  tags=["tasks"])

class Tasks(BaseModel):
    id: int
    project_id: int
    title: str
    description: str
    status: str
    priority: str
    created: str
    updated: str

tasks_list = [
    Tasks(id=1, project_id=1, title="Crear API REST", description="Crear los endpoints CRUD para gestionar proyectos", status="EN_PROGRESO", priority="ALTA", created="2026-10-04T20:00:00", updated="2026-10-04T20:00:00"),
    Tasks(id=2, project_id=1, title="Configurar PostgreSQL", description="Crear y conectar la base de datos con FastAPI", status="PENDIENTE", priority="MEDIA", created="2026-10-04T20:05:00", updated="2026-10-04T20:05:00")
]

@router.get("/")
async def get_tasks():
    return tasks_list

@router.get("/{id}", status_code=201)
async def read_task(id: int):
    tasks = filter(lambda task: task.id == id, tasks_list)
    try:
        return list(tasks)[0]
    except:
        raise HTTPException(status_code=404)

@router.post("/")
async def add_task(task: Tasks):
    if tasks_list.__contains__(task):
        return HTTPException(status_code=204, detail="This task already exist.")
    return tasks_list.append(task)

@router.delete("/{id}")
async def delete_task(id: int):
    tasks = next((t for t in tasks_list if t.id == id), None)
    try:
        return tasks_list.remove(tasks)
    except:
        raise HTTPException(status_code=409)

@router.put("/{id}")
async def update_task(id: int, task: Tasks):
    tasks = next((t for t in tasks_list if t.id == id), None)
    try:
        if task != None:
            element = tasks_list.index(tasks)
            tasks_list[element] = task
            return task
    except:
        raise HTTPException(status_code=409)
