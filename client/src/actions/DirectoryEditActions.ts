import AppDispatcher from '../AppDispatcher';
import { Directory } from '../directories/Directory';
import ActionTypes from './ActionTypes';
import { SelectDirectoryPayload, SelectVideosPayload } from './DirectoryEditPayload';


const DirectoryEditActions = {
    selectDirectory(directory?: Directory): void {
        AppDispatcher.dispatch({
            type: ActionTypes.DIRECTORY_EDIT_DIR_SELECT,
            directory: directory
        } as SelectDirectoryPayload);
    },

    selectVideos(videos?: Set<string>): void {
        AppDispatcher.dispatch({
            type: ActionTypes.DIRECTORY_EDIT_VID_SELECT,
            videos: videos
        } as SelectVideosPayload);
    },

    reset(): void {
        AppDispatcher.dispatch({
            type: ActionTypes.DIRECTORY_EDIT_RESET
        });
    }
}

export default DirectoryEditActions;