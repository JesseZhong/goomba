import { ReduceStore } from 'flux/utils';
import AppDispatcher, { ActionPayload } from '../AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import {
  PutVideoPayload,
  VideosPayload,
  RemoveVideoPayload,
} from '../actions/VideoPayloads';
import { Videos } from '../models/Video';

class VideoStore extends ReduceStore<Videos, ActionPayload> {
  public constructor() {
    super(AppDispatcher);
  }

  public getInitialState(): Videos {
    return new Videos();
  }

  public reduce(state: Videos, action: ActionPayload): Videos {
    switch (action.type) {
      case ActionTypes.RECEIVE_VIDEOS:
        const receiveAction: VideosPayload = action as VideosPayload;
        if (receiveAction) {
          state = receiveAction.videos;
        }
        return state;

      case ActionTypes.PUT_VIDEO:
        const putAction: PutVideoPayload = action as PutVideoPayload;
        if (putAction) {
          state.set(putAction.video.id, putAction.video);
        }
        return new Videos(Object.fromEntries(state));

      case ActionTypes.REMOVE_VIDEO:
        const removeAction: RemoveVideoPayload = action as RemoveVideoPayload;
        if (removeAction) {
          state.delete(removeAction.id);
        }
        return new Videos(Object.fromEntries(state));

      default:
        return state;
    }
  }
}

const videoStore = new VideoStore();

export default videoStore;
