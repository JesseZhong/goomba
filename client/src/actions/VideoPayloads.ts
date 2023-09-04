import { ActionPayload } from '../AppDispatcher';
import { Video, Videos } from '../models/video';

export interface VideosPayload extends ActionPayload {
  videos: Videos;
}

export interface PutVideoPayload extends ActionPayload {
  video: Video;
}

export interface RemoveVideoPayload extends ActionPayload {
  id: string;
}
