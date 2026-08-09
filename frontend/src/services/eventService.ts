import api from './api';
import type { EventItem } from '../types/event';
interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
export async function getUpcomingEvents(page = 0, size = 20): Promise<PagedResponse<EventItem>> {
  const { data } = await api.get<PagedResponse<EventItem>>('/events', { params: { page, size } });
  return data;
}
export async function getAllEventsAdmin(page = 0, size = 20): Promise<PagedResponse<EventItem>> {
  const { data } = await api.get<PagedResponse<EventItem>>('/admin/events', { params: { page, size } });
  return data;
}
export async function createEvent(params: {
  title: string;
  description: string;
  eventDate: string;
  location: string;
  image?: File | null;
}): Promise<EventItem> {
  const formData = new FormData();
  formData.append('title', params.title);
  formData.append('description', params.description);
  formData.append('eventDate', params.eventDate);
  formData.append('location', params.location);
  if (params.image) formData.append('image', params.image);
  const { data } = await api.post<EventItem>('/admin/events', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
export async function deleteEvent(id: number): Promise<void> {
  await api.delete(`/admin/events/${id}`);
}