import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ManagerDashboardPage } from '../pages/ManagerDashboardPage';
import { apiClient } from '@/lib/api/apiClient';

vi.mock('@/lib/api/apiClient');
vi.mock('@/features/auth/context/AuthContext', () => ({
  useAuth: () => ({
    status: 'authenticated',
    isAuthenticated: true,
    user: { id: 2, name: 'Manager Bob', role: 'MANAGER', email: 'manager@autoserve.com' },
    logout: vi.fn(),
    logoutAll: vi.fn(),
  }),
}));

describe('ManagerDashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders operational header and real persisted metrics', async () => {
    vi.mocked(apiClient.get).mockImplementation(() =>
      Promise.resolve({
        data: {
          assignedAppointmentsToday: 5,
          awaitingDecisionCount: 2,
          approvedAwaitingMechanicCount: 1,
          jobsInProgressCount: 3,
          jobsAwaitingAttentionCount: 2,
          jobsCompletedTodayCount: 4,
          activeMechanicsCount: 3,
          lowStockItemsCount: 1,
          invoiceReadyJobsCount: 2,
          outstandingInvoiceCount: 3,
          recentAppointments: [],
          activeJobCards: [],
        },
      })
    );

    render(
      <MemoryRouter initialEntries={['/manager']}>
        <ManagerDashboardPage />
      </MemoryRouter>
    );

    expect(await screen.findByText(/Workshop Operations Center/i)).toBeInTheDocument();
    expect(await screen.findByText("Today's Appointments")).toBeInTheDocument();
    expect(await screen.findByText('5')).toBeInTheDocument();
    expect(await screen.findByText('Jobs In Progress')).toBeInTheDocument();
    expect((await screen.findAllByText('3')).length).toBeGreaterThan(0);
  });

  it('displays error message when overview fetch fails', async () => {
    vi.mocked(apiClient.get).mockImplementation(() =>
      Promise.reject(new Error('Network error loading overview'))
    );

    render(
      <MemoryRouter initialEntries={['/manager']}>
        <ManagerDashboardPage />
      </MemoryRouter>
    );

    expect(await screen.findByRole('alert')).toHaveTextContent('Network error loading overview');
  });
});
