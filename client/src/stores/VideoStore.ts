import { ReduceStore } from 'flux/utils';
import AppDispatcher, { ActionPayload } from '../AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import { ReceiveVideosPayload } from '../actions/VideoPayloads';
import { Videos } from '../videos/Video';

class VideoStore extends ReduceStore<Videos, ActionPayload> {

    public constructor() {
        super(AppDispatcher);
    }

    public getInitialState(): Videos {
        return new Videos();
    }

    public reduce(state: Videos, action: ActionPayload): Videos {
        switch(action.type) {
            case ActionTypes.RECEIVE_VIDEOS:
                const receiveAction: ReceiveVideosPayload = action as ReceiveVideosPayload;
                if (receiveAction) {
                    state = receiveAction.videos;
                }
                return state;

            case ActionTypes.GET_VIDEOS:
            default:
                return state;
        }
    }
}

export default new VideoStore();