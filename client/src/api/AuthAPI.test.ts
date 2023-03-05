// @ts-nocheck
// Type checking disabled so that mock helper methods won't error on build.
import request from 'superagent';
import AuthAPI, { AuthAPIClient, TokenResponse } from './AuthAPI';

jest.mock('superagent');

describe('Auth API', () => {

  const url = 'fakeurl';
  let api: AuthAPIClient;

  beforeAll(() => {
    api = AuthAPI(url);
  });

  afterEach(() => {
    request.__mockClear();
  });

  describe('when requesting authorization', () => {

    it('should return a valid auth url', async () => {

      const state = 'fakestate';
      const auth_url = 'somethingsoemthingsomething';
      request.__setDefaultMockResponse({
        'body': {
          'state': state,
          'auth_url': auth_url
        }
      });

      const actual = await api.requestAuthorization(state);

      expect(actual).toEqual(auth_url);
    });

    describe('with a falsified state', () => {
      
      it('should throw an error', async () => {
        
        request.__setDefaultMockResponse({
          'body': {
            'state': 'falsified state',
            'auth_url': 'nonesense'
          }
        });

        await expect(api.requestAuthorization('wanted state')).rejects.toThrow(Error);
      });
    });
  });

  describe('when requesting access', () => {

    describe('with a valid state and code', () => {

      it('should return access and refresh tokens', async () => {

        const tokens = {
          access_token: 'LET ME IN!!!',
          refresh_token: 'MOAR POWER!!!',
          scope: 'I guess...'
        } as TokenResponse;
        request.__setDefaultMockResponse({
          'body': tokens
        });

        const actual = await api.requestAccess(
          'fake state',
          'fake code'
        );

        expect(actual).toBe(tokens);
      });
    });
  });

  describe('when accessing a protected resource', () => {

    let fakeResource;

    beforeEach(() => {
      fakeResource = {
        id: 'nope',
        data: 'cake'
      }

      request.__setDefaultMockResponse({
        'body': fakeResource
      });
    });

    describe('with a valid token', () => {

      it('should return the resource', async () => {

        const getResource = async (
          _access_token: string
        ) => {
          return Promise.resolve(fakeResource);
        }

        const actual = await api.access(
          'access token',
          'refresh token',
          getResource
        );

        expect(actual).toBe(fakeResource);
      });

      it('should refresh an expired token', async () => {

        const access = 'shared access token';
        const oldRefresh = 'old refresh token';
        const newRefresh = 'new refresh token';
        console.assert(oldRefresh !== newRefresh);

        // Reject first call with access token,
        // simulating that the token needs to be refreshed.
        let calls = 0;
        const getResource = async (
          _access_token: string
        ) => {
          if (calls > 0) {
            calls += 1;
            return Promise.resolve(fakeResource);
          }
          else {
            calls += 1;
            return Promise.reject({
              'status': 401,
              'body': {
                'message': 'Unauthorized - Invalid Token.'
              }
            });
          }
        }

        // Simulate the refresh endpoint response.
        request.__setMockResponses({
          [`${url}/refresh`]: {
            'body': {
              access_token: access,
              refresh_token: newRefresh
            } as TokenResponse
          }
        });

        // Track the received tokens.
        let actualAccess, actualRefresh;
        const onTokensReceived = (
          access: string,
          refresh: string
        ) => {
          actualAccess = access;
          actualRefresh = refresh;
        }
        
        const actual = await api.access(
          access,
          oldRefresh,
          getResource,
          onTokensReceived
        );

        expect(actual).toBe(fakeResource);
        expect(actualAccess).toEqual(access);
        expect(actualRefresh).toEqual(newRefresh);
        expect(calls).toEqual(2);
      });
    });
  });
});