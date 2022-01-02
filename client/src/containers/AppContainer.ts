import { Container } from 'flux/utils';
import App from '../App';
import AuthAPI from '../api/AuthAPI';
import { Access } from '../api/Access';
import { ErrorResponse } from '../api/ErrorResponse';
import SessionStore from '../stores/SessionStore';
import SessionActions from '../actions/SessionActions';
import { Session, Sessions } from '../auth/Session';
import VideoAPI from '../api/VideoAPI';
import VideoStore from '../stores/VideoStore';
import VideoActions from '../actions/VideoActions';
import { Videos } from '../videos/Video';
import TagStore from '../stores/TagStore';
import TagActions from '../actions/TagActions';
import { Directories } from '../videos/Directory';
import DirectoryStore from '../stores/DirectoryStore';
import DirectoryActions from '../actions/DirectoryActions';

const url = process.env.REACT_APP_API_URL ?? '';

const saveSession = (
    access_token: string,
    refresh_token: string
) => {
    // Load up session info.
    let session = SessionStore.getState();
    session.access_token = access_token;
    session.refresh_token = refresh_token;

    // Save it.
    Sessions.set(session);
    SessionActions.set(session);
}

const resetSession = () => {
    // Clear out the existing token.
    let session = SessionStore.getState();
    delete session.access_token;
    delete session.refresh_token;

    // Save it.
    Sessions.set(session);
    SessionActions.set(session);
}

const authApi = AuthAPI(url);
const access: Access = (
    action: (
        access_token: string,
        errorHandler?: (response: ErrorResponse) => boolean
    ) => void
) => {
    const session = SessionStore.getState();
    if (session.access_token && session.refresh_token) {
        authApi.access(
            session.access_token,
            session.refresh_token,
            action,
            saveSession,
            resetSession
        )
    }
}

// Load session.
Sessions.load(
    SessionActions.receive
);

const videoApi = VideoAPI(url, access);

function getStores() {
    return [
        SessionStore,
        VideoStore,
    ]
}

export interface AppState {
    session: Session,

    requestAuthorization: (
        state: string,
        received: (auth_url: string) => void,
        onerror?: (error: any) => void
    ) => void,

    requestAccess: (
        state: string,
        code: string,
        received: (token: string) => void,
        onerror?: (error: any) => void
    ) => void,

    videos: Videos,
    receiveVideos: (videos: Videos) => void,

    getVideos: (
        received: (videos: Videos) => void
    ) => void,

    getVideosByTags: (
        tags: string[],
        received: (videos: Videos) => void
    ) => void,

    directories: Directories,
    receiveDirectories: (directories: Directories) => void,

    getDirectories: (
        received: (directories: Directories) => void
    ) => void,

    tags: string[],
    receiveTags: (tags: string[]) => void,

    getTags: (
        received: (tags: string[]) => void
    ) => void
}

function getState(): AppState {
    return {
        session: SessionStore.getState(),

        requestAuthorization: authApi.requestAuthorization,
        requestAccess: (
            state: string,
            code: string,
            received: (token: string) => void,
            onerror?: (error: any) => void
        ) => authApi.requestAccess(
            state,
            code,
            (
                access_token: string,
                refresh_token: string
            ) => {
                saveSession(access_token, refresh_token);
                received(access_token);
            },
            onerror
        ),

        videos: VideoStore.getState(),
        receiveVideos: VideoActions.receive,

        getVideos: (
            received: (videos: Videos) => void
        ) => videoApi.get(received),

        getVideosByTags: (
            tags: string[],
            received: (videos: Videos) => void
        ) => videoApi.getByTags(tags, received),

        directories: DirectoryStore.getState(),
        receiveDirectories: DirectoryActions.recieve,

        getDirectories: (
            received: (directories: Directories) => void
        ) => videoApi.getDirectories(received),

        tags: TagStore.getState(),
        receiveTags: TagActions.recieve,

        getTags: (
            received: (tags: string[]) => void
        ) => videoApi.getTags(received)
    }
}

export default Container.createFunctional(App, getStores, getState);