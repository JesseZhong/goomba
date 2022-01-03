from os import getenv
from typing import Dict, Callable, Union
from dotenv import load_dotenv
from flask import request
from flask_restful import Resource, abort
from datetime import datetime, timedelta
from functools import wraps
from json import loads
from gremlin.discord.auth import DiscordAuth
from api.db import get, open_db, transact_get, transact_update, update


load_dotenv()
DISCORD_API = getenv('DISCORD_API', 'https://discord.com/api')
SITE_URL = getenv('SITE_URL')
REDIRECT_URL = f'{SITE_URL}/authorized'
CLIENT_ID = getenv('CLIENT_ID')
CLIENT_SECRET = getenv('CLIENT_SECRET')
STATE_EXPIRY = getenv('STATE_EXPIRY', 10) # In days.
STATE_KEY = getenv('STATE_KEY', 'session_states')

TIME_FORMAT = '%Y.%m.%d %H:%M:%S'


def permissions_check(
    token: str,
    check_admin: bool = False
) -> Union[Callable, None]:
    """
        Check user if user has access
        to resources using their token.

        Return:
            None - User is permitted.
            Callable - Abort lambda if user is denied.
    """

    discord = DiscordAuth(
        DISCORD_API,
        REDIRECT_URL,
        CLIENT_ID
    )

    user = discord.get_user(token)

    try:
        username = user['username']
        discriminator = user['discriminator']

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


def resolve_auth(
    check_admin: bool = False
):
    if 'Authorization' not in request.headers:
        return lambda: abort(401)

    auth_type, token = request.headers['Authorization'].split(' ')

    if auth_type.lower() != 'bearer':
        return lambda: abort(400)

    return permissions_check(
        token,
        check_admin
    )


def auth_required(func):
    """
        Requires the user to auth with Discord
        and be permitted.
    """

    @wraps(func)
    def check_auth():
        result = resolve_auth()

        return result() if result else func()
    
    return check_auth


def admin_required(func):
    """
        Requires the user to be an admin to have access.
    """

    @wraps(func)
    def check_admin():
        result = resolve_auth(check_admin=True)

        return result() if result else func()
    
    return check_admin


class RequestAuthorization(Resource):

    def get(self):
        if 'State' not in request.headers:
            abort(400, message='Missing state.')

        discord = DiscordAuth(
            DISCORD_API,
            REDIRECT_URL,
            CLIENT_ID
        )

        # Save state to compare later.
        state = request.headers['State']

        db = open_db()
        with db.begin(write=True) as trnx:
            states: Dict[str, str] = transact_get(
                trnx,
                STATE_KEY
            )

            expiry_date = datetime.now() + timedelta(days=STATE_EXPIRY)
            states[state] = expiry_date.strftime(TIME_FORMAT)

            transact_update(
                trnx,
                STATE_KEY,
                states
            )

        db.close()

        auth_url = discord.request_authorization(
            state=state,
            scope='identify guilds'
        )

        return {
            'auth_url': auth_url,
            'state': state
        }, 200


class RequestAccess(Resource):

    def get(self):
        if 'State' not in request.headers:
            abort(400, message='Missing state.')

        state = request.headers['State']

        db = open_db()

        # Check if state was previously handled.
        states: Dict[str, str] = get(
            STATE_KEY,
            dbenv=db
        )
        
        if state not in states:
            abort(400, message='Bad state.')

        if 'Code' not in request.headers:
            abort(400, message='Missing code.')

        code = request.headers['Code']

        discord = DiscordAuth(
            DISCORD_API,
            REDIRECT_URL,
            CLIENT_ID
        )

        try:
            tokens = discord.request_access(
                code=code,
                client_secret=CLIENT_SECRET
            )
            
            del states[state]
            update(
                STATE_KEY,
                states,
                dbenv=db
            )

            # Check if user is permitted.
            # Call abort if user is not allowed.
            should_abort = permissions_check(tokens['access_token'])
            if should_abort:
                return should_abort()

            return tokens, 200

        except Exception:
            abort(500, message='What?')

        finally:
            db.close()


class RefreshAccess(Resource):

    def get(self):
        if 'Refresh' not in request.headers:
            abort(400, message='Missing refresh token.')

        refresh = request.headers['Refresh']

        discord = DiscordAuth(
            DISCORD_API,
            REDIRECT_URL,
            CLIENT_ID
        )

        tokens = discord.refresh_access(
            refresh_token=refresh,
            client_secret=CLIENT_SECRET
        )

        return tokens, 200