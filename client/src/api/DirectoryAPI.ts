import request, { Response } from 'superagent';
import { Directories, Directory } from '../directories/Directory';
import { Access } from './Access';
import { ErrorResponse } from './ErrorResponse';


const DirectoryAPI = (
    url: string,
    access: Access
) => ({
    get(
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
                            if (
                                error.status < 500 &&
                                !errorHandler?.(response as ErrorResponse)
                            ) {
                                console.error(error)
                            }
                            return;
                        }

                        received(new Directories(response.body));
                    })
        );
    },

    put(
        directory: Directory,
        success: (directory: Directory) => void,
        onerror: (error: any) => void
    ): void {
        access(
            (
                token: string,
                errorHandler?: (response: ErrorResponse) => boolean
            ) => {
                request.put(`${url}/directories/${directory.id}`)
                    .set('Accept', 'application/json')
                    .auth(token, { type: 'bearer' })
                    .send(directory)
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
                request.del(`${url}/directories/${id}`)
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

export default DirectoryAPI;