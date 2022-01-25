import React from 'react';
import { useHistory, useParams } from 'react-router';
import { Video } from './Video';
import VideoMetaActions from '../actions/VideoMetaActions';
import VideoMeta from './VideoMeta';


interface VideoParam {
    id: string
}

const VideoPreview = () => {
    const history = useHistory();
    const params = useParams<VideoParam>();

    // Make sure an ID was provided, or else 404.
    const id = params?.id;
    if (!id) {
        history.push('/denied');
    }

    const [video, setVideo] = React.useState<Video | undefined>(undefined);

    React.useEffect(() => {
            VideoMetaActions.get(
                id,
                (video: Video) => {
                    setVideo(video);
                },
                () => {
                    // Video can't be found, kick to the 404.
                    history.push('/denied');
                }
            );
        },
        [id, history]
    );

    return (
        <VideoMeta video={video} />
    );
}

export default VideoPreview;