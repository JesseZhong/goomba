import { ReduceStore } from 'flux/utils';
import ActionTypes from '../actions/ActionTypes';
import AppDispatcher, { ActionPayload } from '../AppDispatcher';
import { DirectoryEditPending } from '../manage/DirectoryEditPending';
import { SelectDirectoryPayload, SelectVideosPayload } from '../actions/DirectoryEditPayload';

class DirectoryEditStore extends ReduceStore<DirectoryEditPending, ActionPayload> {

  public constructor() {
    super(AppDispatcher);
  }

  public getInitialState(): DirectoryEditPending {
    return {};
  }

  public reduce(
    state: DirectoryEditPending,
    action: ActionPayload
  ): DirectoryEditPending {

    switch(action.type) {
      case ActionTypes.DIRECTORY_EDIT_DIR_SELECT:
        const selectDirAction = action as SelectDirectoryPayload;
        if (selectDirAction) {
          state = {
            directory: selectDirAction.directory
          }
        }
        return {
          directory: state.directory,
          selectedVideos: state.selectedVideos
        };

      case ActionTypes.DIRECTORY_EDIT_VID_SELECT:
        const selectVidAction = action as SelectVideosPayload;
        if (selectVidAction) {
          state.selectedVideos = selectVidAction.videos;
        }
        return {
          directory: state.directory,
          selectedVideos: state.selectedVideos
        };

      case ActionTypes.DIRECTORY_EDIT_RESET:
        if (action) {
          return {};
        }
        return state;
        
      default:
        return state;
    }
  }
}

export default new DirectoryEditStore();