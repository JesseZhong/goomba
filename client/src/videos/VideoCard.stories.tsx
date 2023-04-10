import { ComponentMeta, ComponentStory } from '@storybook/react';
import VideoCard from './VideoCard';
import thumbnail from '../assets/goms.jpg';

export default {
  title: 'Videos/Video Card',
  component: VideoCard,
} as ComponentMeta<typeof VideoCard>;

const Template: ComponentStory<typeof VideoCard> = (args) => (
  <VideoCard {...args} />
);

export const Everything = Template.bind({});
Everything.args = {
  video: {
    id: 'some-id',
    name: "Gober's Video",
    thumbnail_url: thumbnail,
    member: true,
    download_available: true,
    date_aired: '2021-11-28T01:00:00.000Z',
  },
};

export const Empty = Template.bind({});
Empty.args = {
  video: {
    id: 'some-id',
    name: 'Empty Video Card Title',
  },
};
