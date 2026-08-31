import { useEffect, useRef, useState } from 'react';
import { Loader2, Send, MessageCircle } from 'lucide-react';
import { getConversationWithExpert, sendToExpert, replyToConversation } from '../services/expertConversationService';
import type { ExpertConversationDetail } from '../types/expertConversation';

const STATUS_LABELS: Record<string, string> = {
  OUVERTE: 'Ouverte',
  EN_COURS: 'En cours',
  RESOLUE: 'Résolue',
};
export default function ExpertChatWidget({ expertId }: { expertId: number }) {
  const [conversation, setConversation] = useState<ExpertConversationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  function load() {
    setLoading(true);
    getConversationWithExpert(expertId)
      .then(setConversation)
      .catch(() => setError("Impossible de charger la conversation."))
      .finally(() => setLoading(false));
  }
  useEffect(load, [expertId]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages.length]);
  async function handleSend() {
    if (!message.trim()) return;
    setSending(true);
    setError(null);
    try {
      let updated: ExpertConversationDetail;
      if (conversation?.id) {
        updated = await replyToConversation(conversation.id, message.trim());
      } else {
        updated = await sendToExpert(expertId, subject.trim(), message.trim());
      }
      setConversation(updated);
      setMessage('');
      setSubject('');
    } catch {
      setError("Échec de l'envoi du message.");
    } finally {
      setSending(false);
    }
  }
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 grid place-items-center">
        <Loader2 className="animate-spin text-navy/40" size={22} />
      </div>
    );
  }
  const hasStarted = !!conversation?.id;
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col" style={{ maxHeight: '520px' }}>
      <div className="px-5 py-3 border-b border-navy/10 flex items-center justify-between shrink-0">
        <h2 className="flex items-center gap-2 text-sm font-bold text-teal uppercase tracking-wide">
          <MessageCircle size={16} /> Contacter l'expert
        </h2>
        {conversation?.status && (
          <span className="text-[11px] font-semibold text-navy/50 bg-navy/5 rounded-full px-2.5 py-1">
            {STATUS_LABELS[conversation.status] || conversation.status}
          </span>
        )}
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3" style={{ minHeight: '160px' }}>
        {!hasStarted ? (
          <p className="text-sm text-navy/40 italic m-auto text-center">
            Posez votre question, l'expert vous répondra ici.
          </p>
        ) : (
          conversation!.messages.map((m) => (
            <div key={m.id} className={`flex ${m.mine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${
                  m.mine ? 'bg-teal text-white rounded-br-sm' : 'bg-navy/5 text-navy rounded-bl-sm'
                }`}
              >
                <p className="whitespace-pre-line">{m.content}</p>
                <p className={`mt-1 text-[10px] ${m.mine ? 'text-white/70' : 'text-navy/40'}`}>
                  {new Date(m.createdAt).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      {error && <p className="px-5 text-xs text-red-600">{error}</p>}
      <div className="border-t border-navy/10 p-3 shrink-0 flex flex-col gap-2">
        {!hasStarted && (
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Sujet (optionnel)"
            className="w-full rounded-full border border-navy/15 bg-white px-3.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
          />
        )}
        <div className="flex items-center gap-2">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !sending) handleSend(); }}
            placeholder="Écrire un message..."
            className="flex-1 rounded-full border border-navy/15 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
          />
          <button
            onClick={handleSend}
            disabled={sending || !message.trim()}
            className="shrink-0 grid place-items-center h-9 w-9 rounded-full bg-teal text-white hover:bg-teal/90 disabled:opacity-50 transition-colors"
          >
            {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
          </button>
        </div>
      </div>
    </div>
  );
}