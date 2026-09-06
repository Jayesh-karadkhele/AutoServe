import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ManagerAppointmentListPage } from '../pages/ManagerAppointmentListPage';
import { ManagerAppointmentDetailPage } from '../pages/ManagerAppointmentDetailPage';
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

describe('Manager Appointments Workflow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders list of assigned appointments with search and filtering', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: [
        {
          id: 101,
          vehicleId: 10,
          serviceType: 'Periodic Maintenance',
          preferredDate: '2026-09-15',
          status: 'PENDING',
          customerName: 'Customer Alice',
          vehicleRegistration: 'KA01AB1234',
          fulfilmentMode: 'PICKUP_AND_RETURN_REQUESTED',
        },
      ],
    });

    render(
      <MemoryRouter initialEntries={['/manager/appointments']}>
        <ManagerAppointmentListPage />
      </MemoryRouter>
    );

    expect(await screen.findByText('#101')).toBeInTheDocument();
    expect(await screen.findByText('Customer Alice')).toBeInTheDocument();
    expect((await screen.findAllByText('Pickup Requested')).length).toBeGreaterThan(0);
  });

  it('allows approving appointment and assigning mechanic', async () => {
    const mockAppt = {
      id: 101,
      vehicleId: 10,
      serviceType: 'Periodic Maintenance',
      preferredDate: '2026-09-15',
      status: 'PENDING' as const,
      customerName: 'Customer Alice',
      vehicleRegistration: 'KA01AB1234',
      fulfilmentMode: 'WORKSHOP_DROP_OFF' as const,
    };

    vi.mocked(apiClient.get).mockImplementation((url: string) => {
      if (url.includes('/team')) return Promise.resolve({ data: [] });
      return Promise.resolve({ data: mockAppt });
    });
    vi.mocked(apiClient.put).mockResolvedValue({
      data: {
        ...mockAppt,
        status: 'APPROVED',
      },
    });

    render(
      <MemoryRouter initialEntries={['/manager/appointments/101']}>
        <Routes>
          <Route path="/manager/appointments/:appointmentId" element={<ManagerAppointmentDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText('Appointment Reference #101')).toBeInTheDocument();
    expect(await screen.findByText('Approve Appointment')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Approve Appointment'));

    expect(await screen.findByRole('alert')).toHaveTextContent('Appointment approved successfully.');
  });
});
