import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ResetPasswordPage from '../components/ResetPasswordPage';

describe('ResetPasswordPage', () => {
  beforeEach(() => {
    render(<MemoryRouter><ResetPasswordPage /></MemoryRouter>);
  });

  it('renders the "Reset Password" heading', () => {
    expect(screen.getByRole('heading', { name: /reset password/i })).toBeInTheDocument();
  });

  it('renders new password input with placeholder "Enter new password"', () => {
    expect(screen.getByPlaceholderText('Enter new password')).toBeInTheDocument();
  });

  it('renders confirm password input with placeholder "Confirm new password"', () => {
    expect(screen.getByPlaceholderText('Confirm new password')).toBeInTheDocument();
  });

  it('renders the "Reset Password" submit button', () => {
    expect(screen.getByRole('button', { name: /^reset password$/i })).toBeInTheDocument();
  });

  it('renders a "Back to Login" link', () => {
    expect(screen.getByRole('link', { name: /back to login/i })).toBeInTheDocument();
  });
});
