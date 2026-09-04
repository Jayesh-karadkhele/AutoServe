import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { CustomerShell } from '../components/CustomerShell';
import { AuthContext } from '@/features/auth/context/AuthContext';

const mockLogout = vi.fn().mockResolvedValue(undefined);
const mockLogoutAll = vi.fn().mockResolvedValue(undefined);

const mockAuthContext = {
  user: {
    userId: 10,
    userName: 'Jane Customer',
    email: 'jane@example.com',
    userRole: 'CUSTOMER' as const,
    mobile: '9876543210',
    isActive: true,
  },
  isAuthenticated: true,
  isLoading: false,
  login: vi.fn(),
  register: vi.fn(),
  logout: mockLogout,
  logoutAll: mockLogoutAll,
  refreshUser: vi.fn(),
};

const renderShell = (ui: React.ReactNode = <div>Shell Content</div>, route = '/customer/dashboard', breadcrumbs = []) => {
  return render(
    <AuthContext.Provider value={mockAuthContext}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route
            path="/customer/*"
            element={
              <CustomerShell pageTitle="Test Page" breadcrumbs={breadcrumbs}>
                {ui}
              </CustomerShell>
            }
          />
          <Route path="/login" element={<div>Login Screen</div>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

describe('CustomerShell Accessibility & Navigation Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('26. renders skip link targeting main-customer-content', () => {
    renderShell();
    const skipLink = screen.getByText('Skip to main content');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-customer-content');
  });

  it('27. renders brand logo pointing to customer dashboard', () => {
    renderShell();
    expect(screen.getByText('Customer Portal')).toBeInTheDocument();
  });

  it('28. renders desktop sidebar navigation items', () => {
    renderShell();
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getAllByText('My Vehicles').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Appointments')).toBeInTheDocument();
    expect(screen.getByText('Service Tracking')).toBeInTheDocument();
    expect(screen.getByText('Invoices')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Roadside')).toBeInTheDocument();
  });

  it('29. toggles mobile navigation drawer open and closed', async () => {
    renderShell();
    const toggleBtn = screen.getByRole('button', { name: /Open menu/i });
    expect(toggleBtn).toBeInTheDocument();

    fireEvent.click(toggleBtn);
    expect(screen.getByText('AutoServe Menu')).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /Close navigation/i });
    fireEvent.click(closeBtn);
    expect(screen.queryByText('AutoServe Menu')).not.toBeInTheDocument();
  });

  it('30. opens user profile dropdown menu and triggers single session logout', async () => {
    renderShell();
    const profileBtn = screen.getByRole('button', { name: /User account menu/i });
    fireEvent.click(profileBtn);

    expect(screen.getByText('Authenticated Customer')).toBeInTheDocument();

    const signOutBtns = screen.getAllByRole('button', { name: /Sign Out/i });
    fireEvent.click(signOutBtns[0]);

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });

  it('31. triggers logout all sessions from profile dropdown', async () => {
    renderShell();
    const profileBtn = screen.getByRole('button', { name: /User account menu/i });
    fireEvent.click(profileBtn);

    const signOutAllBtn = screen.getByRole('button', { name: /Sign Out All Devices/i });
    fireEvent.click(signOutAllBtn);

    await waitFor(() => {
      expect(mockLogoutAll).toHaveBeenCalledTimes(1);
    });
  });

  it('32. renders breadcrumb trails correctly', () => {
    renderShell(<div>Child</div>, '/customer/vehicles/new', [
      { label: 'My Vehicles', href: '/customer/vehicles' },
      { label: 'Add Vehicle' },
    ]);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getAllByText('My Vehicles').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Add Vehicle')).toBeInTheDocument();
  });

  it('33. marks active navigation link with aria-current="page"', () => {
    renderShell(<div>Overview</div>, '/customer/dashboard');
    const overviewLink = screen.getByRole('link', { name: /Overview/i });
    expect(overviewLink).toHaveAttribute('aria-current', 'page');
  });

  it('34. renders children content inside main landmark', () => {
    renderShell(<div data-testid="test-child">Child Component</div>);
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('35. renders planned capability badge on Roadside nav item', () => {
    renderShell();
    expect(screen.getByText('Planned')).toBeInTheDocument();
  });
});
