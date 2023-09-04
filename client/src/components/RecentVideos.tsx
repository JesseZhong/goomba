import VideoListByDate from './VideoListByDate';
import { Videos } from '../models/video';

const RECENT_VIDS = 20;

const RecentVideos = (props: { videos: Videos }) => {
  return (
    <div className='d-flex flex-column mt-3'>
      <h5 className='ms-2'>Recent</h5>
      <VideoListByDate videos={props.videos} topToShow={RECENT_VIDS} />
    </div>
  );
};

export default RecentVideos;
