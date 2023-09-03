import { Meta, StoryObj } from '@storybook/react';
import FetchingAccess from './FetchingAccess';

const meta: Meta<typeof FetchingAccess> = {
  title: 'Auth/Fetching Access',
  component: FetchingAccess,
  parameters: {
    withRouter: true,
  },
};

export default meta;

type Story = StoryObj<typeof FetchingAccess>;

export const Default: Story = {};

export const WithToken: Story = {
  args: {
    session: {
      session_id: 'example',
      access_token: 'example',
    },
  },
};
