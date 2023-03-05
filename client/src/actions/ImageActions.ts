import ImageAPI from '../api/ImageAPI';
import { AuthAccess } from './AuthActions';
import events from 'events';


const imageApi = ImageAPI(
  process.env.REACT_APP_API_URL ?? '',
  AuthAccess
);

const ImageActions = {
  
  upload: async (
    image_key: string,
    file: File,
    event?: events.EventEmitter
  ) => {
    return await imageApi.upload(
      image_key,
      file,
      event
    );
  }
}

export default ImageActions;