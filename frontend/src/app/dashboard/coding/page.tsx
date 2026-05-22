'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code2, Play, CheckCircle, XCircle, Clock, Building2, Tag } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Problem {
  id: string; title: string; difficulty: string; category: string;
  description: string; examples: { input: string; output: string }[];
  constraints: string[]; starterCode: Record<string, string>;
  tags: string[]; companies: string[];
}
interface Result { status: string; output?: string; feedback?: string; score?: number; passedTests?: number; totalTests?: number; timeComplexity?: string; spaceComplexity?: string; }

const diffColor: Record<string, string> = { Easy: '#10b981', Medium: '#f59e0b', Hard: '#ef4444' };
const langs = [{ id: 'python', label: 'Python' }, { id: 'javascript', label: 'JavaScript' }, { id: 'java', label: 'Java' }];

export default function CodingPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selected, setSelected] = useState<Problem | null>(null);
  const [lang, setLang] = useState('python');
  const [code, setCode] = useState('');
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => { api.get('/coding/problems').then(r => setProblems(r.data.problems)).catch(() => toast.error('Could not load problems')); }, []);

  const selectProblem = async (p: Problem) => {
    const { data } = await api.get(`/coding/problems/${p.id}`);
    setSelected(data.problem);
    setCode(data.problem.starterCode?.[lang] || '');
    setResult(null);
  };

  const run = async () => {
    if (!code.trim()) return toast.error('Please write some code first');
    setRunning(true);
    try {
      const { data } = await api.post('/coding/run', { code, language: lang, problemId: selected?.id });
      setResult(data);
    } catch { toast.error('Failed to run code'); }
    finally { setRunning(false); }
  };

  const submit = async () => {
    if (!code.trim()) return toast.error('Please write some code first');
    setSubmitting(true);
    try {
      const { data } = await api.post('/coding/submit', { code, language: lang, problemId: selected?.id });
      setResult(data);
      if (data.status === 'accepted') toast.success('🎉 Accepted! Great job!');
      else toast.error('Wrong answer. Keep trying!');
    } catch { toast.error('Failed to submit'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Coding Arena</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Solve problems and get AI-powered feedback</p>
      </div>

      <div className="grid lg:grid-cols-[320px_1fr] gap-4 min-h-[600px]">
        {/* Problem List */}
        <div className="glass-card rounded-xl overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <p className="text-sm font-semibold">Problems ({problems.length})</p>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {problems.map(p => (
              <button key={p.id} onClick={() => selectProblem(p)}
                className="w-full text-left px-4 py-3 border-b transition-colors hover:bg-white/5"
                style={{ borderColor: 'var(--border)', background: selected?.id === p.id ? 'rgba(124,58,237,0.1)' : 'transparent' }}>
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-sm font-medium truncate">{p.title}</p>
                  <span className="text-xs font-medium ml-2 flex-shrink-0" style={{ color: diffColor[p.difficulty] }}>{p.difficulty}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{p.category}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Editor Area */}
        {selected ? (
          <div className="flex flex-col gap-3">
            {/* Problem Statement */}
            <div className="glass-card rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="font-bold text-lg">{selected.title}</h2>
                <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ background: `${diffColor[selected.difficulty]}20`, color: diffColor[selected.difficulty] }}>{selected.difficulty}</span>
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>{selected.description}</p>
              {selected.examples?.map((ex, i) => (
                <div key={i} className="mb-2 p-3 rounded-lg text-sm" style={{ background: 'rgba(255,255,255,0.03)', fontFamily: 'JetBrains Mono, monospace' }}>
                  <p style={{ color: 'var(--text-muted)' }}>Input: <span style={{ color: '#60a5fa' }}>{ex.input}</span></p>
                  <p style={{ color: 'var(--text-muted)' }}>Output: <span style={{ color: '#10b981' }}>{ex.output}</span></p>
                </div>
              ))}
              <div className="flex flex-wrap gap-2 mt-3">
                {selected.companies?.map(c => (
                  <span key={c} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                    <Building2 className="w-3 h-3" />{c}
                  </span>
                ))}
                {selected.tags?.map(t => (
                  <span key={t} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(124,58,237,0.1)', color: '#a855f7' }}>
                    <Tag className="w-3 h-3" />{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Code Editor */}
            <div className="glass-card rounded-xl overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: 'var(--border)' }}>
                <div className="flex gap-1">
                  {langs.map(l => (
                    <button key={l.id} onClick={() => { setLang(l.id); setCode(selected.starterCode?.[l.id] || ''); }}
                      className="px-3 py-1 rounded text-xs font-medium transition-all"
                      style={{ background: lang === l.id ? 'rgba(124,58,237,0.2)' : 'transparent', color: lang === l.id ? '#a855f7' : 'var(--text-muted)' }}>
                      {l.label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={run} disabled={running} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                    style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}>
                    {running ? <div className="w-3 h-3 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin" /> : <Play className="w-3 h-3" />}
                    Run
                  </button>
                  <button onClick={submit} disabled={submitting} className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5">
                    {submitting ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                    Submit
                  </button>
                </div>
              </div>
              <textarea value={code} onChange={e => setCode(e.target.value)}
                className="flex-1 w-full p-4 text-sm outline-none resize-none"
                style={{ background: '#0d0d1a', color: '#e2e8f0', fontFamily: 'JetBrains Mono, monospace', minHeight: '260px' }} />
            </div>

            {/* Result */}
            {result && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  {result.status === 'accepted' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                  <span className="font-semibold text-sm capitalize" style={{ color: result.status === 'accepted' ? '#10b981' : '#ef4444' }}>
                    {result.status?.replace('_', ' ')}
                  </span>
                  {result.passedTests !== undefined && (
                    <span className="text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>{result.passedTests}/{result.totalTests} tests passed</span>
                  )}
                  {result.timeComplexity && (
                    <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}><Clock className="w-3 h-3" />{result.timeComplexity}</span>
                  )}
                </div>
                {result.feedback && <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{result.feedback}</p>}
                {result.output && <pre className="mt-2 p-2 rounded text-xs overflow-auto" style={{ background: 'rgba(255,255,255,0.03)', fontFamily: 'monospace' }}>{result.output}</pre>}
              </motion.div>
            )}
          </div>
        ) : (
          <div className="glass-card rounded-xl flex items-center justify-center">
            <div className="text-center">
              <Code2 className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
              <p className="font-medium">Select a problem to start coding</p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Choose from the list on the left</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
