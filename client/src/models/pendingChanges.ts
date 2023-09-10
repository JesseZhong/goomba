import { Directory } from './Directory';

export interface PendingChanges {
  selectedDirectory?: Directory;
  selectedVideos?: Set<string>;
  unsavedVideos?: Set<string>;
}
