import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, Mail, Lock, User, GraduationCap, Building, ArrowRight, Sparkles } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegistering) {
        await register({ email, password, fullName, college, department });
      } else {
        await login(email, password);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { label: 'Alice', sublabel: 'MIT', email: 'alice@skillswap.com' },
    { label: 'Bob', sublabel: 'Harvard', email: 'bob@skillswap.com' },
    { label: 'Charlie', sublabel: 'Stanford', email: 'charlie@skillswap.com' },
  ];

  return (
    <div className="min-h-screen flex bg-[#060b14] overflow-hidden">
      {/* ── Left Panel (hidden on mobile) ── */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-gradient-to-br from-[#0a1020] to-[#0f172a] border-r border-[#1a2540] p-12 relative overflow-hidden">
        {/* Decorative Orbs */}
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full bg-[#ff6b00]/10 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] rounded-full bg-amber-500/8 blur-[80px] pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff6b00] to-amber-500 flex items-center justify-center shadow-orange-glow-sm">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">Skill<span className="text-[#ff6b00]">Swap</span></span>
        </div>

        {/* Tagline */}
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ff6b00]/10 border border-[#ff6b00]/20">
            <Sparkles className="w-3.5 h-3.5 text-[#ff6b00]" />
            <span className="mono-tag text-[#ff6b00]">P2P LEARNING PLATFORM</span>
          </div>
          <h1 className="text-4xl font-bold leading-tight text-white">
            Teach what you know.<br />
            <span className="text-gradient">Learn what you don't.</span>
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
            SkillSwap connects students for peer-to-peer skill exchanges. Create pacts, join live classes, and level up together.
          </p>

          {/* Feature chips */}
          <div className="flex flex-wrap gap-2 pt-2">
            {['Skill Matching', 'Live Classes', 'Study Groups', 'XP & Levels', 'Real-time Chat'].map((f) => (
              <span key={f} className="px-3 py-1 rounded-full bg-[#111827] border border-[#1a2540] text-xs font-medium text-slate-300">
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-6 relative z-10">
          {[
            { value: '500+', label: 'Students' },
            { value: '1.2K', label: 'Skills Swapped' },
            { value: '98%', label: 'Satisfaction' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-bold text-gradient">{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Panel (Form) ── */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#070d1a] bg-grid-pattern relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#ff6b00]/3 to-transparent pointer-events-none" />

        <div className="w-full max-w-md relative z-10 animate-slide-in">
          {/* Mobile Logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff6b00] to-amber-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold">Skill<span className="text-[#ff6b00]">Swap</span></span>
          </div>

          {/* Card */}
          <div className="bg-[#0a1020] border border-[#1a2540] rounded-2xl p-7 card-offset">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">
                {isRegistering ? 'Create Account' : 'Welcome back'}
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                {isRegistering ? 'Join the SkillSwap community' : 'Sign in to your account'}
              </p>
            </div>

            {error && (
              <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                ⚠ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegistering && (
                <div>
                  <label className="block mono-tag text-slate-400 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text" required value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full bg-[#111827] border border-[#1a2540] focus:border-[#ff6b00] text-white rounded-xl py-2.5 pl-10 pr-4 outline-none transition-colors text-sm placeholder-slate-600"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block mono-tag text-slate-400 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email" required value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@college.edu"
                    className="w-full bg-[#111827] border border-[#1a2540] focus:border-[#ff6b00] text-white rounded-xl py-2.5 pl-10 pr-4 outline-none transition-colors text-sm placeholder-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block mono-tag text-slate-400 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password" required value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#111827] border border-[#1a2540] focus:border-[#ff6b00] text-white rounded-xl py-2.5 pl-10 pr-4 outline-none transition-colors text-sm placeholder-slate-600"
                  />
                </div>
              </div>

              {isRegistering && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mono-tag text-slate-400 mb-1.5">College</label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text" value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        placeholder="MIT"
                        className="w-full bg-[#111827] border border-[#1a2540] focus:border-[#ff6b00] text-white rounded-xl py-2.5 pl-9 pr-3 outline-none transition-colors text-sm placeholder-slate-600"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block mono-tag text-slate-400 mb-1.5">Department</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text" value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="CS"
                        className="w-full bg-[#111827] border border-[#1a2540] focus:border-[#ff6b00] text-white rounded-xl py-2.5 pl-9 pr-3 outline-none transition-colors text-sm placeholder-slate-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center gap-2 mt-2 py-3 disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isRegistering ? 'Create Account' : 'Sign In'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Switch */}
            <div className="mt-5 pt-5 border-t border-[#1a2540]">
              <button
                type="button"
                onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
                className="text-sm font-semibold text-[#ff6b00] hover:text-amber-400 transition-colors block w-full text-center"
              >
                {isRegistering ? 'Already have an account? Sign In →' : "Don't have an account? Sign Up →"}
              </button>

              {/* Demo Accounts */}
              <div className="mt-4">
                <div className="mono-tag text-slate-600 text-center mb-2">DEMO ACCOUNTS</div>
                <div className="grid grid-cols-3 gap-2">
                  {demoAccounts.map((acc) => (
                    <button
                      key={acc.email}
                      type="button"
                      onClick={() => { setEmail(acc.email); setPassword('password'); }}
                      className="flex flex-col items-center py-2 px-2 rounded-xl bg-[#111827] border border-[#1a2540] hover:border-[#ff6b00]/40 hover:bg-[#ff6b00]/5 transition-all group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#ff6b00] to-amber-500 flex items-center justify-center text-white font-bold text-xs mb-1 group-hover:shadow-orange-glow-sm">
                        {acc.label[0]}
                      </div>
                      <span className="text-xs font-semibold text-white">{acc.label}</span>
                      <span className="text-[10px] text-slate-500">{acc.sublabel}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
