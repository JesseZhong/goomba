import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Videos } from './Video';
import MediaView from './MediaView';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import './VideoView.sass';

const VideoView = (props: {
    id: number,
    videos: Videos
}) => {
    
    window.scrollTo(0, 0);

    const scrollRate = 120;
    const len = props.videos.len();
    const [id, setId] = useState(props.id);
    const [full, setFull] = useState(true);

    const handleKeys = (keyEvent: React.KeyboardEvent<HTMLDivElement>) => {
        if (!len) {
            return;
        }

        if (keyEvent.key === 'd') {
            const nextId = id + 1;
            setId(nextId >= len ? 0 : nextId);
        }

        else if (keyEvent.key === 'a') {
            const prevId = id - 1;
            setId(prevId < 0 ? len - 1 : prevId)
        }

        else if (keyEvent.key === 'w') {
            window.scrollBy(0, -scrollRate);
        }

        else if (keyEvent.key === 's') {
            window.scrollBy(0, scrollRate);
        }

        else if (keyEvent.key === 'e') {
            setFull(!full);
        }
    };

    const video = props.videos.getVideo(id);
    if (!video) {
        return (<></>);
    }

    return (
        <div className='video-view' tabIndex={0} onKeyDown={handleKeys}>
            <div className='navi d-flex justify-content-end p-2 '>
                <Link to='/videos'>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </Link>
            </div>
            {video && <MediaView video={video} className={(full ? 'full' : 'fit')}/>}
        </div>
    );
}

export default VideoView;