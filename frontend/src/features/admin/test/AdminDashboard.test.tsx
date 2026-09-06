import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';

vi.mock('../../auth/context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 1, fullName: 'Platform Admin', email: 'admin@autoserve.com', role: 'ADMIN' },
    logout: vi.fn(),
    logoutAll: vi.fn(),
  }),
}));

vi.mock('../hooks/useAdminData', () => ({
  useAdminOverview: () => ({
    overview: {
      totalCustomers: 12,
      totalManagers: 3,
      totalMechanics: 6,
      inactiveUsersCount: 1,
      unassignedAppointmentsCount: 2,
      scheduledAppointmentsCount: 4,
      inProgressAppointmentsCount: 3,
      activeJobCardsCount: 5,
      completedJobsToday: 4,
      lowStockCount: 2,
      invoiceReadyJobsCount: 4,
      outstandingInvoicesCount: 2,
      verifiedPaidInvoicesCount: 8,
      paidInvoiceTotal: 45000,
      outstandingInvoiceTotal: 12000,
      totalBilledAmount: 57000,
      recentAuditEvents: [],
    },
    loading: false,
    error: null,
    refresh: vi.fn(),
  }),
  useAdminUsers: () => ({ users: [], loading: false, error: null, refresh: vi.fn() }),
}));

describe('Admin Dashboard Overview Tests', () => {
  it('renders platform governance header and metrics cards', () => {
    render(
      <MemoryRouter>
        <AdminDashboardPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Platform Governance Overview/i)).toBeInTheDocument();
    expect(screen.getByText(/Customers/i)).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
  });
});
