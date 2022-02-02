import React from 'react';
import { useHistory } from 'react-router-dom';
import { History } from 'history';
import { Video, Videos } from './Video';
import VideoCard from './VideoCard';
import './VideoList.sass';


const ToVideoPlayer = (
    video: Video,
    history?: History<unknown>
) => {
    history?.push(`/watch/${video.id}`);
}

const VideoList = (props: {
    videos: Videos | Video[],
    onClick?: (
        video: Video,
        history?: History<unknown>
    ) => void,
    disableClick?: boolean,
    editable?: boolean,
    className?: string
}) => {
    const history = useHistory();
    const videos = props.videos instanceof Videos
        ? [...props.videos.values()]
        : props.videos;
        
    const onClick = props.disableClick
        ? undefined
        : (props.onClick ?? ToVideoPlayer);

    const className = props.className;

    return (
        <div
            className={
                'video-list d-flex flex-wrap flex-row' +
                (className ? ` ${className}` : '')
            }
        >
            {
                videos &&
                videos.map(
                    (video: Video) =>
                        <div
                            key={video.id}
                            className={
                                'd-flex flex-row justify-content-around'
                                + (onClick ? ' clickable' : '')
                            }
                            onClick={() => onClick?.(video, history)}
                        >
                            <VideoCard video={video} />
                        </div>
                )
            }
        </div>
    )
}

export default VideoList;