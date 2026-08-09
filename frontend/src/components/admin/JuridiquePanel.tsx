import { useEffect, useState, useCallback } from 'react';
import { Trash2, UploadCloud, Scale, Pencil, X, ArrowUp, ArrowDown } from 'lucide-react';
import RichTextEditor from '../shared/RichTextEditor';
import { adminJuridiqueService } from '../../services/juridiqueService';
import type { LegalSection, LegalSectionInput } from '../../types/juridique';
const EMPTY_FORM: LegalSectionInput = { title: '', content: '', active: true };
export default function JuridiquePanel() {
  const [sections, setSections] = useState<LegalSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<LegalSectionInput>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const load = useCallback(() => {
    setLoading(true);
    adminJuridiqueService
      .getAll()
      .then((data) => setSections(data))
      .catch(() => setError('Impossible de charger le contenu juridique.'))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  function startEdit(s: LegalSection) {
    setEditingId(s.id);
    setForm({ title: s.title, content: s.content, active: s.active, orderIndex: s.orderIndex });
  }
  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    setSaving(true);
    setError(null);
    try {
      if (editingId != null) {
        await adminJuridiqueService.update(editingId, form);
      } else {
        await adminJuridiqueService.create(form);
      }
      cancelEdit();
      load();
    } catch {
      setError("Échec de l'enregistrement de la section.");
    } finally {
      setSaving(false);
    }
  }
  async function handleDelete(id: number) {
    setBusyId(id);
    try {
      await adminJuridiqueService.remove(id);
      load();
    } catch {
      setError('Impossible de supprimer la section.');
    } finally {
      setBusyId(null);
    }
  }
  async function moveSection(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;
    const reordered = [...sections];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setSections(reordered);
    try {
      await adminJuridiqueService.reorder(reordered.map((s) => s.id));
    } catch {
      setError("Échec de la réorganisation.");
      load();
    }
  }
  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-navy/10 bg-white p-5 grid grid-cols-1 gap-4"
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-navy">
            {editingId != null ? 'Modifier la section' : 'Nouvelle section juridique'}
          </p>
          {editingId != null && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-navy/40 hover:text-navy inline-flex items-center gap-1 text-xs"
            >
              <X size={14} />
              Annuler
            </button>
          )}
        </div>
        <div>
          <label className="block text-xs font-medium text-navy/60 mb-1">Titre</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="w-full rounded-lg border border-navy/15 px-3 py-2 text-sm text-navy"
            placeholder="Ex: Statuts de la coopérative"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-navy/60 mb-1">
            Contenu
          </label>
          <RichTextEditor
            value={form.content}
            onChange={(html) => setForm((f) => ({ ...f, content: html }))}
          />
        </div>
        <label className="inline-flex items-center gap-2 text-sm text-navy/70">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
            className="rounded border-navy/30"
          />
          Visible publiquement
        </label>
        <div>
          <button
            type="submit"
            disabled={!form.title.trim() || !form.content.trim() || saving}
            className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2 text-sm font-semibold text-navy-dark hover:bg-gold-light transition-colors disabled:opacity-50"
          >
            <UploadCloud size={16} />
            {saving ? 'Enregistrement…' : editingId != null ? 'Enregistrer' : 'Créer la section'}
          </button>
        </div>
      </form>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {loading ? (
        <p className="text-navy/60">Chargement…</p>
      ) : sections.length === 0 ? (
        <p className="text-navy/60">Aucune section juridique pour le moment.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {sections.map((s, index) => (
            <div
              key={s.id}
              className="rounded-xl border border-navy/10 bg-white p-4 flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-3 min-w-0">
                <Scale size={18} className="text-gold shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-navy truncate">{s.title}</p>
                  <p className="text-xs text-navy/40 mt-0.5">
                    {s.active ? 'Visible' : 'Masquée'} · ordre {s.orderIndex}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => moveSection(index, -1)}
                  disabled={index === 0}
                  className="p-1.5 rounded-full text-navy/40 hover:text-navy hover:bg-navy/5 disabled:opacity-30"
                  title="Monter"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  onClick={() => moveSection(index, 1)}
                  disabled={index === sections.length - 1}
                  className="p-1.5 rounded-full text-navy/40 hover:text-navy hover:bg-navy/5 disabled:opacity-30"
                  title="Descendre"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  onClick={() => startEdit(s)}
                  className="p-1.5 rounded-full text-navy/40 hover:text-navy hover:bg-navy/5"
                  title="Modifier"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  disabled={busyId === s.id}
                  className="p-1.5 rounded-full text-red-500/70 hover:text-red-600 hover:bg-red-50 disabled:opacity-50"
                  title="Supprimer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}