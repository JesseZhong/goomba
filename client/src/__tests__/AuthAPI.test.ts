// @ts-nocheck
// Type checking disabled that mock helper methods won't error on build.
import request from 'superagent';
import AuthAPI, { AuthAPIClient, TokenResponse } from '../api/AuthAPI';

jest.mock('superagent');

describe('Auth API', () => {

    let api: AuthAPIClient;

    beforeAll(() => {
        api = AuthAPI('fakeurl');
    });

    describe('when requesting authorization', () => {

        it('should return a valid auth url', async () => {

            const state = 'fakestate';
            const auth_url = 'somethingsoemthingsomething';
            request.__setMockResponse({
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
                
                request.__setMockResponse({
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

                request.__setMockResponse({
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

    describe('access', () => {

    });
});