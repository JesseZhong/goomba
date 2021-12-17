from os import getenv
from dotenv import load_dotenv
from flask import request
from flask_restful import abort
from functools import wraps
from json import loads
from gremlin.discord.auth import DiscordAuth
from .db import get


load_dotenv()
DISCORD_API = getenv('DISCORD_API')
REDIRECT_URL = getenv('REDIRECT_URL')
CLIENT_ID = getenv('CLIENT_ID')


def resolve_auth(
    check_admin: bool = False
):
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

    user = loads(response.content)['user']
    if not user:
        return lambda: abort(401)

    try:
        username = user['username']
        discriminator = user['discriminator']
        userid = user['id']

        full_username = f'{username}#{discriminator}'

        permitted_users = get('users')

        # Check if the user has permission to view the resource.
        if full_username in permitted_users:

            # If the resource is restricted to admins only,
            # check if the user is an admin.
            if check_admin:
                user = permitted_users[full_username]
                
                if 'is_admin' in user and user['is_admin']:
                    return None
                else:
                    return lambda: abort(403)

            # Otherwise, send traffic through.
            else:
                return None

        
        # TODO: Roles check.
        permitted_roles = get('roles')


    except KeyError as e:
        print(e)
        return lambda: abort(418, 'I''m a little teapot.')

    return lambda: abort(401)


def auth_required(func):

    @wraps()
    def check_auth():
        result = resolve_auth()

        return result() if result else func()
    
    return check_auth


def admin_required(func):

    @wraps()
    def check_admin():
        result = resolve_auth(check_admin=True)

        return result() if result else func()
    
    return check_admin