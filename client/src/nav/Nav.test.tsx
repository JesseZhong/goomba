import { screen, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Session } from '../auth/Session';
import '@testing-library/jest-dom/extend-expect';
import Nav from './Nav';

describe.each([
  [{ session_id: 'a pleb' }],
  [{ session_id: 'an admin', is_admin: true }],
])('when the user session is $session', (session: Session) => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Nav session={session} />
      </MemoryRouter>
    );
  });

  test('renders logo that links to home', () => {
    const logo: HTMLImageElement = screen.getByRole('img');

    expect(logo?.closest('a')).toHaveAttribute('href', '/');
  });
});