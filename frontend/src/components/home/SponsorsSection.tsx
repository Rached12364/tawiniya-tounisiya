import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getPublicImages, resolveImageUrl } from '../../services/contentService';
import type { ContentImage } from '../../types/admin';
const FALLBACK_SPONSORS = ['Alpha Tech', 'Meridien', 'Nova Systems', 'Atlas Group', 'Carthage Elec', 'Delta Pro'];
export default function SponsorsSection() {
  const { t } = useTranslation();
  const [images, setImages] = useState<ContentImage[]>([]);
  useEffect(() => {
    getPublicImages('SPONSOR')
      .then((data) => setImages(data.filter((img) => img.active)))
      .catch(() => setImages([]));
  }, []);
  return (
    <section className="bg-navy/[0.03] py-16">
      <div className="mx-auto max-w-7xl px-4">
        <p className="text-center text-sm font-semibold tracking-wide text-navy/50 uppercase mb-10">
          {t('home.sponsors_title')}
        </p>
        {images.length > 0 ? (
          <div className="space-y-10">
            {images.map((img, i) => (
              <div
                key={img.id}
                className={`flex flex-col md:flex-row items-center gap-8 rounded-2xl bg-white border border-navy/10 p-6 md:p-8 ${
                  i % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
              >
                <div className="w-full md:w-1/3 shrink-0">
                  <img
                    src={resolveImageUrl(img.imagePath)}
                    alt={img.title}
                    className="w-full h-48 md:h-56 object-cover rounded-xl"
                  />
                </div>
                <div className="w-full md:w-2/3 text-center md:text-start">
                  <h3 className="text-xl font-bold text-navy mb-2">{img.title}</h3>
                  {img.description && (
                    <p className="text-navy/70 leading-relaxed">{img.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {FALLBACK_SPONSORS.map((name) => (
              <span
                key={name}
                className="text-lg font-bold text-navy/30 hover:text-navy/60 transition-colors select-none"
              >
                {name}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
