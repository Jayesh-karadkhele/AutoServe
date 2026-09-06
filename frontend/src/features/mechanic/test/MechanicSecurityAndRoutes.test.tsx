import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/features/auth/routing/ProtectedRoute';
import { ForbiddenPage } from '@/features/auth/routing/ForbiddenPage';
import { MechanicDashboardPage } from '../pages/MechanicDashboardPage';
import { apiClient } from '@/lib/api/apiClient';

vi.mock('@/lib/api/apiClient');

let mockUserRole = 'CUSTOMER';

vi.mock('@/features/auth/context/AuthContext', () => ({
  useAuth: () => ({
    status: 'authenticated',
    isAuthenticated: true,
    user: { id: 1, name: 'Alice Customer', role: mockUserRole, email: 'alice@customer.com' },
    logout: vi.fn(),
    logoutAll: vi.fn(),
  }),
}));

describe('Mechanic Security & Protected Routes', () => {
  it('redirects non-MECHANIC authenticated users (e.g. CUSTOMER) to 403 Forbidden', async () => {
    mockUserRole = 'CUSTOMER';

    render(
      <MemoryRouter initialEntries={['/mechanic']}>
        <Routes>
          <Route element={<ProtectedRoute allowedRoles={['MECHANIC']} />}>
            <Route path="/mechanic" element={<MechanicDashboardPage />} />
          </Route>
          <Route path="/forbidden" element={<ForbiddenPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText('Access Denied')).toBeInTheDocument();
  });

  it('allows access to /mechanic when authenticated user is MECHANIC', async () => {
    mockUserRole = 'MECHANIC';
    vi.mocked(apiClient.get).mockResolvedValue({
      data: {
        activeJobCard: null,
        assignedJobsCount: 0,
        jobsAwaitingStartCount: 0,
        jobsInProgressCount: 0,
        jobsCompletedTodayCount: 0,
        totalCompletedCount: 0,
        recentAssignedJobs: [],
        recentCompletedJobs: [],
      },
    });

    render(
      <MemoryRouter initialEntries={['/mechanic']}>
        <Routes>
          <Route element={<ProtectedRoute allowedRoles={['MECHANIC']} />}>
            <Route path="/mechanic" element={<MechanicDashboardPage />} />
          </Route>
          <Route path="/forbidden" element={<ForbiddenPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText('Digital Workbench Today')).toBeInTheDocument();
  });
});
