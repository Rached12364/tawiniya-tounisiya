import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paperclip, Loader2, Send, MessageSquareWarning, Wrench, FileText, Receipt,
  HelpCircle, Clock, RefreshCw, CheckCircle2, XCircle, X, Inbox,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { createReclamation, getMyReclamations } from '../services/reclamationService';
import {
  RECLAMATION_STATUS_LABELS,
  RECLAMATION_TYPE_LABELS,
  type Reclamation,
  type ReclamationType,
  type ReclamationStatus,
} from '../types/reclamation';
const TYPE_OPTIONS: { value: ReclamationType; icon: typeof Wrench }[] = [
  { value: 'TECHNIQUE', icon: Wrench },
  { value: 'ADMINISTRATIVE', icon: FileText },
  { value: 'FACTURATION', icon: Receipt },
  { value: 'AUTRE', icon: HelpCircle },
];
const STATUS_META: Record<ReclamationStatus, { icon: typeof Clock; dot: string; badge: string }> = {
  OUVERTE: { icon: Clock, dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  EN_COURS: { icon: RefreshCw, dot: 'bg-blue-500', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  RESOLUE: { icon: CheckCircle2, dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  REJETEE: { icon: XCircle, dot: 'bg-red-500', badge: 'bg-red-50 text-red-700 border-red-200' },
};
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
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-3 mb-2">
          <span className="grid place-items-center h-11 w-11 rounded-2xl bg-gradient-to-br from-navy to-teal text-white shadow-sm">
            <MessageSquareWarning size={20} />
          </span>
          <div>
            <h1 className="text-2xl font-black text-navy leading-tight">Réclamation</h1>
            <p className="text-sm text-navy/50">Décrivez votre problème, nous vous répondrons dès que possible.</p>
          </div>
        </div>
        <div className="mt-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-6 items-start">
          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-5">
            <div>
              <label className="block text-sm font-semibold text-navy mb-2.5">Type de réclamation</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {TYPE_OPTIONS.map(({ value, icon: Icon }) => {
                  const isSelected = type === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setType(value)}
                      className={`flex flex-col items-center gap-1.5 rounded-xl border-2 px-2 py-3 text-center transition-colors ${
                        isSelected ? 'border-teal bg-teal/5' : 'border-navy/10 hover:border-navy/25'
                      }`}
                    >
                      <Icon size={18} className={isSelected ? 'text-teal' : 'text-navy/40'} />
                      <span className={`text-[12px] font-semibold ${isSelected ? 'text-teal' : 'text-navy/70'}`}>
                        {RECLAMATION_TYPE_LABELS[value]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Objet</label>
              <input
                required
                maxLength={150}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Résumez votre problème en quelques mots"
                className="w-full rounded-xl border border-navy/15 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Description</label>
              <textarea
                required
                maxLength={3000}
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Décrivez votre problème en détail..."
                className="w-full rounded-xl border border-navy/15 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal resize-none"
              />
              <p className="mt-1 text-right text-[11px] text-navy/30">{description.length}/3000</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">
                Pièce jointe <span className="font-normal text-navy/40">(optionnel — JPG, PNG, WEBP ou PDF, 5 Mo max)</span>
              </label>
              {!attachment ? (
                <label className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-navy/15 px-4 py-5 text-sm text-navy/50 hover:border-teal/40 hover:bg-teal/[0.03] cursor-pointer transition-colors">
                  <Paperclip size={16} />
                  Choisir un fichier
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    onChange={(e) => setAttachment(e.target.files?.[0] ?? null)}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-navy/15 bg-navy/[0.02] px-3.5 py-2.5">
                  <span className="flex items-center gap-2 text-sm text-navy truncate">
                    <Paperclip size={15} className="shrink-0 text-navy/40" />
                    <span className="truncate">{attachment.name}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setAttachment(null)}
                    className="shrink-0 grid place-items-center h-6 w-6 rounded-full text-navy/40 hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <X size={13} />
                  </button>
                </div>
              )}
            </div>
            {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
            {successMessage && (
              <p className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">{successMessage}</p>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="self-start flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-navy-dark hover:bg-gold-light transition-colors disabled:opacity-60"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              Envoyer la réclamation
            </button>
          </form>
          {/* Historique */}
          <div>
            <h2 className="text-sm font-bold text-navy/70 uppercase tracking-wide mb-4">Mes réclamations</h2>
            {isLoadingList ? (
              <div className="grid place-items-center py-16">
                <Loader2 className="animate-spin text-navy/30" size={22} />
              </div>
            ) : items.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                <span className="grid place-items-center h-11 w-11 rounded-full bg-navy/5 text-navy/30 mx-auto mb-3">
                  <Inbox size={20} />
                </span>
                <p className="text-sm text-navy/40">Vous n'avez encore soumis aucune réclamation.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 max-h-[720px] overflow-y-auto pr-1">
                {items.map((r) => {
                  const meta = STATUS_META[r.status];
                  const StatusIcon = meta.icon;
                  return (
                    <div key={r.id} className="relative bg-white rounded-2xl shadow-sm p-5 pl-6 overflow-hidden">
                      <span className={`absolute left-0 top-0 h-full w-1.5 ${meta.dot}`} />
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold text-navy/40 uppercase tracking-wide mb-1">
                            {RECLAMATION_TYPE_LABELS[r.type]}
                          </p>
                          <h3 className="font-semibold text-navy truncate">{r.subject}</h3>
                        </div>
                        <span className={`shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${meta.badge}`}>
                          <StatusIcon size={11} />
                          {RECLAMATION_STATUS_LABELS[r.status]}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-navy/60 whitespace-pre-line line-clamp-3">{r.description}</p>
                      {r.adminResponse && (
                        <div className="mt-3 rounded-xl bg-teal/5 border border-teal/20 p-3">
                          <p className="text-xs font-semibold text-teal mb-1">Réponse de l'équipe</p>
                          <p className="text-sm text-navy/70 whitespace-pre-line">{r.adminResponse}</p>
                        </div>
                      )}
                      <p className="mt-3 text-[11px] text-navy/30">
                        Soumise le {new Date(r.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}