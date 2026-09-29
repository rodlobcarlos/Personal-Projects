from __future__ import annotations

from datetime import UTC, datetime, timedelta

import pytest

PROJECTS_URL = "/api/v1/projects"
TASKS_URL = "/api/v1/tasks"


@pytest.fixture
def project(client, user_headers, project_payload) -> dict:
    response = client.post(PROJECTS_URL, json=project_payload, headers=user_headers)
    assert response.status_code == 201
    return response.json()


def test_create_task(client, user_headers, project, task_payload):
    response = client.post(
        f"{PROJECTS_URL}/{project['id']}/tasks", json=task_payload, headers=user_headers
    )
    assert response.status_code == 201, response.text
    body = response.json()
    assert body["id"] > 0
    assert body["title"] == "Crear frontend"
    assert body["status"] == "todo"
    assert body["priority"] == "high"
    assert body["is_completed"] is False
    assert body["project_id"] == project["id"]


def test_create_task_requires_auth(client, project, task_payload):
    response = client.post(f"{PROJECTS_URL}/{project['id']}/tasks", json=task_payload)
    assert response.status_code == 401


def test_create_task_invalid_project(client, user_headers, task_payload):
    response = client.post(f"{PROJECTS_URL}/999/tasks", json=task_payload, headers=user_headers)
    assert response.status_code == 404


@pytest.mark.parametrize(
    "payload",
    [
        {"title": "ab"},
        {"title": "Tarea valida", "priority": "urgentisima"},
        {"title": "Tarea valida", "estimated_hours": -5},
        {"description": "sin titulo"},
    ],
)
def test_create_task_validation(client, user_headers, project, payload):
    response = client.post(
        f"{PROJECTS_URL}/{project['id']}/tasks", json=payload, headers=user_headers
    )
    assert response.status_code == 422


def test_list_tasks_of_project(client, user_headers, project, task_payload):
    for title in ["Crear frontend", "Crear backend", "Configurar Docker"]:
        client.post(
            f"{PROJECTS_URL}/{project['id']}/tasks",
            json={**task_payload, "title": title},
            headers=user_headers,
        )
    response = client.get(f"{PROJECTS_URL}/{project['id']}/tasks", headers=user_headers)
    assert response.status_code == 200
    body = response.json()
    assert len(body["items"]) == 3
    assert body["pagination"]["total"] == 3


def test_list_tasks_empty(client, user_headers, project):
    response = client.get(f"{PROJECTS_URL}/{project['id']}/tasks", headers=user_headers)
    assert response.json()["items"] == []


def test_get_task_by_id(client, user_headers, project, task_payload):
    created = client.post(
        f"{PROJECTS_URL}/{project['id']}/tasks", json=task_payload, headers=user_headers
    ).json()
    response = client.get(f"{TASKS_URL}/{created['id']}", headers=user_headers)
    assert response.status_code == 200
    assert response.json()["id"] == created["id"]


def test_get_task_not_found(client, user_headers):
    assert client.get(f"{TASKS_URL}/999", headers=user_headers).status_code == 404


def test_update_task(client, user_headers, project, task_payload):
    created = client.post(
        f"{PROJECTS_URL}/{project['id']}/tasks", json=task_payload, headers=user_headers
    ).json()
    response = client.put(
        f"{TASKS_URL}/{created['id']}",
        json={"title": "Crear frontend Angular", "status": "in_progress"},
        headers=user_headers,
    )
    assert response.status_code == 200
    body = response.json()
    assert body["title"] == "Crear frontend Angular"
    assert body["status"] == "in_progress"
    assert body["is_completed"] is False


