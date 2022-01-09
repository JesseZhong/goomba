import { faPhotoVideo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Video } from './Video';
import './VideoCard.sass';

const VideoCard = (props: {
    video: Video,
    className?: string
}) => {

    const video = props.video;

    return (
        <>
            <div
                className={
                    'video-card m-2 ' +
                    (props.className ?? '' )
                }
            >
                <div className='overlay'>
                    <span className='ml-2 mt-2'>
                        {video.name}
                    </span>
                </div>
                <div className='d-flex flex-row'>
                    <div>
                        {
                            video.thumbnail_key
                            ? <img
                                className='img-fluid rounded-start'
                                src={video.thumbnail_url}
                                alt={video.name}
                            />
                            : <FontAwesomeIcon
                                icon={faPhotoVideo}
                                size='3x'
                            />
                        }
                    </div>
                    <div className='m-3'>
                        <span className='title'>
                            {video.name}
                        </span>
                        <p>
                            Placeholder text.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default VideoCard;