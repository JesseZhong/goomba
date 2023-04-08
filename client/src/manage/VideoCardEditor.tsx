import React from 'react';
import { Video } from '../videos/Video';
import VideoCard from '../videos/VideoCard';
import VideoEdit from '../videos/VideoEdit';
import ManageButtons from '../common/ManageButtons';


const VideoCardEditor = (props: {
  video: Video,
  onClick?: (video: Video) => void,
  onEditChange?: (editing: boolean) => void,
  disableEdit?: boolean,
  className?: string
}) => {
  const {
    video,
    onClick, 
    onEditChange,
    disableEdit,
    className
  } = props;

  const [edit, setEdit] = React.useState(false);
  const changeEdit = (value: boolean) => {
    setEdit(value);
    onEditChange?.(value);
  }

  const wrap = React.createRef<HTMLDivElement>();

  return (
    <div
      ref={wrap}
      className={className}
      style={{
        position: 'relative'
      }}
      onClick={() => onClick?.(video)}
    >
      {
        edit
        ? <VideoEdit
          video={video}
          finished={() => changeEdit(false)}
          className='my-3'
        />
        : <>
          {
            !disableEdit &&
            <ManageButtons
              owner={wrap}
              onEditClick={() => changeEdit(true)}
              onRemoveConfirm={() => {}}  // TODO: Remove
              overlay
            />
          }
          <VideoCard video={video} />
        </>
      }
    </div>
  );
}

export default VideoCardEditor;