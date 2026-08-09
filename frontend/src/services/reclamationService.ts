import api from './api';
import type { PagedResponse, Reclamation, ReclamationStatus, ReclamationType } from '../types/reclamation';
export interface CreateReclamationPayload {
  type: ReclamationType;
  subject: string;
  description: string;
  attachment?: File | null;
}
export async function createReclamation(payload: CreateReclamationPayload): Promise<Reclamation> {
  const form = new FormData();
  form.append('type', payload.type);
  form.append('subject', payload.subject);
  form.append('description', payload.description);
  if (payload.attachment) {
    form.append('attachment', payload.attachment);
  }
  const { data } = await api.post<Reclamation>('/reclamations', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
export async function getMyReclamations(page = 0, size = 20): Promise<PagedResponse<Reclamation>> {
  const { data } = await api.get<PagedResponse<Reclamation>>('/reclamations/mine', {
    params: { page, size, sort: 'createdAt,desc' },
  });
  return data;
}
// ----- Admin -----
export async function getAllReclamations(
  status?: ReclamationStatus | '',
  page = 0,
  size = 20
): Promise<PagedResponse<Reclamation>> {
  const { data } = await api.get<PagedResponse<Reclamation>>('/admin/reclamations', {
    params: { status: status || undefined, page, size, sort: 'createdAt,desc' },
  });
  return data;
}
export async function updateReclamationStatus(
  id: number,
  status: ReclamationStatus,
  adminResponse?: string
): Promise<Reclamation> {
  const { data } = await api.put<Reclamation>(`/admin/reclamations/${id}/status`, {
    status,
    adminResponse,
  });
  return data;
}
