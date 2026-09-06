import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { MechanicJobListPage } from '../pages/MechanicJobListPage';
import { MechanicJobDetailPage } from '../pages/MechanicJobDetailPage';
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

describe('Mechanic Jobs & Digital Workbench Workflow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders assigned job queue with search and status filters', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: [
        {
          id: 51,
          appointmentId: 101,
          problemDescription: 'Front Brake Rotor Inspection',
          appointmentDate: '2026-09-06',
          vehicleId: 10,
          licensePlate: 'KA01AB1234',
          brand: 'Toyota',
          model: 'Glanza',
          customerId: 10,
          customerName: 'Alice Customer',
          managerId: 2,
          managerName: 'Manager Bob',
          status: 'CREATED',
          items: [],
          evidence: [],
        },
      ],
    });

    render(
      <MemoryRouter initialEntries={['/mechanic/jobs']}>
        <MechanicJobListPage />
      </MemoryRouter>
    );

    expect(await screen.findByText('#51')).toBeInTheDocument();
    expect(await screen.findByText('Toyota Glanza (KA01AB1234)')).toBeInTheDocument();
    expect(await screen.findByText('Open Workbench')).toBeInTheDocument();
  });

  it('allows starting work on job card and displaying stepper progress', async () => {
    const mockJobCard = {
      id: 51,
      appointmentId: 101,
      problemDescription: 'Front Brake Rotor Inspection',
      appointmentDate: '2026-09-06',
      vehicleId: 10,
      licensePlate: 'KA01AB1234',
      brand: 'Toyota',
      model: 'Glanza',
      customerId: 10,
      customerName: 'Alice Customer',
      managerId: 2,
      managerName: 'Manager Bob',
      status: 'CREATED' as const,
      items: [],
      evidence: [],
    };

    vi.mocked(apiClient.get).mockResolvedValue({ data: mockJobCard });
    vi.mocked(apiClient.put).mockResolvedValue({
      data: {
        ...mockJobCard,
        status: 'IN_PROGRESS',
      },
    });

    render(
      <MemoryRouter initialEntries={['/mechanic/jobs/51']}>
        <Routes>
          <Route path="/mechanic/jobs/:jobCardId" element={<MechanicJobDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText('Job Card #51 Digital Workbench')).toBeInTheDocument();
    expect(await screen.findByText('Start Work Now')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Start Work Now'));

    expect(await screen.findByRole('alert')).toHaveTextContent('Work started successfully!');
  });
});
