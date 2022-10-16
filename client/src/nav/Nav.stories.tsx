import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Nav from './Nav';
import { ComponentMeta, ComponentStory } from '@storybook/react';


export default {
    title: 'Navigation/Nav',
    component: Nav
} as ComponentMeta<typeof Nav>;

const Template: ComponentStory<typeof Nav> = (args) => <MemoryRouter>
    <Nav {...args} />
</MemoryRouter>;

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