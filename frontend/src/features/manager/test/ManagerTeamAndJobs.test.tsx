import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ManagerTeamPage } from '../pages/ManagerTeamPage';
import { ManagerJobCardListPage } from '../pages/ManagerJobCardListPage';
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

describe('Manager Team & Job Cards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders team roster under manager scope', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: [
        {
          mechanicId: 5,
          mechanicName: 'Mechanic Mike',
          email: 'mike@autoserve.com',
          mobile: '9876543210',
          isActive: true,
          activeJobCount: 1,
          completedJobCount: 12,
          availabilityStatus: 'Currently assigned',
        },
      ],
    });

    render(
      <MemoryRouter>
        <ManagerTeamPage />
      </MemoryRouter>
    );

    expect(await screen.findByText('Mechanic Mike')).toBeInTheDocument();
    expect(await screen.findByText('mike@autoserve.com')).toBeInTheDocument();
    expect(await screen.findByText('Currently assigned')).toBeInTheDocument();
  });

  it('renders manager job cards list', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: [
        {
          id: 50,
          appointmentId: 101,
          status: 'IN_PROGRESS',
          customerName: 'Customer Alice',
          mechanicName: 'Mechanic Mike',
          vehicleMakeModel: 'Honda City',
        },
      ],
    });

    render(
      <MemoryRouter>
        <ManagerJobCardListPage />
      </MemoryRouter>
    );

    expect(await screen.findByText('JC#50')).toBeInTheDocument();
    expect(await screen.findByText('Honda City')).toBeInTheDocument();
    expect(await screen.findByText('Mechanic Mike')).toBeInTheDocument();
  });
});
