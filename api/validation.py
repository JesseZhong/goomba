from os import path
from typing import NoReturn, Union
from flask import request
from flask_restful import abort
import json
import re
from jsonschema.exceptions import ValidationError

from jsonschema.validators import validate


# ID regex. UUID format.
ID_REGEX = '^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$'

def verify_id(id: str) -> bool:
    """
        Check if the id is a valid UUID.
    """
    return re.match(ID_REGEX, id, re.RegexFlag.IGNORECASE)


def verify_schema(
    schema_file: str
) -> Union[any, NoReturn]:
    """
        Check if the data
    """

    # Attempt to get the request body as json.
    data = None
    try:
        data = request.get_json(force=True)
    except TypeError:
        abort(400, 'Malformed request body.')

    # Grab local path.
    apiDir = path.dirname(path.realpath(__file__))

    # Validate the schema of the request body first.
    with open(path.join(apiDir, schema_file), 'r') as file:
        put_schema = json.load(file)
        try:
            validate(
                instance=data,
                schema=put_schema
            )
        except ValidationError as e:
            abort(400, message=e.message)

    return data