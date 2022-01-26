import React from 'react';
import { useHistory, useParams } from 'react-router';
import { Video } from '../videos/Video';
import VideoMeta from '../videos/VideoMeta';
import VideoMetaAPI from './VideoMetaAPI';


interface VideoParam {
    id: string
}

const VideoPreview = (props: {
    api_url: string
}) => {
    const history = useHistory();
    const params = useParams<VideoParam>();

    // Make sure an ID was provided, or else 404.
    const id = params?.id;
    if (!id) {
        history.push('/denied');
    }

    const [video, setVideo] = React.useState<Video | undefined>(undefined);

    React.useEffect(() => {

            VideoMetaAPI(props.api_url).get(
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