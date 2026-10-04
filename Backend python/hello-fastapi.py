from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime
from enum import Enum

app = FastAPI()

class Project(BaseModel):
    id: int
    name: str
    description: str
    technology: str
    state: str

class Tasks(BaseModel):
    id: int
    project_id: int
    title: str
    description: str
    status: str
    priority: str
    created: str
    updated: str

projects_list = [
    Project(id=1, name="Portfolio", description="Web con información sobre mí, mis skills y proyectos destacados", technology="Angular, Node.js", state="finished"),
    Project(id=2, name="ApiProjects", description="Web para organizar proyectos personales", technology="Python, PostgrelSQL", state="Developming"),
]

tasks_list = [
    Tasks(id=1, project_id=1, title="Crear API REST", description="Crear los endpoints CRUD para gestionar proyectos", status="EN_PROGRESO", priority="ALTA", created="2026-10-04T20:00:00", updated="2026-10-04T20:00:00"),
    Tasks(id=2, project_id=1, title="Configurar PostgreSQL", description="Crear y conectar la base de datos con FastAPI", status="PENDIENTE", priority="MEDIA", created="2026-10-04T20:05:00", updated="2026-10-04T20:05:00")
]

@app.get("/")
async def read_root():
    return {"Hello": "World"}

@app.get("/projects")
async def read_projects():
    return projects_list

@app.get("/project/{id}")
async def read_projects(id: int):
    projects = filter(lambda project: project.id == id, projects_list)
    try:
        return list(projects)[0]
    except:
        return "Error: project not found."

@app.post("/add_project")
async def add_project(project: Project):
    if projects_list.__contains__(project):
        return "This project already exists"
    return projects_list.append(project)

@app.delete("/delete_project/{id}")
async def delete_project(id: int):
    projects = next((p for p in projects_list if p.id == id), None)
    try:
        return projects_list.remove(projects)
    except:
        return "Error: project id not found."

@app.put("/update_project/{id}")
async def update_project(id: int, project: Project):
    projects = next((p for p in projects_list if p.id == id), None)
    try:
        if projects != None:
            element = projects_list.index(projects)
            projects_list[element] = project
            return project
    except:
        return "Error: Incorrect id."

@app.get("/tasks")
async def get_tasks():
    return tasks_list

@app.post("/add_task")
async def add_task(task: Tasks):
    if tasks_list.__contains__(task):
        return "This tasks already exists"
    return tasks_list.append(task)

@app.delete("/delete_task/{id}")
async def delete_project(id: int):
    tasks = next((t for t in tasks_list if t.id == id), None)
    try:
        return tasks_list.remove(tasks)
    except:
        return "Error: task id not found."

@app.put("/update_task/{id}")
async def update_project(id: int, task: Tasks):
    tasks = next((t for t in tasks_list if t.id == id), None)
    try:
        if task != None:
            element = tasks_list.index(tasks)
            tasks_list[element] = task
            return task
    except:
        return "Error: Incorrect id."