import { createContext, useContext } from 'react';
import type { AuthState } from './authReducer';
import type { AuthUser, LoginRequest, RegisterRequest } from '../api/authContracts';

export interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<AuthUser>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
