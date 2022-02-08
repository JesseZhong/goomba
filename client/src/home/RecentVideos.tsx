import React from 'react';
import VideosByDate from '../video-views/VideosByDate';
import { Videos } from '../videos/Video';


const RECENT_VIDS = 20;

const RecentVideos = (props: {
    videos: Videos
}) => {
    return (
        <div className='d-flex flex-column mt-3'>
            <h5 className='ms-2'>
                Recent
            </h5>
            <VideosByDate
                videos={props.videos}
                topToShow={RECENT_VIDS}
            />
        </div>
    );
}

export default RecentVideos;