import { apiClient } from '@/lib/api/apiClient';
import type {
  MechanicOverview,
  MechanicJobCard,
  AddPartRequest,
  AddEvidenceRequest,
} from '../types/mechanicTypes';
import type { InventoryItem } from '../../manager/types/managerTypes';

export const getMechanicOverview = async (): Promise<MechanicOverview> => {
  const response = await apiClient.get('/mechanic/dashboard/overview');
  return response.data;
};

export const getMyMechanicJobs = async (): Promise<MechanicJobCard[]> => {
  const response = await apiClient.get('/job_cards/mechanic/me');
  return response.data;
};

export const getMechanicJobCardById = async (id: number): Promise<MechanicJobCard> => {
  const response = await apiClient.get(`/job_cards/${id}`);
  return response.data;
};

export const startWorkOnJobCard = async (id: number): Promise<MechanicJobCard> => {
  const response = await apiClient.put(`/job_cards/${id}/start`);
  return response.data;
};

export const completeWorkOnJobCard = async (id: number): Promise<MechanicJobCard> => {
  const response = await apiClient.put(`/job_cards/${id}/complete`);
  return response.data;
};

export const addPartToJobCard = async (id: number, payload: AddPartRequest): Promise<MechanicJobCard> => {
  const response = await apiClient.post(`/job_cards/${id}/items`, payload);
  return response.data;
};

export const removePartFromJobCard = async (jobCardId: number, itemId: number): Promise<MechanicJobCard> => {
  const response = await apiClient.delete(`/job_cards/${jobCardId}/items/${itemId}`);
  return response.data;
};

export const addEvidenceToJobCard = async (id: number, payload: AddEvidenceRequest): Promise<MechanicJobCard> => {
  const response = await apiClient.post(`/job_cards/${id}/evidence`, payload);
  return response.data;
};

export const removeEvidenceFromJobCard = async (jobCardId: number, evidenceId: number): Promise<MechanicJobCard> => {
  const response = await apiClient.delete(`/job_cards/${jobCardId}/evidence/${evidenceId}`);
  return response.data;
};

export const getAvailableInventory = async (): Promise<InventoryItem[]> => {
  const response = await apiClient.get('/inventory/available');
  return response.data;
};
