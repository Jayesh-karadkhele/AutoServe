import { apiClient as api } from '@/lib/api/apiClient';

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export const accountSecurityApi = {
  changePassword: async (payload: ChangePasswordPayload): Promise<{ message: string }> => {
    const res = await api.post<{ message: string }>('/api/users/me/change-password', payload);
    return res.data;
  },

  forgotPassword: async (payload: ForgotPasswordPayload): Promise<{ message: string }> => {
    const res = await api.post<{ message: string }>('/api/auth/forgot-password', payload);
    return res.data;
  },

  resetPassword: async (payload: ResetPasswordPayload): Promise<{ message: string }> => {
    const res = await api.post<{ message: string }>('/api/auth/reset-password', payload);
    return res.data;
  },
};
