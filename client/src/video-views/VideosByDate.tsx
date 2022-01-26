import React from 'react';
import VideoActions from '../actions/VideoActions';
import { Videos } from '../videos/Video';
import VideoList from '../videos/VideoList';
import orderBy from 'lodash/orderBy';


const VideosByDate = (props: {
    videos: Videos
}) => {

    React.useEffect(() => {
            VideoActions.getVideos();
        },
        []
    );

    const videos = orderBy(
        [...props.videos.values()],
        ['date_aired'],
        ['desc']
    );

    return (
        <div>
            <VideoList
                videos={videos}
            />
        </div>
    );
}

export default VideosByDate;