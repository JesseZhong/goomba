import { Container } from 'flux/utils';
import App from '../App';
import SessionStore from '../stores/SessionStore';
import { Session } from '../auth/Session';
import VideoStore from '../stores/VideoStore';
import { Videos } from '../videos/Video';
import TagStore from '../stores/TagStore';
import { Directories } from '../directories/Directory';
import DirectoryStore from '../stores/DirectoryStore';
import DirectoryEditStore from '../stores/DirectoryEditStore';
import { PendingDirectoryEdit } from '../manage/PendingDirectoryEdit';

function getStores() {
    return [
        SessionStore,
        VideoStore,
        DirectoryStore,
        DirectoryEditStore,
        TagStore
    ]
}

export interface AppState {
    session: Session,
    videos: Videos,
    directories: Directories,
    pendingDirectoryEdit: PendingDirectoryEdit | undefined,
    tags: string[]
}

function getState(): AppState {
    return {
        session: SessionStore.getState(),
        videos: VideoStore.getState(),
        directories: DirectoryStore.getState(),
        pendingDirectoryEdit: DirectoryEditStore.getState(),
        tags: TagStore.getState()
    }
}

export default Container.createFunctional(App, getStores, getState);