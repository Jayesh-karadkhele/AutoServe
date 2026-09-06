import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MechanicDashboardPage } from '../pages/MechanicDashboardPage';
import { apiClient } from '@/lib/api/apiClient';

vi.mock('@/lib/api/apiClient');
vi.mock('@/features/auth/context/AuthContext', () => ({
  useAuth: () => ({
    status: 'authenticated',
    isAuthenticated: true,
    user: { id: 10, name: 'Suresh Mechanic', role: 'MECHANIC', email: 'suresh@autoserve.com' },
    logout: vi.fn(),
    logoutAll: vi.fn(),
  }),
}));

describe('MechanicDashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders mechanic digital workbench header and active job card focus', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: {
        activeJobCard: {
          id: 51,
          appointmentId: 101,
          problemDescription: 'Brake Pad Replacement & Fluid Flush',
          appointmentDate: '2026-09-06',
          vehicleId: 10,
          licensePlate: 'KA-01-MJ-8899',
          brand: 'Toyota',
          model: 'Glanza G',
          customerId: 10,
          customerName: 'Ananya Sharma',
          managerId: 2,
          managerName: 'Robert Vance',
          status: 'IN_PROGRESS',
          items: [],
          evidence: [],
        },
        assignedJobsCount: 3,
        jobsAwaitingStartCount: 2,
        jobsInProgressCount: 1,
        jobsCompletedTodayCount: 5,
        totalCompletedCount: 28,
        recentAssignedJobs: [],
        recentCompletedJobs: [],
      },
    });

    render(
      <MemoryRouter initialEntries={['/mechanic']}>
        <MechanicDashboardPage />
      </MemoryRouter>
    );

    expect(await screen.findByText('Digital Workbench Today')).toBeInTheDocument();
    expect(await screen.findByText('Toyota Glanza G (KA-01-MJ-8899)')).toBeInTheDocument();
    expect(await screen.findByText('Continue Work')).toBeInTheDocument();
  });

  it('displays error message when overview fetch fails', async () => {
    vi.mocked(apiClient.get).mockRejectedValue({
      response: { data: { message: 'Internal Server Error' } },
    });

    render(
      <MemoryRouter initialEntries={['/mechanic']}>
        <MechanicDashboardPage />
      </MemoryRouter>
    );

    expect(await screen.findByRole('alert')).toHaveTextContent('Internal Server Error');
  });
});
