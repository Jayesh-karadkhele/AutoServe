import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { VehicleListPage } from '../pages/VehicleListPage';
import { AddVehiclePage } from '../pages/AddVehiclePage';
import { VehicleDetailPage } from '../pages/VehicleDetailPage';
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

describe('Vehicle Management Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('7. renders empty vehicle list state when customer has no vehicles', async () => {
    vi.mocked(customerApi.getMyVehicles).mockResolvedValue([]);

    renderWithRouter(
      <Routes>
        <Route path="/customer/vehicles" element={<VehicleListPage />} />
      </Routes>,
      '/customer/vehicles'
    );

    await waitFor(() => {
      expect(screen.getByText('No Registered Vehicles')).toBeInTheDocument();
      expect(screen.getByText('Add First Vehicle')).toBeInTheDocument();
    });
  });

  it('8. renders owned vehicle cards with exact DTO fields', async () => {
    vi.mocked(customerApi.getMyVehicles).mockResolvedValue([
      {
        id: 1,
        registrationNumber: 'KA01MJ5678',
        make: 'Hyundai',
        model: 'Creta',
        year: 2023,
        fuelType: 'DIESEL',
        vehicleType: 'SUV',
      },
    ]);

    renderWithRouter(
      <Routes>
        <Route path="/customer/vehicles" element={<VehicleListPage />} />
      </Routes>,
      '/customer/vehicles'
    );

    await waitFor(() => {
      expect(screen.getByText('Hyundai Creta')).toBeInTheDocument();
      expect(screen.getByText('KA01MJ5678')).toBeInTheDocument();
      expect(screen.getByText(/Fuel Type: DIESEL/i)).toBeInTheDocument();
    });
  });

  it('9. validates required fields on Add Vehicle form submit', async () => {
    renderWithRouter(
      <Routes>
        <Route path="/customer/vehicles/new" element={<AddVehiclePage />} />
      </Routes>,
      '/customer/vehicles/new'
    );

    const submitBtn = screen.getByRole('button', { name: /Register Vehicle/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Registration number is required.')).toBeInTheDocument();
      expect(screen.getByText(/Vehicle make is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Vehicle model is required/i)).toBeInTheDocument();
    });
  });

  it('10. normalizes registration number to uppercase before submitting payload', async () => {
    vi.mocked(customerApi.createVehicle).mockResolvedValue({
      id: 2,
      registrationNumber: 'DL03XY9999',
      make: 'Tata',
      model: 'Nexon',
    });

    renderWithRouter(
      <Routes>
        <Route path="/customer/vehicles/new" element={<AddVehiclePage />} />
        <Route path="/customer/vehicles" element={<div>Vehicle List</div>} />
      </Routes>,
      '/customer/vehicles/new'
    );

    fireEvent.change(screen.getByLabelText(/Registration \/ Licence Plate Number/i), {
      target: { value: 'dl03xy9999' },
    });
    fireEvent.change(screen.getByLabelText(/Vehicle Make \/ Manufacturer/i), {
      target: { value: 'Tata' },
    });
    fireEvent.change(screen.getByLabelText(/Vehicle Model/i), {
      target: { value: 'Nexon' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Register Vehicle/i }));

    await waitFor(() => {
      expect(customerApi.createVehicle).toHaveBeenCalledWith(
        expect.objectContaining({
          registrationNumber: 'DL03XY9999',
          make: 'Tata',
          model: 'Nexon',
        })
      );
    });
  });

  it('11. displays duplicate registration server error message', async () => {
    vi.mocked(customerApi.createVehicle).mockRejectedValue({
      response: { data: { message: 'Vehicle registration number already exists in system' } },
    });

    renderWithRouter(
      <Routes>
        <Route path="/customer/vehicles/new" element={<AddVehiclePage />} />
      </Routes>,
      '/customer/vehicles/new'
    );

    fireEvent.change(screen.getByLabelText(/Registration \/ Licence Plate Number/i), {
      target: { value: 'KA01MJ5678' },
    });
    fireEvent.change(screen.getByLabelText(/Vehicle Make \/ Manufacturer/i), {
      target: { value: 'Hyundai' },
    });
    fireEvent.change(screen.getByLabelText(/Vehicle Model/i), {
      target: { value: 'Creta' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Register Vehicle/i }));

    await waitFor(() => {
      expect(
        screen.getByText('Vehicle registration number already exists in system')
      ).toBeInTheDocument();
    });
  });

  it('12. restricts access to unowned vehicle URL with safe 403 error state', async () => {
    vi.mocked(customerApi.getVehicleById).mockRejectedValue({
      response: { status: 403 },
    });

    renderWithRouter(
      <Routes>
        <Route path="/customer/vehicles/:vehicleId" element={<VehicleDetailPage />} />
      </Routes>,
      '/customer/vehicles/999'
    );

    await waitFor(() => {
      expect(screen.getByText('Access Restricted')).toBeInTheDocument();
      expect(
        screen.getByText(/Vehicle not found or you do not have permission to view this vehicle./i)
      ).toBeInTheDocument();
    });
  });
});
