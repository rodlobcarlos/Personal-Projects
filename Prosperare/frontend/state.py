import httpx

import reflex as rx

from . import api_client

'''
- Class for control all methods from api_client.py
- The mechanism of this file is what the user will see 
on the website.
'''
class TaskState(rx.State):
    tasks: list[dict] = []
    error: str = ""
    message: str = ""

    # Method to get task list
    async def load_tasks(self):
        self.error = ""

        try:
            self.tasks = await api_client.get_task()
        except httpx.HTTPError:
            self.error = "I can't load tasks list. Revise API"

    # Method for add tasks to the tasksList
    async def add_task(self, form_data: dict):
        self.error = ""
        self.message = ""

        try:
            # The program pauses here until the API creates the task
            await api_client.create_task({
                "title": form_data["title"],
                "description": form_data.get("description", ""),
                "status": form_data.get("state", "pending"),
                "priority": form_data.get("priority", "medium"),
                "due_date": form_data.get("due_date")
            })

            self.message = "Task created correctly."
            await self.load_tasks() # The program pauses here until the load_tasks finish
        
        except (httpx.HTTPError, KeyError):
            self.error = "You can't create this task, revise data."

    # Method that remove a task and update taskList
    async def remove_task(self, task_id: str):
        self.error = ""
        self.message = ""

        try:
            # The program pauses here until the API deletes the task
            await api_client.delete_task(task_id)
            self.message = "Task deleted correctly."
            await self.load_tasks() # The program pauses here until the load_tasks finish
        except httpx.HTTPError:
            self.error = "I can't remove this task."
