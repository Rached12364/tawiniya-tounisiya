import { useEffect, useMemo, useState } from 'react';
import { Loader2, Search, MapPin } from 'lucide-react';
import { browseByRole, sendConnectionRequest, acceptConnection } from '../services/networkService';
import UserCardTile from '../components/UserCardTile';
import type { UserCard } from '../types/network';
export default function ServiceJuridiquePage() {
  const [cards, setCards] = useState<UserCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  useEffect(() => {
    setLoading(true);
    setError(null);
    browseByRole('EXPERT_JURIDIQUE', 0, 100)
      .then((res) => setCards(res.content))
      .catch(() => setError('Impossible de charger les experts juridiques.'))
      .finally(() => setLoading(false));
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
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return cards;
    return cards.filter((c) =>
      `${c.prenom} ${c.nom}`.toLowerCase().includes(q)
      || (c.bio ?? '').toLowerCase().includes(q)
      || (c.adresse ?? '').toLowerCase().includes(q)
    );
  }, [cards, search]);
  const groupedByAdresse = useMemo(() => {
    const groups = new Map<string, UserCard[]>();
    for (const card of filtered) {
      const key = card.adresse?.trim() || 'Adresse non renseignée';
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(card);
    }
    return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b, 'fr'));
  }, [filtered]);
  return (
    <div className="min-h-[70vh] bg-navy/[0.02] pt-28 pb-16 px-4">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-black text-navy mb-1">Service Juridique</h1>
        <p className="text-sm text-navy/50 mb-6">
          Retrouvez nos experts juridiques, classés par adresse.
        </p>
        <div className="relative max-w-sm mb-6">
          <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-navy/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un expert, une adresse..."
            className="w-full rounded-full border border-navy/15 bg-white ps-9 pe-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
          />
        </div>
        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>}
        {loading ? (
          <div className="grid place-items-center py-16"><Loader2 className="animate-spin text-navy/40" size={28} /></div>
        ) : filtered.length === 0 ? (
          <p className="text-navy/50 text-sm">
            {search ? `Aucun résultat pour « ${search} ».` : 'Aucun expert juridique pour le moment.'}
          </p>
        ) : (
          <div className="flex flex-col gap-8">
            {groupedByAdresse.map(([adresse, group]) => (
              <div key={adresse}>
                <h2 className="flex items-center gap-1.5 text-sm font-bold text-navy mb-3">
                  <MapPin size={14} className="text-teal" /> {adresse}
                  <span className="font-normal text-navy/40">({group.length})</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {group.map((c) => <UserCardTile key={c.id} card={c} onAction={handleCardAction} />)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}