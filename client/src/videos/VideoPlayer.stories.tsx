import { ComponentMeta, ComponentStory } from '@storybook/react';
import VideoPlayer from './VideoPlayer';

export default {
  title: 'Videos/Video Player',
  component: VideoPlayer,
  parameters: {
    withRoute: true,
  },
} as ComponentMeta<typeof VideoPlayer>;

const Template: ComponentStory<typeof VideoPlayer> = (args) => (
  <VideoPlayer {...args} />
);

export const WithVideo = Template.bind({});
