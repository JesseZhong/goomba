import { ReduceStore } from 'flux/utils';
import ActionTypes from '../actions/ActionTypes';
import AppDispatcher, { ActionPayload } from '../AppDispatcher';
import { PendingChanges } from '../models/PendingChanges';
import {
  SelectDirectoryPayload,
  SelectVideosPayload,
  SetUnsavedVideosPayload,
} from '../actions/ManagementPayload';

class ManagementStore extends ReduceStore<PendingChanges, ActionPayload> {
  public constructor() {
    super(AppDispatcher);
  }

  public getInitialState(): PendingChanges {
    return {};
  }

  public reduce(state: PendingChanges, action: ActionPayload): PendingChanges {
    switch (action.type) {
      case ActionTypes.MANAGEMENT_SELECT_DIRECTORY:
        const selectDirAction = action as SelectDirectoryPayload;
        return {
          ...state,
          selectedDirectory: selectDirAction?.directory,
        };

      case ActionTypes.MANAGEMENT_SELECT_VIDEOS:
        const selectVidAction = action as SelectVideosPayload;
        if (selectVidAction) {
          state.selectedVideos = selectVidAction.videos;
        }
        return {
          ...state,
          selectedVideos: selectVidAction?.videos,
        };

      case ActionTypes.MANAGEMENT_RESET_SELECTIONS:
        return {
          ...state,
          selectedDirectory: undefined,
          selectedVideos: undefined,
        };

      case ActionTypes.MANAGEMENT_SET_UNSAVED_VIDEOS:
        const setUnsavedVidsAction = action as SetUnsavedVideosPayload;
        return {
          ...state,
          unsavedVideos: setUnsavedVidsAction?.videos,
        };

      default:
        return state;
    }
  }
}

const managementStore = new ManagementStore();

export default managementStore;
