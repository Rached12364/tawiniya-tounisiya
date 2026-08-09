import { useEffect, useState } from 'react';
import { Loader2, Paperclip, X } from 'lucide-react';
import { getAllReclamations, updateReclamationStatus } from '../../services/reclamationService';
import {
  RECLAMATION_STATUS_COLORS,
  RECLAMATION_STATUS_LABELS,
  RECLAMATION_TYPE_LABELS,
  type Reclamation,
  type ReclamationStatus,
} from '../../types/reclamation';
const STATUS_FILTERS: (ReclamationStatus | '')[] = ['', 'OUVERTE', 'EN_COURS', 'RESOLUE', 'REJETEE'];
const STATUS_OPTIONS: ReclamationStatus[] = ['OUVERTE', 'EN_COURS', 'RESOLUE', 'REJETEE'];
export default function ReclamationsPanel() {
  const [items, setItems] = useState<Reclamation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ReclamationStatus | ''>('');
  const [selected, setSelected] = useState<Reclamation | null>(null);
  const load = async () => {
    setIsLoading(true);
    try {
      const res = await getAllReclamations(statusFilter);
      setItems(res.content);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-5">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s || 'all'}
            onClick={() => setStatusFilter(s)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
              statusFilter === s ? 'bg-navy text-white' : 'bg-white text-navy/60 hover:bg-navy/5'
            }`}
          >
            {s ? RECLAMATION_STATUS_LABELS[s] : 'Toutes'}
          </button>
        ))}
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-navy/40">
          <Loader2 size={20} className="animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-16 text-center text-navy/40 text-sm">
          Aucune réclamation pour ce filtre.
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-navy/5 text-navy/60 text-xs uppercase">
              <tr>
                <th className="text-start px-4 py-3 font-semibold">Auteur</th>
                <th className="text-start px-4 py-3 font-semibold">Type</th>
                <th className="text-start px-4 py-3 font-semibold">Objet</th>
                <th className="text-start px-4 py-3 font-semibold">Statut</th>
                <th className="text-start px-4 py-3 font-semibold">Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id} className="border-t border-navy/5 hover:bg-navy/[0.02]">
                  <td className="px-4 py-3">
                    <p className="font-medium text-navy">{r.userPrenom} {r.userNom}</p>
                    <p className="text-xs text-navy/40">{r.userEmail} · {r.userRole}</p>
                  </td>
                  <td className="px-4 py-3 text-navy/70">{RECLAMATION_TYPE_LABELS[r.type]}</td>
                  <td className="px-4 py-3 text-navy/70 max-w-[220px] truncate">{r.subject}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${RECLAMATION_STATUS_COLORS[r.status]}`}>
                      {RECLAMATION_STATUS_LABELS[r.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-navy/50 text-xs">
                    {new Date(r.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelected(r)}
                      className="text-teal text-sm font-semibold hover:underline"
                    >
                      Traiter
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selected && (
        <ReclamationDetailModal
          reclamation={selected}
          onClose={() => setSelected(null)}
          onUpdated={() => {
            setSelected(null);
            load();
          }}
        />
      )}
    </div>
  );
}
function ReclamationDetailModal({
  reclamation,
  onClose,
  onUpdated,
}: {
  reclamation: Reclamation;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [status, setStatus] = useState<ReclamationStatus>(reclamation.status);
  const [adminResponse, setAdminResponse] = useState(reclamation.adminResponse ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateReclamationStatus(reclamation.id, status, adminResponse);
      onUpdated();
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <div className="fixed inset-0 z-[100] bg-navy/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy/10">
          <h3 className="font-bold text-navy">Réclamation #{reclamation.id}</h3>
          <button onClick={onClose} className="text-navy/40 hover:text-navy">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div>
            <p className="text-xs text-navy/40">Auteur</p>
            <p className="text-sm font-medium text-navy">
              {reclamation.userPrenom} {reclamation.userNom} · {reclamation.userEmail} ({reclamation.userRole})
            </p>
          </div>
          <div>
            <p className="text-xs text-navy/40">Objet</p>
            <p className="text-sm font-medium text-navy">{reclamation.subject}</p>
          </div>
          <div>
            <p className="text-xs text-navy/40">Description</p>
            <p className="text-sm text-navy/70 whitespace-pre-line">{reclamation.description}</p>
          </div>
          {reclamation.attachmentPath && (
            <a
              href={`${import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || 'http://localhost:8080'}${reclamation.attachmentPath}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-sm text-teal font-semibold hover:underline w-fit"
            >
              <Paperclip size={14} />
              Voir la pièce jointe
            </a>
          )}
          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">Statut</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ReclamationStatus)}
              className="w-full rounded-lg border border-navy/15 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {RECLAMATION_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">Réponse (visible par l'auteur)</label>
            <textarea
              rows={4}
              value={adminResponse}
              onChange={(e) => setAdminResponse(e.target.value)}
              placeholder="Votre réponse..."
              className="w-full rounded-lg border border-navy/15 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal resize-none"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="self-start flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-navy-dark hover:bg-gold-light transition-colors disabled:opacity-60"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : null}
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}

