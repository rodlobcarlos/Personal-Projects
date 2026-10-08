from fastapi import APIRouter, HTTPException
from db.models.user import User
from db.client import db_client 
from db.schemas.user import user_schema

router = APIRouter(prefix="/usersdb",
                  responses={404: {"message": "Not found"}},
                  tags=["usersdb"])

users_list = []

@router.get("/")
async def get_users():
    return users_list

@router.get("/{id}", status_code=201)
async def read_user(id: int):
    users = filter(lambda user: user.id == id, users_list)
    try:
        return list(users)[0]
    except:
        raise HTTPException(status_code=404)

@router.post("/", response_model=User, status_code=201)
async def add_user(user: User):
    if search_user_by_username(user.username) is not None:
        raise HTTPException(
            status_code=409,
            detail="This user already exists.")

    user_dict = dict(user)
    del user_dict["id"]
    
    id = db_client.local.users.insert_one(user_dict).inserted_id

    new_user = user_schema(db_client.local.users.find_one({"_id": id}))

    return User(**new_user)

@router.delete("/{id}")
async def delete_user(id: int):
    users = next((u for u in users_list if u.id == id), None)
    try:
        return users_list.remove(users)
    except:
        raise HTTPException(status_code=409)

@router.put("/{id}")
async def update_user(id: int, user: User):
    users = next((u for u in users_list if u.id == id), None)
    try:
        if user != None:
            element = users_list.index(users)
            users_list[element] = user
            return user
    except:
        raise HTTPException(status_code=409)

def search_user_by_username(username: str):
    try:
        user = db_client.local.users.find_one({"username": username})
        if user is None:
            return None
        return User(**user_schema(user))
    except:
        raise HTTPException(
            status_code=409,
            detail="This user already exists."
        )