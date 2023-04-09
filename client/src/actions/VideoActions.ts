import AppDispatcher from '../AppDispatcher';
import ActionTypes from './ActionTypes';
import {
  PutVideoPayload,
  VideosPayload,
  RemoveVideoPayload,
} from './VideoPayloads';
import { Video, Videos } from '../videos/Video';
import VideoAPI, { VideoOptions } from '../api/VideoAPI';
import { AuthAccess } from './AuthActions';
import * as ls from 'local-storage';

const video_times_key = 'video_times';

const videoApi = VideoAPI(process.env.REACT_APP_API_URL ?? '', AuthAccess);

const VideoActions = {
  /**
   * Grabs video info along with a HLS video URL.
   * @param id Video UUID.
   */
  getStream: async (id: string) => videoApi.getStream(id),

  /**
   * Grabs video info along with a video download URL.
   * @param id Video UUID.
   */
  getDownload: async (id: string) => videoApi.getStream(id),

  /**
   * Get all watchable videos.
   */
  async getVideos(options?: VideoOptions): Promise<void> {
    return await videoApi.getVideos(options).then((videos: Videos) => {
      AppDispatcher.dispatch({
        type: ActionTypes.RECEIVE_VIDEOS,
        videos: videos,
      } as VideosPayload);
    });
  },

  /**
   * Adds or updates a video.
   * @param video Video information.
   */
  async put(video: Video): Promise<void> {
    return await videoApi.put(video).then((confirmedVideo: Video) => {
      AppDispatcher.dispatch({
        type: ActionTypes.PUT_VIDEO,
        video: confirmedVideo,
      } as PutVideoPayload);
    });
  },

  /**
   * Removes an existing video by its ID.
   * @param id Video's UUID.
   */
  async remove(id: string): Promise<void> {
    return await videoApi.remove(id).then(() => {
      AppDispatcher.dispatch({
        type: ActionTypes.REMOVE_VIDEO,
        id: id,
      } as RemoveVideoPayload);
    });
  },

  getTimes(): { [id: string]: number } {
    return (ls.get(video_times_key) as { [id: string]: number }) ?? {};
  },

  setTimes(times: { [id: string]: number }): void {
    ls.set(video_times_key, times);
  },
};

export default VideoActions;
