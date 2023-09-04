import { Container } from 'flux/utils';
import App from '../App';
import SessionStore from '../stores/SessionStore';
import { Session } from '../models/session';
import VideoStore from '../stores/VideoStore';
import { Videos } from '../models/video';
import TagStore from '../stores/TagStore';
import { Directories } from '../models/directory';
import DirectoryStore from '../stores/DirectoryStore';
import ManagementStore from '../stores/ManagementStore';
import { PendingChanges } from '../models/pendingChanges';

function getStores() {
  return [SessionStore, VideoStore, DirectoryStore, ManagementStore, TagStore];
}

export interface AppState {
  session: Session;
  videos: Videos;
  directories: Directories;
  pendingChanges: PendingChanges;
  tags: string[];
}

function getState(): AppState {
  return {
    session: SessionStore.getState(),
    videos: VideoStore.getState(),
    directories: DirectoryStore.getState(),
    pendingChanges: ManagementStore.getState(),
    tags: TagStore.getState(),
  };
}

export default Container.createFunctional(App, getStores, getState);
