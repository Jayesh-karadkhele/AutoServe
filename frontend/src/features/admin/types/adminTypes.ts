export type Role = 'ADMIN' | 'MANAGER' | 'MECHANIC' | 'CUSTOMER';

export interface UserSummary {
  id: number;
  fullName: string;
  email: string;
  mobile: string;
  role: Role;
  active: boolean;
  managerId?: number;
  managerName?: string;
  createdAt?: string;
  assignedJobCount?: number;
  completedJobCount?: number;
}

export interface ManagerTeam {
  managerId: number;
  managerName: string;
  managerEmail: string;
  managerMobile: string;
  managerActive: boolean;
  mechanics: UserSummary[];
  activeAppointmentsCount: number;
  activeJobsCount: number;
}

export interface CreateStaffPayload {
  fullName: string;
  email: string;
  mobile: string;
  role: 'MANAGER' | 'MECHANIC';
  initialPassword?: string;
  managerId?: number;
  activeState?: boolean;
}

export interface StockAdjustmentPayload {
  inventoryId: number;
  quantityDelta: number;
  movementType: 'MANUAL_INCREASE' | 'MANUAL_DECREASE' | 'CORRECTION';
  reason: string;
}

export interface StockMovement {
  id: number;
  inventoryId: number;
  partName: string;
  partNumber: string;
  movementType: string;
  quantityBefore: number;
  quantityDelta: number;
  quantityAfter: number;
  jobCardId?: number;
  jobCardRef?: string;
  actorId: number;
  actorName: string;
  reason: string;
  createdAt: string;
}

export interface AdminAuditEvent {
  id: number;
  actorId: number;
  actorName: string;
  actorEmail: string;
  actionType: string;
  resourceType: string;
  resourceId?: string;
  outcome: string;
  details: string;
  createdAt: string;
}

export interface AdminOverview {
  totalCustomers: number;
  totalManagers: number;
  totalMechanics: number;
  inactiveUsersCount: number;
  unassignedAppointmentsCount: number;
  scheduledAppointmentsCount: number;
  inProgressAppointmentsCount: number;
  activeJobCardsCount: number;
  completedJobsToday: number;
  lowStockCount: number;
  invoiceReadyJobsCount: number;
  outstandingInvoicesCount: number;
  verifiedPaidInvoicesCount: number;
  paidInvoiceTotal: number;
  outstandingInvoiceTotal: number;
  totalBilledAmount: number;
  recentAuditEvents: AdminAuditEvent[];
}

export interface SystemSettings {
  activeProfile: string;
  environmentLabel: string;
  databaseConnectivity: string;
  mailConfigured: boolean;
  cloudinaryConfigured: boolean;
  razorpayConfigured: boolean;
  demoSeedingEnabled: boolean;
  adminBootstrapEnabled: boolean;
  authCookieSecurityMode: string;
  flywaySchemaVersion: string;
  applicationVersion: string;
}

export interface ReassignMechanicPayload {
  mechanicId: number;
  targetManagerId: number;
  reason: string;
}

export interface AssignManagerPayload {
  appointmentId: number;
  managerId: number;
  reason: string;
}
