import request, { Response } from 'superagent';
import { ErrorResponse } from '../models/ErrorResponse';

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  is_admin?: boolean;
  scope: string;
}

export interface AuthAPIClient {
  requestAuthorization(state: string): Promise<string>;

  requestAccess(state: string, code: string): Promise<TokenResponse>;

  /**
   * Access an endpoint that requires authorization.
   * Handles token refreshes.
   */
  access<Resource>(
    access_token: string,
    refresh_token: string,
    action: (access_token: string) => Promise<Resource>,
    tokensReceived: (access_token: string, refresh_token: string) => void,
    tokenRevoked: () => void
  ): Promise<Resource>;
}

const AuthAPI = (url: string): AuthAPIClient => ({
  async requestAuthorization(state: string): Promise<string> {
    return request
      .get(`${url}/authorize`)
      .set('Accept', 'application/json')
      .set('State', state)
      .then((response: Response) => {
        // Throw an exception if the wrong state was
        // passed back. Might be a man-in-the middle attack.
        const returnState = response.body['state'];
        if (state !== returnState) {
          throw new Error(
            `Incorrect state passed back. ${state} != ${returnState}`
          );
        } else {
          return response.body['auth_url'];
        }
      });
  },

  async requestAccess(state: string, code: string): Promise<TokenResponse> {
    return request
      .get(`${url}/access`)
      .set('Accept', 'application/json')
      .set('State', state)
      .set('Code', code)
      .then((response: Response) => {
        return response.body as TokenResponse;
      });
  },

  async access<Resource>(
    access_token: string,
    refresh_token: string,
    action: (access_token: string) => Promise<Resource>,
    tokensReceived: (access_token: string, refresh_token: string) => void,
    tokenRevoked: () => void
  ): Promise<Resource> {
    return action(access_token).catch(
      async ({ response }: { response: ErrorResponse }) => {
        if (response?.status === 401) {
          const body = response.body as {
            message: string;
          };

          if (body.message === 'Unauthorized - Invalid Token.') {
            return request
              .get(`${url}/refresh`)
              .set('Accept', 'application/json')
              .set('Refresh', refresh_token)
              .then((response: Response) => {
                const { access_token, refresh_token } =
                  response.body as TokenResponse;

                tokensReceived(access_token, refresh_token);

                // Attempt action again.
                return action(access_token);
              });
          } else if (body.message === 'Unauthorized - New Token Required.') {
            tokenRevoked();
            throw new Error();
          }
        }

        return Promise.reject(response);
      }
    );
  },
});

export default AuthAPI;
