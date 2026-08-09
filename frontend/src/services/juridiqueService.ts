import api from './api';
import type { LegalSection, LegalSectionInput } from '../types/juridique';
export const adminJuridiqueService = {
  getAll: () => api.get<LegalSection[]>('/admin/juridique').then((r) => r.data),
  create: (data: LegalSectionInput) => api.post<LegalSection>('/admin/juridique', data).then((r) => r.data),
  update: (id: number, data: LegalSectionInput) =>
    api.put<LegalSection>(`/admin/juridique/${id}`, data).then((r) => r.data),
  remove: (id: number) => api.delete(`/admin/juridique/${id}`),
  reorder: (orderedIds: number[]) => api.put('/admin/juridique/reorder', { orderedIds }),
};
export const juridiqueService = {
  getActive: () => api.get<LegalSection[]>('/juridique').then((r) => r.data),
};