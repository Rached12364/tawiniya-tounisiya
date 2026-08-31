import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Search, MapPin, User as UserIcon, UserPlus, Clock, Check } from 'lucide-react';
import { browseByRole, sendConnectionRequest, acceptConnection } from '../services/networkService';
import { getMyConversations } from '../services/expertConversationService';
import { imageUrl } from '../components/UserCardTile';
import ExpertChatWidget from '../components/ExpertChatWidget';
import type { UserCard } from '../types/network';
import type { ExpertConversationSummary } from '../types/expertConversation';
function ExpertRow({ card, onAction }: { card: UserCard; onAction: (card: UserCard) => Promise<void> }) {
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
      className="bg-white rounded-xl border border-navy/10 px-4 py-3 flex items-center gap-4 hover:shadow-sm hover:border-teal/30 transition-all cursor-pointer"
    >
      <div className="h-11 w-11 rounded-full bg-navy/10 overflow-hidden shrink-0">
        {card.photoProfilPath ? (
          <img src={imageUrl(card.photoProfilPath)} alt={fullName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full grid place-items-center text-navy/30"><UserIcon size={18} /></div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-navy truncate">{fullName}</p>
        <p className="text-xs text-navy/50 truncate">{card.subtitle || 'Expert Juridique'}</p>
      </div>
      <div className="hidden sm:flex items-center gap-1.5 text-xs text-navy/50 w-40 shrink-0 truncate">
        {card.adresse && (
          <>
            <MapPin size={12} className="text-teal shrink-0" />
            <span className="truncate">{card.adresse}</span>
          </>
        )}
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); handleClick(); }}
        disabled={busy || card.connectionStatus === 'ACCEPTED' || card.connectionStatus === 'PENDING_SENT'}
        className={`shrink-0 flex items-center justify-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors disabled:opacity-70 ${
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
  );
}
export default function ServiceJuridiquePage() {
  const [cards, setCards] = useState<UserCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterAdresse, setFilterAdresse] = useState('');
  const [conversations, setConversations] = useState<ExpertConversationSummary[]>([]);
  const [conversationsLoading, setConversationsLoading] = useState(true);
  const [openExpertId, setOpenExpertId] = useState<number | null>(null);
  useEffect(() => {
    setLoading(true);
    setError(null);
    browseByRole('EXPERT_JURIDIQUE', 0, 100)
      .then((res) => setCards(res.content))
      .catch(() => setError('Impossible de charger les experts juridiques.'))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    setConversationsLoading(true);
    getMyConversations()
      .then(setConversations)
      .catch(() => {})
      .finally(() => setConversationsLoading(false));
  }, []);
  async function handleCardAction(card: UserCard) {
    if (card.connectionStatus === 'PENDING_RECEIVED' && card.connectionId) {
      await acceptConnection(card.connectionId);
    } else if (card.connectionStatus === 'NONE') {
      await sendConnectionRequest(card.id);
    }
    const res = await browseByRole('EXPERT_JURIDIQUE', 0, 100);
    setCards(res.content);
  }
  const adresseOptions = useMemo(() => {
    const set = new Set<string>();
    cards.forEach((c) => { if (c.adresse?.trim()) set.add(c.adresse.trim()); });
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'fr'));
  }, [cards]);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return cards
      .filter((c) => !filterAdresse || c.adresse === filterAdresse)
      .filter((c) => {
        if (!q) return true;
        return `${c.prenom} ${c.nom}`.toLowerCase().includes(q)
          || (c.bio ?? '').toLowerCase().includes(q)
          || (c.adresse ?? '').toLowerCase().includes(q);
      })
      .sort((a, b) => `${a.prenom} ${a.nom}`.localeCompare(`${b.prenom} ${b.nom}`, 'fr'));
  }, [cards, search, filterAdresse]);
  return (
    <div className="min-h-[70vh] bg-navy/[0.02] pt-28 pb-16 px-4">
      <div className="mx-auto max-w-3xl">
        {!conversationsLoading && conversations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-bold text-teal uppercase tracking-wide mb-3">Mes conversations</h2>
            <div className="flex flex-col gap-2">
              {conversations.map((conv) => (
                <div key={conv.id}>
                  <div
                    onClick={() => setOpenExpertId(openExpertId === conv.otherUser.id ? null : conv.otherUser.id)}
                    className="bg-white rounded-xl border border-navy/10 px-4 py-3 flex items-center gap-3 hover:shadow-sm hover:border-teal/30 transition-all cursor-pointer"
                  >
                    <div className="h-9 w-9 rounded-full bg-navy/10 overflow-hidden shrink-0">
                      {conv.otherUser.photoProfilPath ? (
                        <img src={imageUrl(conv.otherUser.photoProfilPath)} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full grid place-items-center text-navy/30"><UserIcon size={14} /></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-navy truncate">{conv.otherUser.prenom} {conv.otherUser.nom}</p>
                      <p className="text-xs text-navy/50 truncate">{conv.lastMessagePreview || conv.subject}</p>
                    </div>
                    <span className={`shrink-0 text-[10px] font-semibold rounded-full px-2 py-1 ${
                      conv.status === 'RESOLUE' ? 'bg-teal/10 text-teal' : conv.status === 'EN_COURS' ? 'bg-gold/20 text-navy-dark' : 'bg-navy/5 text-navy/50'
                    }`}>
                      {conv.status === 'RESOLUE' ? 'Résolue' : conv.status === 'EN_COURS' ? 'En cours' : 'Ouverte'}
                    </span>
                  </div>
                  {openExpertId === conv.otherUser.id && (
                    <div className="mt-2">
                      <ExpertChatWidget expertId={conv.otherUser.id} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        <h1 className="text-2xl font-black text-navy mb-1">Service Juridique</h1>
        <p className="text-sm text-navy/50 mb-6">
          Retrouvez nos experts juridiques.
        </p>
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-navy/30" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un expert, une adresse..."
              className="w-full rounded-full border border-navy/15 bg-white ps-9 pe-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
            />
          </div>
          <select
            value={filterAdresse}
            onChange={(e) => setFilterAdresse(e.target.value)}
            className="rounded-full border border-navy/15 bg-white px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
          >
            <option value="">Toutes les adresses</option>
            {adresseOptions.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>}
        {loading ? (
          <div className="grid place-items-center py-16"><Loader2 className="animate-spin text-navy/40" size={28} /></div>
        ) : filtered.length === 0 ? (
          <p className="text-navy/50 text-sm">
            {search || filterAdresse ? 'Aucun résultat pour ces critères.' : 'Aucun expert juridique pour le moment.'}
          </p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {filtered.map((c) => <ExpertRow key={c.id} card={c} onAction={handleCardAction} />)}
          </div>
        )}
      </div>
    </div>
  );
}