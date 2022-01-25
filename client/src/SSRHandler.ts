import AppIndexSSR from './AppIndexSSR';

interface EdgeEvent {
    Records: {
        cf: {
            request: {
                uri: string
            }
        }
    }[]
}

const handler = async (
    event: EdgeEvent
) => {
    try {
        const request = event.Records[0].cf.request;
        if (request.uri === '/edgessr') {

            return {
                status: '200',
                statusDescription: 'OK',
                headers: {
                    'cache-control': [
                        {
                            key: 'Cache-Control',
                            value: 'max-age=100'
                        }
                    ],
                    'content-type': [
                        {
                            key: 'Content-Type',
                            value: 'text/html'
                        }
                    ]
                },
                body: AppIndexSSR
            }
        }
        else {
            return request;
        }
    }
    catch (error) {
        console.log(`Error ${error}`);
        return `Error ${error}`;
    }
}

export { handler };