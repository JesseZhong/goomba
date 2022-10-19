import React from 'react';
import Nav from './Nav';
import { ComponentMeta, ComponentStory } from '@storybook/react';


export default {
    title: 'Navigation/Nav',
    component: Nav,
    parameters: {
        withRouter: true,
    },
} as ComponentMeta<typeof Nav>;

const Template: ComponentStory<typeof Nav> = (args) => <Nav {...args} />;

export const Admin = Template.bind({});
Admin.args = {
    session: {
        session_id: 'some-admin-id',
        is_admin: true,
    },
};

export const Pleb = Template.bind({});
Pleb.args = {
    session: {
        session_id: 'pleb',
    },
};