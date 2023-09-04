import { Directory } from './directory';

export interface PendingChanges {
  selectedDirectory?: Directory;
  selectedVideos?: Set<string>;
  unsavedVideos?: Set<string>;
}
