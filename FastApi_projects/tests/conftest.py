from __future__ import annotations

import os
import shutil
import tempfile
from collections.abc import Generator
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, event
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, sessionmaker

os.environ.setdefault("ENVIRONMENT", "test")
os.environ.setdefault("SECRET_KEY", "clave-de-pruebas-suficientemente-larga-1234567890")
os.environ.setdefault("DATABASE_URL", "sqlite://")
os.environ.setdefault("DEBUG", "false")
os.environ.setdefault("BCRYPT_ROUNDS", "4")  # acelera los tests sin cambiar el comportamiento

from app.core.config import get_settings
from app.core.deps import get_db
from app.core.security import hash_password
from app.database.session import Base
from app.main import create_app
from app.models.user import User, UserRole

get_settings.cache_clear()
settings = get_settings()

# Los tests usan un fichero SQLite temporal en modo WAL: cada sesion abre su
# propia conexion y siempre lee el ultimo estado confirmado, igual que en
# PostgreSQL.
_TMP_DIR = Path(tempfile.mkdtemp(prefix="projects-api-tests-"))
_DB_FILE = _TMP_DIR / "test.db"

test_engine: Engine = create_engine(
    f"sqlite:///{_DB_FILE}",
    connect_args={"check_same_thread": False, "timeout": 10},
)


@event.listens_for(test_engine, "connect")
def _set_sqlite_pragmas(dbapi_connection, _connection_record) -> None:  # type: ignore[no-untyped-def]
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.execute("PRAGMA journal_mode=WAL")
    cursor.execute("PRAGMA synchronous=NORMAL")
    cursor.close()


TestingSessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=test_engine, class_=Session, expire_on_commit=False
)


def pytest_sessionfinish(session, exitstatus) -> None:  # type: ignore[no-untyped-def]
    test_engine.dispose()
    shutil.rmtree(_TMP_DIR, ignore_errors=True)


@pytest.fixture(autouse=True)
def reset_database() -> Generator[None, None, None]:
    Base.metadata.drop_all(bind=test_engine)
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)


def override_get_db() -> Generator[Session, None, None]:
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def app():
    application = create_app()
    application.dependency_overrides[get_db] = override_get_db
    return application


@pytest.fixture
def client(app) -> Generator[TestClient, None, None]:
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def db() -> Generator[Session, None, None]:
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.rollback()
        session.close()


# --- Usuarios de prueba ----------------------------------------------------


def make_user(
    db: Session,
    email: str = "user@example.com",
    password: str = "Test1234",
    role: UserRole = UserRole.USER,
    full_name: str | None = None,
) -> User:
    user = User(
        email=email,
        full_name=full_name or email.split("@")[0].title(),
        hashed_password=hash_password(password),
        role=role,
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    db.rollback()  # libera la transaccion de lectura y sus bloqueos
    return user


@pytest.fixture
def normal_user(db: Session) -> User:
    return make_user(db, "user@example.com", "Test1234", UserRole.USER, "Usuario Normal")


@pytest.fixture
def other_user(db: Session) -> User:
    return make_user(db, "other@example.com", "Test1234", UserRole.USER, "Otro Usuario")


@pytest.fixture
def admin_user(db: Session) -> User:
    return make_user(db, "admin@example.com", "Test1234", UserRole.ADMIN, "Admin User")


# --- Helpers de autenticacion ---------------------------------------------


def token_for(client: TestClient, email: str, password: str = "Test1234") -> str:
    response = client.post("/api/v1/auth/login", json={"email": email, "password": password})
    assert response.status_code == 200, response.text
    return response.json()["access_token"]


def auth_header(client: TestClient, email: str, password: str = "Test1234") -> dict[str, str]:
    return {"Authorization": f"Bearer {token_for(client, email, password)}"}


@pytest.fixture
def user_headers(client, normal_user) -> dict[str, str]:
    return auth_header(client, "user@example.com")


@pytest.fixture
def other_headers(client, other_user) -> dict[str, str]:
    return auth_header(client, "other@example.com")


@pytest.fixture
def admin_headers(client, admin_user) -> dict[str, str]:
    return auth_header(client, "admin@example.com")


@pytest.fixture
def project_payload() -> dict:
    return {
        "name": "Portfolio Personal",
        "description": "Portfolio web personal",
        "technologies": ["Angular", "Java", "Docker"],
        "status": "in_progress",
        "start_date": "2026-01-01",
        "due_date": "2026-12-31",
        "repository_url": "https://github.com/user/portfolio",
    }


@pytest.fixture
def task_payload() -> dict:
    return {
        "title": "Crear frontend",
        "description": "Maquetar la interfaz principal",
        "priority": "high",
        "estimated_hours": 8,
    }
