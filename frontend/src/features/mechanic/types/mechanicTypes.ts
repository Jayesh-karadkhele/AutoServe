export type EvidenceCategory = 'REPORTED' | 'DIAGNOSIS' | 'BEFORE_REPAIR' | 'DURING_REPAIR' | 'AFTER_REPAIR' | 'COMPLETION';

export interface MechanicJobEvidence {
  id: number;
  photoUrl: string;
  description: string;
  uploadedAt: string;
  evidenceType?: EvidenceCategory;
  mediaType?: string;
  originalFilename?: string;
  uploaderId?: number;
  uploaderName?: string;
}

export interface MechanicJobItem {
  id: number;
  itemName: string;
  itemPrice: number;
  quantity: number;
  totalPrice: number;
}

export type MechanicJobStatus = 'CREATED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface MechanicJobCard {
  id: number;
  appointmentId: number;
  problemDescription: string;
  appointmentDate: string;
  vehicleId: number;
  licensePlate: string;
  brand: string;
  model: string;
  customerId: number;
  customerName: string;
  customerPhone?: string;
  managerId: number;
  managerName: string;
  mechanicId?: number;
  mechanicName?: string;
  status: MechanicJobStatus;
  cancellationReason?: string;
  estimatedCompletionDate?: string;
  completionTime?: string;
  createdAt: string;
  updatedAt: string;
  customerRating?: number;
  customerFeedback?: string;
  laborCost?: number;
  totalAmount?: number;
  items: MechanicJobItem[];
  evidence: MechanicJobEvidence[];
}

export interface MechanicOverview {
  activeJobCard: MechanicJobCard | null;
  assignedJobsCount: number;
  jobsAwaitingStartCount: number;
  jobsInProgressCount: number;
  jobsCompletedTodayCount: number;
  totalCompletedCount: number;
  recentAssignedJobs: MechanicJobCard[];
  recentCompletedJobs: MechanicJobCard[];
}

export interface AddPartRequest {
  inventoryItemId: number;
  quantity: number;
}

export interface AddEvidenceRequest {
  photoUrl: string;
  description: string;
  evidenceType?: EvidenceCategory;
  mediaType?: string;
  originalFilename?: string;
}
