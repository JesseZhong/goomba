from os import abort
from typing import Dict
from api.authorization import admin_required, auth_required
from api.cdn import gen_image_url
from api.db import get, open_db, transact_get, transact_update
from api.validation import verify_id, verify_schema
from flask_restful import Resource, abort


class Directory(Resource):

    @admin_required
    def put(self, args: Dict[str, str]):
        """
            Add or update a directory.
        """

        if not args or 'directory_id' not in args:
            abort(400, 'Missing ID.')
        directory_id = args['directory_id']

        # Validate the id.
        if not verify_id(directory_id):
            abort(400, 'Invalid directory ID.')

        # Acquire and validate the request body.
        directory = verify_schema('schemas/put_directory.json')

        # Strip banner URL.
        if 'banner_url' in directory:
            del directory['banner_url']

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
    def delete(self, args: Dict[str, str]):
        """
            Remove a directory if it exists.
        """

        if not args or 'directory_id' not in args:
            abort(400, 'Missing ID.')
        directory_id = args['directory_id']

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
    def get(self, *args):
        """
            Get all available directories.
        """
        try:
            directories = get('directories')

            # Attach banner URLs.
            for directory in directories.values():
                if 'banner' in directory:
                    banner = directory['banner']
                    directory['banner_url'] = gen_image_url(banner)
            print(directories)
            return directories
        except Exception as e:
            print(e)
            abort(500)