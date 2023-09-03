import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

export const parameters = {
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  },
  backgrounds: {
    default: 'dark',
  },
};

const routingDecorator = (Story, { parameters }) => {
  if (!!parameters) {
    if (parameters.withRouter) {
      return (
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      );
    } else if (parameters.withRoute || parameters.withParams) {
      let path = undefined;
      let entries = undefined;

      if (!!parameters.withParams) {
        path = `/:${Object.keys(parameters.withParams).join('/:')}`;
        entries = [`/${Object.values(parameters.withParams).join('/')}`];
      }

      return (
        <MemoryRouter initialEntries={entries}>
          <Routes>
            <Route index={!path} path={path} element={<Story />} />
          </Routes>
        </MemoryRouter>
      );
    }
  }

  return Story();
};

export const decorators = [routingDecorator];
