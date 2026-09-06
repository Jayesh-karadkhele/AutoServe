import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { ProtectedRoute } from '../../auth/routing/ProtectedRoute';
import { ForbiddenPage } from '../../auth/routing/ForbiddenPage';

vi.mock('../../auth/context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 3, fullName: 'Customer User', email: 'customer@autoserve.com', role: 'CUSTOMER' },
    isAuthenticated: true,
    isLoading: false,
  }),
}));

describe('Admin Security & Protected Routes', () => {
  it('redirects non-ADMIN authenticated users (e.g. CUSTOMER) to 403 Forbidden', async () => {
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<div>Protected Admin Dashboard</div>} />
          </Route>
          <Route path="/forbidden" element={<ForbiddenPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Access Denied/i)).toBeInTheDocument();
    expect(screen.queryByText(/Protected Admin Dashboard/i)).not.toBeInTheDocument();
  });
});
