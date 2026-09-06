import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { AccountSecurityPage } from '../pages/AccountSecurityPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/ResetPasswordPage';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 1, email: 'customer@autoserve.com', role: 'CUSTOMER', name: 'Test User' },
    logout: vi.fn(),
  }),
}));

describe('Account Security & Password Recovery Tests', () => {
  it('1. AccountSecurityPage renders password change form fields', () => {
    render(
      <MemoryRouter>
        <AccountSecurityPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/Account Password Control/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Current Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^New Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm New Password/i)).toBeInTheDocument();
  });

  it('2. ForgotPasswordPage renders email input form', () => {
    render(
      <MemoryRouter>
        <ForgotPasswordPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/Password Recovery/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send Reset Instructions/i })).toBeInTheDocument();
  });

  it('3. ResetPasswordPage renders token and new password form fields', () => {
    render(
      <MemoryRouter>
        <ResetPasswordPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/Set New Account Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Reset Verification Token/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^New Password/i)).toBeInTheDocument();
  });

  it('4. ResetPasswordPage extracts token from location hash and cleans history', () => {
    window.location.hash = '#token=test_hash_token_123';
    const replaceStateSpy = vi.spyOn(window.history, 'replaceState');

    render(
      <MemoryRouter>
        <ResetPasswordPage />
      </MemoryRouter>
    );

    const tokenInput = screen.getByLabelText(/Reset Verification Token/i) as HTMLInputElement;
    expect(tokenInput.value).toBe('test_hash_token_123');
    expect(replaceStateSpy).toHaveBeenCalledWith(null, '', window.location.pathname);
  });
});
