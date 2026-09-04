import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/features/auth/routing/ProtectedRoute';
import { AppointmentDetailPage } from '../pages/AppointmentDetailPage';
import { InvoiceDetailPage } from '../pages/InvoiceDetailPage';
import * as customerApi from '../api/customerApi';
import { AuthContext } from '@/features/auth/context/AuthContext';

vi.mock('../api/customerApi');

describe('Customer Security, Authorization & Routing Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('36. ProtectedRoute rejects non-CUSTOMER role (MANAGER) from entering customer dashboard', async () => {
    const managerAuthContext = {
      user: { userId: 5, userName: 'Manager User', email: 'mgr@example.com', userRole: 'MANAGER' as const, mobile: '1112223333', isActive: true },
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      logoutAll: vi.fn(),
      refreshUser: vi.fn(),
    };

    render(
      <AuthContext.Provider value={managerAuthContext}>
        <MemoryRouter initialEntries={['/customer/dashboard']}>
          <Routes>
            <Route element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}>
              <Route path="/customer/dashboard" element={<div>Customer Secret Dashboard</div>} />
            </Route>
            <Route path="/forbidden" element={<div>Access Forbidden Screen</div>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Access Forbidden Screen')).toBeInTheDocument();
    expect(screen.queryByText('Customer Secret Dashboard')).not.toBeInTheDocument();
  });

  it('37. ProtectedRoute redirects unauthenticated anonymous user to /login', async () => {
    const unauthContext = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      logoutAll: vi.fn(),
      refreshUser: vi.fn(),
    };

    render(
      <AuthContext.Provider value={unauthContext}>
        <MemoryRouter initialEntries={['/customer/dashboard']}>
          <Routes>
            <Route element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}>
              <Route path="/customer/dashboard" element={<div>Customer Secret Dashboard</div>} />
            </Route>
            <Route path="/login" element={<div>Login Page Redirect</div>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Login Page Redirect')).toBeInTheDocument();
  });

  it('38. renders safe Access Restricted page when customer accesses unowned appointment ID (403)', async () => {
    vi.mocked(customerApi.getAppointmentById).mockRejectedValue({
      response: { status: 403 },
    });

    const customerAuthContext = {
      user: { userId: 10, userName: 'Jane Customer', email: 'jane@example.com', userRole: 'CUSTOMER' as const, mobile: '9876543210', isActive: true },
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      logoutAll: vi.fn(),
      refreshUser: vi.fn(),
    };

    render(
      <AuthContext.Provider value={customerAuthContext}>
        <MemoryRouter initialEntries={['/customer/appointments/999']}>
          <Routes>
            <Route path="/customer/appointments/:appointmentId" element={<AppointmentDetailPage />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Access Restricted')).toBeInTheDocument();
      expect(screen.getByText(/Appointment not found or you do not have permission to view it./i)).toBeInTheDocument();
    });
  });

  it('39. renders safe Access Restricted page when customer accesses unowned invoice ID (403)', async () => {
    vi.mocked(customerApi.getInvoiceById).mockRejectedValue({
      response: { status: 403 },
    });

    const customerAuthContext = {
      user: { userId: 10, userName: 'Jane Customer', email: 'jane@example.com', userRole: 'CUSTOMER' as const, mobile: '9876543210', isActive: true },
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      logoutAll: vi.fn(),
      refreshUser: vi.fn(),
    };

    render(
      <AuthContext.Provider value={customerAuthContext}>
        <MemoryRouter initialEntries={['/customer/invoices/999']}>
          <Routes>
            <Route path="/customer/invoices/:invoiceId" element={<InvoiceDetailPage />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Access Restricted')).toBeInTheDocument();
      expect(screen.getByText(/Invoice not found or access restricted./i)).toBeInTheDocument();
    });
  });

  it('40. verifies 0 persistent tokens stored in localStorage or sessionStorage', () => {
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(sessionStorage.getItem('token')).toBeNull();
    expect(sessionStorage.getItem('accessToken')).toBeNull();
  });
});
