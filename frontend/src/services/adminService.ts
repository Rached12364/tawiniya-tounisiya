import api from './api';
import type { User } from '../types/auth';
import type { AdminStats, PagedUsers, ContentImage, ContentSection } from '../types/admin';
export async function getStats(): Promise<AdminStats> {
  const { data } = await api.get<AdminStats>('/admin/stats');
  return data;
}
export async function getUsers(page = 0, size = 20): Promise<PagedUsers> {
  const { data } = await api.get<PagedUsers>('/admin/users', { params: { page, size } });
  return data;
}
export async function enableUser(id: number): Promise<User> {
  const { data } = await api.put<User>(`/admin/users/${id}/enable`);
  return data;
}
export async function disableUser(id: number): Promise<User> {
  const { data } = await api.put<User>(`/admin/users/${id}/disable`);
  return data;
}
export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/admin/users/${id}`);
}
export async function getContentImages(section: ContentSection): Promise<ContentImage[]> {
  const { data } = await api.get<ContentImage[]>(`/admin/content/images/${section}`);
  return data;
}
export async function uploadContentImage(params: {
  file: File;
  section: ContentSection;
  title: string;
  description?: string;
  displayOrder: number;
}): Promise<ContentImage> {
  const formData = new FormData();
  formData.append('file', params.file);
  formData.append('section', params.section);
  formData.append('title', params.title);
  if (params.description) formData.append('description', params.description);
  formData.append('displayOrder', String(params.displayOrder));
  const { data } = await api.post<ContentImage>('/admin/content/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
export async function enableContentImage(id: number): Promise<ContentImage> {
  const { data } = await api.put<ContentImage>(`/admin/content/images/${id}/enable`);
  return data;
}
export async function disableContentImage(id: number): Promise<ContentImage> {
  const { data } = await api.put<ContentImage>(`/admin/content/images/${id}/disable`);
  return data;
}
export async function deleteContentImage(id: number): Promise<void> {
  await api.delete(`/admin/content/images/${id}`);
}
