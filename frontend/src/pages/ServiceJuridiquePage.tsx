import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Search, MapPin, User as UserIcon, ArrowLeft } from 'lucide-react';
import { browseByRole } from '../services/networkService';
import { getMyConversations } from '../services/expertConversationService';
import { imageUrl } from '../components/UserCardTile';
import ExpertChatWidget from '../components/ExpertChatWidget';
import type { UserCard } from '../types/network';
import type { ExpertConversationSummary } from '../types/expertConversation';
function ExpertRow({ card }: { card: UserCard }) {
  const navigate = useNavigate();
  const fullName = `${card.prenom} ${card.nom}`.trim();
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
  const [selectedExpertId, setSelectedExpertId] = useState<number | null>(null);
  useEffect(() => {
    setLoading(true);
    setError(null);
    browseByRole('EXPERT_JURIDIQUE', 0, 100)
      .then((res) => setCards(res.content))
      .catch(() => setError('Impossible de charger les experts juridiques.'))
      .finally(() => setLoading(false));
  }, []);
  function loadConversations() {
    setConversationsLoading(true);
    getMyConversations()
      .then(setConversations)
      .catch(() => {})
      .finally(() => setConversationsLoading(false));
  }
  useEffect(loadConversations, []);
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
  const selectedConversation = conversations.find((c) => c.otherUser.id === selectedExpertId);
  const selectedExpertCard = cards.find((c) => c.id === selectedExpertId);
  const selectedName = selectedConversation
    ? `${selectedConversation.otherUser.prenom} ${selectedConversation.otherUser.nom}`
    : selectedExpertCard
    ? `${selectedExpertCard.prenom} ${selectedExpertCard.nom}`
    : '';
  return (
    <div className="min-h-[70vh] bg-navy/[0.02] pt-24 pb-16 px-4">
      <div className="mx-auto max-w-6xl flex gap-5">
        {/* Colonne gauche : mes conversations */}
        <aside className="w-72 shrink-0 hidden md:block">
          <h2 className="text-sm font-bold text-teal uppercase tracking-wide mb-3 px-1">Mes conversations</h2>
          {conversationsLoading ? (
            <div className="grid place-items-center py-10"><Loader2 className="animate-spin text-navy/40" size={20} /></div>
          ) : conversations.length === 0 ? (
            <p className="text-xs text-navy/40 px-1">Aucune conversation pour le moment.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedExpertId(conv.otherUser.id)}
                  className={`bg-white rounded-xl border px-3 py-2.5 flex items-center gap-2.5 cursor-pointer transition-all ${
                    selectedExpertId === conv.otherUser.id ? 'border-teal shadow-sm' : 'border-navy/10 hover:border-teal/30 hover:shadow-sm'
                  }`}
                >
                  <div className="h-9 w-9 rounded-full bg-navy/10 overflow-hidden shrink-0">
                    {conv.otherUser.photoProfilPath ? (
                      <img src={imageUrl(conv.otherUser.photoProfilPath)} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-navy/30"><UserIcon size={14} /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-navy truncate">{conv.otherUser.prenom} {conv.otherUser.nom}</p>
                    <p className="text-[11px] text-navy/50 truncate">{conv.lastMessagePreview || conv.subject}</p>
                  </div>
                  <span className={`shrink-0 text-[9px] font-semibold rounded-full px-1.5 py-0.5 ${
                    conv.status === 'RESOLUE' ? 'bg-teal/10 text-teal' : conv.status === 'EN_COURS' ? 'bg-gold/20 text-navy-dark' : 'bg-navy/5 text-navy/50'
                  }`}>
                    {conv.status === 'RESOLUE' ? 'Résolue' : conv.status === 'EN_COURS' ? 'En cours' : 'Ouverte'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </aside>
        {/* Colonne droite : fil de discussion OU annuaire */}
        <div className="flex-1 min-w-0">
          {selectedExpertId ? (
            <div>
              <button
                onClick={() => setSelectedExpertId(null)}
                className="flex items-center gap-1.5 text-xs font-semibold text-navy/50 hover:text-navy mb-3 transition-colors"
              >
                <ArrowLeft size={14} /> Retour à l'annuaire
              </button>
              <h1 className="text-lg font-black text-navy mb-3">{selectedName}</h1>
              <ExpertChatWidget
                key={selectedExpertId}
                expertId={selectedExpertId}
              />
            </div>
          ) : (
            <div>
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
                  {filtered.map((c) => (
                    <ExpertRow key={c.id} card={c} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}