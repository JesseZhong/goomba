import { Video } from './Video';
import { Helmet } from 'react-helmet';

const VideoMeta = (props: { video?: Video }) => {
  const video = props.video;

  return (
    <Helmet>
      <meta property='og:image' content={video?.thumbnail_url} />
      <meta property='og:description' content={video?.name} />
    </Helmet>
  );
};

export default VideoMeta;
