import { useEffect, useState, useCallback } from 'react';
import { Trash2, UploadCloud, Calendar, MapPin } from 'lucide-react';
import { getAllEventsAdmin, createEvent, deleteEvent } from '../../services/eventService';
import type { EventItem } from '../../types/event';
const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/api\/?$/, '');
function imageUrl(path: string) {
  if (!path) return '';
  return path.startsWith('http') ? path : `${API_ORIGIN}${path.startsWith('/') ? '' : '/'}${path}`;
}
export default function EventsPanel() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [creating, setCreating] = useState(false);
  const load = useCallback(() => {
    setLoading(true);
    getAllEventsAdmin()
      .then((res) => setEvents(res.content))
      .catch(() => setError('Impossible de charger les événements.'))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !eventDate || !location.trim()) return;
    setCreating(true);
    setError(null);
    try {
      await createEvent({
        title: title.trim(),
        description: description.trim(),
        eventDate,
        location: location.trim(),
        image,
      });
      setTitle('');
      setDescription('');
      setEventDate('');
      setLocation('');
      setImage(null);
      load();
    } catch {
      setError("Échec de la création de l'événement.");
    } finally {
      setCreating(false);
    }
  }
  async function handleDelete(id: number) {
    setBusyId(id);
    try {
      await deleteEvent(id);
      load();
    } catch {
      setError("Impossible de supprimer l'événement.");
    } finally {
      setBusyId(null);
    }
  }
  return (
    <div className="space-y-6">
      <form
        onSubmit={handleCreate}
        className="rounded-xl border border-navy/10 bg-white p-5 grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <div>
          <label className="block text-xs font-medium text-navy/60 mb-1">Titre</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-navy/15 px-3 py-2 text-sm text-navy"
            placeholder="Nom de l'événement"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-navy/60 mb-1">Lieu</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-lg border border-navy/15 px-3 py-2 text-sm text-navy"
            placeholder="Ville, salle..."
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-navy/60 mb-1">Date</label>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full rounded-lg border border-navy/15 px-3 py-2 text-sm text-navy"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-navy/60 mb-1">Image (optionnel)</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
            className="w-full text-sm text-navy file:mr-3 file:rounded-full file:border-0 file:bg-navy/10 file:px-3 file:py-1.5 file:text-navy file:text-xs file:font-semibold"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-navy/60 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-navy/15 px-3 py-2 text-sm text-navy resize-none"
            placeholder="Détails de l'événement..."
          />
        </div>
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={!title.trim() || !description.trim() || !eventDate || !location.trim() || creating}
            className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2 text-sm font-semibold text-navy-dark hover:bg-gold-light transition-colors disabled:opacity-50"
          >
            <UploadCloud size={16} />
            {creating ? 'Création…' : "Créer l'événement"}
          </button>
        </div>
      </form>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {loading ? (
        <p className="text-navy/60">Chargement…</p>
      ) : events.length === 0 ? (
        <p className="text-navy/60">Aucun événement pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((ev) => (
            <div key={ev.id} className="rounded-xl border border-navy/10 bg-white overflow-hidden">
              {ev.imagePath && (
                <img src={imageUrl(ev.imagePath)} alt={ev.title} className="h-32 w-full object-cover" />
              )}
              <div className="p-3">
                <p className="text-sm font-semibold text-navy truncate">{ev.title}</p>
                <div className="flex items-center gap-1 text-xs text-navy/50 mt-1">
                  <Calendar size={12} />
                  {new Date(ev.eventDate).toLocaleDateString('fr-FR')}
                </div>
                <div className="flex items-center gap-1 text-xs text-navy/50">
                  <MapPin size={12} />
                  {ev.location}
                </div>
                <button
                  onClick={() => handleDelete(ev.id)}
                  disabled={busyId === ev.id}
                  className="mt-2 w-full inline-flex items-center justify-center gap-1 rounded-full bg-red-50 text-red-600 hover:bg-red-100 px-2 py-1.5 text-xs font-semibold disabled:opacity-50"
                >
                  <Trash2 size={13} />
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}