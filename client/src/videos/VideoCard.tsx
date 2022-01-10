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
                    'video-card d-flex flex-row m-2 ' +
                    (props.className ?? '' )
                }
            >
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
                <div className='d-flex flex-column m-3'>
                    <span className='title'>
                        {video.name}
                    </span>
                    <div className='info flex-column'>
                        {
                            video.date_aired &&
                            <span>
                                {'Aired' + Date.parse(video.date_aired).toLocaleString()}
                            </span>
                        }
                        {
                            video.member &&
                            <span>
                                Member
                            </span>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

export default VideoCard;