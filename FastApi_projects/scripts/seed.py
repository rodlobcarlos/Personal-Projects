"""Carga datos de ejemplo en la base de datos.

Uso:
    python -m scripts.seed
    python -m scripts.seed --reset      # borra los datos antes de insertar
"""

from __future__ import annotations

import argparse
from datetime import UTC, date, datetime, timedelta

from sqlalchemy import delete, select

from app.core.security import hash_password
from app.database.init_db import create_all
from app.database.session import SessionLocal
from app.models.project import Project, ProjectStatus
from app.models.task import Task, TaskPriority, TaskStatus
from app.models.user import User, UserRole

USERS: list[dict] = [
    {
        "email": "admin@example.com",
        "full_name": "Administrador",
        "password": "Admin123!",
        "role": UserRole.ADMIN,
    },
    {
        "email": "developer@example.com",
        "full_name": "Desarrollador",
        "password": "Developer123!",
        "role": UserRole.USER,
    },
]

PROJECTS: list[dict] = [
    {
        "name": "Portfolio Personal",
        "description": "Portfolio web personal con Angular y FastAPI",
        "technologies": "Angular, Java, Docker",
        "status": ProjectStatus.IN_PROGRESS,
        "start_date": date(2026, 1, 15),
        "due_date": date(2026, 12, 31),
        "repository_url": "https://github.com/usuario/portfolio",
        "tasks": [
            {
                "title": "Crear frontend",
                "description": "Maquetar la interfaz principal",
                "status": TaskStatus.DONE,
                "priority": TaskPriority.HIGH,
                "estimated_hours": 8,
                "due_in_days": -20,
            },
            {
                "title": "Crear backend",
                "description": "Endpoints de proyectos y tareas",
                "status": TaskStatus.DONE,
                "priority": TaskPriority.HIGH,
                "estimated_hours": 12,
                "due_in_days": -12,
            },
            {
                "title": "Configurar Docker",
                "description": "Dockerfile y docker-compose",
                "status": TaskStatus.IN_PROGRESS,
                "priority": TaskPriority.MEDIUM,
                "estimated_hours": 4,
                "due_in_days": -3,
            },
            {
                "title": "Crear workflow CI/CD",
                "description": "Tests y build automaticos",
                "status": TaskStatus.TODO,
                "priority": TaskPriority.MEDIUM,
                "estimated_hours": 5,
                "due_in_days": 7,
            },
            {
                "title": "Desplegar en Azure",
                "description": "Publicar la API en Azure",
                "status": TaskStatus.TODO,
                "priority": TaskPriority.LOW,
                "estimated_hours": 6,
                "due_in_days": 30,
            },
        ],
    },
    {
        "name": "API de Gestion de Proyectos",
        "description": "API REST con FastAPI, SQLAlchemy y PostgreSQL",
        "technologies": "Python, FastAPI, PostgreSQL, Docker",
        "status": ProjectStatus.IN_PROGRESS,
        "start_date": date(2026, 2, 1),
        "due_date": date(2026, 10, 1),
        "repository_url": "https://github.com/usuario/projects-api",
        "tasks": [
            {
                "title": "Modelar la base de datos",
                "description": "Usuarios, proyectos y tareas",
                "status": TaskStatus.DONE,
                "priority": TaskPriority.HIGH,
                "estimated_hours": 5,
                "due_in_days": -30,
            },
            {
                "title": "Implementar autenticacion JWT",
                "description": "Registro, login y roles",
                "status": TaskStatus.DONE,
                "priority": TaskPriority.HIGH,
                "estimated_hours": 6,
                "due_in_days": -18,
            },
            {
                "title": "Anadir paginacion y filtros",
                "description": "Parametros de consulta en los listados",
                "status": TaskStatus.DONE,
                "priority": TaskPriority.MEDIUM,
                "estimated_hours": 3,
                "due_in_days": -10,
            },
            {
                "title": "Escribir tests",
                "description": "Cobertura automatizada con pytest",
                "status": TaskStatus.IN_PROGRESS,
                "priority": TaskPriority.HIGH,
                "estimated_hours": 6,
                "due_in_days": -1,
            },
        ],
    },
    {
        "name": "Tienda Online",
        "description": "Tienda de ejemplo con catalogo, carrito y pedidos",
        "technologies": "Java, Spring Boot, PostgreSQL",
        "status": ProjectStatus.PLANNED,
        "start_date": date(2026, 11, 1),
        "due_date": date(2027, 3, 31),
        "repository_url": None,
        "tasks": [
            {
                "title": "Disenar el modelo de datos",
                "description": "Productos, clientes y pedidos",
                "status": TaskStatus.TODO,
                "priority": TaskPriority.MEDIUM,
                "estimated_hours": 6,
                "due_in_days": 25,
            },
            {
                "title": "Crear catalogo",
                "description": "Listado y detalle de producto",
                "status": TaskStatus.TODO,
                "priority": TaskPriority.MEDIUM,
                "estimated_hours": 10,
                "due_in_days": 40,
            },
        ],
    },
    {
        "name": "Migracion a la nube",
        "description": "Migracion de la aplicacion y la base de datos a Azure",
        "technologies": "Docker, GitHub Actions, Azure",
        "status": ProjectStatus.PLANNED,
        "start_date": date(2027, 1, 5),
        "due_date": date(2027, 4, 30),
        "repository_url": None,
        "tasks": [
            {
                "title": "Definir la arquitectura objetivo",
                "description": "Contenedores y servicios gestionados",
                "status": TaskStatus.TODO,
                "priority": TaskPriority.LOW,
                "estimated_hours": 4,
                "due_in_days": 60,
            }
        ],
    },
]


