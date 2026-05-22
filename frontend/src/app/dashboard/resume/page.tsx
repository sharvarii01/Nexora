'use client';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Upload, CheckCircle, AlertCircle, TrendingUp, Target, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Analysis {
  overallScore: number; atsScore: number; summary: string;
  strengths: string[]; weaknesses: string[];
  skills: { technical: string[]; soft: string[]; missing: string[] };
  sections: Record<string, { score: number; feedback: string }>;
  improvements: { priority: string; category: string; suggestion: string }[];
  keywords: string[];
}

const scoreColor = (s: number) => s >= 80 ? '#10b981' : s >= 60 ? '#f59e0b' : '#ef4444';
const priorityColor: Record<string, string> = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' };

export default function ResumePage() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [targetRole, setTargetRole] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [expanded, setExpanded] = useState<string | null>('improvements');

  const onDrop = useCallback((files: File[]) => {
    if (files[0]) setFile(files[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1, maxSize: 10 * 1024 * 1024,
  });

  const analyze = async () => {
    if (!file) return toast.error('Please upload your resume PDF');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      if (targetRole) formData.append('targetRole', targetRole);
      const { data } = await api.post('/resume/analyze', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setAnalysis(data.analysis);
      toast.success('Resume analyzed successfully!');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Analysis failed. Make sure the backend is running with a valid Gemini API key.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const toggle = (key: string) => setExpanded(e => e === key ? null : key);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Resume Analyzer</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Get AI-powered insights, ATS score, and actionable improvements</p>
      </div>

      {/* Upload Section */}
      <div className="glass-card rounded-2xl p-6">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Target Role (optional)</label>
            <input value={targetRole} onChange={e => setTargetRole(e.target.value)} placeholder="e.g. Software Engineer, Data Scientist"
              className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              onFocus={e => (e.target.style.borderColor = '#7c3aed')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
          </div>
        </div>
        <div {...getRootProps()} className="rounded-xl p-8 text-center cursor-pointer transition-all"
          style={{ border: `2px dashed ${isDragActive ? '#7c3aed' : 'var(--border)'}`, background: isDragActive ? 'rgba(124,58,237,0.08)' : 'rgba(255,255,255,0.02)' }}>
          <input {...getInputProps()} id="resume-upload" />
          <Upload className="w-8 h-8 mx-auto mb-3" style={{ color: file ? '#10b981' : 'var(--text-muted)' }} />
          {file ? (
            <div>
              <p className="font-medium text-sm">{file.name}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          ) : (
            <div>
              <p className="font-medium text-sm">{isDragActive ? 'Drop your PDF here!' : 'Drag & drop your resume PDF'}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>or click to browse (max 10MB)</p>
            </div>
          )}
        </div>
        <button id="analyze-btn" onClick={analyze} disabled={loading || !file} className="btn-primary w-full mt-4 py-3 flex items-center justify-center gap-2">
          {loading ? (<><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing with Gemini AI...</>) : (<><Zap className="w-4 h-4" /> Analyze Resume</>)}
        </button>
      </div>

      {/* Results */}
      <AnimatePresence>
        {analysis && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Score Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Overall Score', value: analysis.overallScore },
                { label: 'ATS Score', value: analysis.atsScore },
                { label: 'Experience', value: analysis.sections?.experience?.score || 0 },
                { label: 'Projects', value: analysis.sections?.projects?.score || 0 },
              ].map(s => (
                <div key={s.label} className="glass-card rounded-xl p-4 text-center">
                  <div className="text-3xl font-black mb-1" style={{ color: scoreColor(s.value) }}>{s.value}</div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
                  <div className="h-1.5 rounded-full mt-2" style={{ background: 'var(--border)' }}>
                    <div className="h-1.5 rounded-full transition-all" style={{ width: `${s.value}%`, background: scoreColor(s.value) }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="glass-card rounded-xl p-5">
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{analysis.summary}</p>
            </div>

            {/* Skills */}
            <div className="glass-card rounded-xl p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><Target className="w-4 h-4 text-purple-400" /> Skills Analysis</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs font-medium mb-2" style={{ color: '#10b981' }}>✅ Technical Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.skills?.technical?.map(s => <span key={s} className="px-2 py-0.5 rounded text-xs" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>{s}</span>)}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium mb-2" style={{ color: '#60a5fa' }}>💡 Soft Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.skills?.soft?.map(s => <span key={s} className="px-2 py-0.5 rounded text-xs" style={{ background: 'rgba(96,165,250,0.1)', color: '#60a5fa' }}>{s}</span>)}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium mb-2" style={{ color: '#f59e0b' }}>⚠️ Missing Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.skills?.missing?.map(s => <span key={s} className="px-2 py-0.5 rounded text-xs" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>{s}</span>)}
                  </div>
                </div>
              </div>
            </div>

            {/* Improvements */}
            <div className="glass-card rounded-xl overflow-hidden">
              <button onClick={() => toggle('improvements')} className="w-full flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  <span className="font-semibold">Improvement Suggestions ({analysis.improvements?.length})</span>
                </div>
                {expanded === 'improvements' ? <ChevronUp className="w-4 h-4" style={{ color: 'var(--text-muted)' }} /> : <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />}
              </button>
              {expanded === 'improvements' && (
                <div className="px-5 pb-5 space-y-3">
                  {analysis.improvements?.map((item, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <span className="px-2 py-0.5 rounded text-xs font-medium h-fit mt-0.5 flex-shrink-0"
                        style={{ background: `${priorityColor[item.priority]}20`, color: priorityColor[item.priority] }}>
                        {item.priority}
                      </span>
                      <div>
                        <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--text-secondary)' }}>{item.category}</p>
                        <p className="text-sm">{item.suggestion}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="glass-card rounded-xl p-5">
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-green-400" /> Strengths</h3>
                <ul className="space-y-2">
                  {analysis.strengths?.map((s, i) => <li key={i} className="text-sm flex gap-2"><span style={{ color: '#10b981' }}>•</span>{s}</li>)}
                </ul>
              </div>
              <div className="glass-card rounded-xl p-5">
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm"><AlertCircle className="w-4 h-4 text-red-400" /> Areas to Improve</h3>
                <ul className="space-y-2">
                  {analysis.weaknesses?.map((w, i) => <li key={i} className="text-sm flex gap-2"><span style={{ color: '#ef4444' }}>•</span>{w}</li>)}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
