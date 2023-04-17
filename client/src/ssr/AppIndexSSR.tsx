import ReactDOMServer from 'react-dom/server';
import { Helmet } from 'react-helmet';
import { ssrWindow } from 'ssr-window';
import VideoMetaAPI from './VideoMetaAPI';
import VideoMeta from '../videos/VideoMeta';
import DirectoryMetaAPI from './DirectoryMetaAPI';
import DirectoryMeta from '../directories/DirectoryMeta';

const getHtml = async (api_url: string, banner_url: string, route?: string) => {
  let content = <></>;
  if (route) {
    const vidResult = RegExp(
      '^/watch/([0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12})',
      'i'
    ).exec(route);

    const dirResult = RegExp(
      '^/home/([^\^{}%`\"\'~<>#|]{1,})$',
      'i'
    ).exec(route);

    if (vidResult && vidResult.length > 1) {
      const video = await VideoMetaAPI(api_url).get(vidResult[1]);

      content = <VideoMeta video={video} />;
    }
    else if(dirResult && dirResult.length > 1) {
      const directory = await DirectoryMetaAPI(api_url).get(dirResult[1]);

      content = <DirectoryMeta directory={directory} />;
    }
  }

  const appString = ReactDOMServer.renderToString(
    <>
      <Helmet
        htmlAttributes={{
          lang: 'en',
        }}
      >
        <meta property='og:type' content='website' />
        <meta property='og:title' content='Goomba' />
        <meta property='og:url' content={ssrWindow.location.href} />
        <meta property='og:image' content={banner_url} />
        <meta property='og:description' content='OH NYOOO' />

        <meta name='twitter:card' content='summary_large_image' />
      </Helmet>
      {content}
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
