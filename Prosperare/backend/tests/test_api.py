import os

os.environ["MONGODB_DATABASE"] = "prosperare_test"

from fastapi.testclient import TestClient
from app.main import app, tasks_collection
from bson import ObjectId



# Create a TestClient instance for testing the FastAPI app
client = TestClient(app)

# Test for checking mongodb connectivity
def test_health_check():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["Status"] == "ok"
    assert response.json()["Database"] == "connected"

# Test for checking get and create tasks method
def test_created_and_get_task():
    response = client.post(
        "/tasks",
        json={
            "title": "Test task",
            "description": "Test by pytest",
            "status": "in_progress",
            "priority": "high",
            "due_date": "2026-10-21",
        },
    )
    assert response.status_code == 201

    # Create task with this values
    created_task = response.json()
    assert created_task["title"] == "Test task"
    assert created_task["priority"] == "high"
    assert created_task["status"] == "in_progress"

    task_id = created_task["id"]

    # Get id and title from the created task, them delete then
    try:
        get_response = client.get(f"/tasks/{task_id}")

        assert get_response.status_code == 200
        assert get_response.json()["id"] == task_id
        assert get_response.json()["title"] == "Test task"
    finally:
        tasks_collection.delete_one({"_id": ObjectId(task_id)})


# Test for checking put tasks method
def test_update_task():
    response = client.post(
        "/tasks",
        json={
            "title": "Task for update",
            "description": "Test by pytest",
            "status": "in_progress",
            "priority": "high",
            "due_date": "2026-10-21",
        },
    )
    assert response.status_code == 201

    task_id = response.json()["id"]

    try:
        update_task = client.put(
            f"/tasks/{task_id}",
            json= {
               "title": "Update task",
                "description": "Update description",
                "status": "in_progress",
                "priority": "medium",
                "due_date": "2026-10-22",
            },
        )

        assert update_task.status_code == 200

        update_response = update_task.json()
        assert update_response["title"] == "Update task"
        assert update_response["description"] == "Update description"
        assert update_response["status"] == "in_progress"
        assert update_response["priority"] == "medium"
    
    finally:
        tasks_collection.delete_one({"_id": ObjectId(task_id)})


# Test for checking delete tasks method
def test_delete_task():
    response = client.post(
        "/tasks",
        json={
            "title": "Task for delete",
            "description": "Test by pytest",
            "status": "in_progress",
            "priority": "high",
            "due_date": "2026-10-21",
        },
    )
    assert response.status_code == 201

    task_id = response.json()["id"]

    delete_task = client.delete(f"/tasks/{task_id}")
    assert delete_task.status_code == 204

    get_response = client.get(f"/tasks/{task_id}")
    assert get_response.status_code == 404


# Test to look for tasks without title
def test_task_created_without_title():
    response = client.post(
        "/tasks",
        json={
            "description": "Test by pytest",
            "status": "in_progress",
            "priority": "high",
            "due_date": "2026-10-21",
        },
    )
    assert response.status_code == 422