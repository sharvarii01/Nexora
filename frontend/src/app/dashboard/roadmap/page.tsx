'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Zap, Calendar, BookOpen, Target, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Week {
  week: number; theme: string; goals: string[]; topics: string[];
  resources: { title: string; type: string }[];
  tasks: string[]; estimatedHours: number;
}
interface Roadmap {
  title: string; summary: string; weeks: Week[];
  milestones: { week: number; title: string; description: string }[];
  skillGaps: string[]; keyFocusAreas: string[];
}

const resourceTypeColor: Record<string, string> = {
  article: '#60a5fa', video: '#f43f5e', course: '#a855f7', practice: '#10b981',
};

export default function RoadmapPage() {
  const { user } = useAuth();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [generating, setGenerating] = useState(false);
  const [targetRole, setTargetRole] = useState(user?.targetRole || '');
  const [targetCompany, setTargetCompany] = useState('');
  const [weeks, setWeeks] = useState(12);
  const [expandedWeek, setExpandedWeek] = useState<number | null>(1);

  useEffect(() => {
    api.get('/roadmap').then(r => {
      if (r.data.roadmap?.length) {
        setRoadmap({ title: 'Your Roadmap', summary: '', weeks: r.data.roadmap, milestones: [], skillGaps: [], keyFocusAreas: [] });
      }
    }).catch(() => {});
  }, []);

  const generate = async () => {
    if (!targetRole) return toast.error('Enter a target role first');
    setGenerating(true);
    try {
      const { data } = await api.post('/roadmap/generate', { targetRole, targetCompany, timelineWeeks: weeks });
      setRoadmap(data.roadmap);
      toast.success('Your personalized roadmap is ready!');
    } catch { toast.error('Failed to generate roadmap. Is the backend running?'); }
    finally { setGenerating(false); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Placement Roadmap</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>AI-generated week-by-week preparation plan</p>
      </div>

      {/* Generator */}
      <div className="glass-card rounded-2xl p-5">
        <div className="grid md:grid-cols-3 gap-3 mb-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Target Role *</label>
            <input value={targetRole} onChange={e => setTargetRole(e.target.value)} placeholder="Software Engineer"
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              onFocus={e => (e.target.style.borderColor = '#7c3aed')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Target Company</label>
            <input value={targetCompany} onChange={e => setTargetCompany(e.target.value)} placeholder="Google, Amazon..."
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              onFocus={e => (e.target.style.borderColor = '#7c3aed')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Timeline (weeks)</label>
            <select value={weeks} onChange={e => setWeeks(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
              {[4, 8, 12, 16, 24].map(w => <option key={w} value={w}>{w} weeks</option>)}
            </select>
          </div>
        </div>
        <button id="gen-roadmap" onClick={generate} disabled={generating} className="btn-primary flex items-center gap-2">
          {generating ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating with AI...</> : <><Zap className="w-4 h-4" /> Generate Roadmap</>}
        </button>
      </div>

      {/* Roadmap Display */}
      <AnimatePresence>
        {roadmap && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {roadmap.title && roadmap.summary && (
              <div className="glass-card rounded-xl p-5">
                <h2 className="font-bold text-lg mb-1">{roadmap.title}</h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{roadmap.summary}</p>
              </div>
            )}

            {/* Focus Areas */}
            {roadmap.keyFocusAreas?.length > 0 && (
              <div className="glass-card rounded-xl p-5">
                <h3 className="font-semibold mb-3 text-sm flex items-center gap-2"><Target className="w-4 h-4 text-purple-400" /> Key Focus Areas</h3>
                <div className="flex flex-wrap gap-2">
                  {roadmap.keyFocusAreas.map(a => <span key={a} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(124,58,237,0.15)', color: '#a855f7' }}>{a}</span>)}
                </div>
              </div>
            )}

            {/* Weeks */}
            <div className="space-y-3">
              {roadmap.weeks?.map(week => (
                <motion.div key={week.week} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: week.week * 0.05 }}
                  className="glass-card rounded-xl overflow-hidden">
                  <button onClick={() => setExpandedWeek(e => e === week.week ? null : week.week)}
                    className="w-full flex items-center justify-between px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: 'var(--gradient-primary)', color: 'white' }}>
                        {week.week}
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-sm">{week.theme}</p>
                        <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                          <Clock className="w-3 h-3" /> {week.estimatedHours}h estimated
                        </p>
                      </div>
                    </div>
                    {expandedWeek === week.week ? <ChevronUp className="w-4 h-4" style={{ color: 'var(--text-muted)' }} /> : <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />}
                  </button>
                  {expandedWeek === week.week && (
                    <div className="px-5 pb-5 grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>🎯 Goals</p>
                        <ul className="space-y-1">{week.goals?.map((g, i) => <li key={i} className="text-xs flex gap-2"><span style={{ color: '#a855f7' }}>•</span>{g}</li>)}</ul>
                        <p className="text-xs font-medium mb-2 mt-4" style={{ color: 'var(--text-secondary)' }}>📚 Topics</p>
                        <div className="flex flex-wrap gap-1.5">{week.topics?.map(t => <span key={t} className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>{t}</span>)}</div>
                      </div>
                      <div>
                        <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>📋 Tasks</p>
                        <ul className="space-y-1 mb-4">{week.tasks?.map((t, i) => <li key={i} className="text-xs flex gap-2"><span style={{ color: '#10b981' }}>✓</span>{t}</li>)}</ul>
                        {week.resources?.length > 0 && (
                          <>
                            <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>🔗 Resources</p>
                            {week.resources.map((r, i) => (
                              <div key={i} className="flex items-center gap-2 mb-1">
                                <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: `${resourceTypeColor[r.type] || '#6b7280'}20`, color: resourceTypeColor[r.type] || '#6b7280' }}>{r.type}</span>
                                <span className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{r.title}</span>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Skill Gaps */}
            {roadmap.skillGaps?.length > 0 && (
              <div className="glass-card rounded-xl p-5">
                <h3 className="font-semibold mb-3 text-sm flex items-center gap-2"><BookOpen className="w-4 h-4 text-orange-400" /> Skill Gaps to Address</h3>
                <div className="flex flex-wrap gap-2">
                  {roadmap.skillGaps.map(s => <span key={s} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>{s}</span>)}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!roadmap && !generating && (
        <div className="glass-card rounded-2xl p-10 text-center">
          <Map className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <h3 className="font-semibold mb-2">No roadmap generated yet</h3>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Fill in your target role above and click Generate Roadmap to get a personalized AI prep plan.</p>
        </div>
      )}
    </div>
  );
}
