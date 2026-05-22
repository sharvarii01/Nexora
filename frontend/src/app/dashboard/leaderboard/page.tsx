'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown, Star, TrendingUp, Medal } from 'lucide-react';
import api from '@/lib/api';

interface LeaderboardEntry {
  rank: number; _id: string; name: string; avatar: string;
  points: number; streak: number; targetRole: string; college: string;
  placementStatus: string; isCurrentUser: boolean;
}

const statusColors: Record<string, string> = {
  placed: '#10b981', interviewing: '#8b5cf6', preparing: '#f59e0b', not_started: '#6b7280', applied: '#3b82f6',
};

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentUser, setCurrentUser] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/leaderboard').then(r => {
      setLeaderboard(r.data.leaderboard);
      setCurrentUser(r.data.currentUserRank);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const rankBadge = (rank: number) => {
    if (rank === 1) return <Crown className="w-4 h-4 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-4 h-4 text-gray-300" />;
    if (rank === 3) return <Medal className="w-4 h-4 text-amber-600" />;
    return <span className="text-sm font-bold" style={{ color: 'var(--text-muted)' }}>#{rank}</span>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>See how you rank against your peers</p>
      </div>

      {/* Your rank card */}
      {currentUser && (
        <div className="glass-card rounded-xl p-5" style={{ border: '1px solid rgba(124,58,237,0.4)' }}>
          <p className="text-xs font-medium mb-3" style={{ color: '#a855f7' }}>YOUR RANKING</p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ background: 'var(--gradient-primary)' }}>
              {currentUser.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-semibold">{currentUser.name}</p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{currentUser.targetRole || 'Setting up profile...'}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black gradient-text">#{currentUser.rank}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{currentUser.points} pts</p>
            </div>
          </div>
        </div>
      )}

      {/* Top 3 */}
      {leaderboard.length >= 3 && (
        <div className="grid grid-cols-3 gap-4">
          {[leaderboard[1], leaderboard[0], leaderboard[2]].map((entry, idx) => (
            entry && (
              <motion.div key={entry._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                className={`glass-card rounded-xl p-4 text-center relative ${idx === 1 ? 'ring-2 ring-yellow-400/50' : ''}`}>
                {idx === 1 && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><Crown className="w-6 h-6 text-yellow-400" /></div>}
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2 mt-2" style={{ background: 'var(--gradient-primary)', fontSize: '1.1rem' }}>
                  {entry.name?.[0]?.toUpperCase()}
                </div>
                <p className="font-semibold text-sm truncate">{entry.name}</p>
                <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{entry.targetRole || 'Student'}</p>
                <p className="font-black text-xl gradient-text">{entry.points}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>points</p>
                <p className="text-xs mt-1 font-bold" style={{ color: idx === 0 ? '#9ca3af' : idx === 1 ? '#facc15' : '#d97706' }}>
                  {idx === 1 ? '🥇 1st' : idx === 0 ? '🥈 2nd' : '🥉 3rd'}
                </p>
              </motion.div>
            )
          ))}
        </div>
      )}

      {/* Full List */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b flex items-center gap-2" style={{ borderColor: 'var(--border)' }}>
          <Trophy className="w-4 h-4 text-purple-400" />
          <span className="font-semibold text-sm">Rankings</span>
        </div>
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-6 h-6 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin mx-auto" />
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="p-8 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No rankings yet. Be the first to earn points!</p>
          </div>
        ) : (
          <div>
            {leaderboard.map((entry, idx) => (
              <motion.div key={entry._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }}
                className="flex items-center gap-4 px-5 py-3 border-b transition-colors"
                style={{ borderColor: 'var(--border)', background: entry.isCurrentUser ? 'rgba(124,58,237,0.07)' : 'transparent' }}>
                <div className="w-8 flex items-center justify-center flex-shrink-0">{rankBadge(entry.rank)}</div>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ background: entry.isCurrentUser ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.08)' }}>
                  {entry.name?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{entry.name} {entry.isCurrentUser && <span className="text-xs text-purple-400">(you)</span>}</p>
                    {entry.placementStatus === 'placed' && <span className="text-xs text-green-400">🎉</span>}
                  </div>
                  <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{entry.targetRole || 'Student'} {entry.college ? `• ${entry.college}` : ''}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {entry.streak > 0 && (
                    <div className="flex items-center gap-1 text-xs" style={{ color: '#f59e0b' }}>
                      <TrendingUp className="w-3 h-3" /> {entry.streak}d
                    </div>
                  )}
                  <div className="text-right">
                    <p className="font-bold text-sm">{entry.points}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>pts</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
