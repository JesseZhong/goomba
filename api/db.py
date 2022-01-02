from os import getenv, path, mkdir
from typing import Dict, List, Union
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


def get(
    key: str,
    db: any = None,
    *,
    default: Union[Dict, List] = {}
) -> Union[Dict, List]:
    """
        Retrieves an item from db.
    """

    # Open the DB if no previously opened instance was passed.
    target_db = db if db else open_db()

    result = target_db.get(
        bytes(key, 'utf-8'),
        bytes(json.dumps(default), 'utf-8')
    )

    # Close a self-opened DB.
    if not db:
        target_db.close()
        
    return json.loads(result)


def update(
    key: str,
    item: Union[Dict, List],
    *,
    db: any = None
):
    """
        Update an item in the db.
    """
    # Open the DB if no previously opened instance was passed.
    target_db = db if db else open_db()

    target_db.put(
        bytes(key, 'utf-8'),
        bytes(json.dumps(item), 'utf-8')
    )

    # Close a self-opened DB.
    if not db:
        target_db.close()