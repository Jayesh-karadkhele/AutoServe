import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/features/auth/routing/ProtectedRoute';
import { ForbiddenPage } from '@/features/auth/routing/ForbiddenPage';
import { ManagerDashboardPage } from '../pages/ManagerDashboardPage';
import * as AuthContext from '@/features/auth/context/AuthContext';
import * as managerApi from '../api/managerApi';

import * as useManagerDataHooks from '../hooks/useManagerData';

vi.mock('../hooks/useManagerData', () => ({
  useManagerOverview: vi.fn(),
  useManagerAppointments: vi.fn(),
  useManagerTeam: vi.fn(),
  useManagerJobCards: vi.fn(),
  useManagerInventory: vi.fn(),
  useManagerInvoices: vi.fn(),
  useManagerReports: vi.fn(),
  useManagerActivity: vi.fn(),
}));

describe('Manager Security & Protected Routes', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(useManagerDataHooks.useManagerOverview).mockReturnValue({
      data: {
        assignedAppointmentsToday: 0,
        awaitingDecisionCount: 0,
        approvedAwaitingMechanicCount: 0,
        jobsInProgressCount: 0,
        jobsAwaitingAttentionCount: 0,
        jobsCompletedTodayCount: 0,
        activeMechanicsCount: 0,
        lowStockItemsCount: 0,
        invoiceReadyJobsCount: 0,
        outstandingInvoiceCount: 0,
        recentAppointments: [],
        activeJobCards: [],
      },
      isLoading: false,
      error: null,
      refresh: vi.fn(),
    });
  });

  it('redirects non-MANAGER authenticated users (e.g. CUSTOMER) to 403 Forbidden', async () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      status: 'authenticated',
      user: { id: 1, name: 'Alice Customer', role: 'CUSTOMER', email: 'alice@customer.com' },
      isAuthenticated: true,
      isLoading: false,
      accessToken: 'token',
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      logoutAll: vi.fn(),
      refreshUser: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/manager']}>
        <Routes>
          <Route element={<ProtectedRoute allowedRoles={['MANAGER']} />}>
            <Route path="/manager" element={<ManagerDashboardPage />} />
          </Route>
          <Route path="/forbidden" element={<ForbiddenPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/HTTP 403 Forbidden/i)).toBeInTheDocument();
      expect(screen.getByText(/Access Denied/i)).toBeInTheDocument();
    });
  });

  it('allows access to /manager when authenticated user is MANAGER', async () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: { id: 2, name: 'Bob Manager', role: 'MANAGER', email: 'bob@manager.com' },
      isAuthenticated: true,
      isLoading: false,
      accessToken: 'token',
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      logoutAll: vi.fn(),
      refreshUser: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/manager']}>
        <Routes>
          <Route element={<ProtectedRoute allowedRoles={['MANAGER']} />}>
            <Route path="/manager" element={<ManagerDashboardPage />} />
          </Route>
          <Route path="/forbidden" element={<ForbiddenPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Manager Control Tower')).toBeInTheDocument();
      expect(screen.queryByText(/403/i)).not.toBeInTheDocument();
    });
  });
});
