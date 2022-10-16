export const parameters = {
  darkMode: {
    dark: {
      ...themes.dark,
      appBg: 'black',
    },
    light: {
      ...themes.normal,
      appBg: 'red',
    },
    default: 'dark',
    classTarget: 'html',
  },
};