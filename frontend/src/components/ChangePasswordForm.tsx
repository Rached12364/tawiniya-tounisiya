import { useState } from 'react';
import { Loader2, Check, Lock, Eye, EyeOff } from 'lucide-react';
import { changeMyPassword } from '../services/userProfileService';
export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  async function submit() {
    setError(null);
    setSuccess(false);
    if (!currentPassword || !newPassword) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Le nouveau mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Les deux mots de passe ne correspondent pas.');
      return;
    }
    setSaving(true);
    try {
      await changeMyPassword(currentPassword, newPassword);
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data?.error;
      setError(msg || 'Mot de passe actuel incorrect.');
    } finally {
      setSaving(false);
    }
  }
  const inputCls = "w-full rounded-lg border border-navy/15 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal";
  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="flex items-center gap-2 text-sm font-bold text-teal uppercase tracking-wide">
          <Lock size={15} /> Mot de passe
        </h2>
        <button
          onClick={() => setShowPasswords((v) => !v)}
          className="text-navy/40 hover:text-teal transition-colors p-1.5 rounded-full hover:bg-teal/5"
          title={showPasswords ? 'Masquer' : 'Afficher'}
        >
          {showPasswords ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-[11px] font-medium text-navy/60 mb-1">Mot de passe actuel</label>
          <input
            type={showPasswords ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-navy/60 mb-1">Nouveau mot de passe</label>
          <input
            type={showPasswords ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-navy/60 mb-1">Confirmer le nouveau mot de passe</label>
          <input
            type={showPasswords ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={inputCls}
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mt-3">{error}</p>}
      {success && <p className="text-sm text-teal bg-teal/10 rounded-lg px-3 py-2 mt-3">Mot de passe mis à jour avec succès.</p>}
      <div className="flex justify-end mt-4">
        <button
          onClick={submit}
          disabled={saving}
          className="flex items-center gap-1.5 rounded-full bg-teal px-4 py-2 text-sm font-semibold text-white hover:bg-teal/90 disabled:opacity-50 transition-colors"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
          Mettre à jour
        </button>
      </div>
    </div>
  );
}