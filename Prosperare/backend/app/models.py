from datetime import date
from typing import Literal

from pydantic import BaseModel


# Task that client will send to create it
class TaskCreate(BaseModel):
    title: str
    description: str
    status: Literal["pending", "in_progress", "completed"] = "pending" # Default status
    priority: Literal["low", "medium", "high"] = "medium"
    due_date: date

class TaskBase(TaskCreate):
    pass

# Response of the API
class TaskResponse(TaskCreate):
    id: str
    created_at: date # Change in the future