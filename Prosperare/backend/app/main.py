import os
from datetime import date
from pathlib import Path

from bson import ObjectId
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Response, status
from pymongo import MongoClient
from pymongo.errors import PyMongoError

from app.models import TaskCreate, TaskResponse


env_path = Path(__file__).resolve().parents[1] / ".env" # Search the .env root
load_dotenv(env_path) # Load .env root searched

db_url = os.getenv("MONGODB_URL")
db = os.getenv("MONGODB_DATABASE")

if not db_url or not db:
    raise RuntimeError("MongoDB credentials in .env not configurate")

db_client = MongoClient(
    db_url, 
    serverSelectionTimeoutMS=3000)

database = db_client[db]
tasks_collection = database["tasks"] # Tasks collection

app = FastAPI(title="Prosperare Api", version="0.1.0")

# Convert mongo document in a API response
def convert_task(task):
    return {
        "id": str(task["_id"]),
        "title": task["title"],
        "description": task["description"],
        "status": task["status"],
        "priority": task["priority"],
        "due_date": task["due_date"],
        "created_at": task["created_at"]
    }

# Check API and mongo health
@app.get("/health")
async def health_api_db():
    try:
        db_client.admin.command("ping")
        return {"Status": "ok", "Database": "connected"}
    except:
        raise HTTPException(
            status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Server not connect.")


# Add one new task
@app.post("/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def add_task(task: TaskCreate):
    try:
        task_data = task.model_dump() # Task -> dict

        #date to ISO format
        task_data["due_date"] = task.due_date.isoformat()
        task_data["created_at"] = date.today().isoformat()

        result = tasks_collection.insert_one(task_data) # Add task to the tasks collection
        created_task = tasks_collection.find_one(
                {"_id": result.inserted_id}
            ) # Add id from db for local dict
        
        return convert_task(created_task)

    except PyMongoError as error:
        print(f"Mongo error to create a task: {error}", flush=True)
        raise HTTPException(
            status_code=500,
            detail="Error at save this task in mongo",
        )
    except Exception as error:
        print(f"Error for load task: {error!r}", flush=True)
        raise


# Get the complete task collection
@app.get("/tasks", response_model=list[TaskResponse])
async def get_colletion():
    tasks = tasks_collection.find().sort("created_at", -1)
    return [convert_task(task) for task in tasks]


# Update one task from the collection
@app.put("/tasks/{id}", response_model=TaskResponse)
async def task_update(id: str, task: TaskCreate):
    if not ObjectId.is_valid(id):
        raise HTTPException(
            status_code=status.HTTP_304_NOT_MODIFIED,
            detail={"Error:": "Incorrect id."}
        )

    #To format date, always convert task -> dict
    task_data = task.model_dump()
    task_data["due_date"] = task.due_date.isoformat()
    task_data["created_at"] = date.today().isoformat()

    result = tasks_collection.update_one(
        {"_id": ObjectId(id)}, # Filter by id
        {"$set": task_data} # Update the task with the new data
    )

    if result.matched_count == 0: # If no task was found with the given id
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"Error:": "Task not found."}
        )
    update_task = tasks_collection.find_one(
        {"_id": ObjectId(id)}
    )

    return convert_task(update_task)


# Delete task from the collection
@app.delete("/tasks/{id}")
async def task_delete(id: str):
    if not ObjectId.is_valid(id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"Error": "Id not found."}
        )
 
    result = tasks_collection.delete_one( 
        {"_id": ObjectId(id)} 
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Task not found.")
    
    return Response(status_code=status.HTTP_204_NO_CONTENT)