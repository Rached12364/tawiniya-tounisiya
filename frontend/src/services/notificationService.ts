import api from './api';
import type { AppNotification, PagedNotifications } from '../types/notification';
export async function getNotifications(page = 0, size = 20): Promise<PagedNotifications> {
  const { data } = await api.get<PagedNotifications>('/notifications', { params: { page, size } });
  return data;
}
export async function getUnreadCount(): Promise<number> {
  const { data } = await api.get<{ count: number }>('/notifications/unread-count');
  return data.count;
}
export async function markNotificationAsRead(id: number): Promise<void> {
  await api.post(`/notifications/${id}/read`);
}
export async function markAllNotificationsAsRead(): Promise<void> {
  await api.post('/notifications/read-all');
}
export type { AppNotification };