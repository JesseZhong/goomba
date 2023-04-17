import { Video } from './Video';
import { Helmet } from 'react-helmet';

const VideoMeta = (props: { video?: Video }) => {
  const { video: { thumbnail_url, name } = {} } = props;

  return (
    <Helmet>
      <meta property='og:image' content={thumbnail_url} />
      <meta property='og:description' content={name} />
    </Helmet>
  );
};

export default VideoMeta;
