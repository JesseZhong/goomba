import { themes } from '@storybook/theming';
import { addDecorator } from '@storybook/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

export const parameters = {
  backgrounds: {
    default: 'dark',
  },
  darkMode: {
    dark: {
      ...themes.dark,
      appBg: '#181a1b',
    },
    light: {
      ...themes.normal,
    },
    default: 'dark',
    classTarget: 'html',
  },
};

addDecorator((Story, { parameters }) => {

  if (!!parameters) {

    if (parameters.withRouter) {
      return (<MemoryRouter>
        <Story />
      </MemoryRouter>);
    }
    else if (parameters.withRoute || parameters.withParams) {

      let path = undefined;
      let entries = undefined;

      if (!!parameters.withParams) {
        path = `/:${Object.keys(parameters.withParams).join('/:')}`;
        entries = [`/${Object.values(parameters.withParams).join('/')}`];
      }

      return (<MemoryRouter initialEntries={entries}>
        <Routes>
          <Route
            index={!path}
            path={path}
            element={<Story />}
          />
        </Routes>
      </MemoryRouter>);
    }
  }

  return Story();
});