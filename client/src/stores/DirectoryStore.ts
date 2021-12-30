import { ReduceStore } from 'flux/utils';
import AppDispatcher, { ActionPayload } from '../AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import { ReceiveDirectoryPayload } from '../actions/DirectoryPayload';
import { Directories } from '../videos/Directory';

class TagStore extends ReduceStore<Directories, ActionPayload> {

    public constructor() {
        super(AppDispatcher);
    }

    public getInitialState(): Directories {
        return new Directories();
    }

    public reduce(state: Directories, action: ActionPayload): Directories {
        switch(action.type) {
            case ActionTypes.RECEIVE_DIRECTORIES:
                const receiveAction: ReceiveDirectoryPayload = action as ReceiveDirectoryPayload;
                if (receiveAction) {
                    state = receiveAction.directories;
                }
                return state;
            case ActionTypes.GET_DIRECTORIES:
            default:
                return state;
        }
    }
}

export default new TagStore();