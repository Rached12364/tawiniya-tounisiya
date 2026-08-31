import api from './api';
import type { ExpertConversationDetail, ExpertConversationSummary, ConversationStatus } from '../types/expertConversation';
export async function getMyConversations(): Promise<ExpertConversationSummary[]> {
  const { data } = await api.get<ExpertConversationSummary[]>('/expert-conversations/mine');
  return data;
}
export async function getConversationWithExpert(expertId: number): Promise<ExpertConversationDetail> {
  const { data } = await api.get<ExpertConversationDetail>(`/expert-conversations/with/${expertId}`);
  return data;
}
export async function getConversationById(id: number): Promise<ExpertConversationDetail> {
  const { data } = await api.get<ExpertConversationDetail>(`/expert-conversations/${id}`);
  return data;
}
export async function sendToExpert(expertId: number, subject: string, content: string, attachment?: File): Promise<ExpertConversationDetail> {
  const form = new FormData();
  if (subject) form.append('subject', subject);
  form.append('content', content);
  if (attachment) form.append('attachment', attachment);
  const { data } = await api.post<ExpertConversationDetail>(`/expert-conversations/with/${expertId}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
export async function replyToConversation(id: number, content: string, attachment?: File): Promise<ExpertConversationDetail> {
  const form = new FormData();
  form.append('content', content);
  if (attachment) form.append('attachment', attachment);
  const { data } = await api.post<ExpertConversationDetail>(`/expert-conversations/${id}/messages`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
export async function updateConversationStatus(id: number, status: ConversationStatus): Promise<ExpertConversationDetail> {
  const { data } = await api.put<ExpertConversationDetail>(`/expert-conversations/${id}/status`, { status });
  return data;
}