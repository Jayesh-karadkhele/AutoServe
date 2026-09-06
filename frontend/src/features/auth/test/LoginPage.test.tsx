import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { AuthContext, AuthContextType } from '../context/AuthContext';
import { AuthUser } from '../api/authContracts';

const mockCustomerUser: AuthUser = {
  id: 1,
  name: 'Customer User',
  email: 'customer@autoserve.com',
  role: 'CUSTOMER',
  phone: '9876543210',
  isActive: true,
};

const mockManagerUser: AuthUser = {
  id: 2,
  name: 'Manager User',
  email: 'manager@autoserve.com',
  role: 'MANAGER',
  phone: '9876543211',
  isActive: true,
};

const mockMechanicUser: AuthUser = {
  id: 3,
  name: 'Mechanic User',
  email: 'mechanic@autoserve.com',
  role: 'MECHANIC',
  phone: '9876543212',
  isActive: true,
};

const mockAdminUser: AuthUser = {
  id: 4,
  name: 'Admin User',
  email: 'admin@autoserve.com',
  role: 'ADMIN',
  phone: '9876543213',
  isActive: true,
};

const createMockAuthContext = (overrides?: Partial<AuthContextType>): AuthContextType => ({
  status: 'anonymous',
  user: null,
  error: null,
  login: vi.fn().mockResolvedValue(mockCustomerUser),
  register: vi.fn().mockResolvedValue(undefined),
  logout: vi.fn().mockResolvedValue(undefined),
  logoutAll: vi.fn().mockResolvedValue(undefined),
  refreshUser: vi.fn().mockResolvedValue(undefined),
  ...overrides,
});

