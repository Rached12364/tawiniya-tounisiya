import { useEffect, useState, useCallback } from 'react';
import { GraduationCap, Trash2, X, UploadCloud, Pencil } from 'lucide-react';
import { adminTrainingCenterService } from '../../services/trainingCenterService';
import type { TrainingCenter, TrainingCenterInput, TrainingCourseInput } from '../../types/trainingCenter';
const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/api\/?$/, '');
function imageUrl(path: string | null) {
  if (!path) return '';
  return path.startsWith('http') ? path : `${API_ORIGIN}${path.startsWith('/') ? '' : '/'}${path}`;
}
export default function CentreFormationAdminPanel() {
  const [centers, setCenters] = useState<TrainingCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<TrainingCenterInput | null>(null);
  const [logo, setLogo] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const load = useCallback(() => {
    setLoading(true);
    adminTrainingCenterService
      .list(0, 200)
      .then((data) => setCenters(data.content))
      .catch(() => setError('Impossible de charger les centres de formation.'))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  function startEdit(c: TrainingCenter) {
    setEditingId(c.id);
    setForm({
      name: c.name,
      description: c.description ?? '',
      address: c.address ?? '',
      phone: c.phone ?? '',
      email: c.email ?? '',
      website: c.website ?? '',
      openingHours: c.openingHours ?? '',
      courses: c.courses.map((course) => ({ title: course.title, description: course.description ?? '' })),
    });
    setLogo(null);
  }
  function cancelEdit() {
    setEditingId(null);
    setForm(null);
    setLogo(null);
  }
  function updateCourse(index: number, patch: Partial<TrainingCourseInput>) {
    setForm((f) => {
      if (!f) return f;
      const courses = [...(f.courses ?? [])];
      courses[index] = { ...courses[index], ...patch };
      return { ...f, courses };
    });
  }
  function addCourse() {
    setForm((f) => (f ? { ...f, courses: [...(f.courses ?? []), { title: '', description: '' }] } : f));
  }
  function removeCourse(index: number) {
    setForm((f) => (f ? { ...f, courses: (f.courses ?? []).filter((_, i) => i !== index) } : f));
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form || !form.name.trim() || editingId == null) return;
    setSaving(true);
    setError(null);
    try {
      await adminTrainingCenterService.update(editingId, form, logo);
      cancelEdit();
      load();
    } catch {
      setError("Échec de l'enregistrement du centre de formation.");
    } finally {
      setSaving(false);
    }
  }
  async function handleDelete(id: number) {
    if (!window.confirm('Supprimer définitivement ce centre de formation ?')) return;
    setBusyId(id);
    try {
      await adminTrainingCenterService.remove(id);
      if (editingId === id) cancelEdit();
      load();
    } catch {
      setError('Impossible de supprimer ce centre.');
    } finally {
      setBusyId(null);
    }
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="grid place-items-center h-9 w-9 rounded-xl bg-navy/5 text-navy">
          <GraduationCap size={18} />
        </span>
        <h2 className="text-lg font-black text-navy">Centres de formation ({centers.length})</h2>
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {editingId != null && form && (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-navy/10 bg-white p-5 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div className="sm:col-span-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-navy">Modifier le centre</p>
            <button type="button" onClick={cancelEdit} className="text-navy/40 hover:text-navy inline-flex items-center gap-1 text-xs">
              <X size={14} />
              Annuler
            </button>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-navy/60 mb-1">Nom</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => (f ? { ...f, name: e.target.value } : f))}
              className="w-full rounded-lg border border-navy/15 px-3 py-2 text-sm text-navy"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-navy/60 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => (f ? { ...f, description: e.target.value } : f))}
              rows={3}
              className="w-full rounded-lg border border-navy/15 px-3 py-2 text-sm text-navy resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-navy/60 mb-1">Adresse</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm((f) => (f ? { ...f, address: e.target.value } : f))}
              className="w-full rounded-lg border border-navy/15 px-3 py-2 text-sm text-navy"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-navy/60 mb-1">Horaires</label>
            <input
              type="text"
              value={form.openingHours}
              onChange={(e) => setForm((f) => (f ? { ...f, openingHours: e.target.value } : f))}
              className="w-full rounded-lg border border-navy/15 px-3 py-2 text-sm text-navy"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-navy/60 mb-1">Téléphone</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm((f) => (f ? { ...f, phone: e.target.value } : f))}
              className="w-full rounded-lg border border-navy/15 px-3 py-2 text-sm text-navy"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-navy/60 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => (f ? { ...f, email: e.target.value } : f))}
              className="w-full rounded-lg border border-navy/15 px-3 py-2 text-sm text-navy"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-navy/60 mb-1">Site web</label>
            <input
              type="text"
              value={form.website}
              onChange={(e) => setForm((f) => (f ? { ...f, website: e.target.value } : f))}
              className="w-full rounded-lg border border-navy/15 px-3 py-2 text-sm text-navy"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-navy/60 mb-1">Nouveau logo (optionnel)</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setLogo(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-navy file:mr-3 file:rounded-full file:border-0 file:bg-navy/10 file:px-3 file:py-1.5 file:text-navy file:text-xs file:font-semibold"
            />
          </div>
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-medium text-navy/60">Formations proposées</label>
              <button
                type="button"
                onClick={addCourse}
                className="text-xs font-semibold text-teal hover:underline"
              >
                + Ajouter une formation
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {(form.courses ?? []).map((course, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={course.title}
                      onChange={(e) => updateCourse(index, { title: e.target.value })}
                      placeholder="Titre de la formation"
                      className="w-full rounded-lg border border-navy/15 px-3 py-2 text-sm text-navy"
                    />
                    <input
                      type="text"
                      value={course.description}
                      onChange={(e) => updateCourse(index, { description: e.target.value })}
                      placeholder="Description (optionnel)"
                      className="w-full rounded-lg border border-navy/15 px-3 py-2 text-sm text-navy"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCourse(index)}
                    className="p-2 rounded-full text-red-500/70 hover:text-red-600 hover:bg-red-50 shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={!form.name.trim() || saving}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2 text-sm font-semibold text-navy-dark hover:bg-gold-light transition-colors disabled:opacity-50"
            >
              <UploadCloud size={16} />
              {saving ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          </div>
        </form>
      )}
      {loading ? (
        <p className="text-navy/60">Chargement…</p>
      ) : centers.length === 0 ? (
        <p className="text-navy/60">Aucun centre de formation pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {centers.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl border border-navy/10 overflow-hidden flex flex-col sm:flex-row">
              {c.logoPath && (
                <img src={imageUrl(c.logoPath)} alt={c.name} className="h-28 sm:w-36 w-full object-cover shrink-0" />
              )}
              <div className="p-4 flex-1 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-navy truncate">{c.name}</p>
                  <p className="text-xs text-navy/40 mt-0.5">
                    Propriétaire #{c.ownerId} · {c.courses.length} formation(s)
                  </p>
                  {c.address && <p className="text-xs text-navy/40 mt-0.5 truncate">{c.address}</p>}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => startEdit(c)}
                    className="p-1.5 rounded-full text-navy/40 hover:text-navy hover:bg-navy/5"
                    title="Modifier"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    disabled={busyId === c.id}
                    className="p-1.5 rounded-full text-red-500/70 hover:text-red-600 hover:bg-red-50 disabled:opacity-50"
                    title="Supprimer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}