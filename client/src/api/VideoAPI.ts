import request, { Response } from 'superagent';
import { Videos } from '../videos/Video';

function reduce(
    url: string,
    response: Response,
    received: (videos: Videos) => void
): void {
    if (response) {
        let results = new Videos(response.body);
        results.forEach(video => {
            video.fileURI = `${url}${video.fileURI}`;
            video.thumbnailURI = `${url}${video.thumbnailURI}`;
        });

        received(results);
    }
}

const VideoAPI = (
    url: string
) => ({
    get(
        received: (videos: Videos) => void
    ): void {
        request.get(`${url}`)
            .set('Accept', 'application/json')
            .end((error: any, response: Response) => {
                if (error) {
                    return console.error(error);
                }

                reduce(
                    url,
                    response,
                    received
                );
            });
    },

    getTaggedVideos(
        tag: string,
        received: (videos: Videos) => void
    ): void {
        request.get(`${url}/tags/${tag}/files`)
            .set('Accept', 'application/json')
            .end((error: any, response: Response) => {
                if (error) {
                    return console.error(error);
                }

                reduce(
                    url,
                    response,
                    received
                );
            });
    }
});

export default VideoAPI;