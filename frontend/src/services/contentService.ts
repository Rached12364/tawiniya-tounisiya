import api from './api';
import type { ContentImage, ContentSection } from '../types/admin';
export async function getPublicImages(section: ContentSection): Promise<ContentImage[]> {
  const { data } = await api.get<ContentImage[]>(`/content/images/${section}`);
  return data;
}
const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/api\/?$/, '');
export function resolveImageUrl(path: string): string {
  if (!path) return '';
  return path.startsWith('http') ? path : `${API_ORIGIN}${path.startsWith('/') ? '' : '/'}${path}`;
}
