from os import abort
from typing import Dict
from urllib.parse import unquote
from api.authorization import admin_required, auth_required
from api.cdn import gen_image_url
from api.db import get, open_db, transact_get, transact_update
from api.validation import verify_id, verify_schema
from flask_restful import Resource, abort


def set_image_urls(directory: Dict[str, str]):
    """
        Attach avatar and banner URLs to the directory.
    """
    if 'avatar' in directory:
        avatar = directory['avatar']
        directory['avatar_url'] = gen_image_url(avatar)

    if 'banner' in directory:
        banner = directory['banner']
        directory['banner_url'] = gen_image_url(banner)


class Directory(Resource):

    @admin_required
    def put(self, directory_id: str):
        """
            Add or update a directory.
        """

        if not directory_id:
            abort(400, message='Missing ID.')
        
        # Validate the id.
        if not verify_id(directory_id):
            abort(400, message='Invalid directory ID.')

        # Acquire and validate the request body.
        directory = verify_schema('schemas/put_directory.json')

        # Strip URLs before saving.
        if 'avatar_url' in directory:
            del directory['avatar_url']
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

            # Re-attach URLs before responding.
            set_image_urls(directory)

            return directory, 201

        except Exception as e:
            print(e)
            abort(500)
        finally:
            db.close()


    @admin_required
    def delete(self, directory_id: str):
        """
            Remove a directory if it exists.
        """

        if not directory_id:
            abort(400, message='Missing ID.')

        # Validate the id.
        if not verify_id(directory_id):
            abort(400, message='Invalid directory ID.')

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
            directories = get('directories')

            # Attach image URLs.
            for directory in directories.values():
                set_image_urls(directory)
                    
            return directories
        except Exception as e:
            print(e)
            abort(500)


class DirectoryMeta(Resource):

    def get(self, directory_name: str):

        if not directory_name:
            abort(400, messsage='Missing name.')

        directory_name = unquote(directory_name)
        directories = get('directories')

        # Attempt to find a directory that matches the passed name.
        directory = next((
            directory for directory in directories.values()
            if directory['name'] == directory_name),
            None
        )
        
        if directory:
            return {
                'id': directory['id'],
                'name': directory['name'],
                'avatar_url': directory['avatar_url']
            }, 200
        else:
            abort(400, message='Directory not found.')