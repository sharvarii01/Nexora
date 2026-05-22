'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Brain, Code2, FileText, Trophy, Target, Zap, ArrowRight, ChevronRight, Star, Users, TrendingUp } from 'lucide-react';

const features = [
  { icon: FileText, title: 'AI Resume Analyzer', desc: 'Get ATS score, skill gap analysis, and actionable improvements powered by Gemini AI.', color: 'from-purple-500 to-violet-600', delay: 0.1 },
  { icon: Brain, title: 'Mock Interview Bot', desc: 'Practice with an AI interviewer that adapts to your target role and company.', color: 'from-blue-500 to-cyan-600', delay: 0.2 },
  { icon: Code2, title: 'Coding Assessments', desc: 'Solve curated problems with AI-powered hints, evaluation, and explanations.', color: 'from-green-500 to-emerald-600', delay: 0.3 },
  { icon: Target, title: 'Personalized Roadmap', desc: 'AI-generated week-by-week preparation plan based on your profile and goals.', color: 'from-orange-500 to-amber-600', delay: 0.4 },
  { icon: TrendingUp, title: 'Skill Gap Detection', desc: 'Identify missing skills and get targeted resources to bridge the gap.', color: 'from-pink-500 to-rose-600', delay: 0.5 },
  { icon: Trophy, title: 'Leaderboard', desc: 'Compete with peers, track your rank, and stay motivated on your journey.', color: 'from-yellow-500 to-orange-600', delay: 0.6 },
];

const stats = [
  { value: '10K+', label: 'Students Placed', icon: Users },
  { value: '95%', label: 'Success Rate', icon: Star },
  { value: '500+', label: 'Companies', icon: Target },
  { value: '50+', label: 'AI Features', icon: Zap },
];

const companies = ['Google', 'Amazon', 'Microsoft', 'Meta', 'Apple', 'Flipkart', 'Razorpay', 'Infosys', 'TCS', 'Wipro'];

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Animated background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #2563eb, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #06b6d4, transparent 70%)', filter: 'blur(80px)' }} />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold gradient-text leading-none">Nexora</span>
            <span className="text-[10px] font-medium tracking-tight whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>Next Generation Excellence & Opportunity Recruitment Assistant</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#stats" className="hover:text-white transition-colors">Stats</Link>
          <Link href="#companies" className="hover:text-white transition-colors">Companies</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <button className="btn-secondary text-sm px-4 py-2">Sign In</button>
          </Link>
          <Link href="/register">
            <button className="btn-primary text-sm px-4 py-2 flex items-center gap-1">
              Get Started <ArrowRight className="w-3 h-3" />
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 text-center pt-20 pb-16 px-6 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-medium" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#a855f7' }}>
            <Zap className="w-3.5 h-3.5" /> Powered by Google Gemini AI
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
            Land Your <span className="gradient-text">Dream Job</span><br />with AI Precision
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            The all-in-one platform that combines resume analysis, AI mock interviews, coding practice, and personalized roadmaps to maximize your placement success.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <button className="btn-primary text-base px-8 py-3.5 flex items-center gap-2 animate-pulse-glow">
                Start Free Today <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/login">
              <button className="btn-secondary text-base px-8 py-3.5 flex items-center gap-2">
                View Demo <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section id="stats" className="relative z-10 py-12 px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="glass-card rounded-xl p-5 text-center">
              <stat.icon className="w-5 h-5 mx-auto mb-2" style={{ color: '#a855f7' }} />
              <div className="text-3xl font-black gradient-text">{stat.value}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 py-16 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Everything You Need to Get Placed</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Six powerful AI tools, one unified platform</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature) => (
            <motion.div key={feature.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: feature.delay }}
              className="glass-card rounded-2xl p-6 group cursor-pointer">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${feature.color}`}>
                <feature.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{feature.desc}</p>
              <div className="flex items-center gap-1 mt-4 text-sm font-medium" style={{ color: '#a855f7' }}>
                Explore <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Companies */}
      <section id="companies" className="relative z-10 py-16 px-6 text-center">
        <p className="text-sm font-medium mb-6" style={{ color: 'var(--text-muted)' }}>OUR STUDENTS PLACED AT</p>
        <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
          {companies.map(c => (
            <span key={c} className="glass-card px-4 py-2 rounded-full text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{c}</span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-20 px-6 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="max-w-2xl mx-auto glass-card rounded-3xl p-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Placed? 🚀</h2>
          <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>Join 10,000+ students who used Nexora to land their dream jobs.</p>
          <Link href="/register">
            <button className="btn-primary text-base px-10 py-4 flex items-center gap-2 mx-auto">
              Start Your Journey <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t py-8 px-6 text-center text-sm" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
        © 2024 Nexora.
      </footer>
    </div>
  );
}
