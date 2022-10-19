import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import VideoInfo from './VideoInfo';


export default {
    title: 'Videos/VideoInfo',
    component: VideoInfo,
} as ComponentMeta<typeof VideoInfo>;

const Template: ComponentStory<typeof VideoInfo> = (args) => <VideoInfo {...args} />;

export const Everything = Template.bind({});
Everything.args = {
    video: {
        id: 'everything-id',
        name: 'everything',
        date_aired: '2021-11-28T01:00:00.000Z',
        member: true,
        download_available: true,
    },
};

export const Nothing = Template.bind({});
Nothing.args = {
    video: {
        id: 'some-id',
        name: 'nothing',
    },
};