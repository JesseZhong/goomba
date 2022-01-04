#!/bin/python
from os import getenv
from dotenv import load_dotenv
from flask import Flask
from flask_restful import Api
from api.authorization import RefreshAccess, RequestAccess, RequestAuthorization
from api.directories import Directories, Directory
from api.tags import Tags
from api.videos import Video, Videos


load_dotenv()
DB_DIR = getenv('DB_DIR', './db')
SITE_URL = getenv('SITE_URL')

app = Flask(__name__)
api = Api(app)

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', SITE_URL)
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

api.add_resource(Directories, '/directories')
api.add_resource(Directory, '/directories/<directory_id>')

api.add_resource(Tags, '/tags')