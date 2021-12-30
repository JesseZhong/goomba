import AppDispatcher from '../AppDispatcher';
import ActionTypes from './ActionTypes';
import { ReceiveTagsPayload } from './TagPayload';

const TagActions = {
    get(): void {
        AppDispatcher.dispatch({
            type: ActionTypes.GET_TAGS
        });
    },

    recieve(tags: string[]) {
        AppDispatcher.dispatch({
            type: ActionTypes.RECEIVE_TAGS,
            tags: tags
        } as ReceiveTagsPayload);
    }
}

export default TagActions;