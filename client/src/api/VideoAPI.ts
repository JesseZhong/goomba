import request, { Response } from 'superagent';
import { Video, Videos } from '../videos/video';
import { Access } from './Access';

export interface VideoOptions {
  show_hidden?: boolean;
  show_keys?: boolean;
  directory_id?: string;
  tags?: string[];
}

export interface VideoAPIClient {
  getStream: (id: string) => Promise<Video>;
  getDownload: (id: string) => Promise<Video>;
  getVideos: (options?: VideoOptions) => Promise<Videos>;
  put: (video: Video) => Promise<Video>;
  remove: (id: string) => Promise<void>;
}

const VideoAPI = (url: string, access: Access) => ({
  async getStream(id: string): Promise<Video> {
    return await access((token: string) =>
      request
        .get(`${url}/videos/${id}/stream`)
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' })
        .then((response: Response) => {
          return response.body;
        })
    );
  },

  async getDownload(id: string): Promise<Video> {
    return await access((token: string) =>
      request
        .get(`${url}/videos/${id}/download`)
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' })
        .then((response: Response) => {
          return response.body;
        })
    );
  },

  async getVideos(options?: VideoOptions): Promise<Videos> {
    return await access(async (token: string) => {
      let queries: string[] = [];
      if (options?.show_hidden) {
        queries.push('show_hidden=true');
      }

      if (options?.show_keys) {
        queries.push('show_keys=true');
      }

      if (options?.directory_id) {
        queries.push(`directory=${options.directory_id}`);
      }

      if (options?.tags) {
        queries.push(`tags=[${options.tags.join(',')}]`);
      }

      return await request
        .get(`${url}/videos${queries ? `?${queries.join('&')}` : ''}`)
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' })
        .then((response: Response) => {
          return new Videos(response.body);
        });
    });
  },

  async put(video: Video): Promise<Video> {
    return await access(async (token: string) => {
      return await request
        .put(`${url}/videos/${video.id}`)
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' })
        .send(video)
        .then((response: Response) => {
          if (response.status === 201) {
            return response.body;
          }

          return Promise.reject(response);
        });
    });
  },

  async remove(id: string): Promise<void> {
    return await access(async (token: string) => {
      return await request
        .del(`${url}/videos/${id}`)
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' })
        .then((response: Response) => {
          if (response.status === 204) {
            return;
          }

          return Promise.reject(response);
        });
    });
  },
});

export default VideoAPI;
