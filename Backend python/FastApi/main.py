from fastapi import FastAPI
from routers import projects, tasks
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# routers
app.include_router(projects.router)
app.include_router(tasks.router)
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def root():
    return "Hola fastapi"