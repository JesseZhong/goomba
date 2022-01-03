import React from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Video } from './Video';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './VideoView.sass';

interface VideoParam {
    id: string
}

const VideoView = (props: {
    getVideo: (
        id: string,
        received: (video: Video) => void,
        onerror: (error: any) => void
    ) => void,
    id?: string
}) => {
    const history = useHistory();
    const params = useParams<VideoParam>();

    // Make sure an ID was provided, or else 404.
    const id = props.id ?? params?.id;
    if (!id) {
        history.push('/not-found');
    }

    const [video, setVideo] = React.useState<Video | null>(null);

    props.getVideo(
        id,
        (video: Video) => {
            setVideo(video);
        },
        () => {
            // Video can't be found, kick to the 404.
            history.push('/not-found');
        }
    );
    
    const videoView = video
        ? (
            <div className='video-view' tabIndex={0}>
                <video controls autoPlay loop src={video.url} />
            </div>
        )
        : (
            <div>
                Loading...
            </div>
        );

    return (
        <div className='video-view' tabIndex={0}>
            <div className='navi d-flex justify-content-end p-2'>
                <Link to='/videos'>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </Link>
            </div>
            {videoView}
        </div>
    );
}

export default VideoView;