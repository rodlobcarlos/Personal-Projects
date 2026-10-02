from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def read_root():
    return {"Hello": "World"}

@app.get("/items/{item_id}")
async def read_items(item_id: int, q: str):
    return {"Item_id:": item_id, "q: ": q}