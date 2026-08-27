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
  adresse?: string;
  subtitle?: string;
  verified?: boolean;
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
export interface UserPublicProfile {
  id: number;
  nom: string;
  prenom: string;
  role: Role;
  bio?: string;
  photoProfilPath?: string;
  photoCouverturePath?: string;
  phone?: string;
  diplome?: string;
  specialite?: string;
  niveauScolaire?: string;
  facebook?: string;
  tiktok?: string;
  instagram?: string;
  raisonSociale?: string;
  secteurActivite?: string;
  descriptionEntreprise?: string;
  ville?: string;
  gouvernorat?: string;
  siteWeb?: string;
  linkedin?: string;
  entrepriseTelephone?: string;
  entrepriseEmail?: string;
  adresse?: string;
  horaires?: string;
  formationsProposees?: string;
  numeroBarreau?: string;
  verified?: boolean;
  connectionStatus: ConnectionStatusValue | 'SELF';
  connectionId?: number;
}
export interface PagedUserCards {
  content: UserCard[];
  totalElements: number;
  totalPages: number;
  number: number;
}