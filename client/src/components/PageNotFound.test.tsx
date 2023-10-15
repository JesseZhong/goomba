import { screen, render } from '@testing-library/react';
import PageNotFound from './PageNotFound';

beforeEach(() => {
  render(<PageNotFound />);
});

it('renders without errors', () => {
  expect(screen).toBeDefined();
});

it('renders 404 as header', () => {
  const header = screen.getByRole('heading', { level: 1 });

  expect(header.textContent?.includes('404')).toBeTruthy();
});

it('renders the image with alt text', () => {
  const image: HTMLImageElement = screen.getByRole('img');

  expect(image.src).toBeDefined();
  expect(image.alt).toBeDefined();
});
