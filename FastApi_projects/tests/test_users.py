from __future__ import annotations

USERS_URL = "/api/v1/users"


def test_list_users_requires_admin(client, user_headers):
    assert client.get(USERS_URL, headers=user_headers).status_code == 403


def test_list_users_as_admin(client, admin_headers, normal_user, other_user):
    response = client.get(USERS_URL, headers=admin_headers)
    assert response.status_code == 200
    assert response.json()["pagination"]["total"] == 3


def test_list_users_search(client, admin_headers, normal_user, other_user):
    response = client.get(f"{USERS_URL}?search=other", headers=admin_headers)
    body = response.json()
    assert body["pagination"]["total"] == 1
    assert body["items"][0]["email"] == "other@example.com"


def test_get_own_profile(client, user_headers):
    response = client.get(f"{USERS_URL}/me", headers=user_headers)
    assert response.status_code == 200
    assert response.json()["email"] == "user@example.com"


def test_cannot_read_other_user(client, user_headers, other_user):
    assert client.get(f"{USERS_URL}/{other_user.id}", headers=user_headers).status_code == 403


def test_admin_can_read_any_user(client, admin_headers, normal_user):
    response = client.get(f"{USERS_URL}/{normal_user.id}", headers=admin_headers)
    assert response.status_code == 200


def test_user_updates_own_profile(client, user_headers):
    response = client.patch(
        f"{USERS_URL}/me", json={"full_name": "Nombre Actualizado"}, headers=user_headers
    )
    assert response.status_code == 200
    assert response.json()["full_name"] == "Nombre Actualizado"


def test_user_cannot_change_own_role(client, user_headers):
    response = client.patch(f"{USERS_URL}/me", json={"role": "admin"}, headers=user_headers)
    assert response.status_code == 403


def test_admin_changes_role(client, admin_headers, normal_user):
    response = client.patch(
        f"{USERS_URL}/{normal_user.id}", json={"role": "admin"}, headers=admin_headers
    )
    assert response.status_code == 200
    assert response.json()["role"] == "admin"


def test_admin_deactivates_user(client, db, admin_headers, normal_user):
    response = client.post(f"{USERS_URL}/{normal_user.id}/deactivate", headers=admin_headers)
    assert response.status_code == 200
    assert response.json()["is_active"] is False

    login = client.post(
        "/api/v1/auth/login", json={"email": "user@example.com", "password": "Test1234"}
    )
    assert login.status_code == 403


def test_admin_deletes_user(client, admin_headers, other_user):
    response = client.delete(f"{USERS_URL}/{other_user.id}", headers=admin_headers)
    assert response.status_code == 200
    assert response.json()["detail"] == "Usuario eliminado"


def test_admin_cannot_delete_self(client, admin_headers):
    me = client.get(f"{USERS_URL}/me", headers=admin_headers).json()
    assert client.delete(f"{USERS_URL}/{me['id']}", headers=admin_headers).status_code == 400


def test_create_user_as_admin(client, admin_headers):
    response = client.post(
        USERS_URL,
        json={"email": "nuevo@example.com", "full_name": "Nuevo", "password": "Test1234"},
        headers=admin_headers,
    )
    assert response.status_code == 201


def test_duplicate_email_on_update_returns_409(client, admin_headers, normal_user, other_user):
    response = client.patch(
        f"{USERS_URL}/{normal_user.id}", json={"email": "other@example.com"}, headers=admin_headers
    )
    assert response.status_code == 409


def test_unknown_user_returns_404(client, admin_headers):
    assert client.get(f"{USERS_URL}/999", headers=admin_headers).status_code == 404
