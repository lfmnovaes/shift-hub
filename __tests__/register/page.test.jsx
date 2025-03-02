import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterPage from '@/app/register/page';
import { mockPush } from '@/__tests__/test-utils';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('RegisterPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = ''; // Clear DOM between tests
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ user: { id: 1, username: 'testuser' } }),
    });
  });

  it('renders the registration form with all elements', () => {
    render(<RegisterPage />);
    expect(screen.getByText('Create an Account')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
    expect(screen.getByText('Already have an account? Login')).toBeInTheDocument();
  });

  it('validates form fields correctly', async () => {
    render(<RegisterPage />);
    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: 'Register' });

    // Username validations
    await userEvent.type(usernameInput, 'ab');
    fireEvent.click(submitButton);
    expect(screen.getByText('Username must be at least 3 characters')).toBeInTheDocument();

    await userEvent.clear(usernameInput);
    fireEvent.click(submitButton);
    expect(screen.getByText('Username is required')).toBeInTheDocument();

    await userEvent.type(usernameInput, 'user123');
    fireEvent.click(submitButton);
    expect(screen.getByText('Only letters, dash or underscore allowed')).toBeInTheDocument();

    // Password validations
    await userEvent.clear(usernameInput);
    await userEvent.type(usernameInput, 'validuser');
    await userEvent.type(passwordInput, '12');
    fireEvent.click(submitButton);
    expect(screen.getByText('Password must be at least 3 characters')).toBeInTheDocument();

    await userEvent.clear(passwordInput);
    fireEvent.click(submitButton);
    expect(screen.getByText('Password is required')).toBeInTheDocument();

    // Confirm password validations
    await userEvent.type(passwordInput, 'password123');
    await userEvent.type(confirmPasswordInput, 'password456');
    fireEvent.click(submitButton);
    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();

    await userEvent.clear(confirmPasswordInput);
    fireEvent.click(submitButton);
    expect(screen.getByText('Please confirm your password')).toBeInTheDocument();
  });

  it('submits the form and redirects on success', async () => {
    render(<RegisterPage />);
    await userEvent.type(screen.getByPlaceholderText('Username'), 'validuser');
    await userEvent.type(screen.getByPlaceholderText('Password'), 'password123');
    await userEvent.type(screen.getByPlaceholderText('Confirm Password'), 'password123');
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'validuser',
          password: 'password123',
          confirmPassword: 'password123',
        }),
      });
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('shows error message on registration failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () =>
        Promise.resolve({
          error: { username: ['Username already taken'] },
        }),
    });

    render(<RegisterPage />);
    await userEvent.type(screen.getByPlaceholderText('Username'), 'existinguser');
    await userEvent.type(screen.getByPlaceholderText('Password'), 'password123');
    await userEvent.type(screen.getByPlaceholderText('Confirm Password'), 'password123');
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(screen.getByText('Username already taken')).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it('shows general error message on server error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<RegisterPage />);
    await userEvent.type(screen.getByPlaceholderText('Username'), 'validuser');
    await userEvent.type(screen.getByPlaceholderText('Password'), 'password123');
    await userEvent.type(screen.getByPlaceholderText('Confirm Password'), 'password123');
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(
        screen.getByText('An unexpected error occurred. Please try again.')
      ).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
