import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ForgotPasswordPage from '../components/ForgotPasswordPage';

describe('ForgotPasswordPage', () => {
  beforeEach(() => {
    render(<MemoryRouter><ForgotPasswordPage /></MemoryRouter>);
  });

  it('renders the "Forgot Password" heading', () => {
    expect(screen.getByRole('heading', { name: /forgot password/i })).toBeInTheDocument();
  });

  it('renders email input with placeholder "Enter your email address"', () => {
    expect(screen.getByPlaceholderText('Enter your email address')).toBeInTheDocument();
  });

  it('renders the "Email" label', () => {
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders the "Send OTP" submit button', () => {
    expect(screen.getByRole('button', { name: /send otp/i })).toBeInTheDocument();
  });

  it('renders a "Back to Login" link', () => {
    expect(screen.getByRole('link', { name: /back to login/i })).toBeInTheDocument();
  });
});
