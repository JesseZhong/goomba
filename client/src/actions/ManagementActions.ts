import AppDispatcher from '../AppDispatcher';
import { Directory } from '../directories/directory';
import ActionTypes from './ActionTypes';
import {
  SelectDirectoryPayload,
  SelectVideosPayload,
  SetUnsavedVideosPayload,
} from './ManagementPayload';

const ManagementActions = {
  selectDirectory(directory?: Directory): void {
    AppDispatcher.dispatch({
      type: ActionTypes.MANAGEMENT_SELECT_DIRECTORY,
      directory,
    } as SelectDirectoryPayload);
  },

  selectVideos(videos?: Set<string>): void {
    AppDispatcher.dispatch({
      type: ActionTypes.MANAGEMENT_SELECT_VIDEOS,
      videos,
    } as SelectVideosPayload);
  },

  resetSelections(): void {
    AppDispatcher.dispatch({
      type: ActionTypes.MANAGEMENT_RESET_SELECTIONS,
    });
  },

  setUnsavedVideos(videos?: Set<string>): void {
    AppDispatcher.dispatch({
      type: ActionTypes.MANAGEMENT_SET_UNSAVED_VIDEOS,
      videos,
    } as SetUnsavedVideosPayload);
  },
};

export default ManagementActions;
