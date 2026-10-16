import os

import httpx

# Get the enviroment variable from the api
api_url = os.getenv(
    "prosperare_api_url",
    "http://127.0.0.1:8000",
)

# Method that get all tasks created from API
async def get_task():
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{api_url}/tasks", 
            timeout=10
        )
        response.raise_for_status()
        return response.json()

# Method to create tasks from API
async def create_task(task_data):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{api_url}/tasks",
            json=task_data,
            timeout=10,
        )
        response.raise_for_status()
        return response.json()

# Method to update tasks by {id} from API
async def update_task(task_id, task_data):
    async with httpx.AsyncClient() as client:
        response = await client.put(
            f"{api_url}/tasks/{task_id}",
            json=task_data,
            timeout=10,
        )
        response.raise_for_status()
        return response.json()

# Method to delete tasks by {id} from API
async def delete_task(task_id):
    async with httpx.AsyncClient() as client:
        response = await client.delete(
            f"{api_url}/tasks/{task_id}",
            timeout=10,
        )
        return response.raise_for_status()
