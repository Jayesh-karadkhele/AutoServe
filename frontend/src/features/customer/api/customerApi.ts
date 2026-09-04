import { apiClient } from '@/lib/api/apiClient';
import type {
  UserResponse,
  UpdateSelfProfileDto,
  Vehicle,
  CreateVehicleDto,
  Appointment,
  CreateAppointmentDto,
  JobCard,
  Invoice,
} from '../types/customerTypes';

export const getMyProfile = async (signal?: AbortSignal): Promise<UserResponse> => {
  const response = await apiClient.get<UserResponse>('/api/users/me', { signal });
  return response.data;
};

export const updateMyProfile = async (dto: UpdateSelfProfileDto): Promise<UserResponse> => {
  const response = await apiClient.put<UserResponse>('/api/users/me', dto);
  return response.data;
};

export const getMyVehicles = async (signal?: AbortSignal): Promise<Vehicle[]> => {
  const response = await apiClient.get<Vehicle[]>('/api/vehicles/me', { signal });
  return response.data;
};

export const getVehicleById = async (id: number, signal?: AbortSignal): Promise<Vehicle> => {
  const response = await apiClient.get<Vehicle>(`/api/vehicles/${id}`, { signal });
  return response.data;
};

export const createVehicle = async (dto: CreateVehicleDto): Promise<Vehicle> => {
  const response = await apiClient.post<Vehicle>('/api/vehicles', dto);
  return response.data;
};

export const deleteVehicle = async (id: number): Promise<Vehicle> => {
  const response = await apiClient.delete<Vehicle>(`/api/vehicles/${id}`);
  return response.data;
};

export const getMyAppointments = async (signal?: AbortSignal): Promise<Appointment[]> => {
  const response = await apiClient.get<Appointment[]>('/api/appointments/me', { signal });
  return response.data;
};

export const getAppointmentById = async (id: number, signal?: AbortSignal): Promise<Appointment> => {
  const response = await apiClient.get<Appointment>(`/api/appointments/${id}`, { signal });
  return response.data;
};

export const createAppointment = async (dto: CreateAppointmentDto, image?: File): Promise<Appointment> => {
  const formData = new FormData();
  const jsonBlob = new Blob([JSON.stringify(dto)], { type: 'application/json' });
  formData.append('appointment', jsonBlob);
  if (image) {
    formData.append('image', image);
  }

  const response = await apiClient.post<Appointment>('/api/appointments', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const cancelAppointment = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/appointments/${id}/cancel`);
};

export const getMyJobCards = async (signal?: AbortSignal): Promise<JobCard[]> => {
  const response = await apiClient.get<JobCard[]>('/api/job_cards/me', { signal });
  return response.data;
};

export const getJobCardById = async (id: number, signal?: AbortSignal): Promise<JobCard> => {
  const response = await apiClient.get<JobCard>(`/api/job_cards/${id}`, { signal });
  return response.data;
};

export const getJobCardByAppointmentId = async (appointmentId: number, signal?: AbortSignal): Promise<JobCard> => {
  const response = await apiClient.get<JobCard>(`/api/job_cards/appointment/${appointmentId}`, { signal });
  return response.data;
};

export const rateJobCard = async (id: number, rating: number, feedback: string): Promise<JobCard> => {
  const response = await apiClient.put<JobCard>(`/api/job_cards/${id}/rate`, { rating, feedback });
  return response.data;
};

export const getMyInvoices = async (signal?: AbortSignal): Promise<Invoice[]> => {
  const response = await apiClient.get<Invoice[]>('/api/invoices/me', { signal });
  return response.data;
};

export const getInvoiceById = async (id: number, signal?: AbortSignal): Promise<Invoice> => {
  const response = await apiClient.get<Invoice>(`/api/invoices/${id}`, { signal });
  return response.data;
};

export const getInvoiceByJobCardId = async (jobCardId: number, signal?: AbortSignal): Promise<Invoice> => {
  const response = await apiClient.get<Invoice>(`/api/invoices/job_card/${jobCardId}`, { signal });
  return response.data;
};

export const downloadInvoicePdf = async (id: number): Promise<Blob> => {
  const response = await apiClient.get(`/api/invoices/${id}/download`, {
    responseType: 'blob',
  });
  return response.data;
};
