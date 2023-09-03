import { Meta, StoryObj } from '@storybook/react';
import VideoPlayer from './VideoPlayer';

const meta: Meta<typeof VideoPlayer> = {
  title: 'Videos/Video Player',
  component: VideoPlayer,
  parameters: {
    withRoute: true,
  },
};

export default meta;

type Story = StoryObj<typeof VideoPlayer>;

export const WithVideo: Story = {};
