from __future__ import annotations

from datetime import UTC, datetime, timedelta

import pytest

from tests.conftest import token_for

REGISTER_URL = "/api/v1/auth/register"
LOGIN_URL = "/api/v1/auth/login"


def test_register_user(client):
    response = client.post(
        REGISTER_URL,
        json={"email": "nuevo@example.com", "full_name": "Nuevo Usuario", "password": "Test1234"},
    )
    assert response.status_code == 201, response.text
    body = response.json()
    assert body["email"] == "nuevo@example.com"
    assert body["role"] == "user"
    assert body["is_active"] is True
    assert "password" not in body
    assert "hashed_password" not in body


def test_register_duplicate_email_returns_409(client, normal_user):
    response = client.post(
        REGISTER_URL,
        json={"email": "user@example.com", "full_name": "Duplicado", "password": "Test1234"},
    )
    assert response.status_code == 409


@pytest.mark.parametrize(
    "payload",
    [
        {"email": "no-es-email", "full_name": "X", "password": "Test1234"},
        {"email": "x@example.com", "full_name": "X", "password": "corta"},
        {"email": "x@example.com", "full_name": "X", "password": "solo-letras"},
        {"email": "x@example.com", "full_name": "X"},
    ],
)
def test_register_validation_errors(client, payload):
    response = client.post(REGISTER_URL, json=payload)
    assert response.status_code == 422
    assert response.json()["error"]["code"] == "validation_error"


def test_login_success(client, normal_user):
    response = client.post(LOGIN_URL, json={"email": "user@example.com", "password": "Test1234"})
    assert response.status_code == 200
    body = response.json()
    assert body["token_type"] == "bearer"
    assert body["access_token"]
    assert body["refresh_token"]
    assert body["expires_in"] == 3600


def test_login_wrong_password(client, normal_user):
    response = client.post(LOGIN_URL, json={"email": "user@example.com", "password": "Incorrecta1"})
    assert response.status_code == 401


def test_login_unknown_user(client):
    response = client.post(LOGIN_URL, json={"email": "nadie@example.com", "password": "Test1234"})
    assert response.status_code == 401


def test_login_inactive_user(client, db, normal_user):
    normal_user.is_active = False
    db.commit()
    response = client.post(LOGIN_URL, json={"email": "user@example.com", "password": "Test1234"})
    assert response.status_code == 403


def test_login_oauth2_form(client, normal_user):
    response = client.post(
        "/api/v1/auth/token", data={"username": "user@example.com", "password": "Test1234"}
    )
    assert response.status_code == 200
    assert response.json()["access_token"]


def test_access_token_grants_access(client, user_headers):
    response = client.get("/api/v1/auth/me", headers=user_headers)
    assert response.status_code == 200
    assert response.json()["email"] == "user@example.com"


def test_me_requires_token(client):
    assert client.get("/api/v1/auth/me").status_code == 401


def test_invalid_token_rejected(client):
    response = client.get("/api/v1/auth/me", headers={"Authorization": "Bearer no-es-token"})
    assert response.status_code == 401


def test_expired_token_rejected(client, normal_user):
    from app.core.security import create_access_token

    token = create_access_token(normal_user.id, expires_delta=timedelta(seconds=-10))
    response = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 401
    assert "expirado" in response.json()["detail"]


def test_refresh_token_flow(client, normal_user):
    login = client.post(LOGIN_URL, json={"email": "user@example.com", "password": "Test1234"})
    refresh_token = login.json()["refresh_token"]
    response = client.post("/api/v1/auth/refresh", json={"refresh_token": refresh_token})
    assert response.status_code == 200
    assert response.json()["access_token"]


def test_refresh_rejects_access_token(client, normal_user):
    token = token_for(client, "user@example.com")
    response = client.post("/api/v1/auth/refresh", json={"refresh_token": token})
    assert response.status_code == 401


def test_deactivated_user_token_rejected(client, db, normal_user):
    token = token_for(client, "user@example.com")
    normal_user.is_active = False
    db.commit()
    response = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 403


def test_token_contains_expected_claims(normal_user):
    import jwt

    from app.core.config import settings
    from app.core.security import create_access_token

    encoded = create_access_token(normal_user.id, extra_claims={"role": "admin"})
    claims = jwt.decode(encoded, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    assert claims["sub"] == str(normal_user.id)
    assert claims["type"] == "access"
    assert claims["exp"] > datetime.now(UTC).timestamp()
