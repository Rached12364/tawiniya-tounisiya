export interface TrainingCourse {
  id: number;
  title: string;
  description: string | null;
}
export interface TrainingCourseInput {
  title: string;
  description?: string;
}
export interface TrainingCenter {
  id: number;
  ownerId: number;
  name: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  logoPath: string | null;
  openingHours: string | null;
  courses: TrainingCourse[];
  createdAt: string;
  updatedAt: string;
}
export interface TrainingCenterInput {
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  openingHours?: string;
  courses?: TrainingCourseInput[];
}