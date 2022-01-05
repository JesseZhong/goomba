import request, { Response } from 'superagent';
import events from 'events';
import { Access } from './Access';
import { ErrorResponse } from './ErrorResponse';

interface Progress {
    percent?: string,
    direction?: string
}

interface PresignedUpload {
    url: string,
    fields: {
        key: string,
        'x-amz-algorithm': string,
        'x-amz-credential': string,
        'x-amz-date': string,
        'x-amz-security-token': string,
        policy: string,
        'x-amz-signature': string
    }
}

const ImageAPI = (
    url: string,
    access: Access
) => ({
    upload(
        file: File,
        success: (fileKey: string) => void,
        event?: events.EventEmitter
    ): void {
        access(
            (
                token: string,
                errorHandler?: (response: ErrorResponse) => boolean
            ) => 
                // Request presigned url to use for upload.
                request.put(`${url}/images`)
                    .set('Accept', 'application/json')
                    .auth(token, { type: 'bearer' })
                    .send({
                        'filename': file.name
                    })
                    .end((error: any, response: Response) => {
                        if (!error && response.ok) {
                            const result = response?.body as {
                                fileKey: string,
                                presigned: PresignedUpload
                            };
                            const data = new FormData();

                            // Append all the fields from the presigned.
                            Object.entries(result.presigned.fields).forEach(([key, value]) => {
                                data.append(key, value);
                            });

                            // Append the file.
                            data.append('file', file);

                            // Attempt to upload the file.
                            request.post(result.presigned.url)
                                .on('progress', (e: ProgressEvent) => {
                                    const progress = e as Progress;

                                    if (progress.direction === 'upload') {
                                        event?.emit(
                                            'uploadProgress',
                                            progress.percent
                                        );
                                    }
                                })
                                .send(data)
                                .end((error: any, response: Response) => {
                                    if (!error && response.ok) {
                                        success(result.fileKey);
                                    }
                                });
                        }
                        else {
                            if (error) {
                                if (
                                    error.status < 500 &&
                                    !errorHandler?.(response as ErrorResponse)
                                ) {
                                    console.error(error)
                                }
                            }
                        }
                    })
        );
    }
});

export default ImageAPI;