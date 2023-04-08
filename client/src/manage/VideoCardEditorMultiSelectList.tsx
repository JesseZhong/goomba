import { Video, Videos } from '../videos/Video';
import VideoCardEditor from './VideoCardEditor';
import './VideoCardEditorMultiSelectList.sass';


const VideoCardEditorMultiSelectList = (props: {
  videos: Videos | Video[],
  disableEdit?: boolean,
  selected?: Set<string>,
  onSelected?: (videos: Set<string>) => void,
  className?: string
}) => {
  const videos = props.videos instanceof Videos
    ? [...props.videos.values()]
    : props.videos;

  const {
    selected,
    onSelected,
    className
  } = props;

  return (
    <div
      className={
        'video-card-editor-multi-select d-flex flex-wrap flex-row' +
        (className ? ` ${className}` : '')
      }
    >
      {
        videos &&
        videos.map(
          (video: Video) =>
            <div
              key={video.id}
              className='video-section'
            >
              {
                selected?.has(video.id) &&
                <div className='selected-border' />
              }
              <VideoCardEditor
                video={video}
                disableEdit={props.disableEdit}
                onClick={(
                  video: Video
                ) => {
                  const id = video.id;

                  // Assign to new set to trigger rerender.
                  const newSelected = new Set(selected);

                  // Toggle: Remove if it already exists.
                  if (newSelected?.has(id)) {
                    newSelected.delete(id);
                  }
                  else {
                    newSelected.add(id);
                  }

                  onSelected?.(newSelected);
                }}
              />
            </div>
        )
      }
    </div>
  );
}

export default VideoCardEditorMultiSelectList;