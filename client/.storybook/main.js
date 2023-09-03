export const stories = ['../src/**/*.stories.@(js|jsx|ts|tsx)'];
export const addons = [
  '@storybook/addon-links',
  '@storybook/addon-essentials',
  '@storybook/addon-interactions',
  '@storybook/preset-create-react-app',
  'storybook-addon-manual-mocks',
];
export const framework = {
  name: '@storybook/react-webpack5',
  options: {},
};
export const docs = {
  autodocs: true,
};
