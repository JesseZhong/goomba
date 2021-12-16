import React from 'react';
import { Link } from 'react-router-dom';
import { Video } from './Video';
import MediaView from './MediaView';
import './VideoCard.sass';

const VideoCard = (props: {
    id: number,
    video: Video,
    className?: string
}) => {

    const video = props.video;

    return (
        <>
            <div
                className={
                    'video-card synth ' +
                    props.className
                }
            >
                <div className='overlay'>
                    <span className='ml-2 mt-2'>
                        {video.name}
                    </span>
                </div>
                <div>
                    <Link to={{
                        pathname: '/view',
                        state: props.id
                    }}>
                        <MediaView
                            video={video}
                            thumbnail
                        />
                    </Link>
                </div>
            </div>
        </>
    );
}

export default VideoCard;