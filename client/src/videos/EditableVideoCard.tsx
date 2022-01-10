import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import HoverButtonGroup from '../common/HoverButtonGroup';
import { Video } from './Video';
import VideoCard from './VideoCard';
import VideoEdit from './VideoEdit';


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
                    <HoverButtonGroup
                        owner={wrap}
                    >
                        <button
                            type='button'
                            onClick={() => setEdit(true)}
                        >
                            <FontAwesomeIcon icon={faEdit} />
                        </button>
                    </HoverButtonGroup>
                    <VideoCard video={video} />
                </>
            }
        </div>
    );
}

export default EditableVideoCard;