import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Zap, Mail, Lock, User, GraduationCap, Building, 
  ArrowRight, Sparkles, BookOpen, Users, Trophy, Lightbulb
} from 'lucide-react';

const features = [
  { icon: BookOpen, title: 'Learn from Peers', desc: 'Real students, real skills — no textbooks needed.' },
  { icon: Users, title: 'Study Groups', desc: 'Collaborate in private or public learning squads.' },
  { icon: Trophy, title: 'XP & Levels', desc: 'Earn points for every session you teach or attend.' },
  { icon: Lightbulb, title: 'Skill Matching', desc: 'Our algorithm finds your perfect skill-exchange partner.' },
];

const stats = [
  { value: '500+', label: 'Students' },
  { value: '1.2K', label: 'Skills Swapped' },
  { value: '98%', label: 'Satisfaction' },
];

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

  return (
    <div className="min-h-screen flex bg-[#fdf8f0] overflow-hidden">

      {/* ── Left Panel ── */}
      <div className="hidden lg:flex flex-col justify-between w-[48%] relative overflow-hidden bg-gradient-to-br from-[#fff7ed] via-[#fef3c7] to-[#f5f3ff] p-12">
        {/* Decorative Blobs */}
        <div className="absolute top-[-80px] left-[-80px] w-[380px] h-[380px] rounded-full bg-gradient-to-br from-orange-300/40 to-amber-200/30 blur-[60px] pointer-events-none" />
        <div className="absolute bottom-[-80px] right-[-80px] w-[300px] h-[300px] rounded-full bg-gradient-to-br from-purple-300/40 to-indigo-200/30 blur-[60px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-orange-100/20 to-purple-100/20 blur-[80px] pointer-events-none" />

        {/* Floating shapes */}
        <div className="absolute top-20 right-20 w-16 h-16 rounded-2xl bg-white/60 border border-white/80 shadow-lg animate-float flex items-center justify-center">
          <Zap className="w-7 h-7 text-orange-400" />
        </div>
        <div className="absolute bottom-32 left-16 w-12 h-12 rounded-xl bg-white/60 border border-white/80 shadow-lg animate-float flex items-center justify-center" style={{ animationDelay: '1.5s' }}>
          <Trophy className="w-5 h-5 text-purple-500" />
        </div>
        <div className="absolute top-1/3 right-8 w-10 h-10 rounded-xl bg-white/60 border border-white/80 shadow-lg animate-float flex items-center justify-center" style={{ animationDelay: '0.8s' }}>
          <BookOpen className="w-4 h-4 text-emerald-500" />
        </div>

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#f97316] to-[#7c3aed] flex items-center justify-center shadow-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black text-gray-900 tracking-tight">
            Skill<span className="text-[#f97316]">Swap</span>
          </span>
        </div>

        {/* Tagline */}
        <div className="relative z-10 space-y-7">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-orange-200 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#f97316]" />
            <span className="mono-tag text-[#c2410c]">P2P LEARNING PLATFORM</span>
          </div>

          <div>
            <h1 className="text-5xl font-black leading-tight text-gray-900 tracking-tight">
              Teach what<br />you know.
            </h1>
            <h1 className="text-5xl font-black leading-tight mt-1 text-gradient">
              Learn what you don't.
            </h1>
          </div>

          <p className="text-gray-500 text-base leading-relaxed max-w-sm">
            SkillSwap connects students for peer-to-peer skill exchanges. 
            Create pacts, join live classes, and level up together.
          </p>

          {/* Feature List */}
          <div className="grid grid-cols-2 gap-3">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="flex items-start gap-3 p-3 bg-white/70 border border-white/90 rounded-2xl shadow-sm">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-[#f97316]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-800">{f.title}</div>
                    <div className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{f.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-8 relative z-10">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-black text-gradient">{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Panel (Form) ── */}
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* BG decoration */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-purple-100/40 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-orange-100/40 blur-[80px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10 animate-slide-in">
          {/* Mobile Logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#f97316] to-[#7c3aed] flex items-center justify-center shadow-md">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black">Skill<span className="text-[#f97316]">Swap</span></span>
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            {/* Mode Switch Tabs */}
            <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-2xl mb-6">
              <button
                type="button"
                onClick={() => { setIsRegistering(false); setError(''); }}
                className={`py-2.5 text-xs font-bold rounded-xl transition-all ${
                  !isRegistering
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setIsRegistering(true); setError(''); }}
                className={`py-2.5 text-xs font-bold rounded-xl transition-all ${
                  isRegistering
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Create Account
              </button>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                {isRegistering ? '🎓 Create Account' : '👋 Welcome back'}
              </h2>
              <p className="text-sm text-gray-500 mt-1.5">
                {isRegistering ? 'Join the SkillSwap community to exchange skills' : 'Sign in to access your skills, pacts, and classes'}
              </p>
            </div>

            {error && (
              <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegistering && (
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text" required value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      className="input-light pl-10"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email" required value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@college.edu"
                    className="input-light pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password" required value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-light pl-10"
                  />
                </div>
              </div>

              {isRegistering && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">College</label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text" value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        placeholder="MIT"
                        className="input-light pl-9"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Department</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text" value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="CS"
                        className="input-light pl-9"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center gap-2 mt-2 py-3 text-base rounded-xl disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isRegistering ? 'Create Account' : 'Sign In'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Switch */}
            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <button
                type="button"
                onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
                className="text-sm font-bold text-[#f97316] hover:text-[#ea580c] transition-colors"
              >
                {isRegistering ? 'Already have an account? Sign In →' : "Don't have an account? Sign Up →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
