import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { AuthContext, AuthContextType } from '../context/AuthContext';
import { AuthUser } from '../api/authContracts';

const mockUser: AuthUser = {
  id: 1,
  name: 'John Customer',
  email: 'customer@autoserve.com',
  role: 'CUSTOMER',
  phone: '9876543210',
  isActive: true,
};

const createMockAuthContext = (overrides?: Partial<AuthContextType>): AuthContextType => ({
  status: 'anonymous',
  user: null,
  error: null,
  login: vi.fn().mockResolvedValue(mockUser),
  register: vi.fn().mockResolvedValue(undefined),
  logout: vi.fn().mockResolvedValue(undefined),
  logoutAll: vi.fn().mockResolvedValue(undefined),
  refreshUser: vi.fn().mockResolvedValue(undefined),
  ...overrides,
});

describe('LoginPage Component & Accessibility Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithAuth = (contextValue: AuthContextType) => {
    return render(
      <AuthContext.Provider value={contextValue}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </AuthContext.Provider>
    );
  };

  it('1. renders login form with email and password fields, labels, and titles', () => {
    renderWithAuth(createMockAuthContext());
    expect(screen.getByRole('heading', { level: 1, name: /welcome back/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in to autoserve/i })).toBeInTheDocument();
  });

  it('2. password visibility toggle button toggles password input type', () => {
    renderWithAuth(createMockAuthContext());
    const passwordInput = screen.getByLabelText(/^password$/i) as HTMLInputElement;
    expect(passwordInput.type).toBe('password');

    const toggleButton = screen.getByRole('button', { name: /show password/i });
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');

    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  });

  it('3. client-side validation triggers on empty submit', async () => {
    renderWithAuth(createMockAuthContext());
    const submitButton = screen.getByRole('button', { name: /sign in to autoserve/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('4 & 7. successful login submits payload and calls login context handler', async () => {
    const mockContext = createMockAuthContext();
    renderWithAuth(mockContext);

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'customer@autoserve.com' },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'CustomerPass123!' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in to autoserve/i }));

    await waitFor(() => {
      expect(mockContext.login).toHaveBeenCalledWith({
        email: 'customer@autoserve.com',
        password: 'CustomerPass123!',
      });
    });
  });

  it('8 & 37. invalid login 401 error renders accessible alert with role="alert"', async () => {
    const mockContext = createMockAuthContext({
      login: vi.fn().mockRejectedValue({ response: { status: 401 } }),
    });

    renderWithAuth(mockContext);

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'wrong@autoserve.com' },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'WrongPass123!' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in to autoserve/i }));

    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent(/we couldn’t sign you in with those details/i);
    });
  });

  it('9. prevents double submission while request is loading', async () => {
    let resolveLogin: (value: AuthUser) => void;
    const pendingLogin = new Promise<AuthUser>((resolve) => {
      resolveLogin = resolve;
    });

    const mockContext = createMockAuthContext({
      login: vi.fn().mockReturnValue(pendingLogin),
    });

    renderWithAuth(mockContext);

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'customer@autoserve.com' },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'CustomerPass123!' },
    });

    const submitBtn = screen.getByRole('button', { name: /sign in to autoserve/i });
    fireEvent.click(submitBtn);

    expect(submitBtn).toBeDisabled();
    expect(screen.getByText(/processing/i)).toBeInTheDocument();

    resolveLogin!(mockUser);
  });
});
