import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import DirectoryCard from './DirectoryCard';
import { Directory } from './Directory';
import avatar from '../assets/chadgura.png';


export default {
    title: 'Directories/DirectoryCard',
    component: DirectoryCard
} as ComponentMeta<typeof DirectoryCard>;

const Template: ComponentStory<typeof DirectoryCard> = (args) => <DirectoryCard {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    directory: {
        id: 'primary-id',
        name: 'Goomba',
        avatar_url: avatar
    }
};

export const NoPicture = Template.bind({});
NoPicture.args = {
    directory: {
        id: 'no-picture-id',
        name: 'Faceless',
    }
};