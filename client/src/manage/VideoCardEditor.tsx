import React from 'react';
import { Video } from '../videos/Video';
import VideoCard from '../videos/VideoCard';
import VideoEdit from '../videos/VideoEdit';
import ManageButtons from '../common/ManageButtons';


const VideoCardEditor = (props: {
  video: Video,
  onClick?: (video: Video) => void,
  disableEdit?: boolean,
  className?: string
}) => {
  const video = props.video;
  const [edit, setEdit] = React.useState(false);

  const wrap = React.createRef<HTMLDivElement>();

  return (
    <div
      ref={wrap}
      className={props.className}
      style={{
        position: 'relative'
      }}
      onClick={() => props.onClick?.(video)}
    >
      {
        edit
        ? <VideoEdit
          video={video}
          finished={() => setEdit(false)}
          className='my-3'
        />
        : <>
          {
            !props.disableEdit &&
            <ManageButtons
              owner={wrap}
              onEditClick={() => setEdit(true)}
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