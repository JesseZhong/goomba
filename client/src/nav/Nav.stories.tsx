import type { Meta, StoryObj } from '@storybook/react';
import Nav from './Nav';

/**
 * What are you expecting here? An explanation?
 */
const meta: Meta<typeof Nav> = {
  title: 'Navigation/Nav',
  component: Nav,
  parameters: {
    withRouter: true,
  },
};

export default meta;

type Story = StoryObj<typeof Nav>;

/**
 * Eh.
 */
export const Admin: Story = {
  args: {
    session: {
      session_id: 'some-admin-id',
      is_admin: true,
    },
  },
};

/**
 * What everyone else sees.
 */
export const Pleb: Story = {
  args: {
    session: {
      session_id: 'pleb',
    },
  },
};
