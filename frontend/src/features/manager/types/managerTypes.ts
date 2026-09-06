import type { Appointment } from '../../customer/types/customerTypes';

export interface MechanicWorkloadItem {
  mechanicId: number;
  mechanicName: string;
  email: string;
  mobile: string;
  isActive: boolean;
  activeJobCount: number;
  completedJobCount: number;
  availabilityStatus: string;
}

export interface ManagerOverview {
  assignedAppointmentsToday: number;
  awaitingDecisionCount: number;
  approvedAwaitingMechanicCount: number;
  jobsInProgressCount: number;
  jobsAwaitingAttentionCount: number;
  jobsCompletedTodayCount: number;
  activeMechanicsCount: number;
  lowStockItemsCount: number;
  invoiceReadyJobsCount: number;
  outstandingInvoiceCount: number;
  recentAppointments: Appointment[];
  activeJobCards: ManagerJobCard[];
}

export interface ManagerReportSummary {
  appointmentsByStatus: Record<string, number>;
  jobsByStatus: Record<string, number>;
  mechanicWorkload: MechanicWorkloadItem[];
  totalBilledValue: number;
  paidInvoiceValue: number;
  outstandingInvoiceValue: number;
  totalInvoicesCount: number;
  paidInvoicesCount: number;
  pendingInvoicesCount: number;
}

export interface ManagerActivityItem {
  id: string;
  title: string;
  description: string;
  category: 'APPOINTMENT' | 'JOB_CARD' | 'INVOICE' | 'MECHANIC' | 'INVENTORY';
  timestamp: string;
  referenceId: string;
  status: string;
}

export interface ManagerJobCard {
  id: number;
  jobCardNumber?: string;
  appointmentId: number;
  vehicleRegistration?: string;
  vehicleMakeModel?: string;
  customerName?: string;
  status: 'CREATED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  managerId?: number;
  mechanicId?: number;
  mechanicName?: string;
  reportedIssues?: string;
  diagnosis?: string;
  estimatedCost?: number;
  actualCost?: number;
  laborCost?: number;
  partsCost?: number;
  laborDetails?: string;
  rating?: number;
  customerFeedback?: string;
  createdAt?: string;
  updatedAt?: string;
  items?: {
    id: number;
    partName: string;
    partNumber?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  evidenceList?: {
    id: number;
    imageUrl: string;
    caption?: string;
    stage?: string;
    createdAt?: string;
  }[];
}

export interface InventoryItem {
  id: number;
  skuCode: string;
  itemName: string;
  category?: string;
  unitPrice: number;
  stockQuantity: number;
  reorderLevel: number;
  isDeleted?: boolean;
}

export interface ManagerInvoice {
  id: number;
  invoiceNumber: string;
  jobCardId: number;
  customerId: number;
  customerName?: string;
  customerPhone?: string;
  vehicleDetails?: string;
  baseAmount: number;
  laborCost: number;
  taxPercentage: number;
  taxAmount: number;
  totalAmount: number;
  paymentStatus: 'PENDING' | 'INITIATED' | 'PAID' | 'FAILED' | 'REFUNDED';
  paymentMethod?: string;
  issueDate?: string;
  paidAt?: string;
}
