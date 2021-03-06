from os import getenv
from dotenv import load_dotenv
from typing import Dict, List
from datetime import timedelta
from flask import request
from flask_restful import Resource, abort
from api.authorization import admin_required, auth_required, resolve_auth
from api.cdn import gen_cdn_url, gen_image_url
from api.db import get, open_db, transact_get, transact_update, update

from api.validation import verify_id, verify_schema

load_dotenv()
CDN_STREAM_VALID_TIME = getenv('CDN_STREAM_VALID_TIME', 8)     # In hours. How much time a HLS playlist file is valid for.
CDN_DOWNLOAD_VALID_TIME = getenv('CDN_DOWNLOAD_VALID_TIME', 3)    # In hours. How much time a download file is valid for.


def set_thumbnail_url(video: Dict[str, str]):
    """
        Set thumbnail URL if key is available.
    """
    if 'thumbnail_key' in video:
        thumbnail_key = video['thumbnail_key']
        video['thumbnail_url'] = gen_image_url(thumbnail_key)


def get_videos(
    *,
    show_hidden: bool = False,
    show_keys: bool = False
):
    """
        Grab all available videos.
    """
    try:
        videos: Dict = get('videos')
        
        for id, video in videos.items():

            # Not admin? Filter out videos that are set to 'hide'.
            if not show_hidden:
                if 'hide' in video and video['hide']:
                    del video[id]

            # Strip object keys.
            if not show_keys:
                if 'stream_key' in video:
                    del video['stream_key']

                if 'download_key' in video:
                    del video['download_key']

            # Indicate if a file is available for download.
            if 'download_key' in video and video['download_key']:
                video['download_available'] = True

            # Include fully generated thumbnail url.
            set_thumbnail_url(video)

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


    @admin_required
    def put(self, video_id: str):
        """
            Adds or updates a video listing.
            Also updates tags.
        """

        if not video_id:
            abort(400, message='Missing ID.')

        # Validate the id.
        if not verify_id(video_id):
            abort(400, message='Invalid video ID.')
        
        # Acquire and validate request body.
        video = verify_schema('schemas/put_video.json')

        videos = get_videos(
            show_hidden=True,
            show_keys=True
        )

        # Strip URLs.
        if 'stream_url' in video:
            del video['stream_url']
        if 'download_url' in video:
            del video['download_url']
        if 'thumbnail_url' in video:
            del video['thumbnail_url']

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

        # Strip temp fields.
        if 'download_available' in video:
            del video['download_available']

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

        # Send back the thumbnail URL.
        set_thumbnail_url(video)

        return video, 201


    @admin_required
    def delete(self, video_id: str):

        if not video_id:
            abort(400, message='Missing ID.')

        # Validate the id.
        if not verify_id(video_id):
            abort(400, message='Invalid video ID.')

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
        show_keys = request.args.get('show_keys') != None

        # Auth check based off query.
        # Hidden videos specified? Check for admin access.
        resolve_auth(check_admin=(show_hidden | show_keys))
        
        videos = get_videos(
            show_hidden=show_hidden,
            show_keys=show_keys
        )

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


class StreamVideo(Resource):

    @auth_required
    def get(self, video_id: str):
        """
            Get a video's info along with a temporary
            link to use to stream the video.
        """
        if not video_id:
            abort(400, message='Missing ID.')
        
        # Validate the id.
        if not verify_id(video_id):
            abort(400, message='Invalid video ID.')

        videos = get_videos(
            show_keys=True
        )

        abort_if_not_exist(videos, video_id)
        video = videos[video_id]

        # Generate signed url for HLS playlist.
        video['stream_url'] = gen_cdn_url(
            'stream/' + video['stream_key'] + '/master.m3u8',
            timedelta(hours=CDN_STREAM_VALID_TIME)
        )

        return video, 200


class DownloadVideo(Resource):

    @auth_required
    def get(self, video_id: str):
        """
            Get a video's info along with a temporary
            link to use to download the video.
        """
        if not video_id:
            abort(400, message='Missing ID.')
        
        # Validate the id.
        if not verify_id(video_id):
            abort(400, message='Invalid video ID.')

        videos = get_videos(
            show_keys=True
        )

        abort_if_not_exist(videos, video_id)
        video = videos[video_id]

        # Generate signed url for HLS playlist.
        video['download_url'] = gen_cdn_url(
            'download/' + video['download_key'],
            timedelta(hours=CDN_DOWNLOAD_VALID_TIME)
        )

        return video, 200


class VideoMeta(Resource):

    def get(self, video_id: str):
        """
        
        """
        if not video_id:
            abort(400, message='Missing ID.')

        videos = get_videos()

        if video_id not in videos:
            abort(400, message='Video does not exist.')

        video = videos[video_id]

        return {
            'id': video['id'],
            'name': video['name'],
            'thumbnail_url': video['thumbnail_url'] if 'thumbnail_url' in video else None
        }, 200

