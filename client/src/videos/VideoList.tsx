import './VideoList.sass';
import { useNavigate } from 'react-router-dom';
import { Video, Videos } from './Video';
import VideoCard from './VideoCard';

const VideoList = (props: { videos: Videos | Video[]; className?: string }) => {
  const { videos, className } = props;

  const navigate = useNavigate();

  const flatVideos = Array.isArray(videos)
    ? videos
    : [...props.videos.values()];

  return (
    <div
      className={
        'video-list d-flex flex-wrap flex-row' +
        (className ? ` ${className}` : '')
      }
    >
      {flatVideos &&
        flatVideos.map((video: Video) => (
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
