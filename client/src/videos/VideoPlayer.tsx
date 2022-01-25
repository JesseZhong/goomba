import React from 'react';
import ReactHlsPlayer from 'react-hls-player';
import { useHistory, useParams } from 'react-router-dom';
import { Video } from './Video';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import VideoActions from '../actions/VideoActions';
import VideoInfo from './VideoInfo';
import './VideoPlayer.sass';


interface VideoParam {
    id: string
}

const VideoPlayer = (props: {
    id?: string
}) => {
    const history = useHistory();
    const params = useParams<VideoParam>();

    const playerRef = React.createRef<HTMLVideoElement>();

    // Make sure an ID was provided, or else 404.
    const id = props.id ?? params?.id;
    if (!id) {
        history.push('/not-found');
    }

    const existingTimes = VideoActions.getTimes();
    const startTime = (existingTimes && id in existingTimes)
        ? existingTimes[id]
        : -1;

    const [video, setVideo] = React.useState<Video | undefined>(undefined);

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

    // Records the current video time, and save into local storage.
    const saveTime = (
        e: React.SyntheticEvent<HTMLVideoElement>
    ) => {
        const player = e.currentTarget;

        if (player) {
            const currentTime = player.currentTime;
            
            const times = VideoActions.getTimes();
            if (times) {
                times[id] = currentTime;
                VideoActions.setTimes(times);
            }
        }
    };

    // Removes the video time from local storage.
    const resetTime = () => {
        const times = VideoActions.getTimes();
        if (times && id in times) {
            delete times[id];
            VideoActions.setTimes(times);
        }
    }
    
    const videoPlayer = video?.stream_url
        ? (
            <div className='video-player d-flex flex-column' tabIndex={0}>
                <ReactHlsPlayer
                    playerRef={playerRef}
                    src={video.stream_url}
                    autoPlay={true}
                    controls={true}
                    width='100%'
                    height='auto'
                    hlsConfig={{
                        'startPosition': startTime
                    }}
                    onTimeUpdate={saveTime}
                    onSeeked={saveTime}
                    onEnded={resetTime}
                />
                <div className='info mt-2'>
                    <h3>{video.name}</h3>
                    <VideoInfo
                        className='ms-3'
                        video={video}
                    />
                </div>
            </div>
        )
        : (
            <div>
                Loading...
            </div>
        );

    return (
        <>
            <div className='video-player' tabIndex={0}>
                <div className='navi d-flex justify-content-end p-2'>
                    <FontAwesomeIcon
                        icon={faArrowLeft}
                        onClick={() => history.goBack()}
                    />
                </div>
                {videoPlayer}
            </div>
        </>
    );
}

export default VideoPlayer;