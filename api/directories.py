from os import abort
from api.authorization import admin_required, auth_required
from api.db import get, open_db, transact_get, transact_update
from flask_restful import Resource, abort

from api.validation import verify_id, verify_schema

class Directory(Resource):

    @admin_required
    def put(self, directory_id):
        """
            Add or update a directory.
        """

        # Validate the id.
        if not verify_id(directory_id):
            abort(400, 'Invalid directory ID.')

        # Acquire and validate the request body.
        directory = verify_schema('schemas/put_directory.json')

        # Complete put in a single transaction.
        db = open_db()

        try:
            with db.begin(write=True) as trnx:
                directories = transact_get(
                    trnx,
                    'directories'
                )

                directories[directory_id] = directory
                transact_update(
                    trnx,
                    'directories',
                    directories
                )

            return directory, 201

        except Exception as e:
            print(e)
            abort(500)
        finally:
            db.close()


    @admin_required
    def delete(self, directory_id):
        """
            Remove a directory if it exists.
        """

        # Validate the id.
        if not verify_id(directory_id):
            abort(400, 'Invalid directory ID.')

        db = open_db()

        try:
            with db.begin(write=True) as trnx:
                directories = transact_get(
                    trnx,
                    'directories'
                )

                if directory_id in directories:
                    del directories[directory_id]
                    transact_update(
                        trnx,
                        'directories',
                        directories
                    )
                
            return '', 204

        except Exception as e:
            print(e)
            abort(500)
        finally:
            db.close()


class Directories(Resource):

    @auth_required
    def get(self):
        """
            Get all available directories.
        """
        try:
            return get('directories')
        except Exception as e:
            print(e)
            abort(500)