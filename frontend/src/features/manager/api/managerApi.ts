import { apiClient } from '@/lib/api/apiClient';
import type { Appointment } from '../../customer/types/customerTypes';
import type {
  ManagerOverview,
  ManagerReportSummary,
  MechanicWorkloadItem,
  ManagerActivityItem,
  ManagerJobCard,
  InventoryItem,
  ManagerInvoice,
} from '../types/managerTypes';

export async function getManagerOverview(): Promise<ManagerOverview> {
  const response = await apiClient.get<ManagerOverview>('/api/manager/dashboard/overview');
  return response.data;
}

export async function getManagerReportSummary(): Promise<ManagerReportSummary> {
  const response = await apiClient.get<ManagerReportSummary>('/api/manager/reports/summary');
  return response.data;
}

export async function getManagerTeam(): Promise<MechanicWorkloadItem[]> {
  const response = await apiClient.get<MechanicWorkloadItem[]>('/api/manager/team');
  return response.data;
}

export async function getManagerActivity(): Promise<ManagerActivityItem[]> {
  const response = await apiClient.get<ManagerActivityItem[]>('/api/manager/activity');
  return response.data;
}

export async function getPendingAppointments(): Promise<Appointment[]> {
  const response = await apiClient.get<Appointment[]>('/api/appointments/manager/pending');
  return response.data;
}

export async function getManagerAppointments(): Promise<Appointment[]> {
  const [assignedRes, pendingRes] = await Promise.all([
    apiClient.get<Appointment[]>('/api/appointments/manager/me'),
    apiClient.get<Appointment[]>('/api/appointments/manager/pending'),
  ]);
  const combined = [...pendingRes.data];
  for (const item of assignedRes.data) {
    if (!combined.some((a) => a.id === item.id)) {
      combined.push(item);
    }
  }
  return combined;
}

export async function approveAppointment(appointmentId: number): Promise<Appointment> {
  const response = await apiClient.put<Appointment>(`/api/appointments/${appointmentId}/approve`);
  return response.data;
}

export async function rejectAppointment(appointmentId: number, rejectionReason: string): Promise<Appointment> {
  const response = await apiClient.put<Appointment>(
    `/api/appointments/${appointmentId}/reject?reason=${encodeURIComponent(rejectionReason)}`
  );
  return response.data;
}

export async function assignMechanicToAppointment(appointmentId: number, mechanicId: number): Promise<Appointment> {
  const response = await apiClient.put<Appointment>(`/api/appointments/${appointmentId}/assign_mechanic/${mechanicId}`);
  return response.data;
}

export async function getManagerJobCards(): Promise<ManagerJobCard[]> {
  const response = await apiClient.get<ManagerJobCard[]>('/api/job_cards/manager/me');
  return response.data;
}

export async function getJobCardById(jobCardId: number): Promise<ManagerJobCard> {
  const response = await apiClient.get<ManagerJobCard>(`/api/job_cards/${jobCardId}`);
  return response.data;
}

export async function createJobCard(appointmentId: number, mechanicId?: number): Promise<ManagerJobCard> {
  const response = await apiClient.post<ManagerJobCard>('/api/job_cards/create', {
    appointmentId,
    mechanicId: mechanicId || null,
  });
  return response.data;
}

export async function assignMechanicToJobCard(jobCardId: number, mechanicId: number): Promise<ManagerJobCard> {
  const response = await apiClient.put<ManagerJobCard>(`/api/job_cards/${jobCardId}/assign_mechanic`, { mechanicId });
  return response.data;
}

export async function getInventoryItems(): Promise<InventoryItem[]> {
  const response = await apiClient.get<InventoryItem[]>('/api/inventory/available');
  return response.data;
}

export async function getManagerInvoices(): Promise<ManagerInvoice[]> {
  const response = await apiClient.get<ManagerInvoice[]>('/api/invoices/manager/me');
  return response.data;
}

export async function getInvoiceById(invoiceId: number): Promise<ManagerInvoice> {
  const response = await apiClient.get<ManagerInvoice>(`/api/invoices/${invoiceId}`);
  return response.data;
}

export async function generateInvoiceForJobCard(jobCardId: number): Promise<ManagerInvoice> {
  const response = await apiClient.post<ManagerInvoice>(`/api/invoices/generate/job_card/${jobCardId}`);
  return response.data;
}
