def user_schema(user) -> dict:
    return {
        "id": str(user["_id"]),
        "username": user["username"],
        "surname": user["surname"],
        "age": user["age"],
        "url": user["url"]}

def users_schema(users) -> list:
    return [user_schema(user) for user in users]
