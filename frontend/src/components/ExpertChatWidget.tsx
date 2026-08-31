import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Send, Paperclip, Mic, Square, FileText, X, User as UserIcon } from 'lucide-react';
import { getConversationWithExpert, sendToExpert, replyToConversation } from '../services/expertConversationService';
import type { ExpertConversationDetail, ExpertMessageItem } from '../types/expertConversation';
const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/api\/?$/, '');
function fileUrl(path?: string) {
  if (!path) return '';
  return path.startsWith('http') ? path : `${API_ORIGIN}${path}`;
}
function isImage(path: string) { return /\.(jpe?g|png|webp|gif)$/i.test(path); }
function AttachmentPreview({ path }: { path: string }) {
  const url = fileUrl(path);
  if (isImage(path)) {
    return <img src={url} alt="Pièce jointe" className="mt-1.5 max-w-full rounded-lg max-h-48 object-cover" />;
  }
  // Heuristique simple : si le navigateur peut décoder l'extension comme média audio connu ET que ça vient
  // d'un enregistrement vocal, on ne peut pas distinguer webm-audio de webm-video par l'extension seule ;
  // on affiche donc un lecteur audio par défaut pour webm/ogg si aucune image, et video pour mp4.
  const ext = path.split('.').pop()?.toLowerCase();
  if (ext === 'mp4') {
    return <video src={url} controls className="mt-1.5 max-w-full rounded-lg max-h-56" />;
  }
  if (ext === 'webm' || ext === 'ogg' || ext === 'mp3' || ext === 'wav' || ext === 'm4a') {
    return <audio src={url} controls className="mt-1.5 max-w-full" />;
  }
  return (
    <a href={url} target="_blank" rel="noreferrer" className="mt-1.5 flex items-center gap-1.5 text-xs underline">
      <FileText size={13} /> Voir le document
    </a>
  );
}
const STATUS_LABELS: Record<string, string> = {
  OUVERTE: 'Ouverte',
  EN_COURS: 'En cours',
  RESOLUE: 'Résolue',
};
export default function ExpertChatWidget({ expertId }: { expertId: number }) {
  const navigate = useNavigate();
  const [conversation, setConversation] = useState<ExpertConversationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
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
    if (!message.trim() && !pendingFile) return;
    setSending(true);
    setError(null);
    try {
      let updated: ExpertConversationDetail;
      if (conversation?.id) {
        updated = await replyToConversation(conversation.id, message.trim(), pendingFile ?? undefined);
      } else {
        updated = await sendToExpert(expertId, subject.trim(), message.trim(), pendingFile ?? undefined);
      }
      setConversation(updated);
      setMessage('');
      setSubject('');
      setPendingFile(null);
    } catch {
      setError("Échec de l'envoi du message.");
    } finally {
      setSending(false);
    }
  }
  function handleFilePick(file: File | null) {
    if (!file) return;
    setPendingFile(file);
  }
  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recordedChunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) recordedChunksRef.current.push(e.data); };
      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
        const file = new File([blob], `vocal-${Date.now()}.webm`, { type: 'audio/webm' });
        setPendingFile(file);
        stream.getTracks().forEach((t) => t.stop());
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch {
      setError("Impossible d'accéder au microphone.");
    }
  }
  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setRecording(false);
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
    <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col" style={{ maxHeight: '640px' }}>
      <div className="px-5 py-3 border-b border-navy/10 flex items-center justify-between gap-2 shrink-0">
        <div
          onClick={() => navigate(`/profil/${expertId}`)}
          className="flex items-center gap-2.5 min-w-0 cursor-pointer group"
        >
          <div className="h-8 w-8 rounded-full bg-navy/10 overflow-hidden shrink-0">
            {conversation?.otherUser.photoProfilPath ? (
              <img src={fileUrl(conversation.otherUser.photoProfilPath)} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full grid place-items-center text-navy/30"><UserIcon size={14} /></div>
            )}
          </div>
          <h2 className="text-sm font-bold text-navy truncate group-hover:text-teal transition-colors">
            {conversation?.otherUser ? `${conversation.otherUser.prenom} ${conversation.otherUser.nom}` : "Contacter l'expert"}
          </h2>
        </div>
        {conversation?.status && (
          <span className="shrink-0 text-[11px] font-semibold text-navy/50 bg-navy/5 rounded-full px-2.5 py-1">
            {STATUS_LABELS[conversation.status] || conversation.status}
          </span>
        )}
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3" style={{ minHeight: '260px' }}>
        {!hasStarted ? (
          <p className="text-sm text-navy/40 italic m-auto text-center">
            Posez votre question, l'expert vous répondra ici.
          </p>
        ) : (
          conversation!.messages.map((m: ExpertMessageItem) => (
            <div key={m.id} className={`flex ${m.mine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${
                  m.mine ? 'bg-teal text-white rounded-br-sm' : 'bg-navy/5 text-navy rounded-bl-sm'
                }`}
              >
                {m.content && <p className="whitespace-pre-line">{m.content}</p>}
                {m.attachmentPath && <AttachmentPreview path={m.attachmentPath} />}
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
      {pendingFile && (
        <div className="px-5 pb-1 flex items-center gap-2">
          <span className="flex-1 truncate text-xs text-navy/60 bg-navy/5 rounded-full px-3 py-1">{pendingFile.name}</span>
          <button onClick={() => setPendingFile(null)} className="text-navy/40 hover:text-red-500 transition-colors">
            <X size={14} />
          </button>
        </div>
      )}
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
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf,video/mp4,video/webm,video/ogg"
            className="hidden"
            onChange={(e) => handleFilePick(e.target.files?.[0] ?? null)}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="shrink-0 grid place-items-center h-9 w-9 rounded-full text-navy/50 hover:bg-navy/5 transition-colors"
            title="Joindre un fichier"
          >
            <Paperclip size={17} />
          </button>
          <button
            onClick={recording ? stopRecording : startRecording}
            className={`shrink-0 grid place-items-center h-9 w-9 rounded-full transition-colors ${
              recording ? 'bg-red-500 text-white animate-pulse' : 'text-navy/50 hover:bg-navy/5'
            }`}
            title={recording ? 'Arrêter l\'enregistrement' : 'Message vocal'}
          >
            {recording ? <Square size={15} /> : <Mic size={17} />}
          </button>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !sending) handleSend(); }}
            placeholder="Écrire un message..."
            className="flex-1 rounded-full border border-navy/15 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
          />
          <button
            onClick={handleSend}
            disabled={sending || (!message.trim() && !pendingFile)}
            className="shrink-0 grid place-items-center h-9 w-9 rounded-full bg-teal text-white hover:bg-teal/90 disabled:opacity-50 transition-colors"
          >
            {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
          </button>
        </div>
      </div>
    </div>
  );
}