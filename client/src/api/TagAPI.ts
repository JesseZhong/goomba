import request, { Response } from 'superagent';
import { Access } from '../models/access';

const TagsAPI = (url: string, access: Access) => ({
  async getTags(): Promise<string[]> {
    return await access((token: string) =>
      request
        .get(`${url}/tags`)
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' })
        .then((response: Response) => {
          return response?.body as string[];
        })
    );
  },
});

export default TagsAPI;
