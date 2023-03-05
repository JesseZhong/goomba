// @ts-nocheck
// Type checking disabled so that mock helper methods won't error on build.
import request from 'superagent';
import VideoAPI, { VideoAPIClient } from '../api/VideoAPI';
import { Videos } from '../videos/Video';

jest.mock('superagent');
jest.mock('../videos/Video');

describe('Video API', () => {

  const url = 'fakeurl';
  let api: VideoAPIClient;

  beforeAll(() => {

    // Create a passthrough for auth access.
    const access = (
      action: (
        access_token: string
       ) => Promise<unknown>
    ) => {
      return action();
    }

    api = VideoAPI(
      url,
      access
    );
  });

  describe('when requesting a stream', () => {

    const content = {
      'mmmm': 'unacceptable!'
    }

    beforeAll(() => {
      request.__setDefaultMockResponse({
        'body': content
      });
    });

    afterAll(() => {
      request.__mockClear();
    });

    it('should return video info', async () => {

      const actual = await api.getStream();

      expect(actual).toBe(content);
    });

    it('should authenticate', async () => {

      await api.getStream();

      expect(request.auth).toHaveBeenCalled();
    });
  });

  describe('when requesting a download', () => {

    const content = {
      'uwu': 'uuuuuuuuuu'
    }

    beforeAll(() => {
      request.__setDefaultMockResponse({
        'body': content
      });
    });

    afterAll(() => {
      request.__mockClear();
    });

    it('should return video info', async () => {

      const actual = await api.getDownload();

      expect(actual).toBe(content);
    });

    it('should authenticate', async () => {

      await api.getDownload();

      expect(request.auth).toHaveBeenCalled();
    });
  });

  describe('when requesting all videos', () => {

    const content = {
      'owo': 'ooooooooooooooooo'
    }

    beforeAll(() => {
      request.__setDefaultMockResponse({
        'body': content
      });
    });

    afterAll(() => {
      request.__mockClear();
    });

    it('should return videos', async () => {

      await api.getVideos();

      expect(Videos).toBeCalledWith(content);
    });

    it('should authenticate', async () => {

      await api.getVideos();

      expect(request.auth).toHaveBeenCalled();
    });

    describe('when requested with options', () => {

      it('should be requestable with hidden videos only', async () => {

        await api.getVideos({
          show_hidden: true
        });

        expect(request.get).toBeCalledWith(`${url}/videos?show_hidden=true`);
      });
    });
  });
});