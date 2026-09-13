import api from './api';
import type { ExpertRatingSummary, ExpertRatingItem } from '../types/expertRating';
export async function getExpertRatings(expertId: number): Promise<ExpertRatingSummary> {
  const { data } = await api.get<ExpertRatingSummary>(`/expert-ratings/${expertId}`);
  return data;
}
export async function submitExpertRating(expertId: number, rating: number, comment: string): Promise<ExpertRatingItem> {
  const { data } = await api.post<ExpertRatingItem>(`/expert-ratings/${expertId}`, { rating, comment });
  return data;
}
export async function deleteExpertRating(expertId: number): Promise<void> {
  await api.delete(`/expert-ratings/${expertId}`);
}