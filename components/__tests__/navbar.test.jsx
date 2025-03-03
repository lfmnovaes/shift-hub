import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Navbar from '../navbar';
import '@testing-library/jest-dom';

describe('Navbar Component', () => {
  const mockProps = {
    username: 'testuser',
    userId: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
      })
    );
  });

  it('renders correctly with username', () => {
    render(<Navbar {...mockProps} />);
    expect(screen.getByText('Shift Hub')).toBeInTheDocument();
    expect(screen.getByText('testuser')).toBeInTheDocument();
  });

  it('truncates long usernames', () => {
    const longUsernameMock = {
      username: 'verylongusername',
      userId: 1,
    };

    render(<Navbar {...longUsernameMock} />);
    expect(screen.getByText('verylongus...')).toBeInTheDocument();
  });

  it('has dropdown menu with account settings and logout options', () => {
    render(<Navbar {...mockProps} />);
    expect(screen.getByText('Account Settings')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('calls logout API when logout button is clicked', async () => {
    render(<Navbar {...mockProps} />);
    fireEvent.click(screen.getByText('Logout'));

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