def seed(reset: bool = False) -> None:
    create_all()
    db = SessionLocal()
    try:
        if reset:
            db.execute(delete(Task))
            db.execute(delete(Project))
            db.execute(delete(User))
            db.commit()
            print("Datos anteriores eliminados.")

        users: list[User] = []
        for data in USERS:
            user = db.scalar(select(User).where(User.email == data["email"]))
            if user is None:
                user = User(
                    email=data["email"],
                    full_name=data["full_name"],
                    hashed_password=hash_password(data["password"]),
                    role=data["role"],
                    is_active=True,
                )
                db.add(user)
            users.append(user)
        db.commit()

        owner = users[0]
        created_projects = 0
        created_tasks = 0
        now = datetime.now(UTC)

        for data in PROJECTS:
            if db.scalar(select(Project).where(Project.name == data["name"])):
                continue
            project = Project(
                owner_id=owner.id,
                name=data["name"],
                description=data["description"],
                technologies=data["technologies"],
                status=data["status"],
                start_date=data["start_date"],
                due_date=data["due_date"],
                repository_url=data["repository_url"],
                progress=0,
            )
            db.add(project)
            db.flush()

            done = 0
            for task_data in data["tasks"]:
                is_done = task_data["status"] is TaskStatus.DONE
                done += int(is_done)
                db.add(
                    Task(
                        project_id=project.id,
                        title=task_data["title"],
                        description=task_data["description"],
                        status=task_data["status"],
                        priority=task_data["priority"],
                        estimated_hours=task_data["estimated_hours"],
                        is_completed=is_done,
                        completed_at=now if is_done else None,
                        due_date=now + timedelta(days=task_data["due_in_days"], hours=12),
                    )
                )
                created_tasks += 1

            total = len(data["tasks"])
            project.progress = round((done / total) * 100) if total else 0
            created_projects += 1

        db.commit()
        print(
            f"Seed completado: {created_projects} proyectos y {created_tasks} tareas "
            f"para {len(users)} usuarios."
        )
    finally:
        db.close()


def main() -> None:
    parser = argparse.ArgumentParser(description="Carga datos de ejemplo en la base de datos")
    parser.add_argument(
        "--reset", action="store_true", help="Elimina los datos existentes antes de insertar"
    )
    args = parser.parse_args()
    seed(reset=args.reset)


if __name__ == "__main__":
    main()
