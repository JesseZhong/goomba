from os import getenv, path, mkdir
from typing import Dict
from dotenv import load_dotenv
from plyvel import DB
import json


load_dotenv()
DB_DIR = getenv('DB_DIR', './db')

def open_db():
    if not path.exists(DB_DIR):
        mkdir(DB_DIR)
    db = DB(DB_DIR, create_if_missing=True)

    return db


def get(key: str) -> Dict[str, str]:
    """
        Retrieves an item from db.
    """
    db = open_db()
    users = db.get(bytes(key, 'utf-8'), bytes(json.dumps({}), 'utf-8'))
    db.close()
    return json.loads(users)


def update(
    key: str,
    item: Dict
):
    """
        Update an item in the db.
    """
    db = open_db()
    db.put(bytes(key, 'utf-8'), bytes(json.dumps(item), 'utf-8'))
    db.close()