import { Directory } from '../directories/Directory';

export interface PendingChanges {
  selectedDirectory?: Directory;
  selectedVideos?: Set<string>;
  unsavedVideos?: Set<string>;
}
