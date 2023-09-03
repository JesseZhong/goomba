import { Video } from '../videos/video';
import request, { Response } from 'superagent';

const VideoMetaAPI = (url: string) => ({
  async get(id: string): Promise<Video> {
    return new Promise<Video>(
      (
        resolve: (value: Promise<Video>) => void,
        reject: (reason?: any) => void
      ) => {
        request
          .get(`${url}/videos/${id}/meta`)
          .set('Accept', 'application/json')
          .end((error: any, response: Response) => {
            if (!error && response.ok) {
              resolve(response.body);
            } else {
              reject(error);
            }
          });
      }
    );
  },
});

export default VideoMetaAPI;
