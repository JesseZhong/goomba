import request, { Response } from 'superagent';
import { Video } from '../videos/Video';


const VideoMetaAPI = (
    url: string
) => ({
    get(
        id: string,
        received: (video: Video) => void,
        onerror: (error: any) => void
    ): void {
        // Does not require auth.
        request.get(`${url}/videos/${id}/meta`)
            .set('Accept', 'application/json')
            .end((error: any, response: Response) => {
                if (error) {
                    if (error.status < 500) {
                        console.error(error)
                    }
                    onerror(error);
                    return;
                }

                received(response.body);
            });
    }
});

export default VideoMetaAPI;