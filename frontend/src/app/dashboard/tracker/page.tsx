'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Building2, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Company {
  name: string; logo: string; difficulty: string; domains: string[]; rounds: string[];
}
interface Progress {
  resumeScore: number; solvedRate: number; avgInterviewScore: number;
  interviewsCompleted: number; acceptedSubmissions: number; totalSubmissions: number;
  resumeAnalyzed: boolean; placementStatus: string;
}

const difficultyColor: Record<string, string> = { 'Very High': '#ef4444', 'High': '#f59e0b', 'Medium': '#10b981' };
const statusOptions = [
  { value: 'not_started', label: 'Not Started', color: '#6b7280' },
  { value: 'preparing', label: 'Preparing', color: '#f59e0b' },
  { value: 'applied', label: 'Applied', color: '#3b82f6' },
  { value: 'interviewing', label: 'Interviewing', color: '#8b5cf6' },
  { value: 'placed', label: '🎉 Placed!', color: '#10b981' },
];

export default function TrackerPage() {
  const { user, updateUser } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [status, setStatus] = useState(user?.placementStatus || 'not_started');

  useEffect(() => {
    api.get('/tracker/companies').then(r => setCompanies(r.data.companies)).catch(() => {});
    api.get('/tracker/progress').then(r => setProgress(r.data.progress)).catch(() => {});
  }, []);

  const updateStatus = async (s: string) => {
    try {
      await api.put('/tracker/status', { placementStatus: s });
      setStatus(s);
      updateUser({ placementStatus: s });
      toast.success('Status updated!');
    } catch { toast.error('Failed to update status'); }
  };

  const currentStatus = statusOptions.find(s => s.value === status);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Placement Tracker</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Track your progress and company-wise preparation</p>
      </div>

      {/* Status Selector */}
      <div className="glass-card rounded-2xl p-5">
        <h2 className="font-semibold mb-4 text-sm">Your Placement Status</h2>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map(s => (
            <button key={s.value} onClick={() => updateStatus(s.value)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                background: status === s.value ? `${s.color}20` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${status === s.value ? s.color : 'var(--border)'}`,
                color: status === s.value ? s.color : 'var(--text-secondary)',
              }}>
              {s.label}
            </button>
          ))}
        </div>
        {currentStatus && (
          <div className="mt-3 flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4" style={{ color: currentStatus.color }} />
            <span style={{ color: currentStatus.color }}>Current: {currentStatus.label}</span>
          </div>
        )}
      </div>

      {/* Progress Overview */}
      {progress && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Resume Analyzed', value: progress.resumeAnalyzed ? '✅ Done' : '❌ Pending', score: progress.resumeScore },
            { label: 'Problems Solved', value: `${progress.acceptedSubmissions} / ${progress.totalSubmissions}`, score: progress.solvedRate },
            { label: 'Interviews Done', value: progress.interviewsCompleted, score: Math.min(progress.interviewsCompleted * 20, 100) },
            { label: 'Avg Interview Score', value: `${Math.round(progress.avgInterviewScore)}%`, score: progress.avgInterviewScore },
          ].map(item => (
            <div key={item.label} className="glass-card rounded-xl p-4">
              <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{item.label}</p>
              <p className="font-bold text-lg">{item.value}</p>
              <div className="h-1.5 rounded-full mt-2" style={{ background: 'var(--border)' }}>
                <div className="h-1.5 rounded-full" style={{ width: `${item.score}%`, background: 'var(--gradient-primary)' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Company-wise Tracker */}
      <div>
        <h2 className="font-semibold mb-4 flex items-center gap-2"><Building2 className="w-4 h-4 text-purple-400" /> Company-Wise Preparation</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {companies.map(company => (
            <motion.div key={company.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-xl p-4 group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{company.logo}</div>
                  <div>
                    <h3 className="font-semibold">{company.name}</h3>
                    <span className="text-xs" style={{ color: difficultyColor[company.difficulty] || '#6b7280' }}>
                      {company.difficulty} Difficulty
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" style={{ color: 'var(--text-muted)' }} />
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {company.domains.map(d => <span key={d} className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(124,58,237,0.1)', color: '#a855f7' }}>{d}</span>)}
              </div>
              <div>
                <p className="text-xs font-medium mb-1.5 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}><Clock className="w-3 h-3" /> Interview Rounds</p>
                <div className="flex flex-wrap gap-1.5">
                  {company.rounds.map(r => <span key={r} className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>{r}</span>)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
