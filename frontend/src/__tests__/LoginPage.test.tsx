import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../components/LoginPage';

describe('LoginPage', () => {
  beforeEach(() => {
    render(<MemoryRouter><LoginPage /></MemoryRouter>);
  });

  it('renders the "Login" heading', () => {
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
  });

  it('renders username input with placeholder "ex., john@123"', () => {
    expect(screen.getByPlaceholderText('ex., john@123')).toBeInTheDocument();
  });

  it('renders password input with placeholder "Please Enter"', () => {
    expect(screen.getByPlaceholderText('Please Enter')).toBeInTheDocument();
  });

  it('renders the Login submit button', () => {
    expect(screen.getByRole('button', { name: /^login$/i })).toBeInTheDocument();
  });

  it('renders the "Forgot Password?" link', () => {
    expect(screen.getByRole('link', { name: /forgot password\?/i })).toBeInTheDocument();
  });
});
