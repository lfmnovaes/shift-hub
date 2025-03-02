import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '@/components/login-form';
import '@testing-library/jest-dom';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login form with all elements', () => {
    render(<LoginForm />);
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByText('Only letters, dash or underscore allowed')).toBeInTheDocument();
    expect(screen.getByText('Enter your password')).toBeInTheDocument();
    const svgElements = document.querySelectorAll('svg');
    expect(svgElements.length).toBeGreaterThanOrEqual(2);
  });

  it('toggles password visibility when eye icon is clicked', async () => {
    render(<LoginForm />);
    const passwordInput = screen.getByPlaceholderText('Password');
    expect(passwordInput).toHaveAttribute('type', 'password');
    const toggleButton = screen.getByRole('button', {
      name: /show password/i,
    });
    expect(toggleButton).toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    const hideButton = screen.getByRole('button', {
      name: /hide password/i,
    });
    fireEvent.click(hideButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('validates username correctly', async () => {
    render(<LoginForm />);
    const usernameInput = screen.getByPlaceholderText('Username');
    const submitButton = screen.getByRole('button', { name: 'Login' });

    await userEvent.type(usernameInput, 'ab');
    fireEvent.click(submitButton);
    expect(screen.getByText('Username must be at least 3 characters')).toBeInTheDocument();

    await userEvent.clear(usernameInput);
    fireEvent.click(submitButton);
    expect(screen.getByText('Username is required')).toBeInTheDocument();

    await userEvent.clear(usernameInput);
    await userEvent.type(usernameInput, 'user123');
    fireEvent.click(submitButton);
    expect(screen.getByText('Only letters, dash or underscore allowed')).toBeInTheDocument();

    await userEvent.clear(usernameInput);
    await userEvent.type(usernameInput, 'valid-user_name');
    fireEvent.click(submitButton);
    expect(screen.queryByText('Only letters, dash or underscore allowed')).toBeInTheDocument();
    expect(screen.queryByText('Username is required')).not.toBeInTheDocument();
    expect(screen.queryByText('Username must be at least 3 characters')).not.toBeInTheDocument();
  });

  it('validates password correctly', async () => {
    render(<LoginForm />);
    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Login' });

    await userEvent.type(usernameInput, 'validuser');

    await userEvent.clear(passwordInput);
    fireEvent.click(submitButton);

    await userEvent.type(passwordInput, 'password123');
    fireEvent.click(submitButton);
    expect(mockPush).toHaveBeenCalledWith('/shift');
  });

  it('navigates to shift page upon successful form submission', async () => {
    render(<LoginForm />);
    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Login' });

    await userEvent.type(usernameInput, 'validuser');
    await userEvent.type(passwordInput, 'password123');
    fireEvent.click(submitButton);
    expect(mockPush).toHaveBeenCalledWith('/shift');
  });
});
