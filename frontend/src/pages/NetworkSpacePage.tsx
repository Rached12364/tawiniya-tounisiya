import { useEffect, useState } from 'react';
import {
  User as UserIcon, Loader2, Check, Users, Inbox, Search,
} from 'lucide-react';
import {
  browseByRole, sendConnectionRequest, acceptConnection, rejectConnection,
  getMyConnections, getReceivedInvitations,
} from '../services/networkService';
import type { Role } from '../types/auth';
import type { UserCard, ConnectionItem } from '../types/network';
import UserCardTile, { ROLE_LABELS, imageUrl } from '../components/UserCardTile';
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
const SPACE_IMAGES: Record<string, string> = {
  TECHNICIEN: '/images/hero_bg.jpg',
  ENTREPRISE: '/images/planification.jpg',
};
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
      <div className={`mx-auto max-w-6xl ${SPACE_IMAGES[role] ? 'grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start' : ''}`}>
        <div className="min-w-0">
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
            {(role === 'TECHNICIEN' || role === 'ENTREPRISE' || role === 'CENTRE_FORMATION') && (
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
                  <option value="">
                    {role === 'TECHNICIEN' ? 'Toutes les spécialités' : role === 'ENTREPRISE' ? 'Tous les secteurs' : 'Toutes les formations'}
                  </option>
                  {(role === 'ENTREPRISE' ? SECTEURS_ACTIVITE : SPECIALITE_OPTIONS).map((s) => <option key={s} value={s}>{s}</option>)}
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
        {SPACE_IMAGES[role] && (
          <aside className="hidden lg:block lg:sticky lg:top-24">
            <img
              src={SPACE_IMAGES[role]}
              alt=""
              className="w-full rounded-2xl shadow-sm object-cover"
              style={{ maxHeight: '600px' }}
            />
          </aside>
        )}
      </div>
    </div>
  );
}