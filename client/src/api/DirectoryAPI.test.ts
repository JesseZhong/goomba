// @ts-nocheck
// Type checking disabled so that mock helper methods won't error on build.
import request from 'superagent';
import DirectoryAPI, { DirectoryAPIClient } from '../api/DirectoryAPI';
import { Directories } from '../directories/directory';

jest.mock('superagent');
jest.mock('../directories/Directory');

describe('Directory API', () => {
  const url = 'fakeurl';
  let api: DirectoryAPIClient;

  beforeAll(() => {
    // Create a passthrough for auth access.
    const access = (action: (access_token: string) => Promise<unknown>) => {
      return action();
    };

    api = DirectoryAPI(url, access);
  });

  describe('when requesting all directories', () => {
    const content = {
      hey: 'hello neighbor',
    };

    beforeAll(() => {
      request.__setDefaultMockResponse({
        body: content,
      });
    });

    afterAll(() => {
      request.__mockClear();
    });

    it('should return all as directories', async () => {
      await api.get();

      expect(Directories).toHaveBeenLastCalledWith(content);
    });

    it('should authenticate', async () => {
      await api.get();

      expect(request.auth).toHaveBeenCalled();
    });
  });

  describe('when putting up a directory', () => {
    const directory = {
      'uh oh': 'stinky',
    };

    beforeEach(() => {
      request.__setDefaultMockResponse({
        status: 201,
        body: directory,
      });
    });

    afterEach(() => {
      request.__mockClear();
    });

    it('should return the directory for a successful put', async () => {
      const actual = await api.put(directory);

      expect(actual).toBe(directory);
    });

    it('should authenticate', async () => {
      await api.put(directory);

      expect(request.auth).toHaveBeenCalled();
    });

    it('should reject if something went wrong', async () => {
      const response = {
        status: 500,
        ok: false,
        body: {
          message: 'something went wrong',
        },
      };
      request.__setDefaultMockResponse(response);

      await expect(api.put(directory)).rejects.toMatchObject(response);
    });
  });

  describe('when removing a directory', () => {
    const id = 'hiya';

    beforeEach(() => {
      request.__setDefaultMockResponse({
        status: 204,
      });
    });

    afterEach(() => {
      request.__mockClear();
    });

    it('should return the directory id for a successful delete', async () => {
      const actual = await api.remove(id);

      expect(actual).toBe(id);
    });

    it('should authenticate', async () => {
      await api.remove(id);

      expect(request.auth).toHaveBeenCalled();
    });

    it('should reject if something went wrong', async () => {
      const response = {
        status: 500,
        ok: false,
        body: {
          message: 'something went wrong',
        },
      };
      request.__setDefaultMockResponse(response);

      await expect(api.remove(id)).rejects.toMatchObject(response);
    });
  });
});
