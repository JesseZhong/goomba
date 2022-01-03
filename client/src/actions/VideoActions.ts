import AppDispatcher from '../AppDispatcher';
import ActionTypes from './ActionTypes';
import { PutVideoPayload, VideosPayload, RemoveVideoPayload } from './VideoPayloads';
import { Video, Videos } from '../videos/Video';
import VideoAPI from '../api/VideoAPI';
import { AuthAccess } from './AuthActions';

const videoApi = VideoAPI(
    process.env.REACT_APP_API_URL ?? '',
    AuthAccess
);

const VideoActions = {

    /**
     * Grabs video info along with a watchable video URL.
     * @param id Video UUID.
     * @param received Action performed after video info is received.
     * @param onerror Action performed if there was an error.
     */
    get: (
        id: string,
        received: (video: Video) => void,
        onerror: (error: any) => void
    ) => videoApi.get(
        id,
        received,
        onerror
    ),

    /**
     * Get all watchable videos.
     * @param admin Setting to true allows an admin
     * to view all videos, including hidden.
     */
    getAll(
        admin: boolean = false
    ): void {
        videoApi.getAll(
            (videos: Videos) => {
                AppDispatcher.dispatch({
                    type: ActionTypes.RECEIVE_VIDEOS,
                    videos: videos
                } as VideosPayload);
            },
            admin
        )
    },

    /**
     * Get all videos that have the listed tags.
     * @param tags Desired tags to search by.
     */
    getByTags(tags: string[]): void {
        videoApi.getByTags(
            tags,
            (videos: Videos) => {
                AppDispatcher.dispatch({
                    type: ActionTypes.RECEIVE_VIDEOS,
                    videos: videos
                } as VideosPayload);
            }
        );
    },

    /**
     * Get all the videos under a specific directory.
     * @param dir_id UUID of the directory.
     */
    getByDirectory(dir_id: string): void {
        videoApi.getByDirectory(
            dir_id,
            (videos: Videos) => {
                AppDispatcher.dispatch({
                    type: ActionTypes.RECEIVE_VIDEOS,
                    videos: videos
                } as VideosPayload);
            }
        );
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