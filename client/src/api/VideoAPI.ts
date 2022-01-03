import request, { Response } from 'superagent';
import { Video, Videos } from '../videos/Video';
import { Access } from './Access';
import { ErrorResponse } from './ErrorResponse';

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
        received: (videos: Videos) => void,
        admin: boolean = false
    ): void {
        access(
            (
                token: string,
                errorHandler?: (response: ErrorResponse) => boolean
            ) =>
                request.get(`${url}/videos${admin ? '/all' : ''}`)
                    .set('Accept', 'application/json')
                    .auth(token, { type: 'bearer' })
                    .end((error: any, response: Response) => {
                        if (error) {
                            if (!errorHandler?.(response as ErrorResponse)) {
                                console.error(error)
                            }
                            return;
                        }

                        received(new Videos(response.body));
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

                        received(new Videos(response.body));
                    })
        );
    },

    getByDirectory(
        directory_id: string,
        received: (videos: Videos) => void
    ): void {
        access(
            (
                token: string,
                errorHandler?: (response: ErrorResponse) => boolean
            ) =>
                request.get(`${url}/videos?directory=${directory_id}`)
                    .set('Accept', 'application/json')
                    .auth(token, { type: 'bearer' })
                    .end((error: any, response: Response) => {
                        if (error) {
                            if (!errorHandler?.(response as ErrorResponse)) {
                                console.error(error)
                            }
                            return;
                        }

                        received(new Videos(response.body));
                    })
        );
    },

    put(
        video: Video,
        success: (video: Video) => void,
        onerror: (error: any) => void
    ): void {
        access(
            (
                token: string,
                errorHandler?: (response: ErrorResponse) => boolean
            ) => {
                request.put(`${url}/videos/${video.id}`)
                    .set('Accept', 'application/json')
                    .auth(token, { type: 'bearer' })
                    .send(video)
                    .end((error: any, response: Response) => {
                        if (error) {
                            if (!errorHandler?.(response as ErrorResponse)) {
                                console.error(error)
                            }
                            onerror(error);
                            return;
                        }

                        if (response.status === 201) {
                            success(response.body);
                        }
                    })
            }
        );
    },

    remove(
        id: string,
        success: () => void,
        onerror: (error: any) => void
    ): void {
        access(
            (
                token: string,
                errorHandler?: (response: ErrorResponse) => boolean
            ) => {
                request.del(`${url}/videos/${id}`)
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

                        if (response.status === 204) {
                            success();
                        }
                    })
            }
        );
    }
});

export default VideoAPI;