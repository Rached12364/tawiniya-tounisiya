export type ConversationStatus = 'OUVERTE' | 'EN_COURS' | 'RESOLUE';
export interface ConversationParticipant {
  id: number;
  nom: string;
  prenom: string;
  photoProfilPath?: string;
}
export interface ExpertMessageItem {
  id: number;
  senderId: number;
  senderNom: string;
  senderPrenom: string;
  content: string;
  attachmentPath?: string;
  createdAt: string;
  mine: boolean;
}
export interface ExpertConversationSummary {
  id: number;
  subject: string;
  status: ConversationStatus;
  updatedAt: string;
  otherUser: ConversationParticipant;
  lastMessagePreview?: string;
  isExpertSide: boolean;
}
export interface ExpertConversationDetail {
  id: number | null;
  subject: string | null;
  status: ConversationStatus | null;
  otherUser: ConversationParticipant;
  isExpertSide: boolean;
  messages: ExpertMessageItem[];
}