from __future__ import annotations

import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError

from app.core.config import settings
from app.database.init_db import create_all
from app.routers import auth, health, projects, tasks, users
from app.schemas.common import ErrorDetail, ErrorResponse

logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
)
logger = logging.getLogger("projects-api")


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    create_all()
    logger.info("Base de datos inicializada (%s)", settings.ENVIRONMENT)
    yield
    logger.info("API detenida")


def _simplify_errors(errors: list[dict]) -> list[dict]:
    """Reduce los errores de pydantic a un formato serializable."""
    simplified: list[dict] = []
    for error in errors:
        simplified.append(
            {
                "location": [str(part) for part in error.get("loc", ())],
                "message": error.get("msg", ""),
                "type": error.get("type", ""),
            }
        )
    return simplified


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        description=settings.DESCRIPTION,
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
        lifespan=lifespan,
        contact={"name": "Projects API", "url": "https://github.com"},
        license_info={"name": "MIT"},
        openapi_tags=[
            {"name": "health", "description": "Estado del servicio"},
            {"name": "auth", "description": "Registro, login y tokens JWT"},
            {"name": "users", "description": "Gestion de usuarios"},
            {"name": "projects", "description": "CRUD de proyectos"},
            {"name": "tasks", "description": "Gestion de tareas"},
        ],
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health.router)
    app.include_router(auth.router, prefix=settings.API_PREFIX)
    app.include_router(users.router, prefix=settings.API_PREFIX)
    app.include_router(projects.router, prefix=settings.API_PREFIX)
    app.include_router(tasks.router, prefix=settings.API_PREFIX)

    @app.exception_handler(RequestValidationError)
    async def validation_error_handler(_: Request, exc: RequestValidationError) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content=ErrorResponse(
                error=ErrorDetail(
                    code="validation_error",
                    message="Los datos enviados no son validos",
                    context={"errors": _simplify_errors(exc.errors())},
                )
            ).model_dump(mode="json"),
        )

    @app.exception_handler(SQLAlchemyError)
    def sqlalchemy_error_handler(_: Request, exc: SQLAlchemyError) -> JSONResponse:
        logger.exception("Error de base de datos: %s", exc)
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content=ErrorResponse(
                error=ErrorDetail(code="database_error", message="Error interno de base de datos")
            ).model_dump(),
        )

    app.openapi = lambda: _custom_openapi(app)  # type: ignore[method-assign]
    return app


def _custom_openapi(app: FastAPI) -> dict:
    if app.openapi_schema:
        return app.openapi_schema
    from fastapi.openapi.utils import get_openapi

    schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
        tags=app.openapi_tags,
    )
    schema["components"] = schema.get("components", {})
    schema["components"]["securitySchemes"] = {
        "OAuth2PasswordBearer": {
            "type": "oauth2",
            "flows": {
                "password": {
                    "tokenUrl": f"{settings.API_PREFIX}/auth/token",
                    "scopes": {},
                }
            },
        }
    }
    schema["security"] = [{"OAuth2PasswordBearer": []}]
    app.openapi_schema = schema
    return app.openapi_schema


app = create_app()
