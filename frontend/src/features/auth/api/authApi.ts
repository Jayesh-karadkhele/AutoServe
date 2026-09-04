import { publicApiClient } from '../../../lib/api/publicApiClient';
import { refreshClient } from '../../../lib/api/refreshClient';
import { apiClient } from '../../../lib/api/apiClient';
import { getAccessToken } from '../session/accessTokenStore';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UserResponse,
} from './authContracts';

export const loginApi = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await publicApiClient.post<AuthResponse>('/api/auth/login', data);
  return response.data;
};

export const registerApi = async (data: RegisterRequest): Promise<UserResponse> => {
  const response = await publicApiClient.post<UserResponse>('/api/auth/register', data);
  return response.data;
};

export const refreshApi = async (): Promise<AuthResponse> => {
  const response = await refreshClient.post<AuthResponse>('/api/auth/refresh');
  return response.data;
};

export const logoutApi = async (): Promise<void> => {
  const token = getAccessToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  await publicApiClient.post('/api/auth/logout', null, { headers });
};

export const logoutAllApi = async (): Promise<void> => {
  await apiClient.post('/api/auth/logout-all');
};

export const getCurrentUserApi = async (): Promise<UserResponse> => {
  const response = await apiClient.get<UserResponse>('/api/users/me');
  return response.data;
};
