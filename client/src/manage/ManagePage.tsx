import React from 'react';
import { Directories } from '../directories/Directory';
import { Videos } from '../videos/Video';
import ManageDirectoriesSection from './ManageDirectoriesSection';
import ManageVideosSection from './ManageVideosSection';

const ManagePage = (props: {
    directories: Directories,
    videos: Videos
}) => {

    return (
        <div>
            <ManageDirectoriesSection
                directories={props.directories}
            />
            <ManageVideosSection
                videos={props.videos}
            />
        </div>
    );
}

export default ManagePage;