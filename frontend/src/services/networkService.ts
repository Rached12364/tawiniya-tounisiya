import api from './api';
import type { Role } from '../types/auth';
import type { PagedUserCards, ConnectionItem } from '../types/network';
export async function browseByRole(role: Role, page = 0, size = 20): Promise<PagedUserCards> {
  const { data } = await api.get<PagedUserCards>(`/network/browse/${role}`, { params: { page, size } });
  return data;
}
export async function sendConnectionRequest(targetUserId: number): Promise<ConnectionItem> {
  const { data } = await api.post<ConnectionItem>(`/network/connect/${targetUserId}`);
  return data;
}
export async function acceptConnection(connectionId: number): Promise<ConnectionItem> {
  const { data } = await api.post<ConnectionItem>(`/network/${connectionId}/accept`);
  return data;
}
export async function rejectConnection(connectionId: number): Promise<ConnectionItem> {
  const { data } = await api.post<ConnectionItem>(`/network/${connectionId}/reject`);
  return data;
}
export async function removeConnection(connectionId: number): Promise<void> {
  await api.delete(`/network/${connectionId}`);
}
export async function getMyConnections(): Promise<ConnectionItem[]> {
  const { data } = await api.get<ConnectionItem[]>('/network/connections');
  return data;
}
export async function getReceivedInvitations(): Promise<ConnectionItem[]> {
  const { data } = await api.get<ConnectionItem[]>('/network/invitations/received');
  return data;
}
export async function getSentInvitations(): Promise<ConnectionItem[]> {
  const { data } = await api.get<ConnectionItem[]>('/network/invitations/sent');
  return data;
}