def test_complete_task_updates_progress(client, user_headers, project, task_payload):
    for title in ["Tarea A", "Tarea B", "Tarea C", "Tarea D"]:
        client.post(
            f"{PROJECTS_URL}/{project['id']}/tasks",
            json={**task_payload, "title": title},
            headers=user_headers,
        )
    tasks = client.get(f"{PROJECTS_URL}/{project['id']}/tasks", headers=user_headers).json()[
        "items"
    ]
    target = tasks[0]["id"]

    client.put(f"{TASKS_URL}/{target}", json={"status": "done"}, headers=user_headers)
    project_view = client.get(f"{PROJECTS_URL}/{project['id']}", headers=user_headers).json()
    assert project_view["progress"] == 25
    assert project_view["completed_task_count"] == 1
    assert project_view["task_count"] == 4

    client.put(f"{TASKS_URL}/{target}", json={"status": "in_progress"}, headers=user_headers)
    project_view = client.get(f"{PROJECTS_URL}/{project['id']}", headers=user_headers).json()
    assert project_view["progress"] == 0
    assert project_view["completed_task_count"] == 0


def test_task_marked_completed_via_flag(client, user_headers, project, task_payload):
    created = client.post(
        f"{PROJECTS_URL}/{project['id']}/tasks", json=task_payload, headers=user_headers
    ).json()
    response = client.patch(
        f"{TASKS_URL}/{created['id']}", json={"is_completed": True}, headers=user_headers
    )
    assert response.status_code == 200
    assert response.json()["is_completed"] is True
    assert response.json()["status"] == "done"
    assert response.json()["completed_at"] is not None


def test_delete_task_updates_progress(client, user_headers, project, task_payload):
    tasks = [
        client.post(
            f"{PROJECTS_URL}/{project['id']}/tasks",
            json={**task_payload, "title": f"Tarea {index}"},
            headers=user_headers,
        ).json()
        for index in range(2)
    ]
    client.put(f"{TASKS_URL}/{tasks[0]['id']}", json={"status": "done"}, headers=user_headers)
    assert (
        client.get(f"{PROJECTS_URL}/{project['id']}", headers=user_headers).json()["progress"] == 50
    )

    response = client.delete(f"{TASKS_URL}/{tasks[1]['id']}", headers=user_headers)
    assert response.status_code == 204
    project_view = client.get(f"{PROJECTS_URL}/{project['id']}", headers=user_headers).json()
    assert project_view["progress"] == 100
    assert project_view["task_count"] == 1


def test_filter_tasks_by_status(client, user_headers, project, task_payload):
    client.post(
        f"{PROJECTS_URL}/{project['id']}/tasks",
        json={**task_payload, "title": "Hecha"},
        headers=user_headers,
    )
    client.post(
        f"{PROJECTS_URL}/{project['id']}/tasks",
        json={**task_payload, "title": "Pendiente"},
        headers=user_headers,
    )
    done = client.get(
        f"{PROJECTS_URL}/{project['id']}/tasks?is_completed=true", headers=user_headers
    ).json()
    assert done["pagination"]["total"] == 0

    tasks = client.get(f"{PROJECTS_URL}/{project['id']}/tasks", headers=user_headers).json()[
        "items"
    ]
    client.put(f"{TASKS_URL}/{tasks[0]['id']}", json={"status": "done"}, headers=user_headers)

    response = client.get(f"{PROJECTS_URL}/{project['id']}/tasks?status=done", headers=user_headers)
    assert response.json()["pagination"]["total"] == 1


def test_search_tasks(client, user_headers, project, task_payload):
    client.post(
        f"{PROJECTS_URL}/{project['id']}/tasks",
        json={**task_payload, "title": "Crear backend"},
        headers=user_headers,
    )
    client.post(
        f"{PROJECTS_URL}/{project['id']}/tasks",
        json={**task_payload, "title": "Desplegar en Azure"},
        headers=user_headers,
    )
    response = client.get(
        f"{PROJECTS_URL}/{project['id']}/tasks?search=azure", headers=user_headers
    )
    assert response.json()["pagination"]["total"] == 1
    assert response.json()["items"][0]["title"] == "Desplegar en Azure"


