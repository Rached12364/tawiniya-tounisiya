import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { GraduationCap, MapPin } from 'lucide-react';
import { getTrainingCenters } from '../services/trainingCenterService';
import type { TrainingCenter } from '../types/trainingCenter';
const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/api\/?$/, '');
function imageUrl(path: string | null) {
  if (!path) return '';
  return path.startsWith('http') ? path : `${API_ORIGIN}${path.startsWith('/') ? '' : '/'}${path}`;
}
export default function CentreFormationPage() {
  const { isAuthenticated } = useAuthStore();
  const [centers, setCenters] = useState<TrainingCenter[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getTrainingCenters()
      .then((res) => setCenters(res.content))
      .catch(() => setCenters([]))
      .finally(() => setLoading(false));
  }, []);
  return (
    <div className="min-h-[70vh] bg-navy/[0.02] pt-44 pb-16 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center gap-3 mb-2">
          <span className="grid place-items-center h-10 w-10 rounded-xl bg-navy/5 text-navy">
            <GraduationCap size={20} />
          </span>
          <h1 className="text-2xl font-black text-navy">Centre de formation</h1>
        </div>
        <div className="flex items-start justify-between gap-4 mb-8">
          <p className="text-navy/50">Découvrez les centres de formation partenaires.</p>
          {isAuthenticated && (
            <Link
              to="/mon-centre-formation"
              className="shrink-0 inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-navy-dark hover:bg-gold-light transition-colors"
            >
              Gérer mon centre
            </Link>
          )}
        </div>
        {loading ? (
          <p className="text-navy/40">Chargement...</p>
        ) : centers.length === 0 ? (
          <p className="text-navy/40">Aucun centre de formation pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {centers.map((c) => (
              <div key={c.id} className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div className="h-36 w-full bg-navy/5 grid place-items-center overflow-hidden">
                  {c.logoPath ? (
                    <img src={imageUrl(c.logoPath)} alt={c.name} className="h-full w-full object-contain p-3" />
                  ) : (
                    <GraduationCap size={32} className="text-navy/20" />
                  )}
                </div>
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <h3 className="text-base font-bold text-navy line-clamp-1">{c.name}</h3>
                  {c.address && (
                    <div className="flex items-center gap-1.5 text-xs text-navy/50">
                      <MapPin size={13} className="text-gold shrink-0" />
                      <span className="line-clamp-1">{c.address}</span>
                    </div>
                  )}
                  <Link
                    to={`/centre-formation/${c.id}`}
                    className="mt-auto pt-2 inline-flex items-center justify-center rounded-full bg-navy/5 px-4 py-2 text-xs font-semibold text-navy hover:bg-gold hover:text-navy-dark transition-colors"
                  >
                    Voir détails
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}