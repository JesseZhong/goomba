import { create } from '@storybook/theming/create';

export default create({
  base: 'dark',
  brandTitle: `
    <div style="display: flex; gap: 0.3em; align-items: center;">
      <img src="favicon.png" alt="gobs" />
      <span>Gobble Gooks</span>
    </div>
  `,
  brandUrl: 'https://goob.evenstargames.com',
  brandTarget: '_blank',
});
