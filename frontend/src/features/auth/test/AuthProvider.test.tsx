import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider } from '../context/AuthProvider';
import { useAuth } from '../context/AuthContext';
import * as authApi from '../api/authApi';
import { getAccessToken, setAccessToken } from '../session/accessTokenStore';

vi.mock('../api/authApi');

const TestConsumer: React.FC = () => {
  const { status, user, login, logout, logoutAll } = useAuth();
  return (
    <div>
      <span data-testid="auth-status">{status}</span>
      <span data-testid="auth-user-name">{user?.name || 'none'}</span>
      <button data-testid="login-btn" onClick={() => login({ email: 'test@example.com', password: 'Password123!' })}>
        Login
      </button>
      <button data-testid="logout-btn" onClick={() => logout()}>
        Logout
      </button>
      <button data-testid="logout-all-btn" onClick={() => logoutAll()}>
        Logout All
      </button>
    </div>
  );
};

describe('AuthProvider Session Lifecycle & Bootstrap Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setAccessToken(null);
  });

  it('18, 19. startup session bootstrap calls refresh and /api/users/me to restore session', async () => {
    vi.mocked(authApi.refreshApi).mockResolvedValue({
      token: 'restored-jwt-token',
      tokenType: 'Bearer',
      userId: 1,
      name: 'Restored User',
      email: 'restored@example.com',
      phone: '9876543210',
      role: 'CUSTOMER',
      sessionId: 'sess-123',
    });

    vi.mocked(authApi.getCurrentUserApi).mockResolvedValue({
      userId: 1,
      userName: 'Restored User',
      email: 'restored@example.com',
      userRole: 'CUSTOMER',
      mobile: '9876543210',
      isActive: true,
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('bootstrapping');

    await waitFor(() => {
      expect(authApi.refreshApi).toHaveBeenCalled();
      expect(authApi.getCurrentUserApi).toHaveBeenCalled();
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
      expect(screen.getByTestId('auth-user-name')).toHaveTextContent('Restored User');
      expect(getAccessToken()).toBe('restored-jwt-token');
    });
  });

  it('20. failed startup refresh produces anonymous state and clears in-memory token', async () => {
    vi.mocked(authApi.refreshApi).mockRejectedValue(new Error('No refresh cookie'));

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('anonymous');
      expect(screen.getByTestId('auth-user-name')).toHaveTextContent('none');
      expect(getAccessToken()).toBeNull();
    });
  });

  it('32 & 33. logout calls backend API before clearing local token and state', async () => {
    vi.mocked(authApi.refreshApi).mockRejectedValue(new Error('No cookie'));
    vi.mocked(authApi.logoutApi).mockResolvedValue(undefined);

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('anonymous');
    });

    setAccessToken('active-token-123');
    const logoutBtn = screen.getByTestId('logout-btn');
    
    await act(async () => {
      logoutBtn.click();
    });

    await waitFor(() => {
      expect(authApi.logoutApi).toHaveBeenCalled();
      expect(getAccessToken()).toBeNull();
      expect(screen.getByTestId('auth-status')).toHaveTextContent('anonymous');
    });
  });

  it('34. logoutAll calls /api/auth/logout-all and clears token state', async () => {
    vi.mocked(authApi.refreshApi).mockRejectedValue(new Error('No cookie'));
    vi.mocked(authApi.logoutAllApi).mockResolvedValue(undefined);

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('anonymous');
    });

    setAccessToken('active-token-456');
    const logoutAllBtn = screen.getByTestId('logout-all-btn');

    await act(async () => {
      logoutAllBtn.click();
    });

    await waitFor(() => {
      expect(authApi.logoutAllApi).toHaveBeenCalled();
      expect(getAccessToken()).toBeNull();
      expect(screen.getByTestId('auth-status')).toHaveTextContent('anonymous');
    });
  });
});
