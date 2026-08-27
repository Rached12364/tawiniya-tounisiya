export type Role = 'ADMIN' | 'TECHNICIEN' | 'ENTREPRISE' | 'CENTRE_FORMATION' | 'BENEFICIEL' | 'AVOCAT';
export interface ExperiencePro {
  societe: string;
  periode: string;
}
export interface TechnicienProfil {
  dateNaissance?: string;
  cin?: string;
  nomParent?: string;
  adresse?: string;
  gsmParent?: string;
  gsmBinome?: string;
  facebook?: string;
  tiktok?: string;
  instagram?: string;
  diplome?: string;
  specialite?: string;
  niveauScolaire?: string;
  permisConduire?: 'OUI' | 'NON' | null;
  typeContrat?: string;
  numCnss?: string;
  numD17?: string;
  numeroBanque?: string;
  groupeSanguin?: string;
  poids?: number;
  hauteur?: number;
  pointureChaussure?: string;
  tailleVetements?: string;
  tatouage?: 'OUI' | 'NON' | null;
  maladiesChroniques?: string;
  allergies?: string;
  operations?: string;
  dateEmbauche?: string;
  experienceAnnees?: number;
  salaireDepart?: number;
  joursCongeAutorises?: number;
  gsmSocieteMSD?: string;
  experiencesPro?: ExperiencePro[];
}
export interface EntrepriseProfil {
  raisonSociale?: string;
  matriculeFiscal?: string;
  registreCommerce?: string;
  secteurActivite?: string;
  descriptionEntreprise?: string;
  anneeCreation?: number | string;
  tailleEntreprise?: string;
  entrepriseAdresse?: string;
  gouvernorat?: string;
  ville?: string;
  entrepriseTelephone?: string;
  entrepriseEmail?: string;
  siteWeb?: string;
  linkedin?: string;
  nomResponsable?: string;
  fonctionResponsable?: string;
  telephoneResponsable?: string;
  emailResponsable?: string;
  domainesActivite?: string;
  technologiesUtilisees?: string;
  servicesProposes?: string;
  nombreTechniciens?: number | string;
  nombreStagiaires?: number | string;
  nombreEmployes?: number | string;
}
export interface CentreFormationProfil {
  horaires?: string;
  formationsProposees?: string;
}
export interface AvocatProfil {
  numeroBarreau?: string;
  verified?: boolean;
  avocatDocuments?: string[];
}
export interface User extends TechnicienProfil, EntrepriseProfil, CentreFormationProfil, AvocatProfil {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  phone: string;
  role: Role;
  enabled: boolean;
  createdAt: string;
  bio?: string;
  photoProfilPath?: string;
  photoCouverturePath?: string;
}
export interface AuthResponse {
  token: string;
  user: User;
}
export interface LoginPayload {
  email: string;
  password: string;
}
export interface RegisterPayload extends TechnicienProfil, EntrepriseProfil, CentreFormationProfil, AvocatProfil {
  nom: string;
  prenom: string;
  email: string;
  phone: string;
  password: string;
  role: Role;
}
export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  fieldErrors: Record<string, string> | null;
}