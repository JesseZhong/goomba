import React from 'react';
import VideoActions from '../actions/VideoActions';
import { Videos } from '../videos/Video';
import VideoList from '../videos/VideoList';
import orderBy from 'lodash/orderBy';


const VideosByDate = (props: {
    videos: Videos,
    topToShow?: number
}) => {

    React.useEffect(() => {
            VideoActions.getVideos();
        },
        []
    );

    const orderedVideos = orderBy(
        [...props.videos.values()],
        ['date_aired'],
        ['desc']
    );

    const topToShow = props.topToShow;
    const videos = topToShow
        ? orderedVideos.splice(0, topToShow)
        : orderedVideos;

    return (
        <div>
            <VideoList
                videos={videos}
            />
        </div>
    );
}

export default VideosByDate;