def test_filter_overdue_tasks(client, user_headers, project, task_payload):
    past = (datetime.now(UTC) - timedelta(days=2)).isoformat()
    future = (datetime.now(UTC) + timedelta(days=2)).isoformat()
    client.post(
        f"{PROJECTS_URL}/{project['id']}/tasks",
        json={**task_payload, "title": "Vencida", "due_date": past},
        headers=user_headers,
    )
    client.post(
        f"{PROJECTS_URL}/{project['id']}/tasks",
        json={**task_payload, "title": "Futura", "due_date": future},
        headers=user_headers,
    )
    response = client.get(
        f"{PROJECTS_URL}/{project['id']}/tasks?overdue=true", headers=user_headers
    )
    assert response.json()["pagination"]["total"] == 1
    assert response.json()["items"][0]["title"] == "Vencida"


def test_task_overdue_flag(client, user_headers, project, task_payload):
    past = (datetime.now(UTC) - timedelta(days=1)).isoformat()
    created = client.post(
        f"{PROJECTS_URL}/{project['id']}/tasks",
        json={**task_payload, "title": "Vencida", "due_date": past},
        headers=user_headers,
    ).json()
    assert created["is_overdue"] is True


def test_task_pagination(client, user_headers, project, task_payload):
    for index in range(7):
        client.post(
            f"{PROJECTS_URL}/{project['id']}/tasks",
            json={**task_payload, "title": f"Tarea {index}"},
            headers=user_headers,
        )
    response = client.get(
        f"{PROJECTS_URL}/{project['id']}/tasks?page=2&page_size=3", headers=user_headers
    )
    body = response.json()
    assert len(body["items"]) == 3
    assert body["pagination"]["total"] == 7
    assert body["pagination"]["total_pages"] == 3


def test_project_stats(client, user_headers, project, task_payload):
    client.post(
        f"{PROJECTS_URL}/{project['id']}/tasks",
        json={**task_payload, "title": "Tarea A", "estimated_hours": 5},
        headers=user_headers,
    )
    client.post(
        f"{PROJECTS_URL}/{project['id']}/tasks",
        json={**task_payload, "title": "Tarea B", "priority": "urgent", "estimated_hours": 3},
        headers=user_headers,
    )
    tasks = client.get(f"{PROJECTS_URL}/{project['id']}/tasks", headers=user_headers).json()[
        "items"
    ]
    client.put(f"{TASKS_URL}/{tasks[0]['id']}", json={"status": "done"}, headers=user_headers)

    response = client.get(f"{PROJECTS_URL}/{project['id']}/stats", headers=user_headers)
    body = response.json()
    assert body["total_tasks"] == 2
    assert body["completed_tasks"] == 1
    assert body["pending_tasks"] == 1
    assert body["completion_percentage"] == 50.0
    assert body["estimated_hours"] == 8
    assert body["by_status"]["done"] == 1
    assert body["by_priority"]["urgent"] == 1


def test_deleting_project_cascades_tasks(client, user_headers, project, task_payload):
    task = client.post(
        f"{PROJECTS_URL}/{project['id']}/tasks", json=task_payload, headers=user_headers
    ).json()
    assert client.delete(f"{PROJECTS_URL}/{project['id']}", headers=user_headers).status_code == 204
    assert client.get(f"{TASKS_URL}/{task['id']}", headers=user_headers).status_code == 404


def test_user_cannot_access_other_users_task(
    client, user_headers, other_headers, project, task_payload
):
    task = client.post(
        f"{PROJECTS_URL}/{project['id']}/tasks", json=task_payload, headers=user_headers
    ).json()
    assert client.get(f"{TASKS_URL}/{task['id']}", headers=other_headers).status_code == 403
    assert (
        client.put(
            f"{TASKS_URL}/{task['id']}", json={"title": "Hackeada"}, headers=other_headers
        ).status_code
        == 403
    )
    assert client.delete(f"{TASKS_URL}/{task['id']}", headers=other_headers).status_code == 403
