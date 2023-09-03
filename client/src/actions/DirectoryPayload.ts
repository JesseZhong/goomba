import { ActionPayload } from '../AppDispatcher';
import { Directories, Directory } from '../directories/directory';

export interface ReceiveDirectoriesPayload extends ActionPayload {
  directories: Directories;
}

export interface PutDirectoryPayload extends ActionPayload {
  directory: Directory;
}

export interface RemoveDirectoryPayload extends ActionPayload {
  id: string;
}
