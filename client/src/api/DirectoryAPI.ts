import request, { Response } from 'superagent';
import { Directories, Directory } from '../models/directory';
import { Access } from './Access';

export interface DirectoryAPIClient {
  get(): Promise<Directories>;

  put(directory: Directory): Promise<Directory>;

  remove(id: string): Promise<string>;
}

const DirectoryAPI = (url: string, access: Access): DirectoryAPIClient => ({
  async get(): Promise<Directories> {
    return await access<Directories>(async (token: string) =>
      request
        .get(`${url}/directories`)
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' })
        .then((response: Response) => {
          return new Directories(response.body);
        })
    );
  },

  async put(directory: Directory): Promise<Directory> {
    return await access(async (token: string) => {
      return request
        .put(`${url}/directories/${directory.id}`)
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' })
        .send(directory)
        .then((response: Response) => {
          if (response.status === 201) {
            return response.body;
          }

          return Promise.reject(response);
        });
    });
  },

  async remove(id: string): Promise<string> {
    return await access(async (token: string) => {
      return request
        .del(`${url}/directories/${id}`)
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' })
        .then((response: Response) => {
          if (response.status === 204) {
            return id;
          }

          return Promise.reject(response);
        });
    });
  },
});

export default DirectoryAPI;
