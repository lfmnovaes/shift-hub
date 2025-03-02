import { render, screen } from '@testing-library/react';
import ShiftPage from '@/app/shift/page';
import { getCurrentUser } from '@/lib/session';
import '@testing-library/jest-dom';

jest.mock('@/lib/session', () => ({
  getCurrentUser: jest.fn(),
}));

jest.mock('@/components/logout-button', () => () => <button type="button">Logout</button>);

jest.mock('next/link', () => ({ href, children }) => <a href={href}>{children}</a>);

describe('ShiftPage', () => {
  beforeEach(() => {
    getCurrentUser.mockResolvedValue({
      id: 1,
      username: 'testuser',
      createdAt: new Date(),
    });
  });

  it('renders the page with correct elements', async () => {
    render(await ShiftPage());

    // Check welcome message
    expect(screen.getByText('Welcome, testuser!')).toBeInTheDocument();
    expect(
      screen.getByText('You have successfully logged in to the Shift Hub.')
    ).toBeInTheDocument();

    // Check logout button
    const logoutButton = screen.getByText('Logout');
    expect(logoutButton).toBeInTheDocument();
    expect(logoutButton.closest('button')).toHaveAttribute('type', 'button');

    // Check card component
    expect(screen.getByText(/Welcome, testuser!/i).closest('.card')).toBeInTheDocument();
  });

  it('shows Guest if no user is found', async () => {
    getCurrentUser.mockResolvedValueOnce(null);
    render(await ShiftPage());
    expect(screen.getByText('Welcome, Guest!')).toBeInTheDocument();
  });
});
