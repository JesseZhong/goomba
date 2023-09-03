import VideoPlayer from './VideoPlayer';

export default {
  title: 'Videos/Video Player',
  component: VideoPlayer,
  parameters: {
    withRoute: true,
  },
};

const Template = (args: any) => <VideoPlayer {...args} />;

export const WithVideo = Template.bind({});
