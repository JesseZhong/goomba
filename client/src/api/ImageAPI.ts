import request, { Response } from 'superagent';
import events from 'events';
import { Access } from '../models/Access';

interface Progress {
  percent?: string;
  direction?: string;
}

export interface ImageUploadData {
  image_key: string;
  image_url?: string;
}

interface PresignedUpload {
  url: string;
  fields: {
    key: string;
    'x-amz-algorithm': string;
    'x-amz-credential': string;
    'x-amz-date': string;
    'x-amz-security-token': string;
    policy: string;
    'x-amz-signature': string;
  };
  image_key: string;
  image_url?: string;
}

const ImageAPI = (url: string, access: Access) => ({
  async upload(
    image_key: string,
    file: File,
    event?: events.EventEmitter
  ): Promise<ImageUploadData> {
    return await access(async (token: string) =>
      // Request presigned url to use for upload.
      request
        .get(`${url}/images/${image_key}`)
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' })
        .then((response: Response) => {
          if (response.ok) {
            const result = response?.body as PresignedUpload;
            const data = new FormData();

            // Append all the fields from the presigned.
            Object.entries(result.fields).forEach(([key, value]) => {
              data.append(key, value);
            });

            // Append the file.
            data.append('file', file);

            // Attempt to upload the file.
            return request
              .post(result.url)
              .on('progress', (e: ProgressEvent) => {
                const progress = e as Progress;

                if (progress.direction === 'upload') {
                  event?.emit('uploadProgress', progress.percent);
                }
              })
              .send(data)
              .then((response: Response) => {
                if (response.ok) {
                  return {
                    image_key: result.image_key,
                    image_url: result.image_url,
                  };
                }

                return Promise.reject(response);
              });
          }

          return Promise.reject(response);
        })
    );
  },
});

export default ImageAPI;
