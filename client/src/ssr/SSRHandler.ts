import AppIndexSSR from './AppIndexSSR';
import path from 'path';
import { Crawler } from 'es6-crawler-detect';


interface EdgeEvent {
    Records: {
        cf: {
            request: {
                uri: string,
                headers: {
                    [key: string]: {
                        key: string,
                        value: string
                    }[]
                }
            }
        }
    }[]
}

const handler = async (
    event: EdgeEvent
) => {
    const request = event.Records[0].cf.request;

    try {
        // Check that a route or index is requested.
        if (!path.extname(request.uri) || request.uri === '/index.html') {

            // Join all user agents.
            const userAgent = request.headers['user-agent'].map(
                x => x.value
            ).join(' ').trim();

            const detector = new Crawler();
            if (detector.isCrawler(userAgent)) {
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
                        ],
                        // 'content-encoding': [
                        //     {
                        //         key: 'Content-Encoding',
                        //         value: 'gzip'
                        //     }
                        // ]
                    },
                    body: await AppIndexSSR()
                }
            }
        }
        
        return request;
    }
    catch {
        return request;
    }
}

export { handler };