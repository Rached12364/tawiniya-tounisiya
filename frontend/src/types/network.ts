import type { Role } from './auth';
export type ConnectionStatusValue = 'NONE' | 'PENDING_SENT' | 'PENDING_RECEIVED' | 'ACCEPTED';
export interface UserCard {
  id: number;
  nom: string;
  prenom: string;
  role: Role;
  bio?: string;
  photoProfilPath?: string;
  photoCouverturePath?: string;
  subtitle?: string;
  connectionStatus: ConnectionStatusValue;
  connectionId?: number;
}
export interface ConnectionItem {
  id: number;
  otherUser: UserCard;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  sentByMe: boolean;
}
export interface PagedUserCards {
  content: UserCard[];
  totalElements: number;
  totalPages: number;
  number: number;
}