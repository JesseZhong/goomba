#!/bin/python
try:
    from os import getenv
    from dotenv import load_dotenv
    from flask import Flask
    from flask_restful import Api
    from api.authorization import RefreshAccess, RequestAccess, RequestAuthorization
    from api.directories import Directories, Directory, DirectoryMeta
    from api.tags import Tags
    from api.videos import DownloadVideo, StreamVideo, Video, Videos, VideoMeta
    from api.images import ImageUpload
except ImportError as e:
    print(e)
    exit()


load_dotenv()
SITE_URL = getenv('SITE_URL')

app = Flask(__name__)
api = Api(app)

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add(
        'Access-Control-Allow-Headers',
        'Content-Type, Accept, Authorization, Code, Content-Type, State, Refresh, X-Requested-With'
    )
    response.headers.add(
        'Access-Control-Allow-Methods',
        'GET, PUT, DELETE, OPTIONS'
    )
    response.headers.add('Content-Type', 'application/json')
    return response

api.add_resource(RequestAuthorization, '/authorize')
api.add_resource(RequestAccess, '/access')
api.add_resource(RefreshAccess, '/refresh')

api.add_resource(Videos, '/videos')
api.add_resource(Video, '/videos/<video_id>')
api.add_resource(StreamVideo, '/videos/<video_id>/stream')
api.add_resource(DownloadVideo, '/videos/<video_id>/download')
api.add_resource(VideoMeta, '/videos/<video_id>/meta')

api.add_resource(Directories, '/directories')
api.add_resource(Directory, '/directories/<directory_id>')
api.add_resource(DirectoryMeta, '/directories/<directory_name>/meta')

api.add_resource(Tags, '/tags')

api.add_resource(ImageUpload, '/images/<image_key>')