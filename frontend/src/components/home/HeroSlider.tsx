import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getPublicImages, resolveImageUrl } from '../../services/contentService';
import type { ContentImage } from '../../types/admin';
const FALLBACK_SLIDES = [
  { titleKey: 'hero_title_1', subtitleKey: 'hero_subtitle_1' },
  { titleKey: 'hero_title_2', subtitleKey: 'hero_subtitle_2' },
  { titleKey: 'hero_title_3', subtitleKey: 'hero_subtitle_3' },
];
const FALLBACK_IMAGE = 'https://evole-electricite.fr/wp-content/uploads/2025/06/energie-verte.jpg';
const ROTATE_MS = 5000;
export default function HeroSlider() {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [images, setImages] = useState<ContentImage[] | null>(null);
  useEffect(() => {
    getPublicImages('HERO')
      .then((data) => setImages(data.filter((img) => img.active)))
      .catch(() => setImages([]));
  }, []);
  const slideCount = images && images.length > 0 ? images.length : FALLBACK_SLIDES.length;
  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slideCount);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [slideCount]);
  const goTo = (i: number) => setIndex((i + slideCount) % slideCount);
  const usingUploaded = images && images.length > 0;
  const currentBg = usingUploaded
    ? resolveImageUrl(images![index % images!.length].imagePath)
    : FALLBACK_IMAGE;
  const currentTitle = usingUploaded
    ? images![index % images!.length].title
    : t(`home.${FALLBACK_SLIDES[index % FALLBACK_SLIDES.length].titleKey}`);
  const currentSubtitle = usingUploaded
    ? ''
    : t(`home.${FALLBACK_SLIDES[index % FALLBACK_SLIDES.length].subtitleKey}`);
  return (
    <section
      className="relative h-[560px] md:h-[640px] w-full overflow-hidden bg-cover bg-center transition-[background-image] duration-700"
      style={{ backgroundImage: `url(${currentBg})` }}
      aria-roledescription="carousel"
    >
      <div className="relative h-full mx-auto max-w-7xl px-4 flex flex-col items-start justify-center">
        <div className="max-w-2xl rounded-2xl bg-white/40 backdrop-blur-sm px-6 py-5">
          <span className="h-1 w-16 bg-gold rounded-full mb-6 block" />
          <h1 className="max-w-2xl text-2xl md:text-4xl font-black leading-[1.1] tracking-tight text-navy">
            {currentTitle}
          </h1>
          {currentSubtitle && (
            <p className="mt-3 max-w-lg text-sm text-navy/80">{currentSubtitle}</p>
          )}
          <Link
            to="/espace/technicien"
            className="mt-5 inline-block rounded-full bg-gold px-5 py-2 text-sm font-semibold text-navy-dark hover:bg-gold-light transition-colors"
          >
            {t('home.hero_cta')}
          </Link>
        </div>
      </div>
      {slideCount > 1 && (
        <>
          <button
            onClick={() => goTo(index - 1)}
            aria-label="Slide précédent"
            className="absolute top-1/2 start-4 -translate-y-1/2 z-10 grid place-items-center h-10 w-10 rounded-full bg-navy/10 text-navy backdrop-blur hover:bg-navy/20 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => goTo(index + 1)}
            aria-label="Slide suivant"
            className="absolute top-1/2 end-4 -translate-y-1/2 z-10 grid place-items-center h-10 w-10 rounded-full bg-navy/10 text-navy backdrop-blur hover:bg-navy/20 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
          <div className="absolute bottom-6 start-1/2 -translate-x-1/2 z-10 flex gap-2">
            {Array.from({ length: slideCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Aller au slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? 'w-8 bg-gold' : 'w-1.5 bg-navy/30'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
