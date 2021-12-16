import React from 'react';
import { Video } from './Video';

const MediaView = (props: {
    video: Video,
    thumbnail?: boolean,
    className?: string
}) => {
    const video = props.video;

    switch(video.type) {
        case 'image':
            return (
                <img
                    src={video.fileURI}
                    alt={video.fileURI}
                    className={`${(props.thumbnail ? 'img-thumbnail' : '')} ` + props.className}
                />
            );
        case 'video/mp4':
        case 'video/webm':
            if (props.thumbnail) {
                return (
                    <img
                        src={video.thumbnailURI}
                        alt={video.thumbnailURI}
                        className={'img-thumbnail'}
                    />
                );
            }
            else {
                return (
                    <video controls autoPlay loop className={props.className} src={video.fileURI} />
                )
            }
        default:
            return null;
    }
}

export default MediaView;