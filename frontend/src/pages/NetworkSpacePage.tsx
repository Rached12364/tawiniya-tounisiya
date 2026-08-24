import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User as UserIcon, Loader2, UserPlus, Clock, Check, Users, Inbox, Search, MapPin,
} from 'lucide-react';
import {
  browseByRole, sendConnectionRequest, acceptConnection, rejectConnection,
  getMyConnections, getReceivedInvitations,
} from '../services/networkService';
import type { Role } from '../types/auth';
import type { UserCard, ConnectionItem } from '../types/network';
const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/api\/?$/, '');
function imageUrl(path?: string) {
  if (!path) return '';
  return path.startsWith('http') ? path : `${API_ORIGIN}${path}`;
}
const ROLE_LABELS: Record<Role, string> = {
  TECHNICIEN: 'Technicien', ENTREPRISE: 'Entreprise', CENTRE_FORMATION: 'Centre de formation',
  BENEFICIEL: 'Bénéficiaire', ADMIN: 'Administrateur',
};
const GOUVERNORATS = [
  'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa', 'Jendouba', 'Kairouan',
  'Kasserine', 'Kébili', 'Le Kef', 'Mahdia', 'La Manouba', 'Médenine', 'Monastir',
  'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse', 'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan',
];
const SPECIALITE_OPTIONS = [
  'Électricité bâtiment', 'Électricité industrielle',
  'Caméras de surveillance', 'Contrôle d\u2019accès', 'Système anti-incendie', 'Système anti-intrusion',
  'Smart Home / Domotique', 'Automatisation',
  'Photovoltaïque', 'Pompage solaire', 'STEG Off-grid / On-grid / Installation',
  'Réseaux informatiques', 'Fibre optique',
];
const SECTEURS_ACTIVITE = [
  'Électricité & Énergie renouvelable', 'Bâtiment & Construction', 'Industrie & Manufacture',
  'Climatisation & Froid', 'Sécurité & Surveillance', 'Technologies de l\u2019information',
  'Automatisation & Robotique', 'Commerce & Distribution', 'Services & Conseil',
  'Agriculture & Agroalimentaire', 'Transport & Logistique', 'Autre',
];
type Tab = 'browse' | 'connections' | 'invitations';
function UserCardTile({ card, onAction }: { card: UserCard; onAction: (card: UserCard) => Promise<void> }) {
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
export default function NetworkSpacePage({ role }: { role: Role }) {
  const [tab, setTab] = useState<Tab>('browse');
  const [cards, setCards] = useState<UserCard[]>([]);
  const [connections, setConnections] = useState<ConnectionItem[]>([]);
  const [invitations, setInvitations] = useState<ConnectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterAdresse, setFilterAdresse] = useState('');
  const [filterSpecialite, setFilterSpecialite] = useState('');
  const filteredCards = cards.filter((c) => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q
      || `${c.prenom} ${c.nom}`.toLowerCase().includes(q)
      || (c.subtitle ?? '').toLowerCase().includes(q)
      || (c.adresse ?? '').toLowerCase().includes(q);
    const matchesAdresse = !filterAdresse || c.adresse === filterAdresse;
    const matchesSpecialite = !filterSpecialite || (c.subtitle ?? '').includes(filterSpecialite);
    return matchesSearch && matchesAdresse && matchesSpecialite;
  });
  function loadBrowse() {
    setLoading(true);
    browseByRole(role, 0, 40)
      .then((res) => setCards(res.content))
      .catch(() => setError('Impossible de charger les profils.'))
      .finally(() => setLoading(false));
  }
  function loadConnections() {
    setLoading(true);
    getMyConnections()
      .then(setConnections)
      .catch(() => setError('Impossible de charger vos connexions.'))
      .finally(() => setLoading(false));
  }
  function loadInvitations() {
    setLoading(true);
    getReceivedInvitations()
      .then(setInvitations)
      .catch(() => setError('Impossible de charger les invitations.'))
      .finally(() => setLoading(false));
  }
  useEffect(() => {
    setError(null);
    if (tab === 'browse') loadBrowse();
    else if (tab === 'connections') loadConnections();
    else loadInvitations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, role]);
  async function handleCardAction(card: UserCard) {
    if (card.connectionStatus === 'PENDING_RECEIVED' && card.connectionId) {
      await acceptConnection(card.connectionId);
    } else if (card.connectionStatus === 'NONE') {
      await sendConnectionRequest(card.id);
    }
    loadBrowse();
  }
  async function handleAccept(item: ConnectionItem) {
    await acceptConnection(item.id);
    loadInvitations();
  }
  async function handleReject(item: ConnectionItem) {
    await rejectConnection(item.id);
    loadInvitations();
  }
  const TABS: { key: Tab; label: string; icon: typeof Users }[] = [
    { key: 'browse', label: `${ROLE_LABELS[role]}s`, icon: Users },
    { key: 'connections', label: 'Mes connexions', icon: Check },
    { key: 'invitations', label: 'Invitations reçues', icon: Inbox },
  ];
  return (
    <div className="min-h-[70vh] bg-navy/[0.02] pt-28 pb-16 px-4">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-black text-navy mb-1">Espace {ROLE_LABELS[role]}</h1>
        <p className="text-sm text-navy/50 mb-6">Découvrez et connectez-vous avec la communauté {ROLE_LABELS[role].toLowerCase()}.</p>
        <div className="flex gap-2 mb-6 border-b border-navy/10">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
                tab === key ? 'border-gold text-navy' : 'border-transparent text-navy/50 hover:text-navy'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>}
        {tab === 'browse' && (
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <div className="relative max-w-sm flex-1 min-w-[220px]">
              <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-navy/30" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Rechercher un ${ROLE_LABELS[role].toLowerCase()}...`}
                className="w-full rounded-full border border-navy/15 bg-white ps-9 pe-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
              />
            </div>
            {(role === 'TECHNICIEN' || role === 'ENTREPRISE') && (
              <>
                <select
                  value={filterAdresse}
                  onChange={(e) => setFilterAdresse(e.target.value)}
                  className="rounded-full border border-navy/15 bg-white px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
                >
                  <option value="">Tous les gouvernorats</option>
                  {GOUVERNORATS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
                <select
                  value={filterSpecialite}
                  onChange={(e) => setFilterSpecialite(e.target.value)}
                  className="rounded-full border border-navy/15 bg-white px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
                >
                  <option value="">{role === 'TECHNICIEN' ? 'Toutes les spécialités' : 'Tous les secteurs'}</option>
                  {(role === 'TECHNICIEN' ? SPECIALITE_OPTIONS : SECTEURS_ACTIVITE).map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </>
            )}
          </div>
        )}
        {loading ? (
          <div className="grid place-items-center py-16"><Loader2 className="animate-spin text-navy/40" size={28} /></div>
        ) : tab === 'browse' ? (
          cards.length === 0 ? (
            <p className="text-navy/50 text-sm">Aucun profil {ROLE_LABELS[role].toLowerCase()} pour le moment.</p>
          ) : filteredCards.length === 0 ? (
            <p className="text-navy/50 text-sm">Aucun résultat pour « {search} ».</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredCards.map((c) => <UserCardTile key={c.id} card={c} onAction={handleCardAction} />)}
            </div>
          )
        ) : tab === 'connections' ? (
          connections.length === 0 ? (
            <p className="text-navy/50 text-sm">Vous n'avez pas encore de connexions.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {connections.map((item) => <UserCardTile key={item.id} card={item.otherUser} onAction={async () => {}} />)}
            </div>
          )
        ) : (
          invitations.length === 0 ? (
            <p className="text-navy/50 text-sm">Aucune invitation en attente.</p>
          ) : (
            <div className="flex flex-col gap-3 max-w-xl">
              {invitations.map((item) => {
                const u = item.otherUser;
                const fullName = `${u.prenom} ${u.nom}`.trim();
                return (
                  <div key={item.id} className="bg-white rounded-xl border border-navy/10 p-4 flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-navy/10 overflow-hidden shrink-0">
                      {u.photoProfilPath ? (
                        <img src={imageUrl(u.photoProfilPath)} alt={fullName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full grid place-items-center text-navy/30"><UserIcon size={18} /></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-navy truncate">{fullName}</p>
                      <p className="text-xs text-navy/50 truncate">{u.subtitle || ROLE_LABELS[u.role]}</p>
                    </div>
                    <button onClick={() => handleReject(item)} className="rounded-full border border-navy/15 px-3 py-1.5 text-xs font-semibold text-navy/60 hover:bg-navy/5 transition-colors">
                      Refuser
                    </button>
                    <button onClick={() => handleAccept(item)} className="rounded-full bg-gold px-3 py-1.5 text-xs font-semibold text-navy-dark hover:bg-gold-light transition-colors">
                      Accepter
                    </button>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}