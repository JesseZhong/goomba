import { Video } from '../models/Video';
import { faClock, faDownload, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './VideoInfo.sass';

const VideoInfo = (props: { video: Video; className?: string }) => {
  const video = props.video;
  const className = props.className;

  return (
    <div
      className={
        'video-info d-flex flex-column justify-content-between' +
        (className ? ` ${className}` : '')
      }
    >
      {video.date_aired && (
        <span className='mt-2 info-line'>
          <FontAwesomeIcon icon={faClock} className='icon airtime' />
          <span className='ms-2'>
            {new Date(video.date_aired).toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            })}
          </span>
        </span>
      )}
      {video.member && (
        <span className='mt-2 info-line'>
          <FontAwesomeIcon icon={faStar} className='icon member' />
          <span className='ms-2'>Membership Stream</span>
        </span>
      )}
      {video.download_available && (
        <span className='mt-2 info-line'>
          <FontAwesomeIcon icon={faDownload} className='icon download' />
          <span className='ms-2'>Download Available</span>
        </span>
      )}
    </div>
  );
};

export default VideoInfo;
