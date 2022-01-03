import React from 'react';
import { Link } from 'react-router-dom';
import { Video } from './Video';
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
                        {
                            video.thumbnail &&
                            <img
                                src={video.thumbnail}
                                alt={video.name}
                            />
                        }
                    </Link>
                </div>
            </div>
        </>
    );
}

export default VideoCard;