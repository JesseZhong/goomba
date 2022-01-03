import request, { Response } from 'superagent';
import { Directories } from '../videos/Directory';
import { Video, Videos } from '../videos/Video';
import { Access } from './Access';
import { ErrorResponse } from './ErrorResponse';

function reduce(
    url: string,
    response: Response,
    received: (videos: Videos) => void
): void {
    if (response) {
        let results = new Videos(response.body);
        results.forEach(video => {
            video.url = `${url}${video.url}`;
            video.thumbnail = `${url}${video.thumbnail}`;
        });

        received(results);
    }
}

const VideoAPI = (
    url: string,
    access: Access
) => ({

    get(
        id: string,
        received: (video: Video) => void,
        onerror: (error: any) => void
    ): void {
        access(
            (
                token: string,
                errorHandler?: (response: ErrorResponse) => boolean
            ) =>
                request.get(`${url}/videos/${id}`)
                    .set('Accept', 'application/json')
                    .auth(token, { type: 'bearer' })
                    .end((error: any, response: Response) => {
                        if (error) {
                            if (!errorHandler?.(response as ErrorResponse)) {
                                console.error(error)
                            }

                            onerror(error);
                            return;
                        }

                        received(response.body);
                    })
        );
    },

    getAll(
        received: (videos: Videos) => void
    ): void {
        access(
            (
                token: string,
                errorHandler?: (response: ErrorResponse) => boolean
            ) =>
                request.get(`${url}/videos`)
                    .set('Accept', 'application/json')
                    .auth(token, { type: 'bearer' })
                    .end((error: any, response: Response) => {
                        if (error) {
                            if (!errorHandler?.(response as ErrorResponse)) {
                                console.error(error)
                            }
                            return;
                        }

                        reduce(
                            url,
                            response,
                            received
                        );
                    })
        );
    },

    getByTags(
        tags: string[],
        received: (videos: Videos) => void
    ): void {
        access(
            (
                token: string,
                errorHandler?: (response: ErrorResponse) => boolean
            ) =>
                request.get(`${url}/videos?tags=[${tags.join(',')}]`)
                    .set('Accept', 'application/json')
                    .auth(token, { type: 'bearer' })
                    .end((error: any, response: Response) => {
                        if (error) {
                            if (!errorHandler?.(response as ErrorResponse)) {
                                console.error(error)
                            }
                            return;
                        }

                        reduce(
                            url,
                            response,
                            received
                        );
                    })
        );
    },

    getDirectories(
        received: (directories: Directories) => void
    ): void {
        access(
            (
                token: string,
                errorHandler?: (response: ErrorResponse) => boolean
            ) =>
                request.get(`${url}/directories`)
                    .set('Accept', 'application/json')
                    .auth(token, { type: 'bearer' })
                    .end((error: any, response: Response) => {
                        if (error) {
                            if (!errorHandler?.(response as ErrorResponse)) {
                                console.error(error)
                            }
                            return;
                        }

                        const results = new Directories(response?.body);
                        received(results);
                    })
        );
    },

    getTags(
        received: (tags: string[]) => void
    ): void {
        access(
            (
                token: string,
                errorHandler?: (response: ErrorResponse) => boolean
            ) =>
                request.get(`${url}/tags`)
                    .set('Accept', 'application/json')
                    .auth(token, { type: 'bearer' })
                    .end((error: any, response: Response) => {
                        if (error) {
                            if (!errorHandler?.(response as ErrorResponse)) {
                                console.error(error)
                            }
                            return;
                        }

                        const results = response?.body as string[];
                        received(results);
                    })
        );
    }
});

export default VideoAPI;