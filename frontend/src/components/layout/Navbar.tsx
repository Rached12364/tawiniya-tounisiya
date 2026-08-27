import { useEffect, useState, useRef } from 'react';
import { Link, NavLink as RouterNavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, ChevronDown, User as UserIcon, Users } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { BRAND } from '../../config/brand';
import type { LangCode } from '../../types/nav';
import { getUpcomingEvents } from '../../services/eventService';
import { juridiqueService } from '../../services/juridiqueService';
import { getMyReclamations } from '../../services/reclamationService';
const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/api\/?$/, '');
function imageUrl(path?: string) {
  if (!path) return '';
  return path.startsWith('http') ? path : `${API_ORIGIN}${path}`;
}
const SPACE_LINKS = [
  { key: 'spaces_technicien', path: '/espace/technicien' },
  { key: 'spaces_entreprise', path: '/espace/entreprise' },
  { key: 'spaces_centre_formation', path: '/espace/centre-formation' },
  { key: 'spaces_beneficiel', path: '/espace/beneficiel' },
  { key: 'spaces_avocat', path: '/espace/avocat' },
];
const NAV_LINKS = [
  { key: 'juridique', path: '/juridique', icon: '/icons/juridique.png' },
  { key: 'reclamation', path: '/reclamation', icon: '/icons/reclamations.png' },
  { key: 'evenements', path: '/evenements', icon: '/icons/evenements.png' },
];
const LANGUAGES: { code: LangCode; label: string; flagCode: string }[] = [
  { code: 'fr', label: 'Français', flagCode: 'fr' },
  { code: 'en', label: 'English', flagCode: 'gb' },
  { code: 'ar', label: 'العربية', flagCode: 'tn' },
];
function FlagImg({ code, size = 18 }: { code: string; size?: number }) {
  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      alt=""
      width={size}
      height={size * 0.75}
      className="rounded-[2px] object-cover shrink-0"
      style={{ width: size, height: size * 0.75 }}
    />
  );
}
function NavBadge({ count }: { count: number }) {
  if (!count || count <= 0) return null;
  return (
    <span className="absolute -top-1.5 -end-2 min-w-[15px] h-[15px] px-1 rounded-full bg-red-600 text-white text-[9px] font-bold leading-[15px] text-center">
      {count > 99 ? '99+' : count}
    </span>
  );
}
export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [isSpacesOpen, setIsSpacesOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUiStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const spacesRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const [eventsCount, setEventsCount] = useState(0);
  const [reclamationsCount, setReclamationsCount] = useState(0);
  const [juridiqueCount, setJuridiqueCount] = useState(0);
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';
  useEffect(() => {
    if (isAdmin) return;
    juridiqueService
      .getActive()
      .then((sections) => setJuridiqueCount(sections.length))
      .catch(() => setJuridiqueCount(0));
  }, [isAdmin]);
  useEffect(() => {
    if (isAdmin) return;
    getUpcomingEvents(0, 1)
      .then((res) => setEventsCount(res.totalElements))
      .catch(() => setEventsCount(0));
  }, [isAdmin]);
  useEffect(() => {
    if (!isAuthenticated || isAdmin) {
      setReclamationsCount(0);
      return;
    }
    getMyReclamations(0, 100)
      .then((res) => {
        const pending = res.content.filter((r) => r.status === 'OUVERTE' || r.status === 'EN_COURS').length;
        setReclamationsCount(pending);
      })
      .catch(() => setReclamationsCount(0));
  }, [isAuthenticated, isAdmin]);
  const badgeForKey: Record<string, number> = {
    evenements: eventsCount,
    reclamation: reclamationsCount,
    juridique: juridiqueCount,
  };
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (spacesRef.current && !spacesRef.current.contains(e.target as Node)) {
        setIsSpacesOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setIsAccountOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `relative flex items-center gap-1.5 whitespace-nowrap text-sm font-medium transition-colors hover:text-gold ${isActive ? 'text-gold' : 'text-black'}`;
  const userInitial = (user?.prenom ?? user?.email ?? '?').charAt(0).toUpperCase();
  const userDisplayName = user ? `${user.prenom} ${user.nom}`.trim() : 'Mon compte';
  return (
    <header className="absolute top-0 left-0 z-50 w-full bg-white/25 backdrop-blur-sm">
      <nav className="w-full pe-4 py-2 flex flex-wrap items-center justify-between gap-y-2 text-white">
        <Link to={isAdmin ? '/admin' : '/'} className="flex items-center gap-2 shrink-0" onClick={closeMobileMenu}>
          <img
            src={BRAND.logoSrc}
            alt={BRAND.nameAr}
            className="h-14 w-14 object-contain shrink-0"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <span className="hidden text-lg font-black tracking-tight text-navy">CTTEERA</span>
          <div className="hidden sm:block max-w-[280px]">
            <p dir="rtl" className="text-[9px] font-bold text-navy leading-[1.3]">
              {BRAND.nameAr}
            </p>
            <p className="mt-0.5 text-[6px] font-medium text-navy/70 uppercase tracking-wide leading-snug">
              {BRAND.nameFr}
            </p>
          </div>
        </Link>
        <div className="hidden lg:flex flex-wrap items-center gap-x-6 gap-y-2 min-w-0">
          {!isAdmin && (
            <RouterNavLink to="/" className={linkClass} end>
              <img src="/icons/accueil.png" alt="" className="h-3.5 w-3.5 object-contain" />
              {t('nav.home')}
            </RouterNavLink>
          )}
          {!isAdmin && isAuthenticated && (
            <>
              <RouterNavLink to="/actualites" className={linkClass}>
                <Users size={14} />
                Actualités
              </RouterNavLink>
              <div className="relative shrink-0" ref={spacesRef}>
                <button
                  onClick={() => setIsSpacesOpen((v) => !v)}
                  className="flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-black hover:text-gold transition-colors"
                >
                  <ChevronDown size={12} className={`transition-transform ${isSpacesOpen ? 'rotate-180' : ''}`} />
                  <img src="/icons/espace.png" alt="" className="h-3.5 w-3.5 object-contain" />
                  {t('nav.spaces')}
                </button>
                {isSpacesOpen && (
                  <div className="absolute top-full mt-3 start-4 z-20">
                    <div className="absolute -top-1.5 start-3 h-3 w-3 rotate-45 bg-white border-t border-s border-navy/10 z-10" />
                    <div className="relative w-52 rounded-lg bg-white text-navy shadow-xl overflow-hidden py-1 border border-navy/10">
                      {SPACE_LINKS.map((link) => (
                        <Link
                          key={link.path}
                          to={link.path}
                          onClick={() => setIsSpacesOpen(false)}
                          className="block px-3.5 py-2 text-[13px] hover:bg-navy/5 hover:text-teal transition-colors"
                        >
                          {t(`nav.${link.key}`)}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {NAV_LINKS.map((link) => (
                <RouterNavLink key={link.path} to={link.path} className={linkClass}>
                  <span className="relative inline-block h-3.5 w-3.5 shrink-0">
                    <img src={link.icon} alt="" className="h-3.5 w-3.5 object-contain" />
                    <NavBadge count={badgeForKey[link.key] ?? 0} />
                  </span>
                  {t(`nav.${link.key}`)}
                </RouterNavLink>
              ))}
            </>
          )}
          {isAdmin && (
            <RouterNavLink to="/admin" className={linkClass}>
              <img src="/icons/dashboard.png" alt="" className="h-3.5 w-3.5 object-contain" />
              Dashboard
            </RouterNavLink>
          )}
        </div>
        <div className="hidden lg:flex flex-wrap items-center gap-3 shrink-0">
          <div className="relative shrink-0 border-e border-navy/20 pe-3" ref={langRef}>
            <button
              type="button"
              onClick={() => setIsLangOpen((v) => !v)}
              className="flex items-center gap-1.5 text-[13px] font-medium text-navy hover:text-gold transition-colors"
            >
              <FlagImg code={LANGUAGES.find((l) => l.code === i18n.language)?.flagCode ?? 'fr'} size={20} />
              <ChevronDown size={11} className={`transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>
            {isLangOpen && (
              <div className="absolute top-full mt-3 start-0 z-20">
                <div className="absolute -top-1.5 start-3 h-3 w-3 rotate-45 bg-white border-t border-s border-navy/10 z-10" />
                <div className="relative w-40 rounded-lg bg-white text-navy shadow-xl overflow-hidden py-1 border border-navy/10">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => { i18n.changeLanguage(lang.code); setIsLangOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-left hover:bg-navy/5 transition-colors ${
                        i18n.language === lang.code ? 'text-teal font-semibold' : 'text-navy'
                      }`}
                    >
                      <FlagImg code={lang.flagCode} size={20} />
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          {isAuthenticated ? (
            <div className="relative shrink-0" ref={accountRef}>
              <button
                onClick={() => setIsAccountOpen((v) => !v)}
                className="flex items-center gap-1.5 rounded-full bg-white/70 hover:bg-white pe-2.5 ps-1 py-1 transition-colors"
              >
                <span className="h-6 w-6 rounded-full bg-navy text-white text-[11px] font-bold grid place-items-center overflow-hidden shrink-0">
                  {user?.photoProfilPath ? (
                    <img src={imageUrl(user.photoProfilPath)} alt="" className="w-full h-full object-cover" />
                  ) : (
                    userInitial
                  )}
                </span>
                <span className="text-[13px] font-medium text-navy max-w-[100px] truncate">
                  {userDisplayName}
                </span>
                <ChevronDown size={12} className={`text-navy transition-transform ${isAccountOpen ? 'rotate-180' : ''}`} />
              </button>
              {isAccountOpen && (
                <div className="absolute top-full mt-3 end-0 z-20">
                  <div className="absolute -top-1.5 end-4 h-3 w-3 rotate-45 bg-white border-t border-s border-navy/10 z-10" />
                  <div className="relative w-48 rounded-lg bg-white text-navy shadow-xl overflow-hidden py-1 border border-navy/10">
                    {!isAdmin && (
                      <Link
                        to="/profil"
                        onClick={() => setIsAccountOpen(false)}
                        className="flex items-center gap-2 px-3.5 py-2 text-[13px] hover:bg-navy/5 hover:text-teal transition-colors"
                      >
                        <UserIcon size={14} />
                        Mon profil
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setIsAccountOpen(false);
                        logout?.();
                      }}
                      className="w-full text-left px-3.5 py-2 text-[13px] hover:bg-navy/5 hover:text-red-600 transition-colors"
                    >
                      Se deconnecter
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/register"
              className="shrink-0 whitespace-nowrap rounded-full bg-gold px-4 py-1.5 text-[13px] font-semibold text-navy-dark hover:bg-gold-light transition-colors"
            >
              {t('nav.register')}
            </Link>
          )}
        </div>
        <button
          className="lg:hidden p-2 text-navy"
          onClick={toggleMobileMenu}
          aria-label="Menu"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-navy border-t border-white/10 px-4 py-3 flex flex-col gap-1 text-white">
          {!isAdmin && (
            <RouterNavLink to="/" className={linkClass} end onClick={closeMobileMenu}>
              <div className="py-2 flex items-center gap-1.5">
                <img src="/icons/accueil.png" alt="" className="h-3.5 w-3.5 object-contain" />
                {t('nav.home')}
              </div>
            </RouterNavLink>
          )}
          {!isAdmin && isAuthenticated && (
            <>
              <Link to="/actualites" onClick={closeMobileMenu} className="py-2 flex items-center gap-1.5 text-sm hover:text-gold">
                <Users size={15} />
                Actualités
              </Link>
              <Link to="/profil" onClick={closeMobileMenu} className="py-2 flex items-center gap-1.5 text-sm hover:text-gold">
                <UserIcon size={15} />
                Mon profil
              </Link>
              <div className="py-2 text-[11px] uppercase tracking-wide text-white/50">{t('nav.spaces')}</div>
              {SPACE_LINKS.map((link) => (
                <Link key={link.path} to={link.path} onClick={closeMobileMenu} className="py-2 ps-3 text-sm hover:text-gold">
                  {t(`nav.${link.key}`)}
                </Link>
              ))}
              {NAV_LINKS.map((link) => (
                <RouterNavLink key={link.path} to={link.path} className={linkClass} onClick={closeMobileMenu}>
                  <div className="py-2 flex items-center gap-1.5">
                    <span className="relative inline-block h-3.5 w-3.5 shrink-0">
                      <img src={link.icon} alt="" className="h-3.5 w-3.5 object-contain" />
                      <NavBadge count={badgeForKey[link.key] ?? 0} />
                    </span>
                    {t(`nav.${link.key}`)}
                  </div>
                </RouterNavLink>
              ))}
            </>
          )}
          {isAdmin && (
            <RouterNavLink to="/admin" className={linkClass} onClick={closeMobileMenu}>
              <div className="py-2 flex items-center gap-1.5">
                <img src="/icons/dashboard.png" alt="" className="h-3.5 w-3.5 object-contain" />
                Dashboard
              </div>
            </RouterNavLink>
          )}
          <div className="flex items-center gap-2 py-2">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => i18n.changeLanguage(lang.code)}
                className={`flex items-center gap-1 px-2 py-1 rounded text-sm ${i18n.language === lang.code ? 'text-gold font-semibold' : ''}`}
              >
                <FlagImg code={lang.flagCode} size={18} /> {lang.label}
              </button>
            ))}
          </div>
          {isAuthenticated ? (
            <button
              onClick={() => {
                closeMobileMenu();
                logout?.();
              }}
              className="mt-2 rounded-full bg-navy/10 px-5 py-2 text-sm font-semibold text-red-600 text-center"
            >
              Se deconnecter
            </button>
          ) : (
            <Link
              to="/register"
              onClick={closeMobileMenu}
              className="mt-2 rounded-full bg-gold px-5 py-2 text-sm font-semibold text-navy-dark text-center"
            >
              {t('nav.register')}
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

