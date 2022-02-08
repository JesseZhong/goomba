import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import compact from 'lodash/compact';
import { Directories } from '../directories/Directory';
import { Videos } from '../videos/Video';
import VideosByDate from '../video-views/VideosByDate';



const DirectoryVideos = (props: {
    directories: Directories,
    videos: Videos
}) => {
    const navigate = useNavigate();
    const directories = props.directories.get_lookup();
    const { dirName } = useParams();

    // No ID passed or it doesn't exists? 404.
    if (!dirName || !directories.has(dirName)) {
        navigate('/not-found');
        return <></>;
    }

    const currentDir = directories.get(dirName);

    const currentVideos = compact(
        currentDir?.videos?.map(
            vid => props.videos.get(vid)
        )
    );

    return (
        <VideosByDate videos={currentVideos} />
    );
}

export default DirectoryVideos;