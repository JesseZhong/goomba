import { faDownload, faPhotoVideo, faStar } from '@fortawesome/free-solid-svg-icons';
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
                <div className='thumbnail'>
                    {
                        video.thumbnail_key
                        ? <img
                            className='img-fluid rounded-start'
                            src={video.thumbnail_url}
                            alt={video.name}
                        />
                        : 
                        <div className='thumbholder'>
                            <FontAwesomeIcon
                                icon={faPhotoVideo}
                                size='4x'
                            />
                        </div>
                    }
                </div>
                <div className='d-flex flex-column m-3'>
                    <span className='title mb-1'>
                        {video.name}
                    </span>
                    <div className='info d-flex flex-column justify-content-between'>
                        {
                            video.date_aired &&
                            <span>
                                {'Aired' + Date.parse(video.date_aired).toLocaleString()}
                            </span>
                        }
                        {
                            video.member &&
                            <span className='mt-2'>
                                <FontAwesomeIcon
                                    icon={faStar}
                                    className='icon'
                                />
                                <span className='ms-2'>
                                    Membership Stream
                                </span>
                            </span>
                        }
                        {
                            video.download_available &&
                            <span className='mt-2'>
                                <FontAwesomeIcon
                                    icon={faDownload}
                                    className='icon'
                                />
                                <span className='ms-2'>
                                    Download Available
                                </span>
                            </span>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

export default VideoCard;