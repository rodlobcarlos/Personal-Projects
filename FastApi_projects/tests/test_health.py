from __future__ import annotations

import pytest

pytestmark = pytest.mark.usefixtures("client")


def test_health_ok(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_readiness(client):
    response = client.get("/health/ready")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] in {"ready", "degraded"}


def test_docs_available(client):
    assert client.get("/docs").status_code == 200
    assert client.get("/redoc").status_code == 200


def test_openapi_schema(client):
    response = client.get("/openapi.json")
    assert response.status_code == 200
    schema = response.json()
    assert "/api/v1/projects" in schema["paths"]
    assert "/api/v1/projects/{project_id}/tasks" in schema["paths"]
    assert "/api/v1/auth/login" in schema["paths"]


def test_health_is_public(client):
    assert client.get("/health").status_code == 200
