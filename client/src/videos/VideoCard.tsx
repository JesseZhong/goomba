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
                    'video-card ' +
                    (props.className ?? '' )
                }
            >
                <div className='overlay'>
                    <span className='ml-2 mt-2'>
                        {video.name}
                    </span>
                </div>
                <div className='d-flex flex-row'>
                    <div className='me-4'>
                        {
                            video.thumbnail
                            ? <img
                                className='img-fluid rounded-start'
                                src={video.thumbnail}
                                alt={video.name}
                            />
                            : <FontAwesomeIcon
                                icon={faPhotoVideo}
                                size='3x'
                            />
                        }
                    </div>
                    <div>
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