import { Directory } from '../directories/Directory';


export interface PendingDirectoryEdit {
    directory?: Directory,
    selectedVideos?: Set<string>
}