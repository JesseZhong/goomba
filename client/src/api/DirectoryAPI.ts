import request, { Response } from 'superagent';
import { Directories } from '../directories/Directory';
import { Access } from './Access';
import { ErrorResponse } from './ErrorResponse';


const DirectoryAPI = (
    url: string,
    access: Access
) => ({
    getTags(
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
    }
});

export default DirectoryAPI;