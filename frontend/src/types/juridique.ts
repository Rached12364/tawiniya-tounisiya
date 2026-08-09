export interface LegalSection {
  id: number;
  title: string;
  content: string;
  orderIndex: number;
  active: boolean;
}
export interface LegalSectionInput {
  title: string;
  content: string;
  orderIndex?: number;
  active: boolean;
}