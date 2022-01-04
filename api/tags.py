from typing import Dict, List
from flask_restful import Resource, abort
from api.authorization import auth_required
from api.db import get

class Tags(Resource):

    @auth_required
    def get(self):
        """
            Get all of the tag names.
        """
        try:
            tags: Dict[str, List[str]] = get('tags')

            # Return just the names.
            return tags.keys()

        except Exception as e:
            print(e)
            abort(500)