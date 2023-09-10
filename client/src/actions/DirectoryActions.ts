import AppDispatcher from '../AppDispatcher';
import ActionTypes from './ActionTypes';
import { Directories, Directory } from '../models/Directory';
import {
  PutDirectoryPayload,
  ReceiveDirectoriesPayload,
  RemoveDirectoryPayload,
} from './DirectoryPayload';
import DirectoryAPI from '../api/DirectoryAPI';
import { AuthAccess } from './AuthActions';
import { API_URL } from '../constants/env';

const directoryApi = DirectoryAPI(API_URL, AuthAccess);

const DirectoryActions = {
  async get(): Promise<void> {
    return await directoryApi.get().then((directories: Directories) => {
      AppDispatcher.dispatch({
        type: ActionTypes.RECEIVE_DIRECTORIES,
        directories: directories,
      } as ReceiveDirectoriesPayload);
    });
  },

  async put(directory: Directory): Promise<void> {
    return await directoryApi
      .put(directory)
      .then((confirmedDirectory: Directory) => {
        AppDispatcher.dispatch({
          type: ActionTypes.PUT_DIRECTORY,
          directory: confirmedDirectory,
        } as PutDirectoryPayload);
      });
  },

  async remove(id: string): Promise<void> {
    return await directoryApi.remove(id).then(() => {
      AppDispatcher.dispatch({
        type: ActionTypes.REMOVE_DIRECTORY,
        id: id,
      } as RemoveDirectoryPayload);
    });
  },
};

export default DirectoryActions;
