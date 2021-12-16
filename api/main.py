#!/bin/python
from os import urandom, getenv
from dotenv import load_dotenv
from flask import Flask
from flask_restful import Api
from .videos import Video, Videos


load_dotenv()
DB_DIR = getenv('DB_DIR', './db')

app = Flask(__name__)
app.config |= {
    'SECRET_KEY': urandom(32)
}

api = Api(app)


api.add_resource(Videos, '/videos')
api.add_resource(Video, '/videos/<video_id>')