import { Access } from '../api/Access';
import AuthAPI from '../api/AuthAPI';
import SessionStore from '../stores/SessionStore';
import SessionActions from './SessionActions';

export const authApi = AuthAPI(process.env.REACT_APP_API_URL ?? '');

const saveSession = (
  access_token: string,
  refresh_token: string,
  is_admin?: boolean
) => {
  // Load up session info.
  let session = SessionStore.getState();
  session.access_token = access_token;
  session.refresh_token = refresh_token;
  session.is_admin = is_admin;

  // Save it.
  SessionActions.set(session);
}

const resetSession = () => {
  // Clear out the existing token.
  let session = SessionStore.getState();
  delete session.access_token;
  delete session.refresh_token;
  delete session.is_admin;

  // Save it.
  SessionActions.set(session);
}

export const AuthAccess: Access = <Resource>(
  action: (
    access_token: string
  ) => Promise<Resource>
) => {
  const session = SessionStore.getState();
  if (session.access_token && session.refresh_token) {
    return authApi.access<Resource>(
      session.access_token,
      session.refresh_token,
      action,
      saveSession,
      resetSession
    );
  }

  throw new Error(`One or more tokens is undefined, Access: ${session.access_token}, Refresh: ${session.refresh_token}.`);
}

const AuthActions = {
  
  requestAuthorization: (
    state: string
  ) => authApi.requestAuthorization(
    state
  ),

  requestAccess: (
    state: string,
    code: string
  ) => authApi.requestAccess(
    state,
    code
  ).then(({
    access_token,
    refresh_token,
    is_admin
  }) => {
    saveSession(
      access_token,
      refresh_token,
      is_admin
    );
  })
}

export default AuthActions;