import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import DirectoryActions from '../actions/DirectoryActions';
import VideoActions from '../actions/VideoActions';
import { Directories } from '../directories/directory';
import DirectoryNav from '../directories/DirectoryNav';

const Home = (props: { directories: Directories }) => {
  const { dirName } = useParams();

  React.useEffect(() => {
    DirectoryActions.get();
    VideoActions.getVideos();
  }, []);

  return (
    <div className='d-flex flex-column'>
      <DirectoryNav
        directories={props.directories}
        directoryName={dirName}
        className='mb-4'
      />
      <Outlet />
    </div>
  );
};

export default Home;
