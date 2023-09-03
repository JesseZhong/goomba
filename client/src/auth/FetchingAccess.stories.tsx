import { Meta, StoryObj } from '@storybook/react';
import FetchingAccess from './FetchingAccess';

const meta: Meta<typeof FetchingAccess> = {
  title: 'Auth/Fetching Access',
  component: FetchingAccess,
  parameters: {
    router: true,
  },
};

export default meta;

type Story = StoryObj<typeof FetchingAccess>;

export const Default: Story = {};

export const AccessToken: Story = {
  storyName: 'Receiving a Valid Access Token',
  args: {
    session: {
      session_id: 'example',
      access_token: 'example',
    },
  },
};
