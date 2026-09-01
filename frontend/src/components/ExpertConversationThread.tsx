import { useEffect, useRef, useState } from 'react';
import { Loader2, Send, User as UserIcon, Paperclip, Mic, Square, FileText, X } from 'lucide-react';
import { getConversationById, replyToConversation, updateConversationStatus } from '../services/expertConversationService';
import type { ConversationStatus, ExpertConversationDetail } from '../types/expertConversation';
const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/api\/?$/, '');
function fileUrl(path?: string) {
  if (!path) return '';
  return path.startsWith('http') ? path : `${API_ORIGIN}${path}`;
}
function AttachmentPreview({ path }: { path: string }) {
  const url = fileUrl(path);
  const ext = path.split('.').pop()?.toLowerCase();
  if (ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'webp' || ext === 'gif') {
    return <img src={url} alt="Pièce jointe" className="mt-1.5 max-w-full rounded-lg max-h-56 object-cover" />;
  }
  if (ext === 'mp4') {
    return <video src={url} controls className="mt-1.5 max-w-full rounded-lg max-h-64" />;
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
const STATUS_OPTIONS: { value: ConversationStatus; label: string }[] = [
  { value: 'OUVERTE', label: 'Ouverte' },
  { value: 'EN_COURS', label: 'En cours' },
  { value: 'RESOLUE', label: 'Résolue' },
];
export default function ExpertConversationThread({ conversationId, onStatusChanged }: { conversationId: number; onStatusChanged?: () => void }) {
  const [conversation, setConversation] = useState<ExpertConversationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
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
    if (!message.trim() && !pendingFile) return;
    setSending(true);
    setError(null);
    try {
      const updated = await replyToConversation(conversationId, message.trim(), pendingFile ?? undefined);
      setConversation(updated);
      setMessage('');
      setPendingFile(null);
      onStatusChanged?.();
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
    return <div className="bg-white rounded-xl shadow-sm p-6 grid place-items-center"><Loader2 className="animate-spin text-navy/40" size={22} /></div>;
  }
  if (!conversation) {
    return <p className="text-sm text-red-600">{error ?? 'Conversation introuvable.'}</p>;
  }
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col" style={{ maxHeight: '700px' }}>
      <div className="px-5 py-3 border-b border-navy/10 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-9 w-9 rounded-full bg-navy/10 overflow-hidden shrink-0">
            {conversation.otherUser.photoProfilPath ? (
              <img src={fileUrl(conversation.otherUser.photoProfilPath)} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full grid place-items-center text-navy/30"><UserIcon size={14} /></div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-navy truncate">{conversation.otherUser.prenom} {conversation.otherUser.nom}</p>
            <p className="text-xs text-navy/50 truncate">{conversation.subject}</p>
          </div>
        </div>
        <select
          value={conversation.status ?? 'OUVERTE'}
          onChange={(e) => handleStatusChange(e.target.value as ConversationStatus)}
          disabled={updatingStatus}
          className="shrink-0 rounded-full border border-navy/15 bg-white px-3 py-1.5 text-xs font-semibold text-navy focus:outline-none focus:ring-2 focus:ring-teal/40"
        >
          {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3" style={{ minHeight: '280px' }}>
        {conversation.messages.map((m) => (
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
        ))}
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
      <div className="border-t border-navy/10 p-3 shrink-0 flex items-center gap-2">
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
          title={recording ? "Arrêter l'enregistrement" : 'Message vocal'}
        >
          {recording ? <Square size={15} /> : <Mic size={17} />}
        </button>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !sending) handleSend(); }}
          placeholder="Répondre..."
          className="flex-1 rounded-full border border-navy/15 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40"
        />
        <button
          onClick={handleSend}
          disabled={sending || (!message.trim() && !pendingFile)}
          className="shrink-0 grid place-items-center h-9 w-9 rounded-full bg-teal text-white hover:bg-teal/80 disabled:opacity-50 transition-colors"
        >
          {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
        </button>
      </div>
    </div>
  );
}