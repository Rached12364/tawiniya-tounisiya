import api from './api';
import type { TechnicienProfile, TechnicienProfileFormData } from '../types/technicienProfile';
export async function getMyProfile(): Promise<TechnicienProfile | null> {
  const res = await api.get<TechnicienProfile>('/technicien-profile/mine', {
    validateStatus: (status) => status === 200 || status === 204,
  });
  return res.status === 204 ? null : res.data;
}
export async function saveMyProfile(data: TechnicienProfileFormData): Promise<TechnicienProfile> {
  const { data: result } = await api.put<TechnicienProfile>('/technicien-profile', data);
  return result;
}
export async function uploadPhotoProfil(file: File): Promise<TechnicienProfile> {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post<TechnicienProfile>('/technicien-profile/photo-profil', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
export async function uploadPhotoCouverture(file: File): Promise<TechnicienProfile> {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post<TechnicienProfile>('/technicien-profile/photo-couverture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
export type DocumentType = 'cin' | 'extraitNaissance' | 'diplome' | 'permis';
export async function uploadDocument(type: DocumentType, file: File): Promise<TechnicienProfile> {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post<TechnicienProfile>(`/technicien-profile/document/${type}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}