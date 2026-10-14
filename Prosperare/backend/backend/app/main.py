import os
from datetime import date
from pathlib import Path

from bson import ObjectId
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Response, status
from pymongo import MongoClient
from pymongo.errors import PyMongoError

from app.models import TaskCreate, TaskResponse


env__path = Path(__file__).resolve().parents[1] / ".env" # Search the .env root
load_dotenv(env__path) # Load .env root searched

db_url = os.getenv("MONGODB_URL")
db = os.getenv("MONGODB_DATABASE")

if not db_url or not db:
    raise RuntimeError("MongoDB credentials in .env not configurate")

db_client = MongoClient(
    db_url, 
    serverSelectionTimeoutMS=3000)

database = db_client[db]
tasks_collection = database["tasks"] # Tasks collection

app = FastAPI(title="Properare Api", version="0.1.0")

# Convert mongo document in a API response
def convert_task(task):
    return {
        "id": str["_id"],
        "title": task["title"],
        "description": task["description"],
        "status": task["status"],
        "priority": task["priority"],
        "due_date": task["due_date"]
    }

# Check API and mongo health
@app.get("/health")
async def health_api_db():
    try:
        db_client.admin.command("ping")
        return {"Status": "ok", "Database": "connected"}
    except PyMongoError:
        raise HTTPException(
            status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Server not connect.")


@app.post("/add_task", response_class=TaskResponse, status_code=status.HTTP_201_CREATED)
async def add_task(task: TaskCreate):
    task_data = task.model_dump() # Task -> dict

    #date to ISO format
    task_data["due_date"] = task.due_date.isoformat()
    task_data["created_at"] = date.today().isoformat()

    result = tasks_collection.insert_one(task_data) # Add task to the tasks collection
    task_data["_id"] = result.inserted_id # Add id from db for local dict
    
    return convert_task(task_data)

@app.get("/tasks", response_model=list[TaskResponse])
async def get_colletion(): 
    tasks = tasks_collection.find().sort("created_at", -1)
    return [convert_task(task) for task in tasks]