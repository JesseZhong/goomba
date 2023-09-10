import { Access } from '../models/Access';
import { API_URL } from '../constants/env';
import AuthAPI from '../api/AuthAPI';
import SessionStore from '../stores/SessionStore';
import SessionActions from './SessionActions';

const authApi = AuthAPI(API_URL);

export const saveSession = (
  access_token: string,
  refresh_token: string,
  is_admin?: boolean
) => {
  // Load up previous session info.
  const session = SessionStore.getState();

  // Save new info.
  SessionActions.set({
    ...session,
    access_token,
    refresh_token,
    is_admin,
  });
};

export const resetSession = () => {
  // Load up previous session info.
  const session = SessionStore.getState();

  // Clear out existing tokens.
  SessionActions.set({
    ...session,
    access_token: undefined,
    refresh_token: undefined,
    is_admin: undefined,
  });
};

export const AuthAccess: Access = <Resource>(
  action: (access_token: string) => Promise<Resource>
) => {
  const { access_token, refresh_token } = SessionStore.getState();
  if (access_token && refresh_token) {
    return authApi.access<Resource>(
      access_token,
      refresh_token,
      action,
      saveSession,
      resetSession
    );
  }

  throw new Error(
    `One or more tokens is undefined, Access: ${access_token}, Refresh: ${refresh_token}.`
  );
};

const AuthActions = {
  requestAuthorization: (state: string) => authApi.requestAuthorization(state),

  requestAccess: (state: string, code: string) =>
    authApi
      .requestAccess(state, code)
      .then(({ access_token, refresh_token, is_admin }) => {
        saveSession(access_token, refresh_token, is_admin);
      }),
};

export default AuthActions;
