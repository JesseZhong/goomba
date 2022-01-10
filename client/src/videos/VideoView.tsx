import React from 'react';
import ReactHlsPlayer from 'react-hls-player';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Video } from './Video';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import VideoActions from '../actions/VideoActions';
import './VideoView.sass';

interface VideoParam {
    id: string
}

const VideoView = (props: {
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

    React.useEffect(() => {
            VideoActions.getStream(
                id,
                (video: Video) => {
                    setVideo(video);
                },
                () => {
                    // Video can't be found, kick to the 404.
                    history.push('/not-found');
                }
            );
        },
        [id, history]
    );

    const playerRef = React.createRef<HTMLVideoElement>();
    
    const videoView = video?.stream_url
        ? (
            <div className='video-view d-flex flex-column' tabIndex={0}>
                <ReactHlsPlayer
                    playerRef={playerRef}
                    src={video.stream_url}
                    autoPlay={true}
                    controls={true}
                    width='100%'
                    height='auto'
                />
                <div className='info'>
                    <h3>{video.name}</h3>
                    {
                        video.date_aired &&
                        <span>
                            {'Aired' + Date.parse(video.date_aired).toLocaleString()}
                        </span>
                    }
                    {
                        video.member &&
                        <span>
                            Member
                        </span>
                    }
                </div>
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