from os import getenv
from dotenv import load_dotenv
from uuid import uuid4


load_dotenv()
STAGE = getenv('STAGE')
REDIRECT_URL = getenv('REDIRECT_URL', 'https://localhost:4200/authorized')

class InvalidToken(Exception):
    pass

class ExpiredToken(Exception):
    pass


class MockAuth:

    def __init__(
        *args
    ) -> None:
        if STAGE != 'DEVELOPMENT':
            raise NotImplementedError('Mock auth not supported outside of development.')


    def get_user(
        self,
        token: str
    ):
        """
        
        """
        print(f'User request. Received: Access={token}')
        if input('Accept request? (y/n)').lower() == 'y':
            print('OK!')
            return {
                'id': 'fakesnowflakeid',
                'username': 'fakeuser',
                'discriminator': '1010'
            }

        if input('Revoke? Expire otherwise. (y/n)').lower() == 'y':
            print('Denying token.')
            raise InvalidToken()
        else:
            print('Expiring token.')
            raise ExpiredToken()

    
    def request_authorization(
        self,
        state: str,
        scope: str
    ):
        """
        
        """
        code = uuid4()

        # Redirect onto itself. In realworld case, the URL would lead to Discord.
        auth_url = f'{REDIRECT_URL}?state={state}&code={code}'
        print(f'Authorization requested. Received: Scope={scope} State={state}. Responded: URL={auth_url}')
        return auth_url


    def request_access(
        self,
        code: str,
        client_secret: str
    ):
        """
        
        """
        access_token = f'fake_access_token_{uuid4()}'
        refresh_token = f'fake_refresh_token_{uuid4()}'
        is_admin = True
        print(f'Access requested. Received: Code={code} Client_Secret={client_secret}, Responded: Access={access_token} Refresh={refresh_token} Admin={is_admin}')
        return {
            'access_token': access_token,
            'refresh_token': refresh_token,
            'is_admin': is_admin
        }

    
    def refresh_access(
        self,
        refresh_token: str,
        client_secret: str
    ):
        """
        
        """
        access_token = f'fake_access_token_{uuid4()}'
        new_refresh_token = f'fake_refresh_token_{uuid4()}'
        print(f'Refresh requested. Received: Old_Refresh={refresh_token} Client_Secret={client_secret}, Responded: New_Access={access_token}, New_Refresh={refresh_token}')
        return {
            'access_token': access_token,
            'refresh_token': new_refresh_token
        }