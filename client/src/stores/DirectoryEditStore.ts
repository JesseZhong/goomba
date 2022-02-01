import { ReduceStore } from 'flux/utils';
import ActionTypes from '../actions/ActionTypes';
import AppDispatcher, { ActionPayload } from '../AppDispatcher';
import { PendingDirectoryEdit } from '../manage/PendingDirectoryEdit';
import { SelectDirectoryPayload, SelectVideosPayload } from '../actions/DirectoryEditPayload';

class DirectoryEditStore extends ReduceStore<PendingDirectoryEdit, ActionPayload> {

    public constructor() {
        super(AppDispatcher);
    }

    public getInitialState(): PendingDirectoryEdit {
        return {};
    }

    public reduce(
        state: PendingDirectoryEdit,
        action: ActionPayload
    ): PendingDirectoryEdit {

        switch(action.type) {
            case ActionTypes.DIRECTORY_EDIT_DIR_SELECT:
                const selectDirAction = action as SelectDirectoryPayload;
                if (selectDirAction) {
                    state = {
                        directory: selectDirAction.directory
                    }
                }
                return state;

            case ActionTypes.DIRECTORY_EDIT_VID_SELECT:
                const selectVidAction = action as SelectVideosPayload;
                if (selectVidAction) {
                    state.selectedVideos = selectVidAction.videos;
                }
                return state;

            case ActionTypes.DIRECTORY_EDIT_RESET:
                if (action) {
                    state.directory = undefined;
                    state.selectedVideos = undefined;
                }
                return state;
                
            default:
                return state;
        }
    }
}

export default new DirectoryEditStore();