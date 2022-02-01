import AppDispatcher from '../AppDispatcher';
import ActionTypes from './ActionTypes';
import { Directories, Directory } from '../directories/Directory';
import { PutDirectoryPayload, ReceiveDirectoriesPayload, RemoveDirectoryPayload } from './DirectoryPayload';
import DirectoryAPI from '../api/DirectoryAPI';
import { AuthAccess } from './AuthActions';

const directoryApi = DirectoryAPI(
    process.env.REACT_APP_API_URL ?? '',
    AuthAccess
);

const DirectoryActions = {
    get(): void {
        directoryApi.get(
            (directories: Directories) => {
                AppDispatcher.dispatch({
                    type: ActionTypes.RECEIVE_DIRECTORIES,
                    directories: directories
                } as ReceiveDirectoriesPayload);
            }
        )
    },

    put(
        directory: Directory,
        success?: () => void,
        onerror?: (error: any) => void
    ) {
        directoryApi.put(
            directory,
            (confirmedDirectory: Directory) => {
                AppDispatcher.dispatch({
                    type: ActionTypes.PUT_DIRECTORY,
                    directory: confirmedDirectory
                } as PutDirectoryPayload);
                success?.();
            },
            onerror
        )
    },

    remove(
        id: string,
        success?: () => void,
        onerror?: (error: any) => void
    ): void {
        directoryApi.remove(
            id,
            () => {
                AppDispatcher.dispatch({
                    type: ActionTypes.REMOVE_DIRECTORY,
                    id: id
                } as RemoveDirectoryPayload);
                success?.();
            },
            onerror
        )
    }
}

export default DirectoryActions;