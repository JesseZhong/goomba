import { ReduceStore } from 'flux/utils';
import AppDispatcher, { ActionPayload } from '../AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import {
  PutDirectoryPayload,
  ReceiveDirectoriesPayload,
} from '../actions/DirectoryPayload';
import { Directories } from '../directories/directory';

class DirectoryStore extends ReduceStore<Directories, ActionPayload> {
  public constructor() {
    super(AppDispatcher);
  }

  public getInitialState(): Directories {
    return new Directories();
  }

  public reduce(state: Directories, action: ActionPayload): Directories {
    switch (action.type) {
      case ActionTypes.RECEIVE_DIRECTORIES:
        const receiveAction: ReceiveDirectoriesPayload =
          action as ReceiveDirectoriesPayload;
        if (receiveAction) {
          state = receiveAction.directories;
        }
        return state;

      case ActionTypes.PUT_DIRECTORY:
        const putAction: PutDirectoryPayload = action as PutDirectoryPayload;
        if (putAction) {
          const directory = putAction.directory;
          state.set(directory.id, directory);
        }
        return new Directories(Object.fromEntries(state));

      default:
        return state;
    }
  }
}

const directoryStore = new DirectoryStore();

export default directoryStore;
