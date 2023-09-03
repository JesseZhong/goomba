import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Videos } from './video';
import VideoListByDate from './VideoListByDate';
import goms_thumbnail from '../assets/goms.jpg';
import sus_thumbnail from '../assets/sus.jpg';
import mums_thumbnail from '../assets/mums.jpg';
import oao_thumbnail from '../assets/oao.jpg';

const VIDEOS = new Videos({
  gumbus: {
    id: 'gumbus',
    name: 'Gooba Posted This Video',
    thumbnail_url: goms_thumbnail,
    member: true,
    download_available: true,
    date_aired: '2021-11-28T01:00:00.000Z',
  },
  sussy: {
    id: 'sussy',
    name: 'Sussy Baka',
    thumbnail_url: sus_thumbnail,
    member: true,
    date_aired: '2020-08-24T09:00:00.000Z',
  },
  mumers: {
    id: 'mumers',
    name: 'Crunch ROADs',
    thumbnail_url: mums_thumbnail,
    date_aired: '2022-03-16T18:00:00.000Z',
  },
  goamus: {
    id: 'goamus',
    name: 'uwu',
    thumbnail_url: oao_thumbnail,
    member: true,
  },
});

export default {
  title: 'Videos/Video List By Date',
  component: VideoListByDate,
  parameters: {
    withRoute: true,
  },
} as ComponentMeta<typeof VideoListByDate>;

const Template: ComponentStory<typeof VideoListByDate> = (args) => (
  <VideoListByDate {...args} />
);

export const Default = Template.bind({});
Default.args = {
  videos: VIDEOS,
};

export const LimitThree = Template.bind({});
LimitThree.args = {
  videos: VIDEOS,
  topToShow: 3,
};

export const Empty = Template.bind({});
