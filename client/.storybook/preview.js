import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { MemoryRouter, Routes, Route, Location } from 'react-router-dom';

export const parameters = {
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  },
  backgrounds: {
    default: 'dark',
  },
};

const routingDecorator = (Story, { parameters }) => {
  if (!parameters?.router) {
    return Story();
  }

  if (typeof parameters.router !== 'object') {
    return <MemoryRouter>{Story()}</MemoryRouter>;
  }

  const { params, layout, queries } = parameters.router;

  let path = undefined;
  let entry = undefined;

  if (!!params) {
    path = `/:${Object.keys(params).join('/:')}`;
    entry = `/${Object.values(params).join('/')}`;
  }

  if (Array.isArray(queries)) {
    entry = (entry ?? '') + '?' + queries.join('&');
  }

  return (
    <MemoryRouter initialEntries={!!entry ? [entry] : entry}>
      <Routes>
        {!!layout ? (
          <Route index={!path} path={path} element={layout}>
            <Route index element={Story()} />
          </Route>
        ) : (
          <Route index={!path} path={path} element={Story()} />
        )}
      </Routes>
    </MemoryRouter>
  );
};

export const decorators = [routingDecorator];
