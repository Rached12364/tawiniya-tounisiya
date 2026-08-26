export type ReclamationType = 'ADMINISTRATIVE' | 'JURIDIQUE';
export type ReclamationStatus = 'OUVERTE' | 'EN_COURS' | 'RESOLUE' | 'REJETEE';
export interface Reclamation {
  id: number;
  type: ReclamationType;
  subject: string;
  description: string;
  attachmentPath: string | null;
  status: ReclamationStatus;
  adminResponse: string | null;
  createdAt: string;
  updatedAt: string;
  userId: number;
  userNom: string;
  userPrenom: string;
  userEmail: string;
  userRole: string;
}
export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
export const RECLAMATION_TYPE_LABELS: Record<ReclamationType, string> = {
  ADMINISTRATIVE: 'Administrative',
  JURIDIQUE: 'Juridique',
};
export const RECLAMATION_STATUS_LABELS: Record<ReclamationStatus, string> = {
  OUVERTE: 'Ouverte',
  EN_COURS: 'En cours',
  RESOLUE: 'Résolue',
  REJETEE: 'Rejetée',
};
export const RECLAMATION_STATUS_COLORS: Record<ReclamationStatus, string> = {
  OUVERTE: 'bg-amber-100 text-amber-700',
  EN_COURS: 'bg-blue-100 text-blue-700',
  RESOLUE: 'bg-green-100 text-green-700',
  REJETEE: 'bg-red-100 text-red-700',
};
