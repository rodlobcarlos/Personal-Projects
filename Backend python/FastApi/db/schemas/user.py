def user_schema(user) -> dict:
    return {
        "id": str(user["_id"]),
        "username": user["username"],
        "surname": user["surname"],
        "age": user["age"],
        "url": user["url"]}