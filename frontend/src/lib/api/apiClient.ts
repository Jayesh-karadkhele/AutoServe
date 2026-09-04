import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { getApiBaseUrl, getClientHeaderName, getClientHeaderValue } from './config';
import { getAccessToken, setAccessToken, clearAccessToken } from '../../features/auth/session/accessTokenStore';
import { refreshClient } from './refreshClient';
import type { AuthResponse } from '../../features/auth/api/authContracts';

export interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Global session expiry callback listener (registered by AuthProvider)
type SessionExpiredHandler = () => void;
let sessionExpiredHandler: SessionExpiredHandler | null = null;

export const registerSessionExpiredHandler = (handler: SessionExpiredHandler | null): void => {
  sessionExpiredHandler = handler;
};

// Single-flight refresh promise tracker
let refreshPromise: Promise<string> | null = null;

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    [getClientHeaderName()]: getClientHeaderValue(),
  },
});

// Request Interceptor: Attach Bearer Access Token if available
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Single-Flight Automatic Refresh Handling for 401 Responses
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig | undefined;

    // Check if error is 401 and request has not already been retried
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      const url = originalRequest.url || '';

      // Skip refresh attempt if the failed endpoint was itself login, register, refresh or logout
      const isAuthEndpoint =
        url.includes('/api/auth/login') ||
        url.includes('/api/auth/register') ||
        url.includes('/api/auth/refresh') ||
        url.includes('/api/auth/logout');

      if (isAuthEndpoint) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        // Execute single-flight token refresh
        if (!refreshPromise) {
          refreshPromise = refreshClient
            .post<AuthResponse>('/api/auth/refresh')
            .then((res) => {
              const newToken = res.data.token;
              setAccessToken(newToken);
              return newToken;
            })
            .catch((refreshError) => {
              clearAccessToken();
              if (sessionExpiredHandler) {
                sessionExpiredHandler();
              }
              throw refreshError;
            })
            .finally(() => {
              refreshPromise = null;
            });
        }

        const newToken = await refreshPromise;

        // Retry original request with newly issued access token
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return apiClient(originalRequest);
      } catch (refreshErr) {
        return Promise.reject(refreshErr);
      }
    }

    // Do NOT refresh or retry on HTTP 403 Forbidden
    return Promise.reject(error);
  }
);
