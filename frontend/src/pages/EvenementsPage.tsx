import { useEffect, useState } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { getUpcomingEvents } from '../services/eventService';
import type { EventItem } from '../types/event';
const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/api\/?$/, '');
function imageUrl(path: string) {
  if (!path) return '';
  return path.startsWith('http') ? path : `${API_ORIGIN}${path.startsWith('/') ? '' : '/'}${path}`;
}
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}
export default function EvenementsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getUpcomingEvents()
      .then((res) => setEvents(res.content))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);
  return (
    <div className="min-h-[70vh] bg-navy/[0.02] pt-28 pb-16 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center gap-3 mb-2">
          <span className="grid place-items-center h-10 w-10 rounded-xl bg-navy/5 text-navy">
            <Calendar size={20} />
          </span>
          <h1 className="text-2xl font-black text-navy">Événements</h1>
        </div>
        <p className="text-navy/50 mb-8">Retrouvez les prochains événements de la coopérative.</p>
        {loading ? (
          <p className="text-navy/40">Chargement...</p>
        ) : events.length === 0 ? (
          <p className="text-navy/40">Aucun événement à venir pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((ev) => (
              <div key={ev.id} className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
                {ev.imagePath && (
                  <img src={imageUrl(ev.imagePath)} alt={ev.title} className="h-48 w-full object-cover" />
                )}
                <div className="p-5 flex flex-col gap-2">
                  <h3 className="text-lg font-bold text-navy">{ev.title}</h3>
                  <div className="flex items-center gap-1.5 text-sm text-navy/60">
                    <Calendar size={14} className="text-gold" />
                    {formatDate(ev.eventDate)}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-navy/60">
                    <MapPin size={14} className="text-gold" />
                    {ev.location}
                  </div>
                  <p className="mt-2 text-sm text-navy/70 whitespace-pre-line">{ev.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}