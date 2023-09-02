import { create } from '@storybook/theming/create';

export default create({
  base: 'dark',
  brandTitle: `
    <div style="display: flex; gap: 4px; align-items: center;">
      <img src="" alt="gobs" />
      <span></span>
    </div>
  `,
  brandUrl: 'https://example.com',
  brandTarget: '_self',
});
