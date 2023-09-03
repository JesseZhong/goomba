import React from 'react';
import VideoActions from '../actions/VideoActions';
import { Video, Videos } from './video';
import VideoList from './VideoList';
import orderBy from 'lodash/orderBy';

const VideoListByDate = (props: {
  videos: Videos | Video[];
  topToShow?: number;
}) => {
  React.useEffect(() => {
    VideoActions.getVideos();
  }, []);

  const videoList =
    props.videos instanceof Videos ? [...props.videos.values()] : props.videos;

  const orderedVideos = orderBy(videoList, ['date_aired'], ['desc']);

  const topToShow = props.topToShow;
  const videos = topToShow ? orderedVideos.splice(0, topToShow) : orderedVideos;

  return (
    <div>
      <VideoList videos={videos} />
    </div>
  );
};

export default VideoListByDate;
