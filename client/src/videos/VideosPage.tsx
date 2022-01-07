import React from 'react';
import VideoActions from '../actions/VideoActions';
import { Videos } from './Video';
import VideoList, { ToVideoView } from './VideoList';

const VideosPage = (props: {
    videos: Videos
}) => {
    const videos = props.videos;

    const [loading, setLoading] = React.useState(false);
    if (!loading) {
        setLoading(true);
        VideoActions.getVideos();
    }

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