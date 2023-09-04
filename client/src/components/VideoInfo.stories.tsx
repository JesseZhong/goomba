import { Meta, StoryObj } from '@storybook/react';
import VideoInfo from './VideoInfo';

const meta: Meta<typeof VideoInfo> = {
  title: 'Videos/Video Info',
  component: VideoInfo,
};

export default meta;

type Story = StoryObj<typeof VideoInfo>;

export const Everything: Story = {
  args: {
    video: {
      id: 'everything-id',
      name: 'everything',
      date_aired: '2021-11-28T01:00:00.000Z',
      member: true,
      download_available: true,
    },
  },
};

export const Nothing: Story = {
  args: {
    video: {
      id: 'some-id',
      name: 'nothing',
    },
  },
};
