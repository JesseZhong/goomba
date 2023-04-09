import { ComponentMeta, ComponentStory } from '@storybook/react';
import PageNotFound from './PageNotFound';

export default {
  title: 'Not Found/Page Not Found',
  component: PageNotFound,
  parameters: {
    controls: { disable: true },
  },
} as ComponentMeta<typeof PageNotFound>;

export const Default: ComponentStory<typeof PageNotFound> = () => (
  <PageNotFound />
);
