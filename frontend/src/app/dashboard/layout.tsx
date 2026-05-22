'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FileText, Brain, Code2, Map, TrendingUp, Trophy,
  LogOut, Zap, ChevronRight, Menu, X, User, Sun, Moon
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/resume', label: 'Resume Analyzer', icon: FileText },
  { href: '/dashboard/interview', label: 'Mock Interview', icon: Brain },
  { href: '/dashboard/coding', label: 'Coding Arena', icon: Code2 },
  { href: '/dashboard/roadmap', label: 'My Roadmap', icon: Map },
  { href: '/dashboard/tracker', label: 'Prep Tracker', icon: TrendingUp },
  { href: '/dashboard/leaderboard', label: 'Leaderboard', icon: Trophy },
];

function DashboardNav() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-60 z-30 pt-6 pb-4"
        style={{ background: 'var(--bg-primary)', borderRight: '1px solid var(--border)', backdropFilter: 'blur(20px)' }}>
        <div className="flex items-center gap-2 px-5 mb-8">
          <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.5 }}
            className="w-7 h-7 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20" style={{ background: 'var(--gradient-primary)' }}>
            <Zap className="w-3.5 h-3.5 text-white" />
          </motion.div>
          <div className="flex flex-col">
            <span className="font-bold text-lg gradient-text leading-none">Nexora</span>
            <span className="text-[8px] font-medium tracking-tight" style={{ color: 'var(--text-muted)' }}>Next Generation Excellence & Opportunity Recruitment Assistant</span>
          </div>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map(item => {
            const active = pathname === item.href;
            return (
              <motion.div key={item.href} whileHover={{ x: 4 }}>
                <Link href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: active ? 'rgba(124,58,237,0.1)' : 'transparent',
                    color: active ? 'var(--accent-purple-light)' : 'var(--text-secondary)',
                    borderLeft: active ? '2px solid var(--accent-purple)' : '2px solid transparent',
                  }}>
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {item.label}
                  {active && <ChevronRight className="w-3 h-3 ml-auto" />}
                </Link>
              </motion.div>
            );
          })}
        </nav>
        <div className="px-3 pt-4 border-t mt-4" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-lg" style={{ background: 'var(--bg-card)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-inner"
              style={{ background: 'var(--gradient-primary)' }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate">{user?.name}</p>
              <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{user?.points || 0} pts</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={toggleTheme} className="p-2 rounded-lg transition-colors hover:bg-white/5" style={{ color: 'var(--text-muted)' }}>
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} onClick={logout} className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1 text-xs transition-colors hover:text-red-400"
              style={{ color: 'var(--text-muted)' }}>
              <LogOut className="w-3.5 h-3.5" /> Logout
            </motion.button>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3"
        style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)', backdropFilter: 'blur(20px)' }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold gradient-text leading-none">Nexora</span>
            <span className="text-[7px] font-medium tracking-tight" style={{ color: 'var(--text-muted)' }}>Next Generation Excellence & Opportunity Recruitment Assistant</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} style={{ color: 'var(--text-secondary)' }}>
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button onClick={() => setMobileOpen(true)} style={{ color: 'var(--text-secondary)' }}>
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden" onClick={() => setMobileOpen(false)}
            style={{ background: 'rgba(0,0,0,0.7)' }}>
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              className="absolute left-0 top-0 h-full w-64 flex flex-col pt-6 pb-4 shadow-2xl"
              style={{ background: 'var(--bg-primary)', borderRight: '1px solid var(--border)' }}
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}><Zap className="w-3.5 h-3.5 text-white" /></div>
                  <span className="font-bold gradient-text">Nexora</span>
                </div>
                <button onClick={() => setMobileOpen(false)} style={{ color: 'var(--text-muted)' }}><X className="w-4 h-4" /></button>
              </div>
              <nav className="flex-1 px-3 space-y-1">
                {navItems.map(item => {
                  const active = pathname === item.href;
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium"
                      style={{ background: active ? 'rgba(124,58,237,0.1)' : 'transparent', color: active ? 'var(--accent-purple-light)' : 'var(--text-secondary)' }}>
                      <item.icon className="w-4 h-4" /> {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="px-3 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <button onClick={logout} className="flex items-center gap-2 px-3 py-2 text-sm w-full" style={{ color: 'var(--text-muted)' }}>
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center animate-pulse shadow-lg shadow-purple-500/20" style={{ background: 'var(--gradient-primary)' }}>
            <Zap className="w-5 h-5 text-white" />
          </div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Loading Nexora...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: 'var(--bg-primary)' }}>
      <DashboardNav />
      <main className="md:ml-60 pt-14 md:pt-0 min-h-screen">
        <div className="p-6 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardContent>{children}</DashboardContent>;
}
