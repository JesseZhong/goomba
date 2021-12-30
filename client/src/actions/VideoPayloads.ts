import { ActionPayload } from '../AppDispatcher';
import { Videos } from '../videos/Video';

export interface ReceiveVideosPayload extends ActionPayload {
    videos: Videos
}