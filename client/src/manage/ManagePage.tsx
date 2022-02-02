import React from 'react';
import DirectoryActions from '../actions/DirectoryActions';
import VideoActions from '../actions/VideoActions';
import { Directories } from '../directories/Directory';
import { Videos } from '../videos/Video';
import ManageDirectoriesSection from './ManageDirectoriesSection';
import ManageVideosSection from './ManageVideosSection';
import { DirectoryEditPending } from './DirectoryEditPending';

const ManagePage = (props: {
    directories: Directories,
    videos: Videos,
    pendingDirectoryEdit: DirectoryEditPending
}) => {
    React.useEffect(() => {
            DirectoryActions.get();
            VideoActions.getVideos({
                show_hidden: true,
                show_keys: true
            });
        },
        []
    );

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