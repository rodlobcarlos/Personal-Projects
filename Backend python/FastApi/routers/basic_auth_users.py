from fastapi import FastAPI, Depends, HTTPException, status, APIRouter
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

router = APIRouter(
    prefix="/basicauth",
    tags=["basicauth"],
    responses={status.HTTP_404_NOT_FOUND: {"message": "No encontrado"}})

ouath2 = OAuth2PasswordBearer(tokenUrl="login")

class User(BaseModel):
    username: str
    full_name: str
    email: str
    disabled: bool

class UserDB(User):
    password: str

user_db = {
    "rodlobcarlos": {
        "username": "rodlobcarlos",
        "full_name": "Rodríguez Lobato",
        "email": "rodlobcarlos@gmail.com",
        "disabled": False,
        "password": "password123"
    },
    "rodlobcarlos2": {
            "username": "rodlobcarlos2",
            "full_name": "Rodríguez Lobato 2",
            "email": "rodlobcarlos2@gmail.com",
            "disabled": True,
            "password": "password1234"
        }
}

def search_user_db(username: str):
    if username in user_db:
        return UserDB(**user_db[username])

def search_user(username: str):
    if username in user_db:
        return User(**user_db[username])
    
async def current_user(token: str= Depends(ouath2)):
    user = search_user(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="No authorize", 
            headers={"WWW-Authenticate": "Bearer"})

    if user.disabled:
        raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, 
                    detail="Inactive user")
    
    return user

@router.post("/login")
async def user_login(form: OAuth2PasswordRequestForm = Depends()):
    db = user_db.get(form.username)
    if not db:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found.")
    
    user = search_user_db(form.username)
    if not form.password == user.password:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password.")
    
    return {"access_token": user.username, "token_type": "beaer"}

@router.get("/users/me")
async def me(user: User= Depends(current_user)):
    return user