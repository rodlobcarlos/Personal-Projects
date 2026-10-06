from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

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

@app.get("/tasks", tags=["Task"])
async def get_tasks():
    return tasks_list

@app.get("/task/{id}", tags=["Task"], status_code=201)
async def read_task(id: int):
    tasks = filter(lambda task: task.id == id, tasks_list)
    try:
        return list(tasks)[0]
    except:
        raise HTTPException(status_code=404)

@app.post("/add_task", tags=["Task"])
async def add_task(task: Tasks):
    if tasks_list.__contains__(task):
        return HTTPException(status_code=204, detail="This task already exist.")
    return tasks_list.append(task)

@app.delete("/delete_task/{id}", tags=["Task"])
async def delete_task(id: int):
    tasks = next((t for t in tasks_list if t.id == id), None)
    try:
        return tasks_list.remove(tasks)
    except:
        raise HTTPException(status_code=409)

@app.put("/update_task/{id}", tags=["Task"])
async def update_task(id: int, task: Tasks):
    tasks = next((t for t in tasks_list if t.id == id), None)
    try:
        if task != None:
            element = tasks_list.index(tasks)
            tasks_list[element] = task
            return task
    except:
        raise HTTPException(status_code=409)
