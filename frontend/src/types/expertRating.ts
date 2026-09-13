export interface ExpertRatingItem {
  id: number;
  authorId: number;
  authorNom: string;
  authorPrenom: string;
  authorPhotoProfilPath?: string;
  rating: number;
  comment?: string;
  createdAt: string;
  mine: boolean;
}
export interface ExpertRatingSummary {
  average: number;
  count: number;
  ratings: ExpertRatingItem[];
}