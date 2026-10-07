from fastapi import FastAPI
from routers import projects, tasks, basic_auth_users, jwt_auth_users
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# routers
app.include_router(projects.router)
app.include_router(tasks.router)
app.include_router(basic_auth_users.router)
app.include_router(jwt_auth_users.router)

# Recursos estáticos
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def root():
    return "Hola fastapi"