import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, Loader2, UserPlus, Clock, Check, MapPin } from 'lucide-react';
import type { Role } from '../types/auth';
import type { UserCard } from '../types/network';
const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/api\/?$/, '');
export function imageUrl(path?: string) {
  if (!path) return '';
  return path.startsWith('http') ? path : `${API_ORIGIN}${path}`;
}
export const ROLE_LABELS: Record<Role, string> = {
  TECHNICIEN: 'Technicien', ENTREPRISE: 'Entreprise', CENTRE_FORMATION: 'Centre de formation',
  BENEFICIEL: 'Bénéficiaire', ADMIN: 'Administrateur', EXPERT_JURIDIQUE: 'Expert Juridique',
};
export default function UserCardTile({ card, onAction }: { card: UserCard; onAction: (card: UserCard) => Promise<void> }) {
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const fullName = `${card.prenom} ${card.nom}`.trim();
  async function handleClick() {
    setBusy(true);
    try {
      await onAction(card);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div
      onClick={() => navigate(`/profil/${card.id}`)}
      className="bg-white rounded-xl border border-navy/10 overflow-hidden flex flex-col hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="h-16 bg-gradient-to-br from-navy to-teal overflow-hidden">
        {card.photoCouverturePath && (
          <img src={imageUrl(card.photoCouverturePath)} alt="" className="w-full h-full object-cover" />
        )}
      </div>
      <div className="px-4 pb-4 -mt-8 flex flex-col items-center text-center">
        <div className="h-16 w-16 rounded-full border-4 border-white bg-navy/10 overflow-hidden shrink-0">
          {card.photoProfilPath ? (
            <img src={imageUrl(card.photoProfilPath)} alt={fullName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full grid place-items-center text-navy/30"><UserIcon size={24} /></div>
          )}
        </div>
        <h3 className="mt-2 text-sm font-bold text-navy truncate max-w-full">{fullName}</h3>
        <p className="text-xs text-navy/50 truncate max-w-full">{card.subtitle || ROLE_LABELS[card.role]}</p>
        {card.adresse && (
          <p className="mt-0.5 flex items-center justify-center gap-1 text-[11px] text-navy/40 truncate max-w-full">
            <MapPin size={11} /> {card.adresse}
          </p>
        )}
        {card.bio && <p className="mt-1.5 text-[11px] text-navy/60 italic line-clamp-2">{card.bio}</p>}
        <button
          onClick={(e) => { e.stopPropagation(); handleClick(); }}
          disabled={busy || card.connectionStatus === 'ACCEPTED' || card.connectionStatus === 'PENDING_SENT'}
          className={`mt-3 w-full flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-70 ${
            card.connectionStatus === 'ACCEPTED'
              ? 'bg-teal/10 text-teal cursor-default'
              : card.connectionStatus === 'PENDING_SENT'
              ? 'bg-navy/5 text-navy/50 cursor-default'
              : card.connectionStatus === 'PENDING_RECEIVED'
              ? 'bg-gold text-navy-dark hover:bg-gold-light'
              : 'border border-teal text-teal hover:bg-teal/5'
          }`}
        >
          {busy ? (
            <Loader2 size={13} className="animate-spin" />
          ) : card.connectionStatus === 'ACCEPTED' ? (
            <><Check size={13} /> Connecté</>
          ) : card.connectionStatus === 'PENDING_SENT' ? (
            <><Clock size={13} /> En attente</>
          ) : card.connectionStatus === 'PENDING_RECEIVED' ? (
            <><Check size={13} /> Accepter</>
          ) : (
            <><UserPlus size={13} /> Se connecter</>
          )}
        </button>
      </div>
    </div>
  );
}