import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { CustomerDashboardPage } from '../pages/CustomerDashboardPage';
import * as customerApi from '../api/customerApi';
import { AuthContext } from '@/features/auth/context/AuthContext';

vi.mock('../api/customerApi');

const mockUser = {
  userId: 10,
  name: 'Jane Customer',
  userName: 'Jane Customer',
  email: 'jane@example.com',
  userRole: 'CUSTOMER' as const,
  mobile: '9876543210',
  isActive: true,
};

const mockAuthContext = {
  user: mockUser,
  isAuthenticated: true,
  isLoading: false,
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  logoutAll: vi.fn(),
  refreshUser: vi.fn(),
};

const renderWithProviders = (initialRoute = '/customer/dashboard') => {
  return render(
    <AuthContext.Provider value={mockAuthContext}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/customer/dashboard" element={<CustomerDashboardPage />} />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

describe('CustomerDashboardPage Component & Authorization Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1. renders welcome header with customer name', async () => {
    vi.mocked(customerApi.getMyVehicles).mockResolvedValue([]);
    vi.mocked(customerApi.getMyAppointments).mockResolvedValue([]);
    vi.mocked(customerApi.getMyJobCards).mockResolvedValue([]);
    vi.mocked(customerApi.getMyInvoices).mockResolvedValue([]);

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText(/Welcome back, Jane Customer!/i)).toBeInTheDocument();
    });
  });

  it('2. displays loading skeleton while fetching API data', () => {
    vi.mocked(customerApi.getMyVehicles).mockReturnValue(new Promise(() => {}));
    vi.mocked(customerApi.getMyAppointments).mockReturnValue(new Promise(() => {}));
    vi.mocked(customerApi.getMyJobCards).mockReturnValue(new Promise(() => {}));
    vi.mocked(customerApi.getMyInvoices).mockReturnValue(new Promise(() => {}));

    renderWithProviders();

    expect(screen.getByTestId('dashboard-loading-skeleton')).toBeInTheDocument();
  });

  it('3. renders API error banner and retry button on network failure', async () => {
    vi.mocked(customerApi.getMyVehicles).mockRejectedValue(new Error('Network error loading vehicles'));
    vi.mocked(customerApi.getMyAppointments).mockResolvedValue([]);
    vi.mocked(customerApi.getMyJobCards).mockResolvedValue([]);
    vi.mocked(customerApi.getMyInvoices).mockResolvedValue([]);

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText(/Error Loading Dashboard Data/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Retry Loading/i })).toBeInTheDocument();
    });
  });

  it('4. renders quick action navigation links (Add Vehicle, Book Service, Active Tracker, View Invoices)', async () => {
    vi.mocked(customerApi.getMyVehicles).mockResolvedValue([]);
    vi.mocked(customerApi.getMyAppointments).mockResolvedValue([]);
    vi.mocked(customerApi.getMyJobCards).mockResolvedValue([]);
    vi.mocked(customerApi.getMyInvoices).mockResolvedValue([]);

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText('Add Vehicle')).toBeInTheDocument();
      expect(screen.getByText('Book Service')).toBeInTheDocument();
      expect(screen.getByText('Active Tracker')).toBeInTheDocument();
      expect(screen.getByText('View Invoices')).toBeInTheDocument();
    });
  });

  it('5. answers core questions with real vehicle and appointment data', async () => {
    vi.mocked(customerApi.getMyVehicles).mockResolvedValue([
      {
        id: 1,
        registrationNumber: 'MH12AB1234',
        make: 'Honda',
        model: 'City',
        year: 2022,
        fuelType: 'PETROL',
      },
    ]);

    vi.mocked(customerApi.getMyAppointments).mockResolvedValue([
      {
        id: 101,
        vehicleId: 1,
        vehicleRegistration: 'MH12AB1234',
        serviceType: 'Full General Inspection',
        preferredDate: '2026-09-10',
        status: 'PENDING',
      },
    ]);

    vi.mocked(customerApi.getMyJobCards).mockResolvedValue([]);
    vi.mocked(customerApi.getMyInvoices).mockResolvedValue([]);

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText('Honda City')).toBeInTheDocument();
      expect(screen.getByText('MH12AB1234')).toBeInTheDocument();
      expect(screen.getByText('Full General Inspection')).toBeInTheDocument();
    });
  });

  it('6. displays roadside assistance planned capability badge', async () => {
    vi.mocked(customerApi.getMyVehicles).mockResolvedValue([]);
    vi.mocked(customerApi.getMyAppointments).mockResolvedValue([]);
    vi.mocked(customerApi.getMyJobCards).mockResolvedValue([]);
    vi.mocked(customerApi.getMyInvoices).mockResolvedValue([]);

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText(/Planned capability/i)).toBeInTheDocument();
      expect(screen.getByText(/Roadside Assistance/i)).toBeInTheDocument();
    });
  });
});
