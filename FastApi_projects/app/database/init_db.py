"""Utilidades de arranque de la base de datos."""

from sqlalchemy.orm import Session

from app.database.session import Base, engine


def create_all() -> None:
    """Crea todas las tablas definidas en los modelos.

    En produccion se recomienda usar Alembic para el control de migraciones.
    """
    from app import models  # noqa: F401  (registra los modelos en Base.metadata)

    Base.metadata.create_all(bind=engine)


def drop_all() -> None:
    from app import models  # noqa: F401

    Base.metadata.drop_all(bind=engine)


def init_db(db: Session) -> None:
    from app.core.config import settings
    from app.services import user_service

    create_all()
    user_service.ensure_bootstrap_admin(db, settings.ADMIN_EMAIL, settings.ADMIN_PASSWORD)
