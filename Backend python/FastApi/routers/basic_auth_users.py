from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

app = FastAPI()
ouath2 = OAuth2PasswordBearer(tokenUrl="login")

class user(BaseModel):
    username: str
    full_name: str
    email: str
    disabled: bool

class UserDB(user):
    password: str

user_db = {
    "rodlobcarlos": {
        "username": "Carlos",
        "full_name": "Rodríguez Lobato",
        "email": "rodlobcarlos@gmail.com",
        "disabled": False,
        "password": "password123"
    },
    "rodlobcarlos2": {
            "username": "Carlos2",
            "full_name": "Rodríguez Lobato 2",
            "email": "rodlobcarlos2@gmail.com",
            "disabled": True,
            "password": "password1234"
        }
}

def search_user(username: str):
    if username in user_db:
        return UserDB(user_db[username])

@app.post("/login")
async def user_login(form: OAuth2PasswordRequestForm = Depends()):
    db = user_db.get(form.username)
    if not db:
        raise HTTPException(status_code=400, detail="User not found.")
    
    user = search_user(form.username)
    if not form.password == user.password:
        raise HTTPException(status_code=400, detail="Incorrect password.")
    
    return {"access_token": user.username, "token_type": "beaer"}

