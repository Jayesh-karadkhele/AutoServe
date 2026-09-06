import { apiClient as api } from '@/lib/api/apiClient';
import type {
  AdminOverview,
  UserSummary,
  ManagerTeam,
  CreateStaffPayload,
  StockAdjustmentPayload,
  StockMovement,
  AdminAuditEvent,
  SystemSettings,
  ReassignMechanicPayload,
  AssignManagerPayload,
  Role,
} from '../types/adminTypes';

export const adminApi = {
  getOverview: async (): Promise<AdminOverview> => {
    const res = await api.get<AdminOverview>('/api/admin/overview');
    return res.data;
  },

  getUsers: async (role?: Role, isActive?: boolean, search?: string): Promise<UserSummary[]> => {
    const res = await api.get<{ content: UserSummary[] }>('/api/admin/users', {
      params: { role, isActive, search },
    });
    return res.data.content || [];
  },

  getUserDetails: async (userId: number): Promise<UserSummary> => {
    const res = await api.get<UserSummary>(`/api/admin/users/${userId}`);
    return res.data;
  },

  createStaff: async (payload: CreateStaffPayload): Promise<UserSummary> => {
    const res = await api.post<UserSummary>('/api/admin/staff', payload);
    return res.data;
  },

  toggleUserActiveStatus: async (userId: number, reason: string): Promise<UserSummary> => {
    const res = await api.put<UserSummary>(`/api/admin/users/${userId}/toggle-active`, null, {
      params: { reason },
    });
    return res.data;
  },

  getManagers: async (): Promise<UserSummary[]> => {
    const res = await api.get<{ content: UserSummary[] }>('/api/admin/managers');
    return res.data.content || [];
  },

  getManagerTeam: async (managerId: number): Promise<ManagerTeam> => {
    const res = await api.get<ManagerTeam>(`/api/admin/managers/${managerId}/team`);
    return res.data;
  },

  getMechanics: async (): Promise<UserSummary[]> => {
    const res = await api.get<{ content: UserSummary[] }>('/api/admin/mechanics');
    return res.data.content || [];
  },

  reassignMechanic: async (payload: ReassignMechanicPayload): Promise<UserSummary> => {
    const res = await api.put<UserSummary>('/api/admin/mechanics/reassign', payload);
    return res.data;
  },

  assignManagerToAppointment: async (payload: AssignManagerPayload): Promise<void> => {
    await api.put('/api/admin/appointments/assign-manager', payload);
  },

  adjustStock: async (payload: StockAdjustmentPayload): Promise<StockMovement> => {
    const res = await api.post<StockMovement>('/api/admin/inventory/adjust-stock', payload);
    return res.data;
  },

  getStockMovements: async (inventoryId?: number): Promise<StockMovement[]> => {
    const res = await api.get<{ content: StockMovement[] }>('/api/admin/inventory/movements', {
      params: { inventoryId },
    });
    return res.data.content || [];
  },

  getAuditEvents: async (actorId?: number, actionType?: string, resourceType?: string): Promise<AdminAuditEvent[]> => {
    const res = await api.get<{ content: AdminAuditEvent[] }>('/api/admin/audit-events', {
      params: { actorId, actionType, resourceType },
    });
    return res.data.content || [];
  },

  getSystemSettings: async (): Promise<SystemSettings> => {
    const res = await api.get<SystemSettings>('/api/admin/settings');
    return res.data;
  },
};
