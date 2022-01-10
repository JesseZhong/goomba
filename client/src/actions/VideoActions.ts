import AppDispatcher from '../AppDispatcher';
import ActionTypes from './ActionTypes';
import { PutVideoPayload, VideosPayload, RemoveVideoPayload } from './VideoPayloads';
import { Video, Videos } from '../videos/Video';
import VideoAPI, { VideoOptions } from '../api/VideoAPI';
import { AuthAccess } from './AuthActions';

const videoApi = VideoAPI(
    process.env.REACT_APP_API_URL ?? '',
    AuthAccess
);

const VideoActions = {

    /**
     * Grabs video info along with a HLS video URL.
     * @param id Video UUID.
     * @param received Action performed after video info is received.
     * @param onerror Action performed if there was an error.
     */
    getStream: (
        id: string,
        received: (video: Video) => void,
        onerror: (error: any) => void
    ) => videoApi.getStream(
        id,
        received,
        onerror
    ),

    /**
     * Grabs video info along with a video download URL.
     * @param id Video UUID.
     * @param received Action performed after video info is received.
     * @param onerror Action performed if there was an error.
     */
     getDownload: (
        id: string,
        received: (video: Video) => void,
        onerror: (error: any) => void
    ) => videoApi.getStream(
        id,
        received,
        onerror
    ),

    /**
     * Get all watchable videos.
     * @param admin Setting to true allows an admin
     * to view all videos, including hidden.
     * @param directory_id Get only the videos from a directory.
     * @param tags Filter videos by tags.
     */
    getVideos(
        options?: VideoOptions
    ): void {
        videoApi.getVideos(
            (videos: Videos) => {
                AppDispatcher.dispatch({
                    type: ActionTypes.RECEIVE_VIDEOS,
                    videos: videos
                } as VideosPayload);
            },
            options
        )
    },

    /**
     * Adds or updates a video.
     * @param video Video information.
     * @param success 
     * @param onerror 
     */
    put(
        video: Video,
        success: () => void,
        onerror: (error: any) => void
    ): void {
        videoApi.put(
            video,
            (confirmedVideo: Video) => {
                AppDispatcher.dispatch({
                    type: ActionTypes.PUT_VIDEO,
                    video: confirmedVideo
                } as PutVideoPayload);
                success();
            },
            onerror
        );
    },

    /**
     * Removes an existing video by its ID.
     * @param id Video's UUID.
     * @param success 
     * @param onerror 
     */
    remove(
        id: string,
        success: () => void,
        onerror: (error: any) => void
    ): void {
        videoApi.remove(
            id,
            () => {
                AppDispatcher.dispatch({
                    type: ActionTypes.REMOVE_VIDEO,
                    id: id
                } as RemoveVideoPayload);
                success();
            },
            onerror
        );
    }
}

export default VideoActions;