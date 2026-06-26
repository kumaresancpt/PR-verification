import { render, screen } from '@testing-library/react';
import RoleSelector from '../components/RoleSelector';

describe('RoleSelector', () => {
  beforeEach(() => {
    render(<RoleSelector value="Admin" onChange={jest.fn()} />);
  });

  it('renders the "Admin" tab', () => {
    expect(screen.getByRole('tab', { name: 'Admin' })).toBeInTheDocument();
  });

  it('renders the "Receptionist" tab', () => {
    expect(screen.getByRole('tab', { name: 'Receptionist' })).toBeInTheDocument();
  });

  it('renders the "Security Guard" tab', () => {
    expect(screen.getByRole('tab', { name: 'Security Guard' })).toBeInTheDocument();
  });

  it('marks the Admin tab as selected when value is "Admin"', () => {
    expect(screen.getByRole('tab', { name: 'Admin' })).toHaveAttribute('aria-selected', 'true');
  });

  it('renders a tablist container with label "Select role"', () => {
    expect(screen.getByRole('tablist', { name: /select role/i })).toBeInTheDocument();
  });
});
