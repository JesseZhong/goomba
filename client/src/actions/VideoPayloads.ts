import { ActionPayload } from '../AppDispatcher';
import { Videos } from '../videos/Video';

export interface GetTaggedVideosPayload extends ActionPayload {
    tags: string[]
}

export interface ReceiveVideosPayload extends ActionPayload {
    videos: Videos
}