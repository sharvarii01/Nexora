'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Send, StopCircle, Play, User, Bot, Star, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Message { role: 'user' | 'model'; content: string; }
interface Feedback { score: number; grade: string; summary: string; strengths: string[]; improvements: string[]; communication: number; technical: number; confidence: number; nextSteps: string[]; }

const interviewTypes = [
  { value: 'technical', label: '🔧 Technical', desc: 'DSA, system design, coding' },
  { value: 'behavioral', label: '🧠 Behavioral', desc: 'STAR method, past experience' },
  { value: 'hr', label: '👔 HR Round', desc: 'Culture fit, career goals' },
  { value: 'mixed', label: '⚡ Mixed', desc: 'All types combined' },
];

export default function InterviewPage() {
  const { user } = useAuth();
  const [phase, setPhase] = useState<'setup' | 'active' | 'feedback'>('setup');
  const [targetRole, setTargetRole] = useState(user?.targetRole || '');
  const [targetCompany, setTargetCompany] = useState('');
  const [type, setType] = useState('mixed');
  const [sessionId, setSessionId] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const speak = (text: string) => {
    if (!isVoiceMode || typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).webkitSpeechRecognition) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        setInput(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return toast.error('Speech recognition not supported in this browser');
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      window.speechSynthesis.cancel();
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const start = async () => {
    if (!targetRole) return toast.error('Please enter a target role');
    setLoading(true);
    try {
      const { data } = await api.post('/interview/start', { targetRole, targetCompany, type });
      setSessionId(data.sessionId);
      setMessages([{ role: 'model', content: data.message }]);
      setPhase('active');
      if (isVoiceMode) speak(data.message);
    } catch { toast.error('Failed to start interview. Is the backend running?'); }
    finally { setLoading(false); }
  };

  const send = async () => {
    const userMsg = input.trim();
    if (!userMsg || loading) return;
    setInput('');
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    setMessages(m => [...m, { role: 'user', content: userMsg }]);
    setLoading(true);
    try {
      const { data } = await api.post('/interview/message', { sessionId, message: userMsg });
      setMessages(m => [...m, { role: 'model', content: data.message }]);
      if (isVoiceMode) speak(data.message);
    } catch { toast.error('Failed to get AI response'); }
    finally { setLoading(false); }
  };

  const end = async () => {
    window.speechSynthesis.cancel();
    setLoading(true);
    try {
      const { data } = await api.post('/interview/end', { sessionId });
      setFeedback(data.feedback);
      setPhase('feedback');
    } catch { toast.error('Failed to generate feedback'); }
    finally { setLoading(false); }
  };

  const scoreColor = (s: number) => s >= 80 ? '#10b981' : s >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Mock Interview</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Practice interviews with a real-time AI interviewer</p>
      </div>

      {/* Setup */}
      {phase === 'setup' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6 max-w-2xl">
          <h2 className="font-semibold mb-5">Configure Your Interview</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Target Role *</label>
              <input value={targetRole} onChange={e => setTargetRole(e.target.value)} placeholder="e.g. Software Engineer, Data Analyst"
                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                onFocus={e => (e.target.style.borderColor = '#7c3aed')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Target Company (optional)</label>
              <input value={targetCompany} onChange={e => setTargetCompany(e.target.value)} placeholder="e.g. Google, Amazon, Infosys"
                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                onFocus={e => (e.target.style.borderColor = '#7c3aed')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Interview Type</label>
              <div className="grid grid-cols-2 gap-2">
                {interviewTypes.map(t => (
                  <button key={t.value} onClick={() => setType(t.value)}
                    className="p-3 rounded-lg text-left transition-all"
                    style={{ background: type === t.value ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${type === t.value ? '#7c3aed' : 'var(--border)'}` }}>
                    <p className="text-sm font-medium">{t.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-4" style={{ color: 'var(--text-secondary)' }}>Interview Preferences</label>
              <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isVoiceMode ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {isVoiceMode ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">Voice Interview</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>AI will speak and listen to your answers</p>
                  </div>
                </div>
                <button onClick={() => setIsVoiceMode(!isVoiceMode)} className={`w-12 h-6 rounded-full transition-colors relative`}
                  style={{ background: isVoiceMode ? '#7c3aed' : 'rgba(255,255,255,0.1)' }}>
                  <motion.div animate={{ x: isVoiceMode ? 26 : 4 }} className="w-4 h-4 bg-white rounded-full absolute top-1" />
                </button>
              </div>
            </div>
            <button id="start-interview" onClick={start} disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Starting...</> : <><Play className="w-4 h-4" /> Start Interview</>}
            </button>
          </div>
        </motion.div>
      )}

      {/* Active Interview */}
      {phase === 'active' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-[calc(100vh-220px)] max-h-[700px] glass-card rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm font-medium">Interview in Progress — {type} | {targetRole}</span>
            </div>
            <button onClick={end} disabled={loading} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>
              <StopCircle className="w-3.5 h-3.5" /> End & Get Feedback
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin relative">
            {isVoiceMode && (
              <div className="absolute top-4 right-4 z-10">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${isSpeaking ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-gray-500/10 text-gray-500 border border-transparent'}`}>
                  {isSpeaking ? (
                    <>
                      <span className="flex gap-0.5">
                        {[0, 1, 2].map(i => <motion.span key={i} animate={{ height: [4, 10, 4] }} transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }} className="w-0.5 bg-purple-400 rounded-full" />)}
                      </span>
                      AI Speaking
                    </>
                  ) : 'Interviewer Idle'}
                </div>
              </div>
            )}
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center"
                    style={{ background: msg.role === 'model' ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.1)' }}>
                    {msg.role === 'model' ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />}
                  </div>
                  <div className="max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                    style={{
                      background: msg.role === 'model' ? 'rgba(124,58,237,0.12)' : 'rgba(255,255,255,0.06)',
                      borderBottomLeftRadius: msg.role === 'model' ? '4px' : '16px',
                      borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
                    }}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="flex items-center gap-1 px-4 py-3 rounded-2xl" style={{ background: 'rgba(124,58,237,0.12)' }}>
                  {[0, 1, 2].map(i => <span key={i} className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="p-4 border-t flex gap-3" style={{ borderColor: 'var(--border)' }}>
            {isVoiceMode && (
              <button onClick={toggleListening} className={`p-2.5 rounded-lg transition-all ${isListening ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20'}`}>
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            )}
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder={isListening ? "Listening..." : "Type or speak your answer..."} className="flex-1 px-4 py-2.5 rounded-lg text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            <button id="send-msg" onClick={send} disabled={loading || !input.trim()} className="btn-primary px-4 py-2.5">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Feedback */}
      {phase === 'feedback' && feedback && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="text-5xl font-black mb-1" style={{ color: scoreColor(feedback.score) }}>{feedback.score}</div>
            <div className="text-xl font-bold mb-2">Grade: {feedback.grade}</div>
            <p className="text-sm max-w-lg mx-auto" style={{ color: 'var(--text-secondary)' }}>{feedback.summary}</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[{ label: 'Communication', value: feedback.communication }, { label: 'Technical', value: feedback.technical }, { label: 'Confidence', value: feedback.confidence }].map(s => (
              <div key={s.label} className="glass-card rounded-xl p-4 text-center">
                <div className="text-2xl font-bold mb-1" style={{ color: scoreColor(s.value) }}>{s.value}%</div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="glass-card rounded-xl p-5">
              <h3 className="font-semibold mb-3 text-sm flex items-center gap-2"><Star className="w-4 h-4 text-green-400" /> Strengths</h3>
              <ul className="space-y-1.5">{feedback.strengths?.map((s, i) => <li key={i} className="text-sm flex gap-2"><span style={{ color: '#10b981' }}>✓</span>{s}</li>)}</ul>
            </div>
            <div className="glass-card rounded-xl p-5">
              <h3 className="font-semibold mb-3 text-sm flex items-center gap-2"><Brain className="w-4 h-4 text-blue-400" /> Next Steps</h3>
              <ul className="space-y-1.5">{feedback.nextSteps?.map((s, i) => <li key={i} className="text-sm flex gap-2"><span style={{ color: '#60a5fa' }}>→</span>{s}</li>)}</ul>
            </div>
          </div>
          <button onClick={() => { setPhase('setup'); setMessages([]); setFeedback(null); }} className="btn-secondary w-full py-3">
            Start Another Interview
          </button>
        </motion.div>
      )}
    </div>
  );
}
