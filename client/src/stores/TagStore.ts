import { ReduceStore } from 'flux/utils';
import AppDispatcher, { ActionPayload } from '../AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import { TagsPayload } from '../actions/TagPayload';

class TagStore extends ReduceStore<string[], ActionPayload> {

  public constructor() {
    super(AppDispatcher);
  }

  public getInitialState(): string[] {
    return [];
  }

  public reduce(state: string[], action: ActionPayload): string[] {
    switch(action.type) {
      case ActionTypes.RECEIVE_TAGS:
        const receiveAction: TagsPayload = action as TagsPayload;
        if (receiveAction) {
          state = receiveAction.tags;
        }
        return state;
      default:
        return state;
    }
  }
}

export default new TagStore();