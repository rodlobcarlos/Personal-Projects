from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/projects",
                   responses={404: {"message": "Not found"}},
                   tags=["projects"])

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

### Projects section ###
@router.get("/")
async def read_projects():
    return projects_list

@router.get("/{id}")
async def read_projects(id: int):
    projects = filter(lambda project: project.id == id, projects_list)
    try:
        return list(projects)[0]
    except:
        raise HTTPException(status_code=409)

@router.post("/", status_code=201)
async def add_project(project: Project):
    if projects_list.__contains__(project):
        return HTTPException(status_code=204, detail="This project already exist.")
    return projects_list.append(project)

@router.delete("/{id}")
async def delete_project(id: int):
    projects = next((p for p in projects_list if p.id == id), None)
    try:
        return projects_list.remove(projects)
    except:
        raise HTTPException(status_code=404)

@router.put("/{id}")
async def update_project(id: int, project: Project):
    projects = next((p for p in projects_list if p.id == id), None)
    try:
        if projects != None:
            element = projects_list.index(projects)
            projects_list[element] = project
            return project
    except:
        raise HTTPException(status_code=409)