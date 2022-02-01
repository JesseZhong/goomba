import React from 'react';
import { Directories, Directory } from '../directories/Directory';
import { Videos } from '../videos/Video';
import ManageDirectoriesSection from './ManageDirectoriesSection';
import ManageVideosSection from './ManageVideosSection';
import { PendingDirectoryEdit } from './PendingDirectoryEdit';

const ManagePage = (props: {
    directories: Directories,
    videos: Videos,
    pendingDirectoryEdit: PendingDirectoryEdit
}) => {

    return (
        <div>
            <ManageDirectoriesSection
                directories={props.directories}
                pendingDirectoryEdit={props.pendingDirectoryEdit}
            />  
            <ManageVideosSection
                videos={props.videos}
                pendingDirectoryEdit={props.pendingDirectoryEdit}
            />
        </div>
    );
}

export default ManagePage;