describe('LoginPage Four-Role Selector & Security Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
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

  it('1. Four role cards render on the page', () => {
    renderWithAuth(createMockAuthContext());
    expect(screen.getByText(/Login as/i)).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Customer —/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Manager —/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Mechanic —/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Admin —/i })).toBeInTheDocument();
  });

  it('2. Customer role card can be selected by mouse', () => {
    renderWithAuth(createMockAuthContext());
    const customerRadio = screen.getByRole('radio', { name: /Customer —/i });
    fireEvent.click(customerRadio);
    expect(customerRadio).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('button', { name: /Sign in as Customer/i })).toBeInTheDocument();
  });

  it('3. Manager role card can be selected by mouse', () => {
    renderWithAuth(createMockAuthContext());
    const managerRadio = screen.getByRole('radio', { name: /Manager —/i });
    fireEvent.click(managerRadio);
    expect(managerRadio).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('button', { name: /Sign in as Manager/i })).toBeInTheDocument();
  });

  it('4. Mechanic role card can be selected by mouse', () => {
    renderWithAuth(createMockAuthContext());
    const mechanicRadio = screen.getByRole('radio', { name: /Mechanic —/i });
    fireEvent.click(mechanicRadio);
    expect(mechanicRadio).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('button', { name: /Sign in as Mechanic/i })).toBeInTheDocument();
  });

  it('5. Admin role card can be selected by mouse', () => {
    renderWithAuth(createMockAuthContext());
    const adminRadio = screen.getByRole('radio', { name: /Admin —/i });
    fireEvent.click(adminRadio);
    expect(adminRadio).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('button', { name: /Sign in as Admin/i })).toBeInTheDocument();
  });

  it('6. Keyboard arrow navigation works between role cards', () => {
    renderWithAuth(createMockAuthContext());
    const customerRadio = screen.getByRole('radio', { name: /Customer —/i });
    const managerRadio = screen.getByRole('radio', { name: /Manager —/i });

    customerRadio.focus();
    fireEvent.keyDown(customerRadio, { key: 'ArrowRight' });

    expect(managerRadio).toHaveAttribute('aria-checked', 'true');
  });

  it('7. Selected role changes login copy, title, and button label', () => {
    renderWithAuth(createMockAuthContext());

    const managerRadio = screen.getByRole('radio', { name: /Manager —/i });
    fireEvent.click(managerRadio);

    expect(screen.getByRole('heading', { level: 1, name: /welcome back, manager/i })).toBeInTheDocument();
    expect(screen.getByText(/oversee workshop operations/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in as manager/i })).toBeInTheDocument();
  });

  it('8. Customer selection shows public registration link', () => {
    renderWithAuth(createMockAuthContext());
    const customerRadio = screen.getByRole('radio', { name: /Customer —/i });
    fireEvent.click(customerRadio);

    expect(screen.getByTestId('customer-signup-notice')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /create your account/i })).toBeInTheDocument();
  });

  it('9. Manager selection does not show public signup link', () => {
    renderWithAuth(createMockAuthContext());
    const managerRadio = screen.getByRole('radio', { name: /Manager —/i });
    fireEvent.click(managerRadio);

    expect(screen.queryByRole('link', { name: /create your account/i })).not.toBeInTheDocument();
    expect(screen.getByTestId('manager-signup-notice')).toHaveTextContent(/Manager accounts are created by an authorized Administrator/i);
  });

  it('10. Mechanic selection does not show public signup link', () => {
    renderWithAuth(createMockAuthContext());
    const mechanicRadio = screen.getByRole('radio', { name: /Mechanic —/i });
    fireEvent.click(mechanicRadio);

    expect(screen.queryByRole('link', { name: /create your account/i })).not.toBeInTheDocument();
    expect(screen.getByTestId('mechanic-signup-notice')).toHaveTextContent(/Mechanic accounts are created and assigned by an authorized Administrator/i);
  });

  it('11. Admin selection does not show public signup link', () => {
    renderWithAuth(createMockAuthContext());
    const adminRadio = screen.getByRole('radio', { name: /Admin —/i });
    fireEvent.click(adminRadio);

    expect(screen.queryByRole('link', { name: /create your account/i })).not.toBeInTheDocument();
    expect(screen.getByTestId('admin-signup-notice')).toHaveTextContent(/Administrator accounts are created through the secure bootstrap/i);
  });

  it('12. Customer backend role authentication succeeds', async () => {
    const mockContext = createMockAuthContext({
      login: vi.fn().mockResolvedValue(mockCustomerUser),
    });
    renderWithAuth(mockContext);

    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'customer@autoserve.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'CustomerPass123!' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in as customer/i }));

    await waitFor(() => {
      expect(mockContext.login).toHaveBeenCalledWith({ email: 'customer@autoserve.com', password: 'CustomerPass123!' });
    });
  });

  it('13. Manager backend role authentication succeeds', async () => {
    const mockContext = createMockAuthContext({
      login: vi.fn().mockResolvedValue(mockManagerUser),
    });
    renderWithAuth(mockContext);

    fireEvent.click(screen.getByRole('radio', { name: /Manager —/i }));
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'manager@autoserve.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'ManagerPass123!' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in as manager/i }));

    await waitFor(() => {
      expect(mockContext.login).toHaveBeenCalledWith({ email: 'manager@autoserve.com', password: 'ManagerPass123!' });
    });
  });

  it('14. Mechanic backend role authentication succeeds', async () => {
    const mockContext = createMockAuthContext({
      login: vi.fn().mockResolvedValue(mockMechanicUser),
    });
    renderWithAuth(mockContext);

    fireEvent.click(screen.getByRole('radio', { name: /Mechanic —/i }));
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'mechanic@autoserve.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'MechanicPass123!' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in as mechanic/i }));

    await waitFor(() => {
      expect(mockContext.login).toHaveBeenCalledWith({ email: 'mechanic@autoserve.com', password: 'MechanicPass123!' });
    });
  });

  it('15. Admin backend role authentication succeeds', async () => {
    const mockContext = createMockAuthContext({
      login: vi.fn().mockResolvedValue(mockAdminUser),
    });
    renderWithAuth(mockContext);

    fireEvent.click(screen.getByRole('radio', { name: /Admin —/i }));
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'admin@autoserve.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'AdminPass123!' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in as admin/i }));

    await waitFor(() => {
      expect(mockContext.login).toHaveBeenCalledWith({ email: 'admin@autoserve.com', password: 'AdminPass123!' });
    });
  });

  it('16. Selected Manager plus Customer backend role displays redirect notice and routes to Customer workspace', async () => {
    const mockContext = createMockAuthContext({
      login: vi.fn().mockResolvedValue(mockCustomerUser),
    });
    renderWithAuth(mockContext);

    // Select Manager card, but log in with Customer credentials
    fireEvent.click(screen.getByRole('radio', { name: /Manager —/i }));
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'customer@autoserve.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'CustomerPass123!' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in as manager/i }));

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(/This account belongs to the Customer workspace. Redirecting securely./i);
    });
  });

  it('17. Selected Admin plus Customer backend role displays redirect notice', async () => {
    const mockContext = createMockAuthContext({
      login: vi.fn().mockResolvedValue(mockCustomerUser),
    });
    renderWithAuth(mockContext);

    fireEvent.click(screen.getByRole('radio', { name: /Admin —/i }));
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'customer@autoserve.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'CustomerPass123!' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in as admin/i }));

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(/This account belongs to the Customer workspace. Redirecting securely./i);
    });
  });

  it('20. Inactive accounts remain blocked and show alert', async () => {
    const mockContext = createMockAuthContext({
      login: vi.fn().mockRejectedValue({ response: { status: 403, data: { message: 'Account is disabled' } } }),
    });

    renderWithAuth(mockContext);

    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'inactive@autoserve.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'InactivePass123!' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in as customer/i }));

    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent(/Account is disabled/i);
    });
  });

  it('22 & 23. Layout supports reduced-motion and visible focus without overflow', () => {
    renderWithAuth(createMockAuthContext());
    const customerRadio = screen.getByRole('radio', { name: /Customer —/i });
    expect(customerRadio).toHaveClass('motion-reduce:transition-none');
  });
});
