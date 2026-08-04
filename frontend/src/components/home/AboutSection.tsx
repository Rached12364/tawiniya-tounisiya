import { Play } from 'lucide-react';
import { BRAND } from '../../config/brand';

// ⚠️ Remplacez par le véritable ID de la vidéo YouTube institutionnelle une fois disponible.
const YOUTUBE_VIDEO_ID = '';

export default function AboutSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 grid md:grid-cols-2 gap-12 items-center">
      <div dir="rtl" className="text-end">
        <span className="text-teal font-semibold text-sm tracking-wide">من نحن</span>
        <h2 className="mt-2 text-3xl md:text-4xl font-black text-navy leading-tight">
          {BRAND.nameAr}
        </h2>
        <p className="mt-5 text-navy/70 leading-relaxed text-lg">
          تعمل التعاونية التونسية للتقنيين في مجالات الكهرباء والطاقة المتجددة والأنشطة التابعة على
          دعم التقنيين والمؤسسات العاملة في هذا القطاع، من خلال تسهيل التواصل والتكوين المستمر
          والمتابعة المهنية، من أجل قطاع كهربائي وطاقي أقوى وأكثر تضامنا في تونس.
        </p>
      </div>

      <div className="relative aspect-video rounded-2xl overflow-hidden bg-navy shadow-xl">
        {YOUTUBE_VIDEO_ID ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}`}
            title="CTTEERA - Présentation"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            aria-label="Lire la vidéo de présentation"
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-navy to-navy-dark text-white group"
          >
            <span className="grid place-items-center h-16 w-16 rounded-full bg-gold text-navy-dark group-hover:bg-gold-light transition-colors">
              <Play size={26} fill="currentColor" />
            </span>
            <span className="text-sm text-white/70">Vidéo de présentation à venir</span>
          </button>
        )}
      </div>
    </section>
  );
}
