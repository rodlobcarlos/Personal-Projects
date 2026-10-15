import httpx

import reflex as rx

from . import api_client

class TaskState(rx.State):
    tasks: list[dict] = []
    error: str = ""
    message: str = ""


    async def load_tasks(self):
        self.error = ""

        try:
            self.tasks = await api_client.get_task()
        except httpx.HTTPError:
            self.error = "I can't load tasks list. Revise API"

    async def add_task(self, form_data: dict):
        self.error = ""
        self.message = ""

        try:
            await api_client.create_task({
                "title": form_data["title"],
                "description": form_data.get("description", ""),
                "status": form_data.get("state", "pending"),
                "priority": form_data.get("priority", "medium"),
                "due_date": form_data.get("due_date")
            })

            self.message = "Task created correctly."
            await self.load_tasks()
        
        except (httpx.HTTPError, KeyError):
            self.error = "You can't create this task, revise data."


    async def remove_task(self, task_id: str):
        self.error = ""
        self.message = ""

        try:
            await api_client.delete_task(task_id)
            self.message = "Task deleted correctly."
            await self.load_tasks()
        except httpx.HTTPError:
            self.error = "I can't remove this task."