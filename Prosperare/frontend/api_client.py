import os

import httpx

api_url = os.getenv(
    "prosperare_api_url",
    "http://127.0.0.1:8000",
)

def get_task():
    response = httpx.get(f"{api_url}/tasks", timeout=10)
    response.raise_for_status()
    return response.json()

def create_task(task_data):
    response = httpx.post(
        f"{api_url}/tasks",
        json=task_data,
        timeout=10,
    )
    response.raise_for_status()
    return response.json()

def update_task(task_id, task_data):
    response = httpx.put(
        f"{api_url}/tasks/{task_id}",
        json=task_data,
        timeout=10,
    )
    response.raise_for_status()
    return response.json()

def delete_task(task_id):
    response = httpx.delete(
        f"{api_url}/tasks/{task_id}",
        timeout=10,
    )
    return response.raise_for_status()