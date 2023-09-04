import { Meta, StoryObj } from '@storybook/react';
import Denied from './Denied';

/**
 * Cringe.
 */
const meta: Meta<typeof Denied> = {
  title: 'Auth Flow/Denied',
  component: Denied,
};

export default meta;

type Story = StoryObj<typeof Denied>;

export const Default: Story = {};
