import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { InvoiceListPage } from '../pages/InvoiceListPage';
import { InvoiceDetailPage } from '../pages/InvoiceDetailPage';
import { CustomerProfilePage } from '../pages/CustomerProfilePage';
import { RoadsideAssistancePage } from '../pages/RoadsideAssistancePage';
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

describe('Invoices, Profile & Roadside Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('22. formats invoice totals in INR currency standard', async () => {
    vi.mocked(customerApi.getMyInvoices).mockResolvedValue([
      {
        id: 701,
        invoiceNumber: 'INV-2026-001',
        jobCardId: 301,
        customerId: 10,
        laborAmount: 1500,
        partsAmount: 3500,
        taxAmount: 900,
        discountAmount: 0,
        totalAmount: 5900,
        paymentStatus: 'PENDING',
        vehicleDetails: 'MH12AB1234 - Honda City',
      },
    ]);

    renderWithRouter(
      <Routes>
        <Route path="/customer/invoices" element={<InvoiceListPage />} />
      </Routes>,
      '/customer/invoices'
    );

    await waitFor(() => {
      expect(screen.getByText('Invoice #INV-2026-001')).toBeInTheDocument();
      // Should format 5900 as INR currency containing ₹5,900.00
      expect(screen.getByText(/₹\s*5,900/i)).toBeInTheDocument();
    });
  });

  it('23. renders payment safety safeguard and ensures payment is disabled without provider', async () => {
    vi.mocked(customerApi.getInvoiceById).mockResolvedValue({
      id: 701,
      invoiceNumber: 'INV-2026-001',
      jobCardId: 301,
      customerId: 10,
      laborAmount: 1500,
      partsAmount: 3500,
      taxAmount: 900,
      discountAmount: 0,
      totalAmount: 5900,
      paymentStatus: 'PENDING',
    });

    renderWithRouter(
      <Routes>
        <Route path="/customer/invoices/:invoiceId" element={<InvoiceDetailPage />} />
      </Routes>,
      '/customer/invoices/701'
    );

    await waitFor(() => {
      expect(screen.getByText(/Payment Provider Safeguard/i)).toBeInTheDocument();
      expect(screen.getByText(/Online payment provider integration is unconfigured/i)).toBeInTheDocument();
      expect(screen.getByText('Payment Status: PENDING')).toBeInTheDocument();
    });
  });

  it('24. renders customer profile and excludes protected fields from update payload', async () => {
    vi.mocked(customerApi.getMyProfile).mockResolvedValue({
      userId: 10,
      userName: 'Jane Customer',
      email: 'jane@example.com',
      userRole: 'CUSTOMER',
      mobile: '9876543210',
      isActive: true,
    });

    vi.mocked(customerApi.updateMyProfile).mockResolvedValue({
      userId: 10,
      userName: 'Jane Updated',
      email: 'jane@example.com',
      userRole: 'CUSTOMER',
      mobile: '9999988888',
      isActive: true,
    });

    renderWithRouter(
      <Routes>
        <Route path="/customer/profile" element={<CustomerProfilePage />} />
      </Routes>,
      '/customer/profile'
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Jane Customer')).toBeInTheDocument();
      expect(screen.getByDisplayValue('jane@example.com')).toBeDisabled();
    });

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Jane Updated' } });
    fireEvent.change(screen.getByLabelText(/Mobile \/ Phone Number/i), { target: { value: '9999988888' } });

    fireEvent.click(screen.getByRole('button', { name: /Save Profile Updates/i }));

    await waitFor(() => {
      expect(customerApi.updateMyProfile).toHaveBeenCalledWith({
        userName: 'Jane Updated',
        mobile: '9999988888',
      });
    });
  });

  it('25. renders roadside assistance page with permanent Planned capability badge', async () => {
    renderWithRouter(
      <Routes>
        <Route path="/customer/roadside" element={<RoadsideAssistancePage />} />
      </Routes>,
      '/customer/roadside'
    );

    expect(screen.getByText(/Planned capability/i)).toBeInTheDocument();
    expect(screen.getByText(/GPS Route Dispatch Concept/i)).toBeInTheDocument();
    expect(screen.getByText(/112 \/ 911/i)).toBeInTheDocument();
  });
});
