from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Project(BaseModel):
    id: int
    name: str
    description: str
    technology: str
    state: str

projects_list = [
    Project(id=1, name="Portfolio", description="Web con información sobre mí, mis skills y proyectos destacados", technology="Angular, Node.js", state="finished"),
    Project(id=2, name="ApiProjects", description="Web para organizar proyectos personales", technology="Python, PostgrelSQL", state="Developming"),
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
        return "Error: project not found"

@app.post("/add_project")
async def add_project(project: Project):
    return projects_list.append(project)