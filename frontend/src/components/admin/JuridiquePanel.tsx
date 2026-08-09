import { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical, Bold, Italic, List, ListOrdered } from 'lucide-react';
import { adminJuridiqueService } from '../../services/juridiqueService';
import type { LegalSection, LegalSectionInput } from '../../types/juridique';
const EMPTY: LegalSectionInput = { title: '', content: '', active: true };
function RichTextEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });
  if (!editor) return null;
  return (
    <div className="border border-navy/15 rounded-lg overflow-hidden">
      <div className="flex items-center gap-1 border-b border-navy/10 bg-navy/[0.02] px-2 py-1.5">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-1.5 rounded ${editor.isActive('bold') ? 'bg-navy/10 text-navy' : 'text-navy/50 hover:text-navy'}`}>
          <Bold size={14} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-1.5 rounded ${editor.isActive('italic') ? 'bg-navy/10 text-navy' : 'text-navy/50 hover:text-navy'}`}>
          <Italic size={14} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-1.5 rounded ${editor.isActive('bulletList') ? 'bg-navy/10 text-navy' : 'text-navy/50 hover:text-navy'}`}>
          <List size={14} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-1.5 rounded ${editor.isActive('orderedList') ? 'bg-navy/10 text-navy' : 'text-navy/50 hover:text-navy'}`}>
          <ListOrdered size={14} />
        </button>
      </div>
      <EditorContent editor={editor} className="prose prose-sm max-w-none px-3 py-2 min-h-[150px] focus:outline-none" />
    </div>
  );
}
export default function JuridiquePanel() {
  const [sections, setSections] = useState<LegalSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<LegalSectionInput>(EMPTY);
  const [saving, setSaving] = useState(false);
  const load = () => {
    setLoading(true);
    adminJuridiqueService.getAll().then(setSections).finally(() => setLoading(false));
  };
  useEffect(load, []);
  const startCreate = () => {
    setForm(EMPTY);
    setIsCreating(true);
    setEditingId(null);
  };
  const startEdit = (s: LegalSection) => {
    setForm({ title: s.title, content: s.content, orderIndex: s.orderIndex, active: s.active });
    setEditingId(s.id);
    setIsCreating(false);
  };
  const cancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setForm(EMPTY);
  };
  const save = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        await adminJuridiqueService.update(editingId, form);
      } else {
        await adminJuridiqueService.create(form);
      }
      cancel();
      load();
    } finally {
      setSaving(false);
    }
  };
  const toggleActive = async (s: LegalSection) => {
    await adminJuridiqueService.update(s.id, {
      title: s.title,
      content: s.content,
      orderIndex: s.orderIndex,
      active: !s.active,
    });
    load();
  };
  const remove = async (id: number) => {
    if (!confirm('Supprimer cette section ?')) return;
    await adminJuridiqueService.remove(id);
    load();
  };
  const isFormOpen = isCreating || editingId !== null;
  if (loading) return <div className="p-8 text-navy/50 text-sm">Chargement...</div>;
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-navy">Sections juridiques</h2>
        {!isFormOpen && (
          <button onClick={startCreate} className="flex items-center gap-1.5 rounded-full bg-navy text-white text-sm font-semibold px-4 py-2 hover:bg-navy-dark transition-colors">
            <Plus size={16} /> Nouvelle section
          </button>
        )}
      </div>
      {isFormOpen && (
        <div className="mb-6 border border-navy/10 rounded-xl p-4">
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Titre de la section (ex: Conditions d'adhesion)"
            className="w-full mb-3 rounded-lg border border-navy/15 px-3 py-2 text-sm focus:outline-none focus:border-gold"
          />
          <RichTextEditor value={form.content} onChange={(content) => setForm({ ...form, content })} />
          <div className="flex items-center gap-3 mt-3">
            <button onClick={save} disabled={saving} className="rounded-full bg-gold px-5 py-2 text-sm font-semibold text-navy-dark hover:bg-gold-light transition-colors disabled:opacity-50">
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <button onClick={cancel} className="text-sm text-navy/50 hover:text-navy">
              Annuler
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-2">
        {sections.map((s) => (
          <div key={s.id} className="flex items-center gap-3 border border-navy/10 rounded-xl px-4 py-3">
            <GripVertical size={16} className="text-navy/20 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold truncate ${s.active ? 'text-navy' : 'text-navy/40'}`}>{s.title}</p>
              {!s.active && <span className="text-xs text-navy/40">Masquee cote client</span>}
            </div>
            <button onClick={() => toggleActive(s)} className="p-1.5 text-navy/40 hover:text-navy" title={s.active ? 'Masquer' : 'Afficher'}>
              {s.active ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
            <button onClick={() => startEdit(s)} className="p-1.5 text-navy/40 hover:text-gold">
              <Pencil size={16} />
            </button>
            <button onClick={() => remove(s.id)} className="p-1.5 text-navy/40 hover:text-red-500">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {sections.length === 0 && <p className="text-sm text-navy/40 text-center py-8">Aucune section pour l'instant.</p>}
      </div>
    </div>
  );
}