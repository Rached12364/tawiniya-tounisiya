import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone } from 'lucide-react';
import { FacebookIcon, InstagramIcon, LinkedinIcon } from '../icons/SocialIcons';
import { BRAND } from '../../config/brand';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-dark text-white/80">
      <div className="mx-auto max-w-7xl px-4 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Colonne 1 : logo + tagline */}
        <div>
          <div className="inline-block bg-white rounded-lg p-2">
            <img
              src={BRAND.logoSrc}
              alt={BRAND.nameFr}
              className="h-10 w-auto"
              onError={(e) => {
                e.currentTarget.parentElement!.style.display = 'none';
                e.currentTarget.parentElement!.nextElementSibling?.classList.remove('hidden');
              }}
            />
          </div>
          <span className="hidden text-lg font-black text-white tracking-tight">CTTEERA</span>
          <p className="mt-3 text-sm leading-relaxed text-white/60">{BRAND.nameFr}</p>
          <div className="flex items-center gap-3 mt-4">
            <a href="#" aria-label="Facebook" className="hover:text-gold transition-colors">
              <FacebookIcon width={16} height={16} />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-gold transition-colors">
              <InstagramIcon width={16} height={16} />
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-gold transition-colors">
              <LinkedinIcon width={16} height={16} />
            </a>
          </div>
        </div>

        {/* Colonne 2 : liens utiles */}
        <div>
          <h4 className="text-white font-semibold mb-4">{t('footer.links')}</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/" className="hover:text-gold transition-colors">{t('nav.home')}</Link></li>
            <li><Link to="/juridique" className="hover:text-gold transition-colors">{t('nav.juridique')}</Link></li>
            <li><Link to="/evenements" className="hover:text-gold transition-colors">{t('nav.evenements')}</Link></li>
            <li><Link to="/reclamation" className="hover:text-gold transition-colors">{t('nav.reclamation')}</Link></li>
          </ul>
        </div>

        {/* Colonne 3 : services */}
        <div>
          <h4 className="text-white font-semibold mb-4">{t('footer.services')}</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/espace/technicien" className="hover:text-gold transition-colors">{t('nav.spaces_technicien')}</Link></li>
            <li><Link to="/espace/entreprise" className="hover:text-gold transition-colors">{t('nav.spaces_entreprise')}</Link></li>
          </ul>
        </div>

        {/* Colonne 4 : contact */}
        <div>
          <h4 className="text-white font-semibold mb-4">{t('footer.contact')}</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin size={15} className="text-gold mt-0.5 shrink-0" />
              {t('topbar.address')}
            </li>
            <li className="flex items-center gap-2">
              <Mail size={15} className="text-gold shrink-0" />
              <a href={`mailto:${t('topbar.email')}`} className="hover:text-gold transition-colors">{t('topbar.email')}</a>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={15} className="text-gold shrink-0" />
              <a href={`tel:${t('topbar.phone')}`} className="hover:text-gold transition-colors">{t('topbar.phone')}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <p className="text-center text-xs text-white/50">
          © {year} CTTEERA. {t('footer.rights')}
        </p>
      </div>
    </footer>
  );
}
