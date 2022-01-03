from os import path
from typing import Dict, List
from flask import request
from flask_restful import Resource, reqparse, abort
from api.authorization import admin_required, auth_required
from api.db import get, open_db, transact_get, transact_update, update
from jsonschema import validate
from jsonschema.exceptions import ValidationError
import json
import re

# Video ID regex. UUID format.
ID_REGEX = '^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$'

parser = reqparse.RequestParser()
parser.add_argument('key', type=str, help='File identifier.', required=True)
parser.add_argument('name', type=str, help='Title of the video.', required=True)
parser.add_argument('date_aired', type=str, help='Date the video originally aired.')
parser.add_argument('date_added', type=str, help='Date the video was uploaded.')
parser.add_argument('hide', type=bool, help='Hide from UI or not.')
parser.add_argument('tags', type=list, help='Tags my dude.')


# Load videos.
videos = {}
try:
    all_vids: Dict = get('videos')

    # Filter out videos that are set to 'hide'.
    for id, video in all_vids:
        if 'hide' not in video and not video['hide']:

            # Strip key.
            if 'key' in video:
                del video['key']

            videos[id] = video

except Exception as e:
    print(e)
    abort(500)


def abort_if_not_exist(video_id: str):
    if video_id not in videos:
        abort(404, message=f'Video {video_id} does not exist.')

class Video(Resource):

    @auth_required
    def get(self, video_id: str):
        """
            Get a video's info along with a temporary
            link to use to view the video.
        """
        abort_if_not_exist(video_id)
        video = videos[video_id]

        # TODO: S3 presigned.

        return 

    @admin_required
    def put(self, video_id: str):
        """
            Adds or updates a video listing.
            Also updates tags.
        """

        # Validate the id.
        subMatch = re.match(ID_REGEX, self.subpath, re.RegexFlag.IGNORECASE)
        if not subMatch:
            abort(400, 'Invalid video ID.')

        # Attempt to get the request body as json.
        data = None
        try:
            data = request.get_json(force=True)
        except TypeError:
            abort(400, 'Malformed request body.')

        # Grab local path.
        apiDir = path.dirname(path.realpath(__file__))

        # Validate the schema of the request body first.
        with open(path.join(apiDir, 'schemas/put_persona.json'), 'r') as file:
            put_schema = json.load(file)
            try:
                validate(
                    instance=data,
                    schema=put_schema
                )
            except ValidationError as e:
                abort(400, message=e.message)

        # Validate arguments through flask.
        video = parser.parse_args()

        # Get old tags for removal later.
        old_tags = set()
        if video_id in videos:
            old_video = videos[video_id]

            if 'tags' in old_video:
                old_tags = set(old_video['tags'])

        # Get new tags.
        new_tags = set()
        if 'tags' in video:
            new_tags = set(video['tags'])

        # Calculate the tag diffs.
        tags_to_remove = old_tags - new_tags
        tags_to_add = new_tags - old_tags

        # Put to DB.
        videos[video_id] = video
        update('videos', videos)

        # Update tags if available.
        if len(tags_to_remove) > 0 or len(tags_to_add) > 0:

            # Complete update in a single transaction.
            db = open_db()
            with db.begin(write=True) as trnx:
                db_tags: Dict[str, List[str]] = set(transact_get(
                    trnx,
                    'tags'
                ))
                
                # Remove video from tag.
                for tag in tags_to_remove:
                    if tag in db_tags:
                        tvideos = set(db_tags[tag])

                        # Remove video from tag's list.
                        if video_id in tvideos:
                            tvideos.remove(video_id)

                        # Remove tag if no more videos belong to it.
                        if len(tvideos) < 1:
                            del db_tags[tag]

                # Add video to new tags.
                for tag in tags_to_add:
                    
                    # Make list for a tag if the tag doesn't exist.
                    tvideos = set(db_tags[tag]) if tag in db_tags else set()

                    # Add video to tag's list.
                    for tag in new_tags:
                        tvideos.add(video_id)

                    # Put tag.
                    db_tags[tag] = tvideos

                # Send it.
                transact_update(
                    trnx,
                    'tags',
                    db_tags
                )

        return video, 201


    @admin_required
    def delete(self, video_id: str):
        abort_if_not_exist(video_id)
        del videos[video_id]
        update('videos', videos)
        return '', 204


class Videos(Resource):

    @auth_required
    def get(self):
        """
            Get all visible videos.
        """
        return videos
