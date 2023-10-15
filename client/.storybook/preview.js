import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { routingDecorator } from './decorators';
import dark from './themes/dark-theme';

const preview = {
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
    backgrounds: {
      default: 'dark',
    },
    docs: {
      theme: dark,
    },
  },
  decorators: [routingDecorator],
};

export default preview;
