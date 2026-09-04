import { describe, it, expect, beforeEach, vi } from 'vitest';
import { publicApiClient } from '../../../lib/api/publicApiClient';
import { refreshClient } from '../../../lib/api/refreshClient';
import { apiClient } from '../../../lib/api/apiClient';
import { getAccessToken, setAccessToken } from '../session/accessTokenStore';

describe('Axios Client Security & Single-Flight Interceptor Tests', () => {
  beforeEach(() => {
    setAccessToken(null);
    vi.restoreAllMocks();
  });

  it('5. publicApiClient includes X-AutoServe-Client: web header by default', () => {
    expect(publicApiClient.defaults.headers['X-AutoServe-Client']).toBe('web');
  });

  it('6. publicApiClient is configured with withCredentials=true', () => {
    expect(publicApiClient.defaults.withCredentials).toBe(true);
  });

  it('refreshClient is configured with withCredentials=true and custom client header', () => {
    expect(refreshClient.defaults.withCredentials).toBe(true);
    expect(refreshClient.defaults.headers['X-AutoServe-Client']).toBe('web');
  });

  it('28, 29 & 30. Single-flight refresh handles 401 response and updates token store', async () => {
    setAccessToken('expired-access-token');

    let refreshCallCount = 0;
    vi.spyOn(refreshClient, 'post').mockImplementation(async (url) => {
      if (url.includes('/api/auth/refresh')) {
        refreshCallCount++;
        return { data: { token: 'new-refreshed-jwt-token' } } as any;
      }
      throw new Error('Unexpected URL');
    });

    const mock401Error: any = new Error('Unauthorized');
    mock401Error.response = { status: 401 };
    mock401Error.config = { url: '/api/users/me', headers: {} };

    // Invoke response interceptor directly
    const interceptor = (apiClient.interceptors.response as any).handlers[0].rejected;
    
    // Interceptor attempts refresh and then retries request
    try {
      await interceptor(mock401Error);
    } catch {
      // Catch network error from retry call to localhost:8081
    }

    expect(refreshCallCount).toBe(1);
    expect(getAccessToken()).toBe('new-refreshed-jwt-token');
  });

  it('31. HTTP 403 Forbidden does not trigger refresh token flow', async () => {
    const refreshSpy = vi.spyOn(refreshClient, 'post');

    const err: any = new Error('Forbidden');
    err.response = { status: 403 };
    err.config = { url: '/api/users/1' };

    const interceptor = (apiClient.interceptors.response as any).handlers[0].rejected;
    await expect(interceptor(err)).rejects.toThrow();
    expect(refreshSpy).not.toHaveBeenCalled();
  });
});
