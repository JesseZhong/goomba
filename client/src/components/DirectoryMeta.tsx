import { Directory } from '../models/directory';
import { Helmet } from 'react-helmet';

const DirectoryMeta = (props: { directory?: Directory }) => {
  const { directory: { avatar_url, name } = {} } = props;

  return (
    <Helmet>
      <meta property='og:image' content={avatar_url} />
      <meta property='og:description' content={name} />
    </Helmet>
  );
};

export default DirectoryMeta;
