import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  User as UserIcon, Loader2, UserPlus, Clock, Check, ArrowLeft,
  Phone, Mail, Globe, MapPin, GraduationCap, Building2, Link as LinkIcon,
  MessageCircle, X,
} from 'lucide-react';
import { getPublicProfile, sendConnectionRequest, acceptConnection } from '../services/networkService';
import UserPostsList from '../components/post/UserPostsList';
import ExpertChatWidget from '../components/ExpertChatWidget';
import type { UserPublicProfile } from '../types/network';
const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/api\/?$/, '');
function imageUrl(path?: string) {
  if (!path) return '';
  return path.startsWith('http') ? path : `${API_ORIGIN}${path}`;
}
const ROLE_LABELS: Record<string, string> = {
  TECHNICIEN: 'Technicien', ENTREPRISE: 'Entreprise', CENTRE_FORMATION: 'Centre de formation',
  BENEFICIEL: 'Bénéficiaire', ADMIN: 'Administrateur',
};
function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 text-teal shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] text-navy/45 leading-none mb-0.5">{label}</p>
        <p className="text-sm text-navy font-medium break-words">{value}</p>
      </div>
    </div>
  );
}
export default function PublicProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserPublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  function load() {
    if (!id) return;
    setLoading(true);
    getPublicProfile(Number(id))
      .then(setProfile)
      .catch(() => setError('Profil introuvable.'))
      .finally(() => setLoading(false));
  }
  useEffect(load, [id]);
  async function handleConnect() {
    if (!profile) return;
    setBusy(true);
    try {
      if (profile.connectionStatus === 'PENDING_RECEIVED' && profile.connectionId) {
        await acceptConnection(profile.connectionId);
      } else if (profile.connectionStatus === 'NONE') {
        await sendConnectionRequest(profile.id);
      }
      load();
    } finally {
      setBusy(false);
    }
  }
  if (loading) {
    return <div className="min-h-[70vh] grid place-items-center"><Loader2 className="animate-spin text-navy/40" size={28} /></div>;
  }
  if (error || !profile) {
    return <div className="min-h-[70vh] grid place-items-center"><p className="text-red-600">{error ?? 'Profil introuvable.'}</p></div>;
  }
  const fullName = `${profile.prenom} ${profile.nom}`.trim();
  const subtitle =
    profile.role === 'TECHNICIEN' ? profile.specialite :
    profile.role === 'ENTREPRISE' ? profile.secteurActivite :
    profile.role === 'CENTRE_FORMATION' ? profile.formationsProposees : null;
  return (
    <div className="min-h-[70vh] bg-navy/[0.02] pb-16">
      <div className="relative h-48 md:h-60 w-full bg-gradient-to-br from-navy via-navy-dark to-teal overflow-hidden">
        {profile.photoCouverturePath && (
          <img src={imageUrl(profile.photoCouverturePath)} alt="Couverture" className="w-full h-full object-cover" />
        )}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 start-4 flex items-center gap-1.5 rounded-full bg-white/90 hover:bg-white px-3 py-1.5 text-xs font-semibold text-navy shadow transition-colors"
        >
          <ArrowLeft size={14} /> Retour
        </button>
      </div>
      <div className="mx-auto max-w-3xl px-4">
        <div className="relative -mt-16 mb-6 bg-white rounded-xl shadow-sm px-6 pt-4 pb-5">
          <div className="h-28 w-28 rounded-full border-4 border-white bg-navy/10 overflow-hidden shrink-0 -mt-16 mb-3">
            {profile.photoProfilPath ? (
              <img src={imageUrl(profile.photoProfilPath)} alt={fullName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full grid place-items-center text-navy/30"><UserIcon size={36} /></div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <h1 className="text-xl font-black text-navy">{fullName}</h1>
              <p className="text-sm text-navy/50 mt-0.5">{subtitle || ROLE_LABELS[profile.role]} — CTTEERA</p>
              {profile.bio && <p className="mt-2 text-sm text-navy/70 italic">"{profile.bio}"</p>}
            </div>
            {profile.role === 'EXPERT_JURIDIQUE' && profile.connectionStatus !== 'SELF' && (
              <button
                onClick={() => setChatOpen(true)}
                className="shrink-0 grid place-items-center h-11 w-11 rounded-full bg-teal text-white hover:bg-teal/90 transition-colors shadow"
                title="Contacter l'expert"
              >
                <MessageCircle size={20} />
              </button>
            )}
            {profile.connectionStatus !== 'SELF' && profile.role !== 'EXPERT_JURIDIQUE' && (
              <button
                onClick={handleConnect}
                disabled={busy || profile.connectionStatus === 'ACCEPTED' || profile.connectionStatus === 'PENDING_SENT'}
                className={`shrink-0 flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-70 ${
                  profile.connectionStatus === 'ACCEPTED'
                    ? 'bg-teal/10 text-teal cursor-default'
                    : profile.connectionStatus === 'PENDING_SENT'
                    ? 'bg-navy/5 text-navy/50 cursor-default'
                    : profile.connectionStatus === 'PENDING_RECEIVED'
                    ? 'bg-gold text-navy-dark hover:bg-gold-light'
                    : 'border border-teal text-teal hover:bg-teal/5'
                }`}
              >
                {busy ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : profile.connectionStatus === 'ACCEPTED' ? (
                  <><Check size={15} /> Connecté</>
                ) : profile.connectionStatus === 'PENDING_SENT' ? (
                  <><Clock size={15} /> En attente</>
                ) : profile.connectionStatus === 'PENDING_RECEIVED' ? (
                  <><Check size={15} /> Accepter</>
                ) : (
                  <><UserPlus size={15} /> Se connecter</>
                )}
              </button>
            )}
          </div>
        </div>
        {profile.role === 'TECHNICIEN' && (
          <div className="bg-white rounded-xl shadow-sm p-5 mb-5">
            <h2 className="text-sm font-bold text-teal uppercase tracking-wide mb-4">Formation</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow icon={<GraduationCap size={16} />} label="Diplôme" value={profile.diplome} />
              <InfoRow icon={<GraduationCap size={16} />} label="Spécialité" value={profile.specialite} />
              <InfoRow icon={<GraduationCap size={16} />} label="Niveau scolaire" value={profile.niveauScolaire} />
            </div>
          </div>
        )}
        {profile.role === 'ENTREPRISE' && (
          <div className="bg-white rounded-xl shadow-sm p-5 mb-5">
            <h2 className="text-sm font-bold text-teal uppercase tracking-wide mb-4">Entreprise</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow icon={<Building2 size={16} />} label="Raison sociale" value={profile.raisonSociale} />
              <InfoRow icon={<Building2 size={16} />} label="Secteur d'activité" value={profile.secteurActivite} />
              <InfoRow icon={<MapPin size={16} />} label="Ville" value={profile.ville} />
              <InfoRow icon={<MapPin size={16} />} label="Gouvernorat" value={profile.gouvernorat} />
              <InfoRow icon={<Globe size={16} />} label="Site web" value={profile.siteWeb} />
              <InfoRow icon={<Phone size={16} />} label="Téléphone" value={profile.entrepriseTelephone} />
              <InfoRow icon={<Mail size={16} />} label="Email" value={profile.entrepriseEmail} />
            </div>
            {profile.descriptionEntreprise && (
              <p className="mt-4 text-sm text-navy/70 whitespace-pre-line">{profile.descriptionEntreprise}</p>
            )}
          </div>
        )}
        {profile.role === 'CENTRE_FORMATION' && (
          <div className="bg-white rounded-xl shadow-sm p-5 mb-5">
            <h2 className="text-sm font-bold text-teal uppercase tracking-wide mb-4">Centre de formation</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow icon={<MapPin size={16} />} label="Adresse" value={profile.adresse} />
              <InfoRow icon={<Globe size={16} />} label="Site web" value={profile.siteWeb} />
              <InfoRow icon={<GraduationCap size={16} />} label="Horaires" value={profile.horaires} />
            </div>
            {profile.formationsProposees && (
              <p className="mt-4 text-sm text-navy/70 whitespace-pre-line">{profile.formationsProposees}</p>
            )}
          </div>
        )}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-sm font-bold text-teal uppercase tracking-wide mb-4">Contact</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoRow icon={<Phone size={16} />} label="Téléphone" value={profile.phone} />
            <InfoRow icon={<LinkIcon size={16} />} label="Facebook" value={profile.facebook} />
            <InfoRow icon={<LinkIcon size={16} />} label="Instagram" value={profile.instagram} />
            <InfoRow icon={<Globe size={16} />} label="TikTok" value={profile.tiktok} />
            <InfoRow icon={<Globe size={16} />} label="LinkedIn" value={profile.linkedin} />
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-sm font-bold text-teal uppercase tracking-wide mb-3">Publications</h2>
          <UserPostsList authorId={profile.id} />
        </div>
      </div>
      {chatOpen && profile.role === 'EXPERT_JURIDIQUE' && (
        <div className="fixed bottom-4 end-4 z-50 w-[400px] max-w-[92vw] shadow-2xl rounded-xl overflow-hidden">
          <div className="relative">
            <button
              onClick={() => setChatOpen(false)}
              className="absolute top-3 end-3 z-10 grid place-items-center h-6 w-6 rounded-full bg-navy/10 hover:bg-navy/20 text-navy transition-colors"
            >
              <X size={13} />
            </button>
            <ExpertChatWidget expertId={profile.id} />
          </div>
        </div>
      )}
    </div>
  );
}