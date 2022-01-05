import ImageAPI from '../api/ImageAPI';
import { AuthAccess } from './AuthActions';
import events from 'events';


const imageApi = ImageAPI(
    process.env.REACT_APP_API_URL ?? '',
    AuthAccess
);

const ImageActions = {
    upload: (
        file: File,
        success: (fileKey: string) => void,
        event?: events.EventEmitter
    ) => {
        imageApi.upload(
            file,
            success,
            event
        )
    }
}

export default ImageActions;