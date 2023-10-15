import { MemoryRouter, Routes, Route } from 'react-router-dom';

export const routingDecorator = (Story, { parameters }) => {
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
