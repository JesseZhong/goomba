import { themes } from '@storybook/theming';



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