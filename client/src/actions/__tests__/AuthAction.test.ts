const mockAccess = jest.fn();
const mockRequestAuthorization = jest.fn();
const mockRequestAccess = jest.fn();

const mockAuthApi = jest.fn(() => ({
  access: mockAccess,
  requestAuthorization: mockRequestAuthorization,
  requestAccess: mockRequestAccess,
}));

jest.mock('../../api/AuthAPI', () => ({
  __esModule: true,
  default: mockAuthApi,
}));
jest.mock('../../stores/SessionStore');
jest.mock('../SessionActions');

import sessionStore from '../../stores/SessionStore';
import AuthActions, {
  AuthAccess,
  resetSession,
  saveSession,
} from '../AuthActions';
import * as authActionsModule from '../AuthActions';
import SessionActions from '../SessionActions';

afterEach(() => {
  jest.clearAllMocks();
});

test('setup API with the correct URL', () => {
  expect(mockAuthApi).toHaveBeenCalledWith('example api url');
});

describe('#saveSession', () => {
  describe.each`
    previous                                                         | access_token        | refresh_token        | is_admin     | current
    ${{}}                                                            | ${undefined}        | ${undefined}         | ${undefined} | ${{}}
    ${{}}                                                            | ${'example'}        | ${undefined}         | ${undefined} | ${{ access_token: 'example' }}
    ${{}}                                                            | ${'example access'} | ${'example refresh'} | ${undefined} | ${{ access_token: 'example access', refresh_token: 'example refresh' }}
    ${{ other: 'other' }}                                            | ${'example access'} | ${'example refresh'} | ${false}     | ${{ access_token: 'example access', refresh_token: 'example refresh', is_admin: false, other: 'other' }}
    ${{ access_token: 'no', refresh_token: 'nah', is_admin: false }} | ${'example access'} | ${'example refresh'} | ${true}      | ${{ access_token: 'example access', refresh_token: 'example refresh', is_admin: true }}
  `(
    'when the previous session is $previous, access token is $access_token, refresh token is $refresh_token, and admin is $is_admin',
    ({ previous, access_token, refresh_token, is_admin, current }) => {
      beforeEach(() => {
        (sessionStore.getState as jest.Mock).mockReturnValue(previous);
      });

      test(`updates the session to ${JSON.stringify(current)}`, () => {
        saveSession(access_token, refresh_token, is_admin);

        expect(SessionActions.set).toHaveBeenCalledWith(current);
      });
    }
  );
});

describe('#resetSession', () => {
  describe.each`
    previous                                                                                                | current
    ${{}}                                                                                                   | ${{}}
    ${{ access_token: 'example' }}                                                                          | ${{}}
    ${{ access_token: 'example access', refresh_token: 'example refresh', is_admin: false }}                | ${{}}
    ${{ access_token: 'example access', refresh_token: 'example refresh', is_admin: true, other: 'other' }} | ${{ other: 'other' }}
  `('when the previous session is $previous', ({ previous, current }) => {
    beforeEach(() => {
      (sessionStore.getState as jest.Mock).mockReturnValue(previous);
    });

    test(`resets the session to ${JSON.stringify(current)}`, () => {
      resetSession();

      expect(SessionActions.set).toHaveBeenCalledWith(current);
    });
  });
});

describe('#AuthAccess', () => {
  describe('when valid tokens are provided', () => {
    beforeEach(() => {
      (sessionStore.getState as jest.Mock).mockReturnValue({
        access_token: 'example access token',
        refresh_token: 'example refresh token',
      });
    });

    test('attempts to verify access', () => {
      const action = () => Promise.resolve();
      AuthAccess(action);

      expect(mockAccess).toHaveBeenCalledWith(
        'example access token',
        'example refresh token',
        action,
        saveSession,
        resetSession
      );
    });
  });

  describe('when the access token is invalid', () => {
    beforeEach(() => {
      (sessionStore.getState as jest.Mock).mockReturnValue({
        refresh_token: 'example refresh token',
      });
    });

    test('throws an exception', () => {
      expect(() => AuthAccess(() => Promise.resolve())).toThrow(
        /^One or more tokens is undefined, Access: undefined, Refresh: example refresh token\.$/
      );
    });
  });

  describe('when the refresh token is invalid', () => {
    beforeEach(() => {
      (sessionStore.getState as jest.Mock).mockReturnValue({
        access_token: 'example access token',
      });
    });

    test('throws an exception', () => {
      expect(() => AuthAccess(() => Promise.resolve())).toThrow(
        /^One or more tokens is undefined, Access: example access token, Refresh: undefined\.$/
      );
    });
  });
});

describe('AuthAction', () => {
  describe('#requestAuthorization', () => {
    test('request authorization through the API', () => {
      const state = 'example state';

      AuthActions.requestAuthorization(state);

      expect(mockRequestAuthorization).toHaveBeenCalledWith(state);
    });
  });

  describe('#requestAccess', () => {
    beforeEach(() => {
      mockRequestAccess.mockResolvedValue({
        access_token: 'example access token',
        refresh_token: 'example refresh token',
        is_admin: true,
      });
    });

    test('request access and save received tokens', async () => {
      const state = 'example state';
      const code = 'example code';
      const saveSessionSpy = jest.spyOn(authActionsModule, 'saveSession');

      return AuthActions.requestAccess(state, code).then(() => {
        expect(mockRequestAccess).toHaveBeenCalledWith(state, code);
        expect(saveSessionSpy).toHaveBeenCalledWith(
          'example access token',
          'example refresh token',
          true
        );
      });
    });
  });
});
