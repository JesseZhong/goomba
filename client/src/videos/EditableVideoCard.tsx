import React from 'react';
import { Video } from './Video';
import VideoCard from './VideoCard';
import VideoEdit from './VideoEdit';
import ManageButtons from '../common/ManageButtons';


const EditableVideoCard = (props: {
    video: Video,
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
        >
            {
                edit
                ? <VideoEdit
                    video={video}
                    finished={() => setEdit(false)}
                    className='my-3'
                />
                : <>
                    <ManageButtons
                        owner={wrap}
                        onEditClick={() => setEdit(true)}
                        onRemoveConfirm={() => {}}
                        overlay
                    />
                    <VideoCard video={video} />
                </>
            }
        </div>
    );
}

export default EditableVideoCard;