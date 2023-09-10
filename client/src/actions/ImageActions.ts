import ImageAPI from '../api/ImageAPI';
import { API_URL } from '../constants/env';
import { AuthAccess } from './AuthActions';
import events from 'events';

const imageApi = ImageAPI(API_URL, AuthAccess);

const ImageActions = {
  upload: async (
    image_key: string,
    file: File,
    event?: events.EventEmitter
  ) => {
    return await imageApi.upload(image_key, file, event);
  },
};

export default ImageActions;
