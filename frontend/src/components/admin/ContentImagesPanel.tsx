import { useEffect, useState, useCallback } from 'react';
import { Trash2, Ban, CheckCircle2, UploadCloud } from 'lucide-react';
import {
  getContentImages,
  uploadContentImage,
  enableContentImage,
  disableContentImage,
  deleteContentImage,
} from '../../services/adminService';
import type { ContentImage, ContentSection } from '../../types/admin';

const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/api\/?$/, '');

function imageUrl(path: string) {
  if (!path) return '';
  return path.startsWith('http') ? path : `${API_ORIGIN}${path.startsWith('/') ? '' : '/'}${path}`;
}

export default function ContentImagesPanel() {
  const [section, setSection] = useState<ContentSection>('HERO');
  const [images, setImages] = useState<ContentImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [uploading, setUploading] = useState(false);

  const load = useCallback((s: ContentSection) => {
    setLoading(true);
    getContentImages(s)
      .then(setImages)
      .catch(() => setError('Impossible de charger les images.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load(section);
  }, [section, load]);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !title.trim()) return;
    setUploading(true);
    setError(null);
    try {
      await uploadContentImage({ file, section, title: title.trim(), displayOrder });
      setFile(null);
      setTitle('');
      setDisplayOrder(0);
      load(section);
    } catch {
      setError("Échec de l'upload. Vérifiez le format (JPG/PNG/WEBP) et la taille (max 5 Mo).");
    } finally {
      setUploading(false);
    }
  }

  async function toggleEnabled(img: ContentImage) {
    setBusyId(img.id);
    try {
      if (img.active) {
        await disableContentImage(img.id);
      } else {
        await enableContentImage(img.id);
      }
      load(section);
    } catch {
      setError('Impossible de modifier le statut de cette image.');
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: number) {
    setBusyId(id);
    try {
      await deleteContentImage(id);
      load(section);
    } catch {
      setError('Impossible de supprimer cette image.');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {(['HERO', 'SPONSOR'] as ContentSection[]).map((s) => (
          <button
            key={s}
            onClick={() => setSection(s)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              section === s ? 'bg-navy text-white' : 'bg-navy/5 text-navy hover:bg-navy/10'
            }`}
          >
            {s === 'HERO' ? 'Images du hero' : 'Sponsors'}
          </button>
        ))}
      </div>

      <form
        onSubmit={handleUpload}
        className="rounded-xl border border-navy/10 bg-white p-5 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
      >
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-navy/60 mb-1">Fichier image</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full text-sm text-navy file:mr-3 file:rounded-full file:border-0 file:bg-navy/10 file:px-3 file:py-1.5 file:text-navy file:text-xs file:font-semibold"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-navy/60 mb-1">Titre</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-navy/15 px-3 py-2 text-sm text-navy"
            placeholder="Titre de l'image"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-navy/60 mb-1">Ordre</label>
          <input
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(Number(e.target.value))}
            className="w-full rounded-lg border border-navy/15 px-3 py-2 text-sm text-navy"
          />
        </div>
        <div className="sm:col-span-4">
          <button
            type="submit"
            disabled={!file || !title.trim() || uploading}
            className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2 text-sm font-semibold text-navy-dark hover:bg-gold-light transition-colors disabled:opacity-50"
          >
            <UploadCloud size={16} />
            {uploading ? 'Envoi en cours…' : 'Uploader l\u2019image'}
          </button>
        </div>
      </form>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {loading ? (
        <p className="text-navy/60">Chargement des images…</p>
      ) : images.length === 0 ? (
        <p className="text-navy/60">Aucune image pour cette section.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="rounded-xl border border-navy/10 bg-white overflow-hidden">
              <img src={imageUrl(img.imagePath)} alt={img.title} className="h-32 w-full object-cover" />
              <div className="p-3">
                <p className="text-sm font-semibold text-navy truncate">{img.title}</p>
                <p className="text-xs text-navy/50 mb-2">Ordre : {img.displayOrder}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleEnabled(img)}
                    disabled={busyId === img.id}
                    className={`flex-1 inline-flex items-center justify-center gap-1 rounded-full px-2 py-1.5 text-xs font-semibold disabled:opacity-50 ${
                      img.active ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-700 hover:bg-green-100'
                    }`}
                  >
                    {img.active ? <Ban size={13} /> : <CheckCircle2 size={13} />}
                    {img.active ? 'Désactiver' : 'Activer'}
                  </button>
                  <button
                    onClick={() => handleDelete(img.id)}
                    disabled={busyId === img.id}
                    className="grid place-items-center h-8 w-8 rounded-full bg-navy/5 text-navy hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                    aria-label="Supprimer"
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
