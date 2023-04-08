import { Directory } from '../directories/Directory';


export interface DirectoryEditPending {
  directory?: Directory,
  selectedVideos?: Set<string>
}