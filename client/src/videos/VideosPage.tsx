import React from 'react';
import { Videos } from './Video';
import VideoList from './VideoList';

const VideosPage = (props: {
    videos: Videos
}) => (
    <div>
        <VideoList
            videos={props.videos}
        />
    </div>
)

export default VideosPage;