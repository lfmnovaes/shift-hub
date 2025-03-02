import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LogoutButton from '@/components/logout-button';
import { mockSuccess, mockError, mockPush, setupTest } from '@/__tests__/test-utils';

// Mock useState to control the isLoggingOut state
const mockSetIsLoggingOut = jest.fn();
jest.mock('react', () => {
  const originalReact = jest.requireActual('react');
  return {
    ...originalReact,
    useState: jest.fn((initialValue) => {
      // Only mock the isLoggingOut state
      if (initialValue === false) {
        return [false, mockSetIsLoggingOut];
      }
      return originalReact.useState(initialValue);
    }),
  };
});

describe('LogoutButton', () => {
  beforeEach(setupTest);

  it('renders the logout button', () => {
    render(<LogoutButton />);
    expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
  });

  it('handles successful logout', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true });

    render(<LogoutButton />);
    fireEvent.click(screen.getByRole('button', { name: 'Logout' }));

    expect(mockSetIsLoggingOut).toHaveBeenCalledWith(true);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      expect(mockSuccess).toHaveBeenCalledWith('Logged out successfully');
      expect(screen.getByTestId('toast-success')).toBeInTheDocument();
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('handles logout failure', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false });

    render(<LogoutButton />);
    fireEvent.click(screen.getByRole('button', { name: 'Logout' }));

    expect(mockSetIsLoggingOut).toHaveBeenCalledWith(true);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      expect(mockError).toHaveBeenCalledWith('Failed to log out');
      expect(screen.getByTestId('toast-error')).toBeInTheDocument();
      expect(mockSetIsLoggingOut).toHaveBeenCalledWith(false);
    });
  });

  it('handles network errors', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<LogoutButton />);
    fireEvent.click(screen.getByRole('button', { name: 'Logout' }));

    expect(mockSetIsLoggingOut).toHaveBeenCalledWith(true);

    await waitFor(() => {
      expect(mockError).toHaveBeenCalledWith('An error occurred while logging out');
      expect(screen.getByTestId('toast-error')).toBeInTheDocument();
      expect(mockSetIsLoggingOut).toHaveBeenCalledWith(false);
    });
  });
});
