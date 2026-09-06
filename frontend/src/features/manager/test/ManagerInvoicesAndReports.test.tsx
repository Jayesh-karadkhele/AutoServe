import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ManagerInvoiceListPage } from '../pages/ManagerInvoiceListPage';
import { ManagerReportsPage } from '../pages/ManagerReportsPage';
import { ManagerInventoryPage } from '../pages/ManagerInventoryPage';
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

describe('Manager Invoices, Reports & Inventory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders invoices list', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: [
        {
          id: 301,
          invoiceNumber: 'INV-2026-001',
          jobCardId: 50,
          customerId: 1,
          customerName: 'Customer Alice',
          baseAmount: 1000,
          laborCost: 500,
          taxPercentage: 18,
          taxAmount: 270,
          totalAmount: 1770,
          paymentStatus: 'PENDING',
        },
      ],
    });

    render(
      <MemoryRouter>
        <ManagerInvoiceListPage />
      </MemoryRouter>
    );

    expect(await screen.findByText('INV-2026-001')).toBeInTheDocument();
    expect(await screen.findByText('Customer Alice')).toBeInTheDocument();
  });

  it('renders operational reports summary', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: {
        appointmentsByStatus: { PENDING: 2, APPROVED: 5 },
        jobsByStatus: { IN_PROGRESS: 3, COMPLETED: 10 },
        mechanicWorkload: [],
        totalBilledValue: 15000,
        paidInvoiceValue: 10000,
        outstandingInvoiceValue: 5000,
        totalInvoicesCount: 8,
        paidInvoicesCount: 5,
        pendingInvoicesCount: 3,
      },
    });

    render(
      <MemoryRouter>
        <ManagerReportsPage />
      </MemoryRouter>
    );

    expect(await screen.findByText('Team Operational Metrics')).toBeInTheDocument();
    expect(await screen.findByText('Total Billed Value')).toBeInTheDocument();
  });

  it('renders inventory master list', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: [
        {
          id: 1,
          skuCode: 'OIL-SYN-5W30',
          itemName: 'Synthetic Engine Oil 5W30',
          unitPrice: 2500,
          stockQuantity: 15,
          reorderLevel: 5,
        },
      ],
    });

    render(
      <MemoryRouter>
        <ManagerInventoryPage />
      </MemoryRouter>
    );

    expect(await screen.findByText('OIL-SYN-5W30')).toBeInTheDocument();
    expect(await screen.findByText('Synthetic Engine Oil 5W30')).toBeInTheDocument();
  });
});
