import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '@/components/login-form';
import { mockSuccess, mockError, mockPush, setupTest } from '@/__tests__/test-utils';

describe('LoginForm', () => {
  beforeEach(setupTest);

  it('renders the login form with all elements', () => {
    render(<LoginForm />);
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(document.querySelectorAll('svg').length).toBeGreaterThanOrEqual(2);
  });

  it('toggles password visibility when eye icon is clicked', () => {
    render(<LoginForm />);
    const passwordInput = screen.getByPlaceholderText('Password');

    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(screen.getByRole('button', { name: /show password/i }));
    expect(passwordInput).toHaveAttribute('type', 'text');

    fireEvent.click(screen.getByRole('button', { name: /hide password/i }));
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('validates username correctly', async () => {
    render(<LoginForm />);
    const usernameInput = screen.getByPlaceholderText('Username');
    const submitButton = screen.getByRole('button', { name: 'Login' });

    // Test min length validation
    await userEvent.type(usernameInput, 'ab');
    fireEvent.click(submitButton);
    expect(screen.getByText('Username must be at least 3 characters')).toBeInTheDocument();

    // Test required validation
    await userEvent.clear(usernameInput);
    fireEvent.click(submitButton);
    expect(screen.getByText('Username is required')).toBeInTheDocument();

    // Test pattern validation
    await userEvent.clear(usernameInput);
    await userEvent.type(usernameInput, 'user123');
    fireEvent.click(submitButton);
    expect(screen.getByText('Only letters, dash or underscore allowed')).toBeInTheDocument();
  });

  it('validates password correctly', async () => {
    render(<LoginForm />);
    const passwordInput = screen.getByPlaceholderText('Password');
    const formElement = screen.getByText(/don't have an account/i).closest('form');

    // Test required validation
    await userEvent.type(screen.getByPlaceholderText('Username'), 'validuser');
    fireEvent.submit(formElement);
    expect(
      screen.getAllByText(/password/i).find((el) => el.textContent.includes('required'))
    ).toBeInTheDocument();

    // Test length validation
    await userEvent.type(passwordInput, '12');
    fireEvent.submit(formElement);
    expect(
      screen
        .getAllByText(/password/i)
        .find((el) => el.textContent.includes('at least 3 characters'))
    ).toBeInTheDocument();
  });

  it('submits the form and handles successful login', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: { username: 'validuser', id: '123', createdAt: new Date().toISOString() },
      }),
    });

    render(<LoginForm />);
    await userEvent.type(screen.getByPlaceholderText('Username'), 'validuser');
    await userEvent.type(screen.getByPlaceholderText('Password'), 'password123');
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'validuser', password: 'password123' }),
      });
      expect(mockSuccess).toHaveBeenCalledWith('Welcome back, validuser!');
      expect(screen.getByTestId('toast-success')).toBeInTheDocument();
      expect(mockPush).toHaveBeenCalledWith('/shift');
    });
  });

  it('handles login failure correctly', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: { _errors: ['Invalid username or password'] } }),
    });

    render(<LoginForm />);
    await userEvent.type(screen.getByPlaceholderText('Username'), 'validuser');
    await userEvent.type(screen.getByPlaceholderText('Password'), 'wrongpassword');
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      expect(mockError).toHaveBeenCalledWith('Invalid username or password');
      expect(screen.getByTestId('toast-error')).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
