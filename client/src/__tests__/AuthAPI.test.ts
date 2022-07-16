// @ts-nocheck
// Type checking disabled that mock helper methods won't error on build.
import request from 'superagent';
import AuthAPI, { AuthAPIClient } from '../api/AuthAPI';

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

    describe('request access', () => {

    });

    describe('access', () => {

    });
});