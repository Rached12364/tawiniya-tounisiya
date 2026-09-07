import type { Role } from './auth';
export interface NotificationActor {
  id: number;
  nom: string;
  prenom: string;
  role: Role;
  photoProfilPath?: string | null;
}
export type NotificationType = 'LIKE_POST' | 'COMMENT_POST' | 'REPLY_COMMENT' | 'LIKE_COMMENT' | 'NEW_POST';
export interface AppNotification {
  id: number;
  type: NotificationType;
  actor: NotificationActor;
  postId: number | null;
  commentId: number | null;
  message: string;
  read: boolean;
  createdAt: string;
}
export interface PagedNotifications {
  content: AppNotification[];
  totalElements: number;
  totalPages: number;
  number: number;
}