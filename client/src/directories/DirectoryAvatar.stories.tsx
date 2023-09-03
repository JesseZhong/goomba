import type { Meta, StoryObj } from '@storybook/react';
import DirectoryAvatar from './DirectoryAvatar';
import avatar from '../assets/chadgura.png';

/**
 * It's magical, really.
 */
const meta: Meta<typeof DirectoryAvatar> = {
  title: 'Directories/Directory Avatar',
  component: DirectoryAvatar,
  argTypes: {
    directory: {
      description: `The directory's data. Name, ID, avatar, etc.`,
    },
    onClick: {
      description: 'Action executed when avatar is clicked.',
      control: false,
    },
    className: {
      description: 'Any additional styling.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof DirectoryAvatar>;

/**
 * Get a load of that chin. Fine chin there, Goobs.
 */
export const Default: Story = {
  args: {
    directory: {
      id: 'primary-id',
      name: 'Goomba',
      avatar_url: avatar,
    },
  },
};

/**
 * You're playin'.
 */
export const NoPicture: Story = {
  args: {
    directory: {
      id: 'no-picture-id',
      name: 'Faceless',
    },
  },
};
