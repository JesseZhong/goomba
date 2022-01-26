import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Route, StaticRouter, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import VideoMetaSSR from './videos/VideoMetaSSR';
import { ssrWindow } from 'ssr-window';


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
            <meta property='og:image' content={process.env.REACT_APP_BANNER_URL} />
            <meta property='og:description' content='OH NYOOO' />

            <meta name='twitter:card' content='summary_large_image' />
        </Helmet>
        <StaticRouter>
            <Switch>
                <Route
                    exact
                    path='/watch/:id'
                    component={VideoMetaSSR}
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

const html = `
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

export default html;