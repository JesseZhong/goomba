import ManagementActions from '../actions/ManagementActions';
import { Video, Videos } from '../models/Video';
import { PendingChanges } from '../models/PendingChanges';
import VideoCardEditor from './VideoCardEditor';
import './VideoCardEditorMultiSelectList.sass';

const VideoCardEditorMultiSelectList = (props: {
  videos: Videos | Video[];
  pendingChanges: PendingChanges;

  className?: string;
}) => {
  const {
    className,
    pendingChanges: { selectedDirectory, selectedVideos, unsavedVideos },
  } = props;

  const videos =
    props.videos instanceof Videos ? [...props.videos.values()] : props.videos;

  return (
    <div
      className={
        'video-card-editor-multi-select d-flex flex-wrap flex-row' +
        (className ? ` ${className}` : '')
      }
    >
      {videos &&
        videos.map((video: Video) => (
          <div key={video.id} className='video-section'>
            {selectedVideos?.has(video.id) && (
              <div className='selected-border' />
            )}
            <VideoCardEditor
              video={video}
              disableEdit={!!selectedDirectory}
              onClick={(video: Video) => {
                if (!!selectedDirectory) {
                  const id = video.id;

                  // Assign to new set to trigger rerender.
                  const newSelected = new Set(selectedVideos);

                  // Toggle: Remove if it already exists.
                  if (newSelected.has(id)) {
                    newSelected.delete(id);
                  } else {
                    newSelected.add(id);
                  }

                  ManagementActions.selectVideos(newSelected);
                }
              }}
              onEditChange={(edit: boolean) => {
                const id = video.id;

                const newUnsaved = new Set(unsavedVideos);

                if (edit) {
                  newUnsaved.add(id);
                } else if (newUnsaved.has(id)) {
                  newUnsaved.delete(id);
                }

                ManagementActions.setUnsavedVideos(newUnsaved);
              }}
            />
          </div>
        ))}
    </div>
  );
};

export default VideoCardEditorMultiSelectList;
