import type { Role } from './auth';
export type ReactionType = 'LIKE' | 'BRAVO' | 'SOUTIEN' | 'COUP_DE_COEUR' | 'INSTRUCTIF';
export interface PostAuthor {
  id: number;
  nom: string;
  prenom: string;
  role: Role;
  photoProfilPath?: string;
}
export interface Post {
  id: number;
  author: PostAuthor;
  content: string;
  imagePath?: string;
  createdAt: string;
  reactionsCount: Partial<Record<ReactionType, number>>;
  totalReactions: number;
  totalComments: number;
  myReaction: ReactionType | null;
  pinned: boolean;
  savedByMe: boolean;
  canEdit: boolean;
}
export interface Comment {
  id: number;
  author: PostAuthor;
  content: string;
  createdAt: string;
  parentCommentId: number | null;
  reactionsCount: Partial<Record<ReactionType, number>>;
  totalReactions: number;
  myReaction: ReactionType | null;
  replies: Comment[] | null;
}
export interface PagedPosts {
  content: Post[];
  totalElements: number;
  totalPages: number;
  number: number;
}