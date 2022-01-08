import ImageAPI from '../api/ImageAPI';
import { AuthAccess } from './AuthActions';
import events from 'events';


const imageApi = ImageAPI(
    process.env.REACT_APP_API_URL ?? '',
    AuthAccess
);

const ImageActions = {
    upload: (
        image_key: string,
        file: File,
        success: (image_key: string) => void,
        event?: events.EventEmitter
    ) => {
        imageApi.upload(
            image_key,
            file,
            success,
            event
        )
    }
}

export default ImageActions;