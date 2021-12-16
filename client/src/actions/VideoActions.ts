import AppDispatcher from '../AppDispatcher';
import ActionTypes from './ActionTypes';
import { GetTaggedVideosPayload, ReceiveVideosPayload } from './VideoPayloads';
import { Videos } from '../videos/Video';

const VideoActions = {
    get(): void {
        AppDispatcher.dispatch({
            type: ActionTypes.GET_VIDEOS,
        });
    },

    getTagged(tags: string[]): void {
        AppDispatcher.dispatch({
            type: ActionTypes.GET_TAGGED_VIDEOS,
            tags: tags
        } as GetTaggedVideosPayload);
    },

    receive(videos: Videos): void {
        AppDispatcher.dispatch({
            type: ActionTypes.RECEIVE_VIDEOS,
            videos: videos
        } as ReceiveVideosPayload);
    }
}

export default VideoActions;