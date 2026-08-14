export type GroupeSanguin =
  | 'A_POSITIF' | 'A_NEGATIF'
  | 'B_POSITIF' | 'B_NEGATIF'
  | 'AB_POSITIF' | 'AB_NEGATIF'
  | 'O_POSITIF' | 'O_NEGATIF';
export const GROUPE_SANGUIN_LABELS: Record<GroupeSanguin, string> = {
  A_POSITIF: 'A+',
  A_NEGATIF: 'A-',
  B_POSITIF: 'B+',
  B_NEGATIF: 'B-',
  AB_POSITIF: 'AB+',
  AB_NEGATIF: 'AB-',
  O_POSITIF: 'O+',
  O_NEGATIF: 'O-',
};
export interface TechnicienProfile {
  id: number;
  userId: number;
  userEmail: string;
  nom: string | null;
  prenom: string | null;
  dateNaissance: string | null;
  cin: string | null;
  nomParent: string | null;
  adresse: string | null;
  gsm: string | null;
  gsmParent: string | null;
  gsmBinome: string | null;
  email: string | null;
  facebook: string | null;
  tiktok: string | null;
  instagram: string | null;
  diplome: string | null;
  specialite: string | null;
  niveauScolaire: string | null;
  permisConduite: boolean;
  datePermis: string | null;
  typeContrat: string | null;
  numeroCnss: string | null;
  numeroD17: string | null;
  numeroBanquePoste: string | null;
  groupeSanguin: GroupeSanguin | null;
  poidsKg: number | null;
  hauteurCm: number | null;
  pointureChaussure: string | null;
  tailleVetements: string | null;
  maladiesChroniques: string | null;
  allergies: string | null;
  operations: string | null;
  tatouage: boolean;
  dateEmbauche: string | null;
  experience: string | null;
  societesEtPeriodes: string | null;
  salaireDepart: number | null;
  nombreJoursConge: number | null;
  gsmSociete: string | null;
  photoProfilPath: string | null;
  photoCouverturePath: string | null;
  copieCinPath: string | null;
  copieExtraitNaissancePath: string | null;
  copieDiplomePath: string | null;
  copiePermisPath: string | null;
  createdAt: string;
  updatedAt: string;
}
export interface TechnicienProfileFormData {
  nom: string;
  prenom: string;
  dateNaissance: string | null;
  cin: string | null;
  nomParent: string | null;
  adresse: string | null;
  gsm: string | null;
  gsmParent: string | null;
  gsmBinome: string | null;
  email: string | null;
  facebook: string | null;
  tiktok: string | null;
  instagram: string | null;
  diplome: string | null;
  specialite: string | null;
  niveauScolaire: string | null;
  permisConduite: boolean;
  datePermis: string | null;
  typeContrat: string | null;
  numeroCnss: string | null;
  numeroD17: string | null;
  numeroBanquePoste: string | null;
  groupeSanguin: GroupeSanguin | null;
  poidsKg: number | null;
  hauteurCm: number | null;
  pointureChaussure: string | null;
  tailleVetements: string | null;
  maladiesChroniques: string | null;
  allergies: string | null;
  operations: string | null;
  tatouage: boolean;
  dateEmbauche: string | null;
  experience: string | null;
  societesEtPeriodes: string | null;
  salaireDepart: number | null;
  nombreJoursConge: number | null;
  gsmSociete: string | null;
}