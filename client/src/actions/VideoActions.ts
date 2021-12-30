import AppDispatcher from '../AppDispatcher';
import ActionTypes from './ActionTypes';
import { ReceiveVideosPayload } from './VideoPayloads';
import { Videos } from '../videos/Video';

const VideoActions = {
    get(): void {
        AppDispatcher.dispatch({
            type: ActionTypes.GET_VIDEOS,
        });
    },

    receive(videos: Videos): void {
        AppDispatcher.dispatch({
            type: ActionTypes.RECEIVE_VIDEOS,
            videos: videos
        } as ReceiveVideosPayload);
    }
}

export default VideoActions;