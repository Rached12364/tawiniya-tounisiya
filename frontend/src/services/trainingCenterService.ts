import api from './api';
import type { TrainingCenter, TrainingCenterInput } from '../types/trainingCenter';
interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
function buildFormData(data: TrainingCenterInput, logo?: File | null): FormData {
  const formData = new FormData();
  formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  if (logo) formData.append('logo', logo);
  return formData;
}
// --- Public ---
export async function getTrainingCenters(page = 0, size = 20): Promise<PagedResponse<TrainingCenter>> {
  const { data } = await api.get<PagedResponse<TrainingCenter>>('/training-centers', { params: { page, size } });
  return data;
}
export async function getTrainingCenterById(id: number): Promise<TrainingCenter> {
  const { data } = await api.get<TrainingCenter>(`/training-centers/${id}`);
  return data;
}
// --- Utilisateur connecté : ses propres centres ---
export const myTrainingCenterService = {
  list: async (): Promise<TrainingCenter[]> => {
    const { data } = await api.get<TrainingCenter[]>('/training-centers/mine');
    return data;
  },
  create: async (input: TrainingCenterInput, logo?: File | null): Promise<TrainingCenter> => {
    const { data } = await api.post<TrainingCenter>('/training-centers/mine', buildFormData(input, logo), {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
  update: async (id: number, input: TrainingCenterInput, logo?: File | null): Promise<TrainingCenter> => {
    const { data } = await api.put<TrainingCenter>(`/training-centers/mine/${id}`, buildFormData(input, logo), {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/training-centers/mine/${id}`);
  },
};
// --- Admin ---
export const adminTrainingCenterService = {
  list: async (page = 0, size = 100): Promise<PagedResponse<TrainingCenter>> => {
    const { data } = await api.get<PagedResponse<TrainingCenter>>('/admin/training-centers', { params: { page, size } });
    return data;
  },
  update: async (id: number, input: TrainingCenterInput, logo?: File | null): Promise<TrainingCenter> => {
    const { data } = await api.put<TrainingCenter>(`/admin/training-centers/${id}`, buildFormData(input, logo), {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/admin/training-centers/${id}`);
  },
};