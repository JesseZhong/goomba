import { Directory } from '../models/directory';
import request, { Response } from 'superagent';

const DirectoryMetaAPI = (url: string) => ({
  async get(name: string): Promise<Directory> {
    return new Promise<Directory>(
      (
        resolve: (value: Promise<Directory>) => void,
        reject: (reason?: any) => void
      ) => {
        request
          .get(`${url}/directory/${name}/meta`)
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

export default DirectoryMetaAPI;
