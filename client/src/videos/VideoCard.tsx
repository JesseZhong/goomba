import React from 'react';
import { faPhotoVideo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Video } from './video';
import VideoInfo from './VideoInfo';
import './VideoCard.sass';

const VideoCard = (props: { video: Video; className?: string }) => {
  const video = props.video;

  return (
    <>
      <div
        className={'video-card d-flex flex-row m-2 ' + (props.className ?? '')}
      >
        <div className='thumbnail'>
          {video.thumbnail_url ? (
            <img
              className='img-fluid rounded-start'
              src={video.thumbnail_url}
              alt={video.name}
            />
          ) : (
            <div className='thumbholder'>
              <FontAwesomeIcon icon={faPhotoVideo} size='4x' />
            </div>
          )}
        </div>
        <div className='d-flex flex-column m-3'>
          <span className='title mb-1'>{video.name}</span>
          <VideoInfo video={video} />
        </div>
      </div>
    </>
  );
};

export default VideoCard;
