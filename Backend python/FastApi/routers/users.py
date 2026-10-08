from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/users",
                  responses={404: {"message": "Not found"}},
                  tags=["users"])

class User(BaseModel):
    id: int
    username: str
    surname: str
    age: int
    url: str

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

@router.post("/", status_code=201)
async def add_user(user: User):
    if user in users_list:
        return HTTPException(status_code=204, detail="This user already exist.")
    return users_list.append(user)

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