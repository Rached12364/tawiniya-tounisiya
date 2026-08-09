import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, GraduationCap, Phone, Mail, Globe, MapPin, Clock } from 'lucide-react';
import { getTrainingCenterById } from '../services/trainingCenterService';
import type { TrainingCenter } from '../types/trainingCenter';
const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/api\/?$/, '');
function imageUrl(path: string | null) {
  if (!path) return '';
  return path.startsWith('http') ? path : `${API_ORIGIN}${path.startsWith('/') ? '' : '/'}${path}`;
}
export default function CentreFormationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [center, setCenter] = useState<TrainingCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getTrainingCenterById(Number(id))
      .then(setCenter)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);
  return (
    <div className="min-h-[70vh] bg-navy/[0.02] pt-44 pb-16 px-4">
      <div className="mx-auto max-w-3xl">
        <Link to="/centre-formation" className="inline-flex items-center gap-1.5 text-sm text-navy/50 hover:text-navy mb-6">
          <ArrowLeft size={14} />
          Retour aux centres de formation
        </Link>
        {loading ? (
          <p className="text-navy/40">Chargement...</p>
        ) : error || !center ? (
          <p className="text-navy/40">Ce centre de formation est introuvable.</p>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {center.logoPath && (
              <img src={imageUrl(center.logoPath)} alt={center.name} className="h-56 w-full object-contain bg-navy/5 p-4" />
            )}
            <div className="p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="grid place-items-center h-10 w-10 rounded-xl bg-navy/5 text-navy shrink-0">
                  <GraduationCap size={20} />
                </span>
                <h1 className="text-2xl font-black text-navy">{center.name}</h1>
              </div>
              {center.description && (
                <p className="text-sm text-navy/70 whitespace-pre-line">{center.description}</p>
              )}
              <div className="flex flex-col gap-2 pt-2 border-t border-navy/5">
                {center.address && (
                  <div className="flex items-center gap-2 text-sm text-navy/70">
                    <MapPin size={15} className="text-gold shrink-0" />
                    {center.address}
                  </div>
                )}
                {center.openingHours && (
                  <div className="flex items-center gap-2 text-sm text-navy/70">
                    <Clock size={15} className="text-gold shrink-0" />
                    {center.openingHours}
                  </div>
                )}
                {center.phone && (
                  <div className="flex items-center gap-2 text-sm text-navy/70">
                    <Phone size={15} className="text-gold shrink-0" />
                    {center.phone}
                  </div>
                )}
                {center.email && (
                  <div className="flex items-center gap-2 text-sm text-navy/70">
                    <Mail size={15} className="text-gold shrink-0" />
                    {center.email}
                  </div>
                )}
                {center.website && (
                  <a
                    href={center.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm text-teal hover:underline"
                  >
                    <Globe size={15} className="text-gold shrink-0" />
                    {center.website}
                  </a>
                )}
              </div>
              {center.courses.length > 0 && (
                <div className="pt-4 border-t border-navy/5">
                  <p className="text-xs font-semibold text-navy/50 uppercase tracking-wide mb-2">
                    Formations proposées
                  </p>
                  <ul className="flex flex-col gap-2">
                    {center.courses.map((course) => (
                      <li key={course.id} className="rounded-lg bg-navy/[0.03] px-3 py-2">
                        <p className="text-sm font-semibold text-navy">{course.title}</p>
                        {course.description && (
                          <p className="text-xs text-navy/60 mt-0.5">{course.description}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}