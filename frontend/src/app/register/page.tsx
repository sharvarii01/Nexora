'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Zap, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', targetRole: '', college: '', branch: '', graduationYear: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill required fields');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form);
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text-primary)',
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative" style={{ background: 'var(--bg-primary)' }}>
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)', filter: 'blur(60px)' }} />
      </div>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg relative z-10">
        <Link href="/" className="flex items-center gap-2 mb-8 text-sm" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
        <div className="glass-card rounded-2xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">Nexora</span>
          </div>
          <h1 className="text-2xl font-bold mb-1">Create your account</h1>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Start your AI-powered placement journey today</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Full Name *</label>
                <input id="reg-name" name="name" value={form.name} onChange={handle} placeholder="John Doe" className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} onFocus={e => (e.target.style.borderColor = '#7c3aed')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email *</label>
                <input id="reg-email" name="email" type="email" value={form.email} onChange={handle} placeholder="you@example.com" className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} onFocus={e => (e.target.style.borderColor = '#7c3aed')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
              </div>
              <div className="col-span-2 relative">
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Password *</label>
                <input id="reg-password" name="password" type={showPw ? 'text' : 'password'} value={form.password} onChange={handle} placeholder="Min. 6 characters" className="w-full px-3 py-2.5 rounded-lg text-sm outline-none pr-10" style={inputStyle} onFocus={e => (e.target.style.borderColor = '#7c3aed')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 bottom-2.5" style={{ color: 'var(--text-muted)' }}>
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Target Role</label>
                <input id="reg-role" name="targetRole" value={form.targetRole} onChange={handle} placeholder="Software Engineer" className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} onFocus={e => (e.target.style.borderColor = '#7c3aed')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Grad Year</label>
                <input id="reg-year" name="graduationYear" type="number" value={form.graduationYear} onChange={handle} placeholder="2025" className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} onFocus={e => (e.target.style.borderColor = '#7c3aed')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>College</label>
                <input id="reg-college" name="college" value={form.college} onChange={handle} placeholder="MIT / IIT / etc." className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} onFocus={e => (e.target.style.borderColor = '#7c3aed')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Branch</label>
                <input id="reg-branch" name="branch" value={form.branch} onChange={handle} placeholder="CS / EC / etc." className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} onFocus={e => (e.target.style.borderColor = '#7c3aed')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
              </div>
            </div>
            <button id="reg-submit" type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-medium" style={{ color: '#a855f7' }}>Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
