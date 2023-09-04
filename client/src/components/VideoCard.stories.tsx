import { Meta, StoryObj } from '@storybook/react';
import VideoCard from './VideoCard';
import thumbnail from '../assets/goms.jpg';

const meta: Meta<typeof VideoCard> = {
  title: 'Videos/Video Card',
  component: VideoCard,
};

export default meta;

type Story = StoryObj<typeof VideoCard>;

export const Everything: Story = {
  args: {
    video: {
      id: 'some-id',
      name: "Gober's Video",
      thumbnail_url: thumbnail,
      member: true,
      download_available: true,
      date_aired: '2021-11-28T01:00:00.000Z',
    },
  },
};

export const Empty: Story = {
  args: {
    video: {
      id: 'some-id',
      name: 'Empty Video Card Title',
    },
  },
};
