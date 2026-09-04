import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { RegisterPage } from '../pages/RegisterPage';
import { AuthContext, AuthContextType } from '../context/AuthContext';

const createMockAuthContext = (overrides?: Partial<AuthContextType>): AuthContextType => ({
  status: 'anonymous',
  user: null,
  error: null,
  login: vi.fn().mockResolvedValue({} as any),
  register: vi.fn().mockResolvedValue(undefined),
  logout: vi.fn().mockResolvedValue(undefined),
  logoutAll: vi.fn().mockResolvedValue(undefined),
  refreshUser: vi.fn().mockResolvedValue(undefined),
  ...overrides,
});

describe('RegisterPage Component & Security Payload Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithAuth = (contextValue: AuthContextType) => {
    return render(
      <AuthContext.Provider value={contextValue}>
        <BrowserRouter>
          <RegisterPage />
        </BrowserRouter>
      </AuthContext.Provider>
    );
  };

  it('10. renders registration form fields (Name, Email, Phone, Password, Confirm Password)', () => {
    renderWithAuth(createMockAuthContext());
    expect(screen.getByRole('heading', { level: 1, name: /create your account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^confirm password$/i)).toBeInTheDocument();
  });

  it('13. password requirements checklist renders live items', () => {
    renderWithAuth(createMockAuthContext());
    expect(screen.getByText(/8 to 72 characters long/i)).toBeInTheDocument();
    expect(screen.getByText(/at least one uppercase letter/i)).toBeInTheDocument();
    expect(screen.getByText(/at least one number/i)).toBeInTheDocument();
  });

  it('14. validates password mismatch on submit', async () => {
    renderWithAuth(createMockAuthContext());

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Alex Mercer' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'alex@example.com' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '9876543210' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'ValidPass123!' } });
    fireEvent.change(screen.getByLabelText(/^confirm password$/i), { target: { value: 'DifferentPass123!' } });

    fireEvent.click(screen.getByRole('button', { name: /create customer account/i }));

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it('11, 12 & 15. registration sends strictly name, email, password, phone and excludes role & confirmPassword', async () => {
    const mockContext = createMockAuthContext();
    renderWithAuth(mockContext);

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Alex Mercer' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'alex@example.com' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '9876543210' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'ValidPass123!' } });
    fireEvent.change(screen.getByLabelText(/^confirm password$/i), { target: { value: 'ValidPass123!' } });

    fireEvent.click(screen.getByRole('button', { name: /create customer account/i }));

    await waitFor(() => {
      expect(mockContext.register).toHaveBeenCalledWith({
        name: 'Alex Mercer',
        email: 'alex@example.com',
        password: 'ValidPass123!',
        phone: '9876543210',
      });

      const calledPayload = (mockContext.register as any).mock.calls[0][0];
      expect(calledPayload).not.toHaveProperty('role');
      expect(calledPayload).not.toHaveProperty('confirmPassword');
      expect(calledPayload).not.toHaveProperty('salary');
      expect(calledPayload).not.toHaveProperty('managerId');
    });
  });
});
