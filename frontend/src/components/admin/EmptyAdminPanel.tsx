import { Construction } from 'lucide-react';
interface EmptyAdminPanelProps {
  title: string;
}
export default function EmptyAdminPanel({ title }: EmptyAdminPanelProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-16 flex flex-col items-center text-center">
      <span className="grid place-items-center h-14 w-14 rounded-2xl bg-navy/5 text-navy/40 mb-5">
        <Construction size={26} />
      </span>
      <h2 className="text-lg font-bold text-navy">{title}</h2>
      <p className="mt-1.5 text-sm text-navy/50 max-w-sm">
        Cette section du tableau de bord n'est pas encore développée.
      </p>
    </div>
  );
}
