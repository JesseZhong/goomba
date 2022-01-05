import React from 'react';
import { useHistory } from 'react-router-dom';
import { History } from 'history';
import { Video, Videos } from './Video';
import VideoCard from './VideoCard';

export const ToVideoView = (
    video: Video,
    history?: History<History.PoorMansUnknown>
) => {
    history?.push(`/view/${video.id}`);
}

const VideoList = (props: {
    videos: Videos,
    onClick?: (
        video: Video,
        history?: History<History.PoorMansUnknown>
    ) => void,
    editable?: boolean,
    className?: string
}) => {
    const history = useHistory();
    const videos = [...props.videos.entries()];
    const onClick = props.onClick;

    return (
        <div
            className={'d-flex flex-wrap flex-row' + props.className}
        >
            {
                videos &&
                videos.map(
                    ([id, video]) =>
                        <div
                            key={id}
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