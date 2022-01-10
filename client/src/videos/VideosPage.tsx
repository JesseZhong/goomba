import React from 'react';
import VideoActions from '../actions/VideoActions';
import { Videos } from './Video';
import VideoList, { ToVideoView } from './VideoList';

const VideosPage = (props: {
    videos: Videos
}) => {

    React.useEffect(() => {
            VideoActions.getVideos();
        },
        []
    );

    const videos = props.videos;

    return (
        <div>
            <VideoList
                videos={videos}
                onClick={ToVideoView}
            />
        </div>
    );
}

export default VideosPage;