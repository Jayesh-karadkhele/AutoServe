import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ActiveServicePage } from '../pages/ActiveServicePage';
import { EvidenceGalleryDialog } from '../components/EvidenceGalleryDialog';
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

describe('Service Tracking & Evidence Gallery Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('18. renders manual status refresh button with latest recorded status label', async () => {
    vi.mocked(customerApi.getMyJobCards).mockResolvedValue([
      {
        id: 301,
        jobCardNumber: 'JC-2026-001',
        appointmentId: 10,
        status: 'IN_PROGRESS',
        mechanicName: 'Alex Tech',
      },
    ]);

    renderWithRouter(
      <Routes>
        <Route path="/customer/service/active" element={<ActiveServicePage />} />
      </Routes>,
      '/customer/service/active'
    );

    await waitFor(() => {
      expect(screen.getByText('Latest recorded status')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Refresh Status/i })).toBeInTheDocument();
      expect(screen.getByText('Job #JC-2026-001')).toBeInTheDocument();
    });
  });

  it('19. maps active job card status to service progress timeline stages', async () => {
    vi.mocked(customerApi.getMyJobCards).mockResolvedValue([
      {
        id: 301,
        appointmentId: 10,
        status: 'IN_PROGRESS',
        reportedIssues: 'Engine noise',
      },
    ]);

    renderWithRouter(
      <Routes>
        <Route path="/customer/service/active" element={<ActiveServicePage />} />
      </Routes>,
      '/customer/service/active'
    );

    await waitFor(() => {
      expect(screen.getByText('Appointment Requested')).toBeInTheDocument();
      expect(screen.getByText('Manager Reviewed')).toBeInTheDocument();
      expect(screen.getByText('Mechanic Assigned')).toBeInTheDocument();
      expect(screen.getByText('Work Started')).toBeInTheDocument();
    });
  });

  it('20. renders evidence photo gallery grid and triggers modal viewer', async () => {
    vi.mocked(customerApi.getMyJobCards).mockResolvedValue([
      {
        id: 301,
        appointmentId: 10,
        status: 'IN_PROGRESS',
        evidenceList: [
          {
            id: 1,
            imageUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
            caption: 'Front Brake Disc Wear Inspection',
            stage: 'DISASSEMBLY',
          },
        ],
      },
    ]);

    renderWithRouter(
      <Routes>
        <Route path="/customer/service/active" element={<ActiveServicePage />} />
      </Routes>,
      '/customer/service/active'
    );

    await waitFor(() => {
      expect(screen.getByText('Front Brake Disc Wear Inspection')).toBeInTheDocument();
    });

    const photoBtn = screen.getByRole('button', { name: /View evidence photo 1/i });
    fireEvent.click(photoBtn);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Repair Evidence Photo 1 of 1')).toBeInTheDocument();
    });
  });

  it('21. closes evidence gallery dialog on Escape key press', async () => {
    const handleClose = vi.fn();
    const evidence = [
      { id: 1, imageUrl: 'http://example.com/photo.jpg', caption: 'Sample photo', stage: 'TEST' },
    ];

    render(
      <EvidenceGalleryDialog
        isOpen={true}
        onClose={handleClose}
        evidenceList={evidence}
        initialIndex={0}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
