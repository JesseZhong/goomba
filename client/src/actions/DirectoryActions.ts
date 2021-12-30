import AppDispatcher from '../AppDispatcher';
import ActionTypes from './ActionTypes';
import { Directories } from '../videos/Directory';
import { ReceiveDirectoryPayload } from './DirectoryPayload';

const DirectoryActions = {
    get(): void {
        AppDispatcher.dispatch({
            type: ActionTypes.GET_TAGS
        });
    },

    recieve(directories: Directories) {
        AppDispatcher.dispatch({
            type: ActionTypes.RECEIVE_TAGS,
            directories: directories
        } as ReceiveDirectoryPayload);
    }
}

export default DirectoryActions;