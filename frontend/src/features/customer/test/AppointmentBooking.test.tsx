import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { BookAppointmentPage } from '../pages/BookAppointmentPage';
import { AppointmentListPage } from '../pages/AppointmentListPage';
import * as customerApi from '../api/customerApi';
import { AuthContext } from '@/features/auth/context/AuthContext';

vi.mock('../api/customerApi');

const mockAuthContext = {
  user: { userId: 10, userName: 'Jane Customer', email: 'jane@example.com', userRole: 'CUSTOMER' as const, mobile: '9876543210', isActive: true },
  isAuthenticated: true,
  isLoading: false,
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  logoutAll: vi.fn(),
  refreshUser: vi.fn(),
};

const renderWithRouter = (ui: React.ReactNode, route = '/') => {
  return render(
    <AuthContext.Provider value={mockAuthContext}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </AuthContext.Provider>
  );
};

describe('Appointment Booking & List Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('13. renders multi-step booking wizard and checks vehicle selection', async () => {
    vi.mocked(customerApi.getMyVehicles).mockResolvedValue([
      { id: 1, registrationNumber: 'MH12AB1234', make: 'Honda', model: 'City' },
    ]);

    renderWithRouter(
      <Routes>
        <Route path="/customer/appointments/new" element={<BookAppointmentPage />} />
      </Routes>,
      '/customer/appointments/new'
    );

    await waitFor(() => {
      expect(screen.getByText('Step 1: Select Your Vehicle')).toBeInTheDocument();
      expect(screen.getByText('Honda City')).toBeInTheDocument();
    });
  });

  it('14. navigates through step 1 to step 4 in appointment booking flow', async () => {
    vi.mocked(customerApi.getMyVehicles).mockResolvedValue([
      { id: 1, registrationNumber: 'MH12AB1234', make: 'Honda', model: 'City' },
    ]);

    renderWithRouter(
      <Routes>
        <Route path="/customer/appointments/new" element={<BookAppointmentPage />} />
      </Routes>,
      '/customer/appointments/new'
    );

    await waitFor(() => {
      expect(screen.getByText('Step 1: Select Your Vehicle')).toBeInTheDocument();
    });

    // Step 1 -> Step 2
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    expect(screen.getByText('Step 2: Choose Service Type')).toBeInTheDocument();

    // Step 2 -> Step 3
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    expect(screen.getByText('Step 3: Preferred Date & Time')).toBeInTheDocument();

    // Step 3 -> Step 4
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    expect(screen.getByText('Step 4: Review Appointment Details')).toBeInTheDocument();
  });

  it('15. verifies customer cannot select a mechanic or manager in form UI', async () => {
    vi.mocked(customerApi.getMyVehicles).mockResolvedValue([
      { id: 1, registrationNumber: 'MH12AB1234', make: 'Honda', model: 'City' },
    ]);

    renderWithRouter(
      <Routes>
        <Route path="/customer/appointments/new" element={<BookAppointmentPage />} />
      </Routes>,
      '/customer/appointments/new'
    );

    await waitFor(() => {
      expect(screen.queryByLabelText(/select mechanic/i)).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/select manager/i)).not.toBeInTheDocument();
    });
  });

  it('16. submits booking payload and displays real appointment reference ID and PENDING initial status', async () => {
    vi.mocked(customerApi.getMyVehicles).mockResolvedValue([
      { id: 1, registrationNumber: 'MH12AB1234', make: 'Honda', model: 'City' },
    ]);

    vi.mocked(customerApi.createAppointment).mockResolvedValue({
      id: 505,
      vehicleId: 1,
      serviceType: 'Periodic Maintenance',
      preferredDate: '2026-09-15',
      timeSlot: '09:00 AM - 11:00 AM',
      status: 'PENDING',
    });

    renderWithRouter(
      <Routes>
        <Route path="/customer/appointments/new" element={<BookAppointmentPage />} />
      </Routes>,
      '/customer/appointments/new'
    );

    await waitFor(() => {
      expect(screen.getByText('Step 1: Select Your Vehicle')).toBeInTheDocument();
    });

    // Step 1 -> Step 2
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    await waitFor(() => {
      expect(screen.getByText('Step 2: Choose Service Type')).toBeInTheDocument();
    });

    // Step 2 -> Step 3
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    await waitFor(() => {
      expect(screen.getByText('Step 3: Preferred Date & Time')).toBeInTheDocument();
    });

    // Step 3 -> Step 4
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    await waitFor(() => {
      expect(screen.getByText('Step 4: Review Appointment Details')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Confirm & Submit Booking/i }));

    await waitFor(() => {
      expect(customerApi.createAppointment).toHaveBeenCalledWith(
        expect.objectContaining({
          vehicleId: 1,
          serviceType: 'Periodic Maintenance',
        }),
        undefined
      );
      expect(screen.getByText('Appointment Requested Successfully!')).toBeInTheDocument();
      expect(screen.getByText('#505')).toBeInTheDocument();
      expect(screen.getByText('PENDING')).toBeInTheDocument();
    });
  });

  it('17. filters appointments by status tabs (All, Upcoming, Active, Completed, Cancelled)', async () => {
    vi.mocked(customerApi.getMyAppointments).mockResolvedValue([
      { id: 1, vehicleId: 1, serviceType: 'Oil Change', preferredDate: '2026-09-05', status: 'PENDING' },
      { id: 2, vehicleId: 1, serviceType: 'Brake Replacement', preferredDate: '2026-09-02', status: 'COMPLETED' },
    ]);

    renderWithRouter(
      <Routes>
        <Route path="/customer/appointments" element={<AppointmentListPage />} />
      </Routes>,
      '/customer/appointments'
    );

    await waitFor(() => {
      expect(screen.getByText('Oil Change')).toBeInTheDocument();
      expect(screen.getByText('Brake Replacement')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Completed' }));

    expect(screen.queryByText('Oil Change')).not.toBeInTheDocument();
    expect(screen.getByText('Brake Replacement')).toBeInTheDocument();
  });
});
