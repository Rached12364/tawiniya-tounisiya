import { useEffect, useState } from 'react';
import { Star, Loader2, User as UserIcon } from 'lucide-react';
import { getExpertRatings, submitExpertRating, deleteExpertRating } from '../services/expertRatingService';
import type { ExpertRatingSummary } from '../types/expertRating';
const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/api\/?$/, '');
function imageUrl(path?: string) {
  if (!path) return '';
  return path.startsWith('http') ? path : `${API_ORIGIN}${path}`;
}
function StarRow({ value, onChange, size = 20 }: { value: number; onChange?: (v: number) => void; size?: number }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= (hover || value);
        return (
          <button
            key={n}
            type="button"
            disabled={!onChange}
            onClick={() => onChange?.(n)}
            onMouseEnter={() => onChange && setHover(n)}
            onMouseLeave={() => onChange && setHover(0)}
            className={onChange ? 'cursor-pointer' : 'cursor-default'}
          >
            <Star size={size} className={filled ? 'fill-gold text-gold' : 'text-navy/20'} />
          </button>
        );
      })}
    </div>
  );
}
export default function ExpertRatingWidget({ expertId, isSelf }: { expertId: number; isSelf?: boolean }) {
  const [summary, setSummary] = useState<ExpertRatingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  function load() {
    setLoading(true);
    getExpertRatings(expertId)
      .then((res) => {
        setSummary(res);
        const mine = res.ratings.find((r) => r.mine);
        if (mine) {
          setMyRating(mine.rating);
          setMyComment(mine.comment ?? '');
        }
      })
      .catch(() => setError('Impossible de charger les avis.'))
      .finally(() => setLoading(false));
  }
  useEffect(load, [expertId]);
  async function submit() {
    if (myRating < 1) return;
    setSaving(true);
    setError(null);
    try {
      await submitExpertRating(expertId, myRating, myComment.trim());
      setEditing(false);
      load();
    } catch {
      setError("Échec de l'envoi de votre avis.");
    } finally {
      setSaving(false);
    }
  }
  async function remove() {
    setSaving(true);
    try {
      await deleteExpertRating(expertId);
      setMyRating(0);
      setMyComment('');
      setEditing(false);
      load();
    } finally {
      setSaving(false);
    }
  }
  if (loading) {
    return <div className="bg-white rounded-xl shadow-sm p-5 grid place-items-center"><Loader2 className="animate-spin text-navy/40" size={20} /></div>;
  }
  const mine = summary?.ratings.find((r) => r.mine);
  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-teal uppercase tracking-wide">Avis</h2>
        {summary && summary.count > 0 && (
          <div className="flex items-center gap-1.5">
            <Star size={15} className="fill-gold text-gold" />
            <span className="text-sm font-bold text-navy">{summary.average.toFixed(1)}</span>
            <span className="text-xs text-navy/40">({summary.count})</span>
          </div>
        )}
      </div>
      {!isSelf && (
        <div className="mb-5 pb-5 border-b border-navy/10">
          {!editing && mine ? (
            <div className="flex items-start justify-between gap-3">
              <div>
                <StarRow value={mine.rating} />
                {mine.comment && <p className="mt-1.5 text-sm text-navy/70 italic">"{mine.comment}"</p>}
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => setEditing(true)} className="text-xs font-semibold text-teal hover:underline">Modifier</button>
                <span className="text-navy/20">·</span>
                <button onClick={remove} disabled={saving} className="text-xs font-semibold text-red-500 hover:underline">Supprimer</button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              <p className="text-xs font-semibold text-navy/60">{mine ? 'Modifier votre avis' : 'Laisser un avis'}</p>
              <StarRow value={myRating} onChange={setMyRating} size={24} />
              <textarea
                value={myComment}
                onChange={(e) => setMyComment(e.target.value)}
                placeholder="Votre commentaire (optionnel)"
                rows={2}
                className="w-full rounded-lg border border-navy/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal resize-none"
              />
              <div className="flex gap-2 self-end">
                {editing && (
                  <button onClick={() => setEditing(false)} className="text-xs font-semibold text-navy/50 hover:text-navy px-2">
                    Annuler
                  </button>
                )}
                <button
                  onClick={submit}
                  disabled={saving || myRating < 1}
                  className="flex items-center gap-1.5 rounded-full bg-teal px-4 py-1.5 text-xs font-semibold text-white hover:bg-teal/90 disabled:opacity-50 transition-colors"
                >
                  {saving ? <Loader2 size={13} className="animate-spin" /> : null}
                  Envoyer
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-3">{error}</p>}
      {!summary || summary.ratings.length === 0 ? (
        <p className="text-sm text-navy/40">Aucun avis pour le moment.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {summary.ratings.filter((r) => !r.mine).map((r) => (
            <div key={r.id} className="flex gap-2.5">
              <div className="h-8 w-8 rounded-full bg-navy/10 overflow-hidden shrink-0">
                {r.authorPhotoProfilPath ? (
                  <img src={imageUrl(r.authorPhotoProfilPath)} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full grid place-items-center text-navy/30"><UserIcon size={14} /></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-navy">{r.authorPrenom} {r.authorNom}</p>
                  <StarRow value={r.rating} size={13} />
                </div>
                {r.comment && <p className="text-sm text-navy/70 mt-0.5">{r.comment}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}