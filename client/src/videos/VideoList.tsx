import React from 'react';
import Infinite from 'react-infinite';
import { Videos } from './Video';
import VideoCard from './VideoCard';

const VideosPerRow = 6;
const Height = 400;

const VideoList = (props: {
    videos: Videos,
    className?: string
}) => {
    let videos = [];
    const listedItems = Array.from(props.videos.values());
    const length = listedItems.length;
    for (let i = 0; i < length; i += VideosPerRow) {
        videos.push(listedItems.splice(i, VideosPerRow));
    }

    return (
        <div className={'d-flex flex-wrap ' + props.className}>
            <Infinite
                useWindowAsScrollContainer
                elementHeight={Height}
            >
            {
                videos &&
                videos.map(
                    (row, rowIndex) =>
                        <div
                            key={rowIndex}
                            className='d-flex flex-row justify-content-around'
                            style={{
                                minHeight: Height
                            }}
                        >
                        {
                            row.map(
                                (video, videoIndex) =>
                                    <VideoCard
                                        id={props.videos.getIndex(video) || 0}
                                        key={videoIndex}
                                        video={video}
                                    />
                            )
                        }
                        </div>
                )
            }
            </Infinite>
        </div>
    )
}

export default VideoList;