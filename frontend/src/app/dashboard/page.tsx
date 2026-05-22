'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { FileText, Brain, Code2, Trophy, TrendingUp, Zap, Target, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

interface Progress {
  resumeAnalyzed: boolean; resumeScore: number;
  totalSubmissions: number; acceptedSubmissions: number; solvedRate: number;
  interviewsCompleted: number; avgInterviewScore: number;
  points: number; streak: number; placementStatus: string;
}

interface Activity {
  id: string; type: 'coding' | 'interview'; title: string;
  status: string; score: number; date: string;
}

const statusColors: Record<string, string> = {
  not_started: '#6b7280', preparing: '#f59e0b', applied: '#3b82f6',
  interviewing: '#8b5cf6', placed: '#10b981',
};
const statusLabels: Record<string, string> = {
  not_started: 'Not Started', preparing: 'Preparing', applied: 'Applied',
  interviewing: 'Interviewing', placed: '🎉 Placed!',
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    api.get('/tracker/progress').then(r => setProgress(r.data.progress)).catch(() => {});
    api.get('/tracker/activity').then(r => setActivities(r.data.activity)).catch(() => {});
  }, []);

  const quickActions = [
    { href: '/dashboard/resume', icon: FileText, label: 'Analyze Resume', color: 'from-purple-500 to-violet-600', desc: 'Get AI feedback on your resume' },
    { href: '/dashboard/interview', icon: Brain, label: 'Start Interview', color: 'from-blue-500 to-cyan-600', desc: 'Practice with AI mock interviewer' },
    { href: '/dashboard/coding', icon: Code2, label: 'Solve Problems', color: 'from-green-500 to-emerald-600', desc: 'Tackle coding challenges' },
    { href: '/dashboard/roadmap', icon: Target, label: 'View Roadmap', color: 'from-orange-500 to-amber-600', desc: 'Your personalized prep plan' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              {user?.targetRole ? `Targeting: ${user.targetRole}` : 'Set your target role to get started'}
            </p>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ background: `${statusColors[user?.placementStatus || 'not_started']}20`, color: statusColors[user?.placementStatus || 'not_started'], border: `1px solid ${statusColors[user?.placementStatus || 'not_started']}40` }}>
              {statusLabels[user?.placementStatus || 'not_started']}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      {progress && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Points', value: progress.points, icon: Star, color: '#f59e0b' },
            { label: 'Problems Solved', value: `${progress.acceptedSubmissions}/${progress.totalSubmissions}`, icon: Code2, color: '#10b981' },
            { label: 'Interviews Done', value: progress.interviewsCompleted, icon: Brain, color: '#8b5cf6' },
            { label: 'Resume Score', value: progress.resumeAnalyzed ? `${progress.resumeScore}%` : 'N/A', icon: FileText, color: '#2563eb' },
          ].map(stat => (
            <div key={stat.label} className="glass-card rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </motion.div>
      )}

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-6">
          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <Link key={action.href} href={action.href}>
                  <div className="glass-card rounded-xl p-4 h-full group cursor-pointer hover:scale-[1.02] transition-transform">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br ${action.color}`}>
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="font-semibold text-sm mb-1">{action.label}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{action.desc}</p>
                    <ArrowRight className="w-3.5 h-3.5 mt-3 group-hover:translate-x-1 transition-transform" style={{ color: '#a855f7' }} />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Progress Overview */}
          {progress && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <TrendingUp className="w-4 h-4" style={{ color: '#a855f7' }} />
                <h2 className="font-semibold">Preparation Progress</h2>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Resume Optimization', value: progress.resumeScore, color: '#8b5cf6' },
                  { label: 'Coding Proficiency', value: progress.solvedRate, color: '#10b981' },
                  { label: 'Interview Performance', value: Math.round(progress.avgInterviewScore), color: '#2563eb' },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                    <div className="h-2 rounded-full" style={{ background: 'var(--border)' }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${item.value}%` }} transition={{ duration: 1, delay: 0.5 }}
                        className="h-2 rounded-full" style={{ background: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar: Activity History */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
          className="space-y-4">
          <h2 className="text-base font-semibold px-1" style={{ color: 'var(--text-secondary)' }}>Recent Activity</h2>
          <div className="glass-card rounded-2xl p-4 max-h-[500px] overflow-y-auto scrollbar-thin">
            {activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((act, i) => (
                  <div key={act.id} className="relative pl-6 border-l-2 py-1" style={{ borderColor: 'var(--border)' }}>
                    <div className="absolute left-[-5px] top-2 w-2 h-2 rounded-full" 
                      style={{ background: act.type === 'coding' ? '#10b981' : '#8b5cf6' }} />
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold tracking-wider" 
                        style={{ color: act.type === 'coding' ? '#10b981' : '#8b5cf6' }}>
                        {act.type}
                      </span>
                      <p className="text-xs font-semibold mt-0.5">{act.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] px-1.5 py-0.5 rounded uppercase" 
                          style={{ 
                            background: act.status === 'accepted' || act.status === 'completed' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                            color: act.status === 'accepted' || act.status === 'completed' ? '#10b981' : '#ef4444' 
                          }}>
                          {act.status}
                        </span>
                        {act.score !== undefined && (
                          <span className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>
                            Score: {act.score}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] mt-1.5" style={{ color: 'var(--text-muted)' }}>
                        {new Date(act.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No recent activity found</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Empty state if no progress */}
      {!progress && activities.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-8 text-center">
          <Zap className="w-10 h-10 mx-auto mb-3" style={{ color: '#7c3aed' }} />
          <h3 className="font-semibold mb-2">Let&apos;s get started!</h3>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Upload your resume or start a mock interview to begin tracking your progress.</p>
          <Link href="/dashboard/resume">
            <button className="btn-primary">Analyze Resume</button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
