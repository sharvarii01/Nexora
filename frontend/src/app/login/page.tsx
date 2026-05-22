'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Zap, ArrowLeft, HelpCircle, X, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [lastUser, setLastUser] = useState<any>(null);
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('nexora_last_user');
    if (saved) setLastUser(JSON.parse(saved));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please fill in all fields');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Login failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { title: 'AI Resume Analyzer', desc: 'Get instant feedback and score for your resume.' },
    { title: 'Mock Interview Bot', desc: 'Practice with an AI that simulates real interviewers.' },
    { title: 'Coding Arena', desc: 'Solve DSA problems with AI-powered complexity analysis.' },
    { title: 'Personalized Roadmaps', desc: 'Custom prep guides based on your target companies.' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, var(--accent-purple), transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, var(--accent-blue), transparent 70%)', filter: 'blur(60px)' }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="flex items-center gap-2 text-sm transition-colors hover:text-white" style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
          <button onClick={() => setShowHelp(true)} className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-white" style={{ color: 'var(--text-muted)' }}>
            <HelpCircle className="w-4 h-4" /> What Nexora does?
          </button>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <motion.div whileHover={{ rotate: 15 }} className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20" style={{ background: 'var(--gradient-primary)' }}>
              <Zap className="w-4 h-4 text-white" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl font-bold gradient-text leading-none">Nexora</span>
              <span className="text-[10px] font-medium tracking-tight whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>Next Generation Excellence & Opportunity Recruitment Assistant</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Continue your placement journey</p>

          {/* Quick Login for Registered Users */}
          {lastUser && !email && (
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setEmail(lastUser.email)}
              className="w-full mb-6 p-4 rounded-xl flex items-center gap-4 text-left transition-all border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ background: 'var(--gradient-primary)' }}>
                {lastUser.name[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{lastUser.name}</p>
                <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{lastUser.email}</p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-purple-400" />
            </motion.button>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email</label>
              <input id="login-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                onFocus={e => (e.target.style.borderColor = 'var(--accent-purple)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Password</label>
              <div className="relative">
                <input id="login-password" type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all pr-10"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  onFocus={e => (e.target.style.borderColor = 'var(--accent-purple)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors hover:text-white" style={{ color: 'var(--text-muted)' }}>
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <motion.button id="login-submit" type="submit" disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="btn-primary w-full py-3 mt-2 shadow-lg shadow-purple-500/30">
              {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-medium hover:underline" style={{ color: 'var(--accent-purple-light)' }}>Sign up free</Link>
          </p>
        </div>
      </motion.div>

      {/* Help Modal */}
      <AnimatePresence>
        {showHelp && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowHelp(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card w-full max-w-lg rounded-2xl p-6 relative"
              onClick={e => e.stopPropagation()}>
              <button onClick={() => setShowHelp(false)} className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10" style={{ color: 'var(--text-muted)' }}>
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold mb-4 gradient-text">What Nexora Does?</h2>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Nexora is your AI-powered companion for placement preparation. We use advanced AI to help you land your dream job by providing specialized tools:
              </p>
              <div className="grid gap-4">
                {features.map((f, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                    className="p-3 rounded-xl border border-white/5 bg-white/5">
                    <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--accent-purple-light)' }}>{f.title}</h3>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
                  </motion.div>
                ))}
              </div>
              <motion.button onClick={() => setShowHelp(false)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="btn-primary w-full mt-6">Got it, thanks!</motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
