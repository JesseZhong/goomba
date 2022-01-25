import React from 'react';
import AppContainer from './containers/AppContainer';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './index.sass';


const appString = ReactDOMServer.renderToString(
    <StaticRouter>
        <AppContainer />
    </StaticRouter>
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