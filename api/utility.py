import requests
from os import getenv
from dotenv import load_dotenv
from typing import Dict, Set
from datetime import datetime
from api.db import get, update
from json import loads

TIME_FORMAT = '%Y.%m.%d %H:%M:%S'

load_dotenv()
DISCORD_API = getenv('DISCORD_API', 'https://discord.com/api')
BOT_TOKEN = getenv('BOT_TOKEN')

def lookup_user(user_id: str):
    response = requests.get(
        f'{DISCORD_API}/users/{user_id}',
        headers={
            'Authorization': f'Bot {BOT_TOKEN}'
        }
    )
    
    if response.ok and response.content:
        return loads(response.content)
    else:
        return None

def list_users():
    """
        Prints all allowed users.
    """
    users = get('users')

    user_list = []
    for user_id, user in users.items():
        found_user = lookup_user(user_id)
        username = found_user['username'] if found_user else ''

        if 'is_admin' in user and user['is_admin']:
            user_list.append(f'{username} ({user_id}) [admin]')
        else:
            user_list.append(f'{username} ({user_id})')

    print('Users: ' + ', '.join(user_list))


def delete_user(
    user_id: str
):
    """
        Attempts to delete a user from the db.
    """
    users = get('users')

    if user_id in users:
        del users[user_id]
        update('users', users)


def put_user(
    user_id: str,
    is_admin: bool = False
):
    """
        Add a user and maybe a role.
    """
    user = lookup_user(user_id)
    if user:
        username = user['username']
        discriminator = user['discriminator']

        users = get('users')
        users[user_id] = {
            'is_admin': is_admin
        }
        update('users', users)

        print(f'Added {username}#{discriminator}.')
    else:
        print('User not found.')


def list_roles():
    """
        Prints all allowed guild roles.
    """
    roles = get('roles')
    
    role_list = []
    for guild, role in roles.items():
        role_list.append(f'{role} [{guild}]')

    print('Roles [Guild]: ' + ', '.join(role_list))


def delete_guild(
    guild: str
):
    """
        Delete all the roles for a guild.
    """
    roles = get('roles')

    if guild in roles:
        del roles[guild]

        update('roles', roles)


def delete_role(
    guild: str,
    role: str
):
    """
        Deletes an allowed role.
    """
    roles = get('roles')

    if guild in roles:
        guild_roles: Set = roles[guild]
        del guild_roles[role]

        update('roles', roles)


def put_role(
    guild: str,
    role: str
):
    """
        Add an allowable guild role.
    """
    roles = get('roles')

    if guild in roles:
        guild_roles: Set = roles[guild]
        guild_roles.add(role)
        roles[guild] = guild_roles

        update('roles', roles)


def clean_states():
    """
        Clean up session states that have expired.
    """
    states: Dict[str, str] = get('states')

    now = datetime.now()
    for state, expiry in states.items():
        if datetime.strptime(expiry, TIME_FORMAT) > now:
            del states[state]
