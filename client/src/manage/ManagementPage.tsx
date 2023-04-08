import React from 'react';
import DirectoryActions from '../actions/DirectoryActions';
import VideoActions from '../actions/VideoActions';
import { Directories } from '../directories/Directory';
import { Videos } from '../videos/Video';
import DirectoryManagmentSection from './DirectoryManagmentSection';
import VideoManagementSection from './VideoManagementSection';
import { DirectoryEditPending } from './DirectoryEditPending';

const ManagementPage = (props: {
  directories: Directories,
  videos: Videos,
  pendingDirectoryEdit: DirectoryEditPending
}) => {
  React.useEffect(() => {
      DirectoryActions.get();
      VideoActions.getVideos({
        show_hidden: true,
        show_keys: true
      });
    },
    []
  );

  return (
    <div>
      <DirectoryManagmentSection
        directories={props.directories}
        pendingDirectoryEdit={props.pendingDirectoryEdit}
      />  
      <VideoManagementSection
        videos={props.videos}
        pendingDirectoryEdit={props.pendingDirectoryEdit}
      />
    </div>
  );
}

export default ManagementPage;