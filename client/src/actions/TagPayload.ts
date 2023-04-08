import { ActionPayload } from "../AppDispatcher";

export interface TagsPayload extends ActionPayload {
  tags: string[]
}