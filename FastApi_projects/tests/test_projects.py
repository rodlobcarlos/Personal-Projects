from __future__ import annotations

import pytest

PROJECTS_URL = "/api/v1/projects"


def test_create_project(client, user_headers, project_payload):
    response = client.post(PROJECTS_URL, json=project_payload, headers=user_headers)
    assert response.status_code == 201, response.text
    body = response.json()
    assert body["id"] > 0
    assert body["name"] == "Portfolio Personal"
    assert body["status"] == "in_progress"
    assert body["technologies"] == ["Angular", "Java", "Docker"]
    assert body["progress"] == 0
    assert body["task_count"] == 0


def test_create_project_requires_auth(client, project_payload):
    assert client.post(PROJECTS_URL, json=project_payload).status_code == 401


def test_technologies_accept_comma_string(client, user_headers):
    response = client.post(
        PROJECTS_URL,
        json={"name": "Proyecto Tech", "technologies": "Python, FastAPI"},
        headers=user_headers,
    )
    assert response.status_code == 201
    assert response.json()["technologies"] == ["Python", "FastAPI"]


@pytest.mark.parametrize(
    "payload",
    [
        {"name": "AB"},
        {"name": "Proyecto valido", "status": "estado_invalido"},
        {"name": "Proyecto valido", "due_date": "2020-01-01", "start_date": "2026-01-01"},
        {"name": "Proyecto valido", "repository_url": "ftp://no-valido"},
        {"description": "sin nombre"},
    ],
)
def test_create_project_validation(client, user_headers, payload):
    response = client.post(PROJECTS_URL, json=payload, headers=user_headers)
    assert response.status_code == 422


def test_duplicate_technologies_removed(client, user_headers):
    response = client.post(
        PROJECTS_URL,
        json={"name": "Dup Tech", "technologies": ["Docker", "docker"]},
        headers=user_headers,
    )
    assert response.status_code == 201
    assert response.json()["technologies"] == ["Docker"]


def test_list_projects_empty(client, user_headers):
    response = client.get(PROJECTS_URL, headers=user_headers)
    assert response.status_code == 200
    body = response.json()
    assert body["items"] == []
    assert body["pagination"]["total"] == 0
    assert body["pagination"]["total_pages"] == 0


def test_list_projects_pagination(client, user_headers, project_payload):
    for index in range(5):
        client.post(
            PROJECTS_URL,
            json={**project_payload, "name": f"Proyecto {index}"},
            headers=user_headers,
        )
    response = client.get(f"{PROJECTS_URL}?page=1&page_size=2", headers=user_headers)
    body = response.json()
    assert len(body["items"]) == 2
    assert body["pagination"]["total"] == 5
    assert body["pagination"]["total_pages"] == 3
    assert body["pagination"]["has_next"] is True
    assert body["pagination"]["has_previous"] is False

    last = client.get(f"{PROJECTS_URL}?page=3&page_size=2", headers=user_headers).json()
    assert len(last["items"]) == 1
    assert last["pagination"]["has_next"] is False
    assert last["pagination"]["has_previous"] is True


def test_list_projects_filter_by_status(client, user_headers, project_payload):
    client.post(PROJECTS_URL, json={**project_payload, "name": "Alpha"}, headers=user_headers)
    client.post(
        PROJECTS_URL,
        json={**project_payload, "name": "Beta", "status": "completed"},
        headers=user_headers,
    )
    response = client.get(f"{PROJECTS_URL}?status=completed", headers=user_headers)
    body = response.json()
    assert body["pagination"]["total"] == 1
    assert body["items"][0]["name"] == "Beta"


def test_list_projects_search(client, user_headers, project_payload):
    client.post(
        PROJECTS_URL, json={**project_payload, "name": "Tienda Online"}, headers=user_headers
    )
    client.post(
        PROJECTS_URL, json={**project_payload, "name": "Blog Personal"}, headers=user_headers
    )
    response = client.get(f"{PROJECTS_URL}?search=tienda", headers=user_headers)
    assert response.json()["pagination"]["total"] == 1
    assert response.json()["items"][0]["name"] == "Tienda Online"


def test_list_projects_filter_by_technology(client, user_headers, project_payload):
    client.post(PROJECTS_URL, json=project_payload, headers=user_headers)
    client.post(
        PROJECTS_URL,
        json={**project_payload, "name": "Otro", "technologies": ["Go"]},
        headers=user_headers,
    )
    response = client.get(f"{PROJECTS_URL}?technology=docker", headers=user_headers)
    assert response.json()["pagination"]["total"] == 1


def test_list_projects_ordering(client, user_headers, project_payload):
    for name in ["Charlie", "Alpha", "Bravo"]:
        client.post(PROJECTS_URL, json={**project_payload, "name": name}, headers=user_headers)
    response = client.get(f"{PROJECTS_URL}?order_by=name&order=asc", headers=user_headers)
    names = [item["name"] for item in response.json()["items"]]
    assert names == ["Alpha", "Bravo", "Charlie"]


def test_list_projects_invalid_order_by(client, user_headers):
    response = client.get(f"{PROJECTS_URL}?order_by=drop_table", headers=user_headers)
    assert response.status_code == 422


def test_get_project(client, user_headers, project_payload):
    created = client.post(PROJECTS_URL, json=project_payload, headers=user_headers).json()
    response = client.get(f"{PROJECTS_URL}/{created['id']}", headers=user_headers)
    assert response.status_code == 200
    assert response.json()["id"] == created["id"]


def test_get_project_not_found(client, user_headers):
    response = client.get(f"{PROJECTS_URL}/999", headers=user_headers)
    assert response.status_code == 404
    assert "999" in response.json()["detail"]


def test_update_project(client, user_headers, project_payload):
    created = client.post(PROJECTS_URL, json=project_payload, headers=user_headers).json()
    response = client.put(
        f"{PROJECTS_URL}/{created['id']}",
        json={"name": "Portfolio Actualizado", "status": "completed"},
        headers=user_headers,
    )
    assert response.status_code == 200
    body = response.json()
    assert body["name"] == "Portfolio Actualizado"
    assert body["status"] == "completed"
    assert body["completed_at"] is not None


def test_patch_project_partial(client, user_headers, project_payload):
    created = client.post(PROJECTS_URL, json=project_payload, headers=user_headers).json()
    response = client.patch(
        f"{PROJECTS_URL}/{created['id']}",
        json={"description": "Solo descripcion"},
        headers=user_headers,
    )
    assert response.status_code == 200
    assert response.json()["description"] == "Solo descripcion"
    assert response.json()["name"] == "Portfolio Personal"


def test_delete_project(client, user_headers, project_payload):
    created = client.post(PROJECTS_URL, json=project_payload, headers=user_headers).json()
    assert client.delete(f"{PROJECTS_URL}/{created['id']}", headers=user_headers).status_code == 204
    assert client.get(f"{PROJECTS_URL}/{created['id']}", headers=user_headers).status_code == 404


def test_delete_project_not_found(client, user_headers):
    assert client.delete(f"{PROJECTS_URL}/42", headers=user_headers).status_code == 404


def test_user_cannot_access_other_users_project(
    client, user_headers, other_headers, project_payload
):
    created = client.post(PROJECTS_URL, json=project_payload, headers=user_headers).json()
    assert client.get(f"{PROJECTS_URL}/{created['id']}", headers=other_headers).status_code == 403
    assert (
        client.put(
            f"{PROJECTS_URL}/{created['id']}", json={"name": "Hackeado"}, headers=other_headers
        ).status_code
        == 403
    )
    assert (
        client.delete(f"{PROJECTS_URL}/{created['id']}", headers=other_headers).status_code == 403
    )


def test_admin_can_access_any_project(client, user_headers, admin_headers, project_payload):
    created = client.post(PROJECTS_URL, json=project_payload, headers=user_headers).json()
    assert client.get(f"{PROJECTS_URL}/{created['id']}", headers=admin_headers).status_code == 200
    assert (
        client.delete(f"{PROJECTS_URL}/{created['id']}", headers=admin_headers).status_code == 204
    )


def test_admin_sees_all_projects(
    client, user_headers, other_headers, admin_headers, project_payload
):
    client.post(PROJECTS_URL, json={**project_payload, "name": "Mio"}, headers=user_headers)
    client.post(PROJECTS_URL, json={**project_payload, "name": "Suyo"}, headers=other_headers)
    admin_view = client.get(PROJECTS_URL, headers=admin_headers).json()
    assert admin_view["pagination"]["total"] == 2
    user_view = client.get(PROJECTS_URL, headers=user_headers).json()
    assert user_view["pagination"]["total"] == 1


def test_project_stats_empty(client, user_headers, project_payload):
    created = client.post(PROJECTS_URL, json=project_payload, headers=user_headers).json()
    response = client.get(f"{PROJECTS_URL}/{created['id']}/stats", headers=user_headers)
    assert response.status_code == 200
    body = response.json()
    assert body["total_tasks"] == 0
    assert body["completion_percentage"] == 0.0
