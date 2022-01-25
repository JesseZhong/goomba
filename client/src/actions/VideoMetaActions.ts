import VideoMetaAPI from '../api/VideoMetaAPI';
import { Video } from '../videos/Video';

const videoMetaApi = VideoMetaAPI(
    process.env.REACT_APP_API_URL ?? ''
);

const VideoMetaActions = {
    get: (
        id: string,
        received: (video: Video) => void,
        onerror: (error: any) => void
    ) => videoMetaApi.get(
        id,
        received,
        onerror
    )
}

export default VideoMetaActions;