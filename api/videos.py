from flask_restful import Resource, reqparse, abort
from api.authorization import auth_required

parser = reqparse.RequestParser()
parser.add_argument('url', type=str, help='Url for the video.')
parser.add_argument('date_added', type=str, help='Date the video was uploaded.')
parser.add_argument('show', type=bool, help='Show in UI or not.')

videos = {}

def abort_if_not_exist(video_id: str):
    if video_id not in videos:
        abort(404, message=f'Video {video_id} does not exist.')

class Video(Resource):

    @auth_required
    def get(self, video_id: str):
        abort_if_not_exist(video_id)
        return videos[video_id]

    @auth_required
    def put(self, video_id: str):
        video = parser.parse_args()
        videos[video_id] = video
        return video, 201

    @auth_required
    def delete(self, video_id: str):
        abort_if_not_exist(video_id)
        del videos[video_id]
        return '', 204


class Videos(Resource):

    @auth_required
    def get(self):
        return videos
