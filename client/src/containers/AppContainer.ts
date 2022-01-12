import { Container } from 'flux/utils';
import App from '../App';
import SessionStore from '../stores/SessionStore';
import { Session } from '../auth/Session';
import VideoStore from '../stores/VideoStore';
import { Videos } from '../videos/Video';
import TagStore from '../stores/TagStore';
import { Directories } from '../directories/Directory';
import DirectoryStore from '../stores/DirectoryStore';

function getStores() {
    return [
        SessionStore,
        VideoStore,
        DirectoryStore,
        TagStore
    ]
}

export interface AppState {
    session: Session,
    videos: Videos,
    directories: Directories,
    tags: string[]
}

function getState(): AppState {
    return {
        session: SessionStore.getState(),
        videos: VideoStore.getState(),
        directories: DirectoryStore.getState(),
        tags: TagStore.getState()
    }
}

export default Container.createFunctional(App, getStores, getState);