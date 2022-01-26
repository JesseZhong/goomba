import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Route, StaticRouter, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ssrWindow } from 'ssr-window';
import VideoMetaSSR from './VideoMetaSSR';
import { SSM, AWSError } from 'aws-sdk';

const getHtml = async () => {
    const ssm = new SSM({

    });

    const getParam = async (
        name: string
    ) => await new Promise<string>(
        (
            resolve: (value: string) => void,
            reject: (reason?: any) => void
        ) => ssm.getParameter(
            { Name: name },
            (
                error: AWSError,
                data: SSM.GetParameterResult
            ) => {
                if (error) {
                    reject(error.message);
                }
                else {
                    resolve(data.Parameter?.Value ?? '');
                }
            }
        )
    );

    const api_url = await getParam('API_URL');
    const banner_url = await getParam('BANNER_URL');

    const appString = ReactDOMServer.renderToString(
        <>
            <Helmet
                htmlAttributes={{
                    lang: 'en'
                }}
            >
                <meta property='og:type' content='website' />
                <meta property='og:title' content='Goomba' />
                <meta property='og:url' content={ssrWindow.location.href} />
                <meta property='og:image' content={banner_url} />
                <meta property='og:description' content='OH NYOOO' />

                <meta name='twitter:card' content='summary_large_image' />
            </Helmet>
            <StaticRouter>
                <Switch>
                    <Route
                        exact
                        path='/watch/:id'
                        render={(props: any) => (
                            <VideoMetaSSR
                                {...props}
                                api_url={api_url}
                            />
                        )}
                    />
                    <Route
                        path='*'
                        render={() => (
                            <></>
                        )}
                    />
                </Switch>
            </StaticRouter>
        </>
    );
    const helmet = Helmet.renderStatic();
    return `
    <!doctype html>
    <html ${helmet.htmlAttributes.toString()}>
        <head>
            ${helmet.title.toString()}
            ${helmet.meta.toString()}
            ${helmet.link.toString()}
        </head>
        <body ${helmet.bodyAttributes.toString()}>
            <div id="root">${appString}</div>
        </body>
    </html>
    `;
};

export default getHtml;