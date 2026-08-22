import api from './api';
import type { PagedPosts, Post, Comment, ReactionType } from '../types/post';
export async function getFeed(page = 0, size = 20): Promise<PagedPosts> {
  const { data } = await api.get<PagedPosts>('/posts', { params: { page, size } });
  return data;
}
export async function createPost(content: string, image: File | null): Promise<Post> {
  const formData = new FormData();
  formData.append('content', content);
  if (image) formData.append('image', image);
  const { data } = await api.post<Post>('/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
export async function updatePost(postId: number, content: string): Promise<Post> {
  const { data } = await api.put<Post>(`/posts/${postId}`, { content });
  return data;
}
export async function deletePost(postId: number): Promise<void> {
  await api.delete(`/posts/${postId}`);
}
export async function togglePin(postId: number): Promise<Post> {
  const { data } = await api.post<Post>(`/posts/${postId}/pin`);
  return data;
}
export async function toggleSave(postId: number): Promise<Post> {
  const { data } = await api.post<Post>(`/posts/${postId}/save`);
  return data;
}
export async function getPostsByAuthor(authorId: number, page = 0, size = 20): Promise<PagedPosts> {
  const { data } = await api.get<PagedPosts>(`/posts/by-user/${authorId}`, { params: { page, size } });
  return data;
}
export async function getSavedPosts(): Promise<Post[]> {
  const { data } = await api.get<Post[]>('/posts/saved');
  return data;
}
export async function reactToPost(postId: number, type: ReactionType): Promise<Post> {
  const { data } = await api.post<Post>(`/posts/${postId}/react`, { type });
  return data;
}
export async function getComments(postId: number): Promise<Comment[]> {
  const { data } = await api.get<Comment[]>(`/posts/${postId}/comments`);
  return data;
}
export async function addComment(postId: number, content: string, parentCommentId?: number): Promise<Comment> {
  const { data } = await api.post<Comment>(`/posts/${postId}/comments`, { content, parentCommentId });
  return data;
}
export async function reactToComment(commentId: number, type: ReactionType): Promise<Comment> {
  const { data } = await api.post<Comment>(`/posts/comments/${commentId}/react`, { type });
  return data;
}
export async function deleteComment(commentId: number): Promise<void> {
  await api.delete(`/posts/comments/${commentId}`);
}