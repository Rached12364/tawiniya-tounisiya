import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-32 flex flex-col items-center text-center">
      <span className="text-7xl font-black text-navy/10">404</span>
      <h1 className="mt-2 text-2xl font-black text-navy">Page introuvable</h1>
      <p className="mt-2 text-navy/60">La page que vous cherchez n'existe pas ou plus.</p>
      <Link
        to="/"
        className="mt-6 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-navy-dark hover:bg-gold-light transition-colors"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}
