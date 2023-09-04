import { ActionPayload } from '../AppDispatcher';
import { Directory } from '../models/directory';

export interface SelectDirectoryPayload extends ActionPayload {
  directory?: Directory;
}

export interface SelectVideosPayload extends ActionPayload {
  videos?: Set<string>;
}

export interface SetUnsavedVideosPayload extends ActionPayload {
  videos?: Set<string>;
}
