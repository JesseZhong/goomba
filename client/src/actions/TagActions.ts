import AppDispatcher from "../AppDispatcher"
import { Video } from "../videos/Video";
import ActionTypes from "./ActionTypes"
import { ChangeTagsPayload, GetItemTagsPayload, ReceiveTagsPayload } from "./TagPayload";

const TagActions = {
    get(): void {
        AppDispatcher.dispatch({
            type: ActionTypes.GET_TAGS
        });
    },

    getItemTags(video: Video) {
        AppDispatcher.dispatch({
            type: ActionTypes.GET_VIDEO_TAGS,
            video: video
        } as GetItemTagsPayload);
    },

    addTags(video: Video, tags: string[]) {
        AppDispatcher.dispatch({
            type: ActionTypes.ADD_TAGS,
            video: video,
            tags: tags
        } as ChangeTagsPayload);
    },

    removeTags(video: Video, tags: string[]) {
        AppDispatcher.dispatch({
            type: ActionTypes.REMOVE_TAGS,
            video: video,
            tags: tags
        } as ChangeTagsPayload);
    },

    recieve(tags: string[]) {
        AppDispatcher.dispatch({
            type: ActionTypes.RECEIVE_TAGS,
            tags: tags
        } as ReceiveTagsPayload);
    }
}

export default TagActions;