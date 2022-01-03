import AppDispatcher from '../AppDispatcher';
import ActionTypes from './ActionTypes';
import { TagsPayload } from './TagPayload';

const TagActions = {
    get(): void {
        AppDispatcher.dispatch({
            type: ActionTypes.RECEIVE_TAGS
        } as TagsPayload);
    },
}

export default TagActions;