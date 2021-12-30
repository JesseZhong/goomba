import { ActionPayload } from "../AppDispatcher";

export interface ReceiveTagsPayload extends ActionPayload {
    tags: string[]
}