import type { UserRole } from '../api/authContracts';

export const getRoleDestination = (role: UserRole | string): string => {
  const cleanRole = typeof role === 'string' ? role.toUpperCase().replace(/^ROLE_/, '') : '';
  switch (cleanRole) {
    case 'CUSTOMER':
      return '/customer/dashboard';
    case 'MANAGER':
      return '/manager/dashboard';
    case 'MECHANIC':
      return '/mechanic/dashboard';
    case 'ADMIN':
      return '/admin/dashboard';
    default:
      return '/forbidden';
  }
};
