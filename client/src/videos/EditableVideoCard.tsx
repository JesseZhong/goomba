import React from 'react';
import { Video } from './Video';
import VideoCard from './VideoCard';
import VideoEdit from './VideoEdit';

const EditableVideoCard = (props: {
    video: Video,
    className?: string
}) => {
    const video = props.video;
    const [edit, setEdit] = React.useState(false);

    return (
        <div className={props.className}>
            {
                edit
                ? <VideoEdit video={video} />
                : <VideoCard video={video} />
            }
        </div>
    );
}

export default EditableVideoCard;