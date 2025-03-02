import React from 'react';
import { render, screen } from '@testing-library/react';
import LoginPage from '@/app/page';
import '@testing-library/jest-dom';

jest.mock('@/components/login-form', () => {
  return function MockLoginForm() {
    return <div data-testid="login-form-mock">Login Form</div>;
  };
});

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('LoginPage', () => {
  it('renders the login page with title', () => {
    render(<LoginPage />);
    expect(screen.getByText('Shift Hub Login')).toBeInTheDocument();
  });

  it('renders the LoginForm component', () => {
    render(<LoginPage />);
    expect(screen.getByTestId('login-form-mock')).toBeInTheDocument();
  });

  it('renders within a card component', () => {
    render(<LoginPage />);
    const cardElement = screen.getByText('Shift Hub Login').closest('.card');
    expect(cardElement).toBeInTheDocument();
  });
});
