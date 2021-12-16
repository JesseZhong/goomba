import { Container } from 'flux/utils';
import App from '../App';
import VideoStore from '../stores/VideoStore';
import VideoActions from '../actions/VideoActions';
import { Videos } from '../videos/Video';
import VideoAPI from '../api/VideoAPI';

const url = 'http://media:4000/';
const api = VideoAPI(url);

function getStores() {
    return [
        VideoStore,
    ]
}

export interface AppState {
    videoes: Videos,
    receiveVideos: (videos: Videos) => void
}

function getState(): AppState {
    return {
        videoes: VideoStore.getState(),
        receiveVideos: VideoActions.receive
    }
}

api.get(getState().receiveVideos);

export default Container.createFunctional(App, getStores, getState);