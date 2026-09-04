import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { getRoleDestination } from '../routing/roleUtils';
import { ProtectedRoute } from '../routing/ProtectedRoute';
import { AuthContext, AuthContextType } from '../context/AuthContext';
import { AuthUser } from '../api/authContracts';

const mockCustomer: AuthUser = {
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
  login: vi.fn().mockResolvedValue({} as any),
  register: vi.fn().mockResolvedValue(undefined),
  logout: vi.fn().mockResolvedValue(undefined),
  logoutAll: vi.fn().mockResolvedValue(undefined),
  refreshUser: vi.fn().mockResolvedValue(undefined),
  ...overrides,
});

describe('Role Redirection & Protected Route Security Mapping', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('23. Customer role redirects to /customer/dashboard', () => {
    expect(getRoleDestination('CUSTOMER')).toBe('/customer/dashboard');
    expect(getRoleDestination('ROLE_CUSTOMER')).toBe('/customer/dashboard');
  });

  it('24. Manager role redirects to /manager/dashboard', () => {
    expect(getRoleDestination('MANAGER')).toBe('/manager/dashboard');
    expect(getRoleDestination('ROLE_MANAGER')).toBe('/manager/dashboard');
  });

  it('25. Mechanic role redirects to /mechanic/dashboard', () => {
    expect(getRoleDestination('MECHANIC')).toBe('/mechanic/dashboard');
    expect(getRoleDestination('ROLE_MECHANIC')).toBe('/mechanic/dashboard');
  });

  it('26. Admin role redirects to /admin/dashboard', () => {
    expect(getRoleDestination('ADMIN')).toBe('/admin/dashboard');
    expect(getRoleDestination('ROLE_ADMIN')).toBe('/admin/dashboard');
  });

  it('27 & 38. Unknown or invalid role receives no privileged route and redirects to /forbidden', () => {
    expect(getRoleDestination('UNKNOWN_ROLE')).toBe('/forbidden');
    expect(getRoleDestination('SUPERUSER')).toBe('/forbidden');
    expect(getRoleDestination('')).toBe('/forbidden');
  });

  it('21. ProtectedRoute redirects anonymous user to /login preserving target location', () => {
    render(
      <AuthContext.Provider value={createMockAuthContext({ status: 'anonymous', user: null })}>
        <MemoryRouter initialEntries={['/customer/dashboard']}>
          <Routes>
            <Route element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}>
              <Route path="/customer/dashboard" element={<div>Protected Dashboard Content</div>} />
            </Route>
            <Route path="/login" element={<div>Login Page Target</div>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Login Page Target')).toBeInTheDocument();
    expect(screen.queryByText('Protected Dashboard Content')).not.toBeInTheDocument();
  });

  it('22. ProtectedRoute allows access when user possesses an authorized role', () => {
    render(
      <AuthContext.Provider value={createMockAuthContext({ status: 'authenticated', user: mockCustomer })}>
        <MemoryRouter initialEntries={['/customer/dashboard']}>
          <Routes>
            <Route element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}>
              <Route path="/customer/dashboard" element={<div>Protected Customer Content</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Protected Customer Content')).toBeInTheDocument();
  });

  it('ProtectedRoute rejects unauthorized role and redirects to /forbidden', () => {
    render(
      <AuthContext.Provider value={createMockAuthContext({ status: 'authenticated', user: mockCustomer })}>
        <MemoryRouter initialEntries={['/admin/dashboard']}>
          <Routes>
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admin/dashboard" element={<div>Admin Only Content</div>} />
            </Route>
            <Route path="/forbidden" element={<div>Access Denied 403 Target</div>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Access Denied 403 Target')).toBeInTheDocument();
    expect(screen.queryByText('Admin Only Content')).not.toBeInTheDocument();
  });
});
