import { ComponentMeta, ComponentStory } from '@storybook/react';
import DirectoryAvatar from './DirectoryAvatar';
import avatar from '../assets/chadgura.png';

export default {
  title: 'Directories/Directory Avatar',
  component: DirectoryAvatar,
} as ComponentMeta<typeof DirectoryAvatar>;

const Template: ComponentStory<typeof DirectoryAvatar> = (args) => (
  <DirectoryAvatar {...args} />
);

export const Default = Template.bind({});
Default.args = {
  directory: {
    id: 'primary-id',
    name: 'Goomba',
    avatar_url: avatar,
  },
};

export const NoPicture = Template.bind({});
NoPicture.args = {
  directory: {
    id: 'no-picture-id',
    name: 'Faceless',
  },
};
