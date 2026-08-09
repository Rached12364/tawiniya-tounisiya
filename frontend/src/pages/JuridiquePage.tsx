import { useEffect, useState } from 'react';
import { ChevronDown, Scale } from 'lucide-react';
import { juridiqueService } from '../services/juridiqueService';
import type { LegalSection } from '../types/juridique';
export default function JuridiquePage() {
  const [sections, setSections] = useState<LegalSection[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    juridiqueService.getActive().then((data) => {
      setSections(data);
      if (data.length) setOpenId(data[0].id);
    }).finally(() => setLoading(false));
  }, []);
  return (
    <div className="min-h-[70vh] pt-28 pb-16 px-4 bg-navy/[0.02]">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-2 mb-8">
          <Scale className="text-gold" size={24} />
          <h1 className="text-2xl font-black text-navy">Cadre juridique</h1>
        </div>
        {loading && <p className="text-navy/40 text-sm">Chargement...</p>}
        <div className="flex flex-col gap-3">
          {sections.map((s) => {
            const isOpen = openId === s.id;
            return (
              <div key={s.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-navy/5">
                <button onClick={() => setOpenId(isOpen ? null : s.id)} className="w-full flex items-center justify-between px-6 py-4 text-start">
                  <span className="font-semibold text-navy">{s.title}</span>
                  <ChevronDown size={18} className={`text-navy/40 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-sm text-navy/70 leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: s.content }} />
                )}
              </div>
            );
          })}
        </div>
        {!loading && sections.length === 0 && <p className="text-navy/40 text-sm">Aucun contenu juridique publie pour le moment.</p>}
      </div>
    </div>
  );
}