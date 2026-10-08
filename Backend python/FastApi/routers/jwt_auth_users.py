from fastapi import FastAPI, Depends, HTTPException, status, APIRouter
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import jwt
from jwt.exceptions import PyJWTError as JWTError
from passlib.context import CryptContext
from datetime import timedelta, datetime, timezone

router = APIRouter(prefix="/jwt",
                tags=["jwt"],
                responses={status.HTTP_404_NOT_FOUND: {"message": "No encontrado"}})

ALGORITHM = "HS256"

crypt = CryptContext(schemes=["bcrypt"])

ACCESS_TOKEN_DURATION = 1 

SECRET = "d9ee3c27a0833872258a39daadb16ff7470d2cff5acfbb569ebc7bd636dabc58"

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
        "password": "$2a$12$nOlH1df2jquImuq49zZ7yO3333jZIOrpCqHt15Y08Zovt9tSGfUAi"
    },
    "rodlobcarlos2": {
            "username": "rodlobcarlos2",
            "full_name": "Rodríguez Lobato 2",
            "email": "rodlobcarlos2@gmail.com",
            "disabled": True,
            "password": "$2a$12$DkwjDBFuEOMu5bkLHgIPPOiteaXjeCwnp0DwsfCZLEjqliEbSVsl2"
        }
}

def search_user_db(username: str):
    if username in user_db:
        return UserDB(**user_db[username])

def search_user(username: str):
    if username in user_db:
        return User(**user_db[username])

async def auth_user(token: str= Depends(ouath2)):
    exception = HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="No authorize", 
                headers={"WWW-Authenticate": "Bearer"})
    try:
        username = jwt.decode(token, SECRET, algorithms=ALGORITHM).get("sub")
        if username is None:
            raise exception
    except JWTError: exception

    return search_user(username)

async def current_user(user: User= Depends(auth_user)):
    if user.disabled:
        raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, 
                    detail="Inactive user")
    
    return user

@router.post("/login")
async def user_login(form: OAuth2PasswordRequestForm = Depends()):
    db = user_db.get(form.username)
    if not db:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, 
                            detail="User not found.")
    
    user = search_user_db(form.username)

    if not crypt.verify(form.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, 
                            detail="Incorrect password.")
    
    access_token = {"sub": user.username, 
                    "exp": datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_DURATION)}
    
    return {"access_token": jwt.encode(access_token, SECRET, algorithm=ALGORITHM), "token_type": "bearer"}

@router.get("/users/me")
async def me(user: User= Depends(current_user)):
    return user