import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Videos } from './Video';
import VideoCard from './VideoCard';
import './VideoList.sass';

const VideoList = (props: { videos: Videos | Video[]; className?: string }) => {
  const navigate = useNavigate();
  const videos =
    props.videos instanceof Videos ? [...props.videos.values()] : props.videos;

  const className = props.className;

  return (
    <div
      className={
        'video-list d-flex flex-wrap flex-row' +
        (className ? ` ${className}` : '')
      }
    >
      {videos &&
        videos.map((video: Video) => (
          <div
            key={video.id}
            className='d-flex flex-row justify-content-around'
            onClick={() => navigate(`/watch/${video.id}`)}
          >
            <VideoCard video={video} />
          </div>
        ))}
    </div>
  );
};

export default VideoList;
