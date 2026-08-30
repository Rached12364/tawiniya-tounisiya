import api from './api';
import type { User, RegisterPayload } from '../types/auth';
export type UpdateProfilePayload = Partial<RegisterPayload>;
export async function getMyUserProfile(): Promise<User> {
  const { data } = await api.get<User>('/users/me');
  return data;
}
export async function updateMyUserProfile(payload: UpdateProfilePayload): Promise<User> {
  const { data } = await api.put<User>('/users/me', payload);
  return data;
}
export async function uploadMyPhotoProfil(file: File): Promise<User> {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post<User>('/users/me/photo-profil', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
export async function uploadMyPhotoCouverture(file: File): Promise<User> {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post<User>('/users/me/photo-couverture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
export async function uploadDiplomeDocument(file: File): Promise<User> {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post<User>('/users/me/diplome-document', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}