export interface UserResponse {
  userId: number;
  userName: string;
  email: string;
  userRole: 'CUSTOMER' | 'MANAGER' | 'MECHANIC' | 'ADMIN';
  mobile: string;
  salary?: number | null;
  managerId?: number | null;
  isActive: boolean;
}

export interface UpdateSelfProfileDto {
  userName: string;
  mobile: string;
}

export interface Vehicle {
  id: number;
  registrationNumber: string;
  make: string;
  model: string;
  year?: number | null;
  fuelType?: string | null;
  vehicleType?: string | null;
  color?: string | null;
  vin?: string | null;
  customerId?: number | null;
  createdAt?: string | null;
}

export interface CreateVehicleDto {
  registrationNumber: string;
  make: string;
  model: string;
  year?: number | null;
  fuelType?: string | null;
  vehicleType?: string | null;
  color?: string | null;
  vin?: string | null;
}

export interface Appointment {
  id: number;
  vehicleId: number;
  vehicleRegistration?: string | null;
  vehicleMakeModel?: string | null;
  customerId?: number | null;
  customerName?: string | null;
  customerPhone?: string | null;
  serviceType: string;
  preferredDate: string;
  timeSlot?: string | null;
  notes?: string | null;
  fulfilmentMode?: 'WORKSHOP_DROP_OFF' | 'PICKUP_AND_RETURN_REQUESTED' | null;
  pickupAddress?: string | null;
  logisticsInstructions?: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'IN_PROGRESS' | 'COMPLETED';
  managerId?: number | null;
  mechanicId?: number | null;
  jobCardId?: number | null;
  imageUrl?: string | null;
  createdAt?: string | null;
}

export interface CreateAppointmentDto {
  vehicleId: number;
  serviceType: string;
  preferredDate: string;
  timeSlot?: string;
  notes?: string;
  fulfilmentMode?: 'WORKSHOP_DROP_OFF' | 'PICKUP_AND_RETURN_REQUESTED';
  pickupAddress?: string;
  logisticsInstructions?: string;
}

export interface JobCardItem {
  id: number;
  partName: string;
  partNumber?: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface JobCardEvidence {
  id: number;
  imageUrl: string;
  caption?: string | null;
  stage?: string | null;
  createdAt?: string | null;
}

export interface JobCard {
  id: number;
  jobCardNumber?: string | null;
  appointmentId: number;
  vehicleRegistration?: string | null;
  vehicleMakeModel?: string | null;
  customerName?: string | null;
  status: 'CREATED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  managerId?: number | null;
  mechanicId?: number | null;
  mechanicName?: string | null;
  reportedIssues?: string | null;
  diagnosis?: string | null;
  estimatedCost?: number | null;
  actualCost?: number | null;
  laborCost?: number | null;
  partsCost?: number | null;
  laborDetails?: string | null;
  rating?: number | null;
  customerFeedback?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  items?: JobCardItem[];
  evidenceList?: JobCardEvidence[];
}

export interface InvoiceLineItem {
  id: number;
  description: string;
  itemType: 'PARTS' | 'LABOR' | 'OTHER';
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  jobCardId: number;
  customerId: number;
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  vehicleDetails?: string | null;
  laborAmount: number;
  partsAmount: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  paymentMethod?: string | null;
  issueDate?: string | null;
  paidAt?: string | null;
  lineItems?: InvoiceLineItem[];
}
