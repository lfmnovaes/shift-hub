import { render, screen } from '@testing-library/react';
import LoginPage from '@/app/page';
import { setupTest } from '@/__tests__/test-utils';

jest.mock('@/components/login-form', () => () => (
  <div data-testid="login-form-mock">Login Form</div>
));

describe('LoginPage', () => {
  beforeEach(() => {
    setupTest();
  });

  it('renders the login page with title and form', () => {
    render(<LoginPage />);
    expect(screen.getByText('Shift Hub Login')).toBeInTheDocument();
    expect(screen.getByTestId('login-form-mock')).toBeInTheDocument();
    expect(screen.getByText('Shift Hub Login').closest('.card')).toBeInTheDocument();
  });
});
