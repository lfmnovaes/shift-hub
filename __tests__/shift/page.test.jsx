import { render, screen } from '@testing-library/react';
import ShiftPage from '@/app/shift/page';
import '@testing-library/jest-dom';

jest.mock('next/link', () => {
  return function Link(props) {
    return <a href={props.href}>{props.children}</a>;
  };
});

describe('ShiftPage', () => {
  it('renders the welcome message', () => {
    render(<ShiftPage />);
    expect(screen.getByText('Welcome!')).toBeInTheDocument();
    expect(
      screen.getByText('You have successfully logged in to the Shift Hub.')
    ).toBeInTheDocument();
  });

  it('renders the logout button', () => {
    render(<ShiftPage />);
    const logoutButton = screen.getByText('Logout');
    expect(logoutButton).toBeInTheDocument();
    expect(logoutButton.closest('a')).toHaveAttribute('href', '/');
  });

  it('renders within a card component', () => {
    render(<ShiftPage />);
    const cardElement = screen.getByText('Welcome!').closest('.card');
    expect(cardElement).toBeInTheDocument();
  });
});
