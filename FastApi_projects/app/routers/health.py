from fastapi import APIRouter

from app.schemas.common import Message

router = APIRouter(tags=["health"])


@router.get("/health", response_model=dict, summary="Estado de la API")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "projects-api"}


@router.get("/health/ready", response_model=dict, summary="Comprobacion de dependencias")
def readiness() -> dict[str, str]:
    from sqlalchemy import text

    from app.database.session import engine

    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return {"status": "ready", "database": "up"}
    except Exception as exc:  # pragma: no cover - depende del entorno
        return {"status": "degraded", "database": "down", "detail": str(exc)}


@router.get("/", response_model=Message, include_in_schema=False)
def root() -> Message:
    return Message(detail="Projects API. Documentacion en /docs")
