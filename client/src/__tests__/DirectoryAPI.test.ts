// @ts-nocheck
// Type checking disabled so that mock helper methods won't error on build.
import request from 'superagent';
import DirectoryAPI, { DirectoryAPIClient } from '../api/DirectoryAPI';
import { Directories } from '../directories/Directory';

jest.mock('superagent');
jest.mock('../directories/Directory');

describe('Directory API', () => {

    const url = 'fakeurl';
    let api: DirectoryAPIClient;

    beforeAll(() => {

        // Create a passthrough for auth access.
        const access = (
            action: (
                access_token: string
            ) => Promise<unknown>
        ) => {
            return action();
        }

        api = DirectoryAPI(
            url,
            access
        );
    });

    describe('when requesting all directories', () => {

        it('should return all as directories', async () => {

            const content = {
                'hey': 'hello neighbor'
            }

            request.__setDefaultMockResponse({
                'body': content
            });

            await api.get();

            expect(Directories).toHaveBeenLastCalledWith(content);
        });

        it('should authenticate', async () => {

            await api.get();

            expect(request.auth).toHaveBeenCalled();
        });
    });

    
});