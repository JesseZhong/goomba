import React from 'react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import VideoActions from '../actions/VideoActions';
import { Videos } from '../videos/Video';
import VideoEdit from '../videos/VideoEdit';
import VideoList from '../videos/VideoList';

const ManagePage = (props: {
    videos: Videos
}) => {

    React.useEffect(() => {
            VideoActions.getVideos({
                show_hidden: true,
                show_keys: true
            });
        },
        []
    );

    const videos = props.videos;
    const [videoAdd, setVideoAdd] = React.useState(false);

    return (
        <div>
            <div className='d-flex flex-row justify-content-end'>
                <div className='align-self-center'>
                    <button
                        type='button'
                        className='btn btn-outline-white text-primary'
                        onClick={() => setVideoAdd(!videoAdd)}
                    >
                        <FontAwesomeIcon icon={faPlus} /> Video
                    </button>
                </div>
            </div>

            <div
                className='d-flex flex-column mt-5'
            >
                {
                    videoAdd &&
                    <VideoEdit
                        finished={() => setVideoAdd(false)}
                    />
                }
                <VideoList
                    videos={videos}
                    editable
                    disableClick
                />
            </div>
        </div>
    )
}

export default ManagePage;