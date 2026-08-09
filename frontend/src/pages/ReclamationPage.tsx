import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paperclip, Loader2, Send, MessageSquareWarning } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { createReclamation, getMyReclamations } from '../services/reclamationService';
import {
  RECLAMATION_STATUS_COLORS,
  RECLAMATION_STATUS_LABELS,
  RECLAMATION_TYPE_LABELS,
  type Reclamation,
  type ReclamationType,
} from '../types/reclamation';
const TYPE_OPTIONS: ReclamationType[] = ['TECHNIQUE', 'ADMINISTRATIVE', 'FACTURATION', 'AUTRE'];
export default function ReclamationPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [type, setType] = useState<ReclamationType>('TECHNIQUE');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [items, setItems] = useState<Reclamation[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  const loadMine = async () => {
    setIsLoadingList(true);
    try {
      const res = await getMyReclamations();
      setItems(res.content);
    } catch {
      // silencieux
    } finally {
      setIsLoadingList(false);
    }
  };
  useEffect(() => {
    if (isAuthenticated) {
      loadMine();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);
    try {
      await createReclamation({ type, subject, description, attachment });
      setSuccessMessage('Votre réclamation a bien été envoyée. Vous pouvez suivre son statut ci-dessous.');
      setSubject('');
      setDescription('');
      setAttachment(null);
      loadMine();
    } catch {
      setError("Impossible d'envoyer la réclamation. Réessayez dans un instant.");
    } finally {
      setIsSubmitting(false);
    }
  };
  if (!isAuthenticated) {
    return null;
  }
  return (
    <div className="min-h-[70vh] bg-navy/[0.02] pt-44 pb-16 px-4">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-3 mb-2">
          <span className="grid place-items-center h-10 w-10 rounded-xl bg-navy/5 text-navy">
            <MessageSquareWarning size={20} />
          </span>
          <h1 className="text-2xl font-black text-navy">Réclamation</h1>
        </div>
        <p className="text-navy/50 mb-8">
          Décrivez votre problème, nous vous répondrons dès que possible.
        </p>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4 mb-10">
          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">Type de réclamation</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ReclamationType)}
              className="w-full rounded-lg border border-navy/15 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
            >
              {TYPE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {RECLAMATION_TYPE_LABELS[opt]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">Objet</label>
            <input
              required
              maxLength={150}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Résumez votre problème en quelques mots"
              className="w-full rounded-lg border border-navy/15 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">Description</label>
            <textarea
              required
              maxLength={3000}
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez votre problème en détail..."
              className="w-full rounded-lg border border-navy/15 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal resize-none"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-navy mb-1.5">
              <Paperclip size={15} />
              Pièce jointe (optionnel — JPG, PNG, WEBP ou PDF, 5 Mo max)
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              onChange={(e) => setAttachment(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-navy/70 file:mr-3 file:rounded-lg file:border-0 file:bg-navy/5 file:px-3 file:py-2 file:text-sm file:font-medium file:text-navy hover:file:bg-navy/10"
            />
          </div>
          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
          {successMessage && (
            <p className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">{successMessage}</p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="self-start flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-navy-dark hover:bg-gold-light transition-colors disabled:opacity-60"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            Envoyer la réclamation
          </button>
        </form>
        <h2 className="text-lg font-bold text-navy mb-4">Mes réclamations</h2>
        {isLoadingList ? (
          <p className="text-sm text-navy/40">Chargement...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-navy/40">Vous n'avez encore soumis aucune réclamation.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {items.map((r) => (
              <div key={r.id} className="bg-white rounded-xl shadow-sm p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs text-navy/40 mb-1">{RECLAMATION_TYPE_LABELS[r.type]}</p>
                    <h3 className="font-semibold text-navy">{r.subject}</h3>
                  </div>
                  <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${RECLAMATION_STATUS_COLORS[r.status]}`}>
                    {RECLAMATION_STATUS_LABELS[r.status]}
                  </span>
                </div>
                <p className="mt-2 text-sm text-navy/60 whitespace-pre-line">{r.description}</p>
                {r.adminResponse && (
                  <div className="mt-3 rounded-lg bg-teal/5 border border-teal/20 p-3">
                    <p className="text-xs font-semibold text-teal mb-1">Réponse de l'équipe</p>
                    <p className="text-sm text-navy/70 whitespace-pre-line">{r.adminResponse}</p>
                  </div>
                )}
                <p className="mt-3 text-xs text-navy/30">
                  Soumise le {new Date(r.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
