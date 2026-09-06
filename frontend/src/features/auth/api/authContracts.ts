/**
 * AutoServe Authentication API Contracts & Data Transfer Objects
 * Matches Spring Boot backend DTOs strictly.
 */

export type UserRole = 'CUSTOMER' | 'MANAGER' | 'MECHANIC' | 'ADMIN';

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  userId: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  sessionId: string;
}

export interface UserResponse {
  userId: number;
  userName: string;
  email: string;
  userRole: UserRole;
  mobile: string;
  isActive: boolean;
  managerName?: string | null;
  managerId?: number | null;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  isActive: boolean;
}

export interface ApiErrorResponse {
  timestamp?: string;
  status: number;
  error: string;
  message: string;
  path?: string;
  fieldErrors?: Record<string, string>;
}

export const normalizeUserRole = (rawRole: string): UserRole => {
  const clean = rawRole.toUpperCase().replace(/^ROLE_/, '');
  if (clean === 'CUSTOMER' || clean === 'MANAGER' || clean === 'MECHANIC' || clean === 'ADMIN') {
    return clean as UserRole;
  }
  console.warn(`[AutoServe Auth] Unknown user role received: "${rawRole}". Defaulting to CUSTOMER.`);
  return 'CUSTOMER';
};

export const normalizeUserResponse = (dto: UserResponse): AuthUser => ({
  id: dto.userId,
  name: dto.userName,
  email: dto.email,
  role: normalizeUserRole(dto.userRole),
  phone: dto.mobile || '',
  isActive: dto.isActive !== false,
});

export const normalizeAuthResponse = (dto: AuthResponse): AuthUser => ({
  id: dto.userId,
  name: dto.name,
  email: dto.email,
  role: normalizeUserRole(dto.role),
  phone: dto.phone || '',
  isActive: true,
});
