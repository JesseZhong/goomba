from os import getenv
from dotenv import load_dotenv
from flask import request
from flask_restful import abort
from functools import wraps
import json
from gremlin.discord.auth import DiscordAuth


load_dotenv()
DISCORD_API = getenv('DISCORD_API')
REDIRECT_URL = getenv('REDIRECT_URL')
CLIENT_ID = getenv('CLIENT_ID')


permitted_users = {}


def permitted(user):

    username = user['username']
    discriminator = user['discriminator']
    userid = user['id']


def auth_required(func):

    @wraps()
    def check_auth():
        if 'Authorization' not in request.headers:
            return lambda: abort(401)

        auth_type, token = request.headers['Authorization'].split(' ')

        if auth_type.lower() != 'bearer':
            return lambda: abort(400)

        discord = DiscordAuth(
            DISCORD_API,
            REDIRECT_URL,
            CLIENT_ID
        )

        response = discord.get_user(token)

        if response.status_code != 200:
            return lambda: abort(401)

        user = json.loads(response.content)['user']

        return func()
    
    return check_auth