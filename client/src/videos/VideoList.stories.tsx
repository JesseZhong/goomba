import { ComponentMeta, ComponentStory } from '@storybook/react';
import VideoList from './VideoList';
import { Videos } from './Video';
import goms_thumbnail from '../assets/goms.jpg';
import sus_thumbnail from '../assets/sus.jpg';
import mums_thumbnail from '../assets/mums.jpg';
import oao_thumbnail from '../assets/oao.jpg';

export default {
  title: 'Videos/Video List',
  component: VideoList,
  parameters: {
    withRoute: true,
  },
} as ComponentMeta<typeof VideoList>;

const Template: ComponentStory<typeof VideoList> = (args) => (
  <VideoList {...args} />
);

export const Some = Template.bind({});
Some.args = {
  videos: new Videos({
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
  }),
};

export const Empty = Template.bind({});
