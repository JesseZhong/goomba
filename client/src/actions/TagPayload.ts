import { ActionPayload } from "../AppDispatcher";
import { Video } from "../videos/Video";

export interface GetItemTagsPayload extends ActionPayload {
    video: Video
}

export interface ChangeTagsPayload extends ActionPayload {
    video: Video,
    tags: string[]
}

export interface ReceiveTagsPayload extends ActionPayload {
    tags: string[]
}