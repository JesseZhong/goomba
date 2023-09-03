import { Meta, StoryObj } from '@storybook/react';
import PageNotFound from './PageNotFound';

/**
 * You really shouldn't be here.
 */
const meta: Meta<typeof PageNotFound> = {
  title: 'Not Found/Page Not Found',
  component: PageNotFound,
  parameters: {
    controls: { disable: true },
  },
};

export default meta;

type Story = StoryObj<typeof PageNotFound>;

export const Default: Story = {};
