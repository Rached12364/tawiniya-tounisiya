import type { Role, User } from './auth';
export interface AdminStats {
  totalUsers: number;
  usersByRole: Record<Role, number>;
  failedLoginAttempts: number;
}
export interface PagedUsers {
  content: User[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
export type ContentSection = 'HERO' | 'SPONSOR';
export interface ContentImage {
  id: number;
  section: ContentSection;
  title: string;
  description: string | null;
  imagePath: string;
  displayOrder: number;
  active: boolean;
  createdAt: string;
}
