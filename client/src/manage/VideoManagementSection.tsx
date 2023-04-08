import React from 'react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Videos } from '../videos/Video';
import { PendingChanges } from './PendingChanges';
import ManagementActions from '../actions/ManagementActions';
import VideoEdit from '../videos/VideoEdit';
import VideoCardEditorMultiSelectList from './VideoCardEditorMultiSelectList';
import orderBy from 'lodash/orderBy';


const NEW_VIDEO_ID = 'NEW_VIDEO_ID_FRFR';

const VideoManagementSection = (props: {
  videos: Videos,
  pendingChanges: PendingChanges
}) => {
  const videos = orderBy(
    [...props.videos.values()],
    ['date_added'],
    ['desc']
  );
  const { unsavedVideos } = props.pendingChanges;

  const [videoAdd, setVideoAdd] = React.useState(false);
  const changeVideoAdd = (value: boolean) => {
    setVideoAdd(value);

    const newUnsavedVideos = new Set(unsavedVideos);
    if (value) {
      newUnsavedVideos.add(NEW_VIDEO_ID);
    } else if(newUnsavedVideos.has(NEW_VIDEO_ID)) {
      newUnsavedVideos.delete(NEW_VIDEO_ID);
    }

    ManagementActions.setUnsavedVideos(newUnsavedVideos);
  }

  return (
    <>
      <div className='d-flex flex-row justify-content-end'>
        <div className='align-self-center'>
          <button
            type='button'
            className='btn btn-outline-white text-primary'
            onClick={() => changeVideoAdd(!videoAdd)}
          >
            <FontAwesomeIcon icon={faPlus} /> Video
          </button>
        </div>
      </div>

      <div
        className='d-flex flex-column'
      >
        {
          videoAdd &&
          <VideoEdit
            finished={() => changeVideoAdd(false)}
          />
        }
        <VideoCardEditorMultiSelectList
          videos={videos}
          pendingChanges={props.pendingChanges}
        />
      </div>
    </>
  );
}

export default VideoManagementSection;