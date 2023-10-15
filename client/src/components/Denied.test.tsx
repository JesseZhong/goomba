import { screen, render } from '@testing-library/react';
import Denied from './Denied';

describe('<Denied>', () => {
  beforeEach(() => {
    render(<Denied />);
  });

  it('renders without errors', () => {
    expect(screen).toBeDefined();
  });

  it('renders informing image', () => {
    expect(screen.getByRole('img', { name: 'Nope' }));
  });
});
