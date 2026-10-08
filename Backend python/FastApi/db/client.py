import os

from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

mongo_uri = os.environ.get("MONGODB_URI")
if not mongo_uri:
    raise RuntimeError("MONGODB_URI environment variable is not configured.")

db_client = MongoClient(mongo_uri).backPython
