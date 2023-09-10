// @ts-nocheck
// Type checking disabled so that mock helper methods won't error on build.
jest.mock('superagent');
jest.mock('../../models/Video');

import request from 'superagent';
import VideoAPI, { VideoAPIClient } from '../VideoAPI';
import { Videos } from '../../models/Video';

describe('Video API', () => {
  const url = 'fakeurl';
  let api: VideoAPIClient;

  beforeAll(() => {
    // Create a passthrough for auth access.
    const access = (action: (access_token: string) => Promise<unknown>) => {
      return action();
    };

    api = VideoAPI(url, access);
  });

  describe('when requesting a stream', () => {
    const content = {
      mmmm: 'unacceptable!',
    };

    beforeAll(() => {
      request.__setDefaultMockResponse({
        body: content,
      });
    });

    afterAll(() => {
      request.__mockClear();
    });

    test('returns video info', async () => {
      const actual = await api.getStream();

      expect(actual).toBe(content);
    });

    test('authenticates', async () => {
      await api.getStream();

      expect(request.auth).toHaveBeenCalled();
    });
  });

  describe('when requesting a download', () => {
    const content = {
      uwu: 'uuuuuuuuuu',
    };

    beforeAll(() => {
      request.__setDefaultMockResponse({
        body: content,
      });
    });

    afterAll(() => {
      request.__mockClear();
    });

    test('returns video info', async () => {
      const actual = await api.getDownload();

      expect(actual).toBe(content);
    });

    test('authenticates', async () => {
      await api.getDownload();

      expect(request.auth).toHaveBeenCalled();
    });
  });

  describe('when requesting all videos', () => {
    const content = {
      owo: 'ooooooooooooooooo',
    };

    beforeAll(() => {
      request.__setDefaultMockResponse({
        body: content,
      });
    });

    afterAll(() => {
      request.__mockClear();
    });

    test('returns videos', async () => {
      await api.getVideos();

      expect(Videos).toBeCalledWith(content);
    });

    test('authenticates', async () => {
      await api.getVideos();

      expect(request.auth).toHaveBeenCalled();
    });

    describe('when requesting with options', () => {
      test('forwards options', async () => {
        await api.getVideos({
          show_hidden: true,
        });

        expect(request.get).toBeCalledWith(`${url}/videos?show_hidden=true`);
      });
    });
  });
});
