from os import getenv
from dotenv import load_dotenv
from typing import Dict, List
from flask import request
from flask_restful import Resource, abort
from api.authorization import admin_required, auth_required, resolve_auth
from api.db import get, open_db, transact_get, transact_update, update
from boto3 import client as awsclient

from api.validation import verify_id, verify_schema

load_dotenv()
VIDEO_BUCKET = getenv('VIDEO_BUCKET')
VIDEO_EXPIRY = getenv('VIDEO_EXPIRY', 86400)  # In seconds. Default is 24 hours.



def get_videos(
    show_hidden: bool = False
):
    """
        Grab all available videos.
    """
    try:
        videos: Dict = get('videos')

        if not show_hidden:

            # Not admin? Filter out videos that are set to 'hide'.
            for id, video in videos:
                if 'hide' in video and video['hide']:
                    del video[id]

                # Strip key.
                if 'key' in video:
                    del video['key']

        return videos

    except Exception as e:
        print(e)
        abort(500)


def abort_if_not_exist(
    videos: Dict,
    video_id: str
):
    if video_id not in videos:
        abort(404, message=f'Video {video_id} does not exist.')

class Video(Resource):

    @auth_required
    def get(self, video_id: str):
        """
            Get a video's info along with a temporary
            link to use to view the video.
        """
        videos = get_videos()

        abort_if_not_exist(videos, video_id)
        video = videos[video_id]

        # Get presigned URL to the actual video file.
        video['url'] = awsclient('s3').generate_presigned_url(
            ClientMethod='get_object', 
            Params={
                'Bucket': VIDEO_BUCKET,
                'Key': video['key']
            },
            ExpiresIn=VIDEO_EXPIRY
        )

        return video, 200


    @admin_required
    def put(self, video_id: str):
        """
            Adds or updates a video listing.
            Also updates tags.
        """

        # Validate the id.
        if not verify_id(video_id):
            abort(400, 'Invalid video ID.')

        
        # Acquire and validate request body.
        video = verify_schema('schemas/put_video.json')

        videos = get_videos()

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
            try:
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
            except Exception as e:
                print(e)
                abort(500)
            finally:
                db.close()

        return video, 201


    @admin_required
    def delete(self, video_id: str):

        # Validate the id.
        if not verify_id(video_id):
            abort(400, 'Invalid video ID.')

        videos = get_videos()
        abort_if_not_exist(videos, video_id)

        del videos[video_id]
        update('videos', videos)

        return '', 204


class Videos(Resource):

    def get(self):
        """
            Get all visible videos.
            Admins see all hidden videos as well.
        """
        show_hidden = request.args.get('show_hidden') != None

        # Auth check based off query.
        # Hidden videos specified? Check for admin access.
        result = resolve_auth(check_admin=show_hidden)
        if result:
            return result()
        
        videos = get_videos(show_hidden)

        # Get videos for a directory, if it is specified.
        directory = request.args.get('directory')
        if directory:
            directories = get('directories')

            # Check that the directory exists.
            if directory not in directories:
                abort(400, message='Directory not found.')

            # Get video ids for the directory.
            dir_videos: List[str] = directories[directory]

            # Filter video info by the ids.
            filtered = {}
            for dir_vid in dir_videos:
                if dir_vid in videos:
                    filtered = videos[dir_vid]

            # Reassign.
            videos = filtered

        # Filter by tags if tags are specified.
        tags = request.args.getlist('tags')
        if tags:
            db_tags = get('tags')

            try:
                # Get list of video ids for the first tag listed.
                tagged_video_ids = set(db_tags[tags[0]])

                # Filter the list down further if other tags are specified.
                for tag in tags[1:]:
                    tagged_video_ids &= set(db_tags[tag])

                # Filter the video info list.
                tagged_videos = {}
                for tagged_vid_id in tagged_video_ids:
                    if tagged_vid_id in videos:
                        tagged_videos[tagged_vid_id] = videos[tagged_vid_id]
                videos = tagged_videos

            except KeyError as e:
                abort(400, message=f"Tag '{e.args[0]}' not found.")
        
        return videos