from fastapi import APIRouter, HTTPException
from db.models.user import User
from db.client import db_client 
from db.schemas.user import user_schema, users_schema
from bson import ObjectId

router = APIRouter(prefix="/usersdb",
                  responses={404: {"message": "Not found"}},
                  tags=["usersdb"])

users_list = []

@router.get("/", response_model=list[User])
async def get_users():
    return users_schema(db_client.users.find())

@router.get("/{id}", status_code=201)
async def read_user(id: str):
    return search_user("_id", ObjectId(id))

@router.post("/", response_model=User, status_code=201)
async def add_user(user: User):
    if search_user("username", user.username) is not None:
        raise HTTPException(
            status_code=409,
            detail="This user already exists.")

    user_dict = dict(user)
    del user_dict["id"]
    
    id = db_client.users.insert_one(user_dict).inserted_id

    new_user = user_schema(db_client.users.find_one({"_id": id}))

    return User(**new_user)

@router.delete("/{id}", status_code=204)
async def delete_user(id: str):
    found = db_client.users.find_one_and_delete({"_id": ObjectId(id)})

    if not found:
        return {"Error": "User deleted."}

@router.put("/", response_model=User)
async def update_user(user: User):

    user_dict = dict(user)
    del user_dict["id"]

    try:
        db_client.users.find_one_and_replace(
            {"_id": ObjectId(user.id)}, user_dict)
    except:
        return {"Error": "User not updated."}
        
    return search_user("_id", ObjectId(user.id))
    
def search_user(field: str, key):
    try:
        user = db_client.users.find_one({field: key})
        if user is None:
            return None
        return User(**user_schema(user))
    except:
        raise HTTPException(
            status_code=409,
            detail="This user already exists."
        )