import React from 'react';
import { Videos } from '../models/Video';
import { Directories } from '../models/Directory';
import { PendingChanges } from '../models/PendingChanges';
import VideoActions from '../actions/VideoActions';
import DirectoryActions from '../actions/DirectoryActions';
import DirectoryManagmentSection from './DirectoryManagmentSection';
import VideoManagementSection from './VideoManagementSection';

const ManagementPage = (props: {
  directories: Directories;
  videos: Videos;
  pendingChanges: PendingChanges;
}) => {
  React.useEffect(() => {
    DirectoryActions.get();
    VideoActions.getVideos({
      show_hidden: true,
      show_keys: true,
    });
  }, []);

  return (
    <div>
      <DirectoryManagmentSection
        directories={props.directories}
        pendingChanges={props.pendingChanges}
      />
      <VideoManagementSection
        videos={props.videos}
        pendingChanges={props.pendingChanges}
      />
    </div>
  );
};

export default ManagementPage;
