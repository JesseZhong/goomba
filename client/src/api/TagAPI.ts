import request, { Response } from 'superagent';
import { Access } from './Access';
import { ErrorResponse } from './ErrorResponse';


const TagsAPI = (
    url: string,
    access: Access
) => ({
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
                            if (
                                error.status < 500 &&
                                !errorHandler?.(response as ErrorResponse)
                            ) {
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

export default TagsAPI;