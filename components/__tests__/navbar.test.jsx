import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Navbar from '../navbar';
import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
  })
);

describe('Navbar Component', () => {
  const mockProps = {
    username: 'testuser',
    userId: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with username', () => {
    render(<Navbar {...mockProps} />);

    // Check if the logo is rendered
    expect(screen.getByText('Shift Hub')).toBeInTheDocument();

    // Check if the username is rendered
    expect(screen.getByText('testuser')).toBeInTheDocument();
  });

  it('truncates long usernames', () => {
    const longUsernameMock = {
      username: 'verylongusername',
      userId: 1,
    };

    render(<Navbar {...longUsernameMock} />);

    // Check if the username is truncated
    expect(screen.getByText('verylongus...')).toBeInTheDocument();
  });

  it('has dropdown menu with account settings and logout options', () => {
    render(<Navbar {...mockProps} />);

    // Check if the dropdown menu contains the expected items
    expect(screen.getByText('Account Settings')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('calls logout API when logout button is clicked', async () => {
    render(<Navbar {...mockProps} />);

    // Click the logout button
    fireEvent.click(screen.getByText('Logout'));

    // Check if fetch was called with the correct parameters
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
  });
});
