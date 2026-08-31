import { useEffect, useRef, useState } from 'react';
import { Loader2, Send, User as UserIcon } from 'lucide-react';
import { getConversationById, replyToConversation, updateConversationStatus } from '../services/expertConversationService';
import type { ConversationStatus, ExpertConversationDetail } from '../types/expertConversation';
const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/api\/?$/, '');
function imageUrl(path?: string) {
  if (!path) return '';
  return path.startsWith('http') ? path : `${API_ORIGIN}${path}`;
}
const STATUS_OPTIONS: { value: ConversationStatus; label: string }[] = [
  { value: 'OUVERTE', label: 'Ouverte' },
  { value: 'EN_COURS', label: 'En cours' },
  { value: 'RESOLUE', label: 'Résolue' },
];
export default function ExpertConversationThread({ conversationId, onStatusChanged }: { conversationId: number; onStatusChanged?: () => void }) {
  const [conversation, setConversation] = useState<ExpertConversationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  function load() {
    setLoading(true);
    getConversationById(conversationId)
      .then(setConversation)
      .catch(() => setError('Impossible de charger la conversation.'))
      .finally(() => setLoading(false));
  }
  useEffect(load, [conversationId]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages.length]);
  async function handleSend() {
    if (!message.trim()) return;
    setSending(true);
    setError(null);
    try {
      const updated = await replyToConversation(conversationId, message.trim());
      setConversation(updated);
      setMessage('');
      onStatusChanged?.();
    } catch {
      setError("Échec de l'envoi du message.");
    } finally {
      setSending(false);
    }
  }
  async function handleStatusChange(status: ConversationStatus) {
    setUpdatingStatus(true);
    try {
      const updated = await updateConversationStatus(conversationId, status);
      setConversation(updated);
      onStatusChanged?.();
    } finally {
      setUpdatingStatus(false);
    }
  }
  if (loading) {
    return <div className="bg-white rounded-xl shadow-sm p-6 grid place-items-center"><Loader2 className="animate-spin text-blue-400" size={22} /></div>;
  }
  if (!conversation) {
    return <p className="text-sm text-red-600">{error ?? 'Conversation introuvable.'}</p>;
  }
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col" style={{ maxHeight: '600px' }}>
      <div className="px-5 py-3 border-b border-blue-900/10 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-9 w-9 rounded-full bg-blue-100 overflow-hidden shrink-0">
            {conversation.otherUser.photoProfilPath ? (
              <img src={imageUrl(conversation.otherUser.photoProfilPath)} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full grid place-items-center text-blue-300"><UserIcon size={14} /></div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-blue-900 truncate">{conversation.otherUser.prenom} {conversation.otherUser.nom}</p>
            <p className="text-xs text-blue-900/50 truncate">{conversation.subject}</p>
          </div>
        </div>
        <select
          value={conversation.status ?? 'OUVERTE'}
          onChange={(e) => handleStatusChange(e.target.value as ConversationStatus)}
          disabled={updatingStatus}
          className="shrink-0 rounded-full border border-blue-900/15 bg-white px-3 py-1.5 text-xs font-semibold text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
        >
          {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3" style={{ minHeight: '200px' }}>
        {conversation.messages.map((m) => (
          <div key={m.id} className={`flex ${m.mine ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${
                m.mine ? 'bg-blue-700 text-white rounded-br-sm' : 'bg-blue-50 text-blue-900 rounded-bl-sm'
              }`}
            >
              <p className="whitespace-pre-line">{m.content}</p>
              <p className={`mt-1 text-[10px] ${m.mine ? 'text-white/70' : 'text-blue-900/40'}`}>
                {new Date(m.createdAt).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {error && <p className="px-5 text-xs text-red-600">{error}</p>}
      <div className="border-t border-blue-900/10 p-3 shrink-0 flex items-center gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !sending) handleSend(); }}
          placeholder="Répondre..."
          className="flex-1 rounded-full border border-blue-900/15 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/40"
        />
        <button
          onClick={handleSend}
          disabled={sending || !message.trim()}
          className="shrink-0 grid place-items-center h-9 w-9 rounded-full bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-50 transition-colors"
        >
          {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
        </button>
      </div>
    </div>
  );
}