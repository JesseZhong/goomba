import request, { Response } from 'superagent';
import { Video, Videos } from '../videos/Video';
import { Access } from './Access';
import { ErrorResponse } from './ErrorResponse';

const VideoAPI = (
    url: string,
    access: Access
) => ({

    getStream(
        id: string,
        received: (video: Video) => void,
        onerror: (error: any) => void
    ): void {
        access(
            (
                token: string,
                errorHandler?: (response: ErrorResponse) => boolean
            ) =>
                request.get(`${url}/videos/${id}/stream`)
                    .set('Accept', 'application/json')
                    .auth(token, { type: 'bearer' })
                    .end((error: any, response: Response) => {
                        if (error) {
                            if (
                                error.status < 500 &&
                                !errorHandler?.(response as ErrorResponse)
                            ) {
                                console.error(error)
                            }
                            onerror(error);
                            return;
                        }

                        received(response.body);
                    })
        );
    },

    getDownload(
        id: string,
        received: (video: Video) => void,
        onerror: (error: any) => void
    ): void {
        access(
            (
                token: string,
                errorHandler?: (response: ErrorResponse) => boolean
            ) =>
                request.get(`${url}/videos/${id}/download`)
                    .set('Accept', 'application/json')
                    .auth(token, { type: 'bearer' })
                    .end((error: any, response: Response) => {
                        if (error) {
                            if (
                                error.status < 500 &&
                                !errorHandler?.(response as ErrorResponse)
                            ) {
                                console.error(error)
                            }
                            onerror(error);
                            return;
                        }

                        received(response.body);
                    })
        );
    },

    getVideos(
        received: (videos: Videos) => void,
        show_hidden: boolean = false,
        directory_id?: string,
        tags?: string[]
    ): void {
        access(
            (
                token: string,
                errorHandler?: (response: ErrorResponse) => boolean
            ) => {
                let queries: string[] = []
                if (show_hidden) {
                    queries.push('show_hidden=true');
                }

                if (directory_id) {
                    queries.push(`directory=${directory_id}`);
                }

                if (tags) {
                    queries.push(`tags=[${tags.join(',')}]`);
                }

                request.get(`${url}/videos${queries ? `?${queries.join('&')}` : ''}`)
                    .set('Accept', 'application/json')
                    .auth(token, { type: 'bearer' })
                    .end((error: any, response: Response) => {
                        if (error) {
                            if (
                                error.status < 500 &&
                                !errorHandler?.(response as ErrorResponse)
                            ) {
                                console.error(error)
                            }
                            return;
                        }

                        received(new Videos(response.body));
                    });
            }
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
                            if (
                                error.status < 500 &&
                                !errorHandler?.(response as ErrorResponse)
                            ) {
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
                            if (
                                error.status < 500 &&
                                !errorHandler?.(response as ErrorResponse)
                            ) {
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