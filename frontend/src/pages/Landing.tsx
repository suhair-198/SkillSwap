import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Zap, 
  ArrowRight, 
  Sparkles, 
  Users, 
  Check, 
  Award, 
  ShieldCheck, 
  MessageSquare, 
  Flame, 
  GraduationCap, 
  Code, 
  Palette, 
  BrainCircuit, 
  Video, 
  FileText,
  Star,
  ChevronRight,
  TrendingUp,
  Compass,
  Laptop,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface MockSwapper {
  name: string;
  college: string;
  level: number;
  xp: number;
  teaches: string[];
  learns: string[];
  avatarBg: string;
  matchScore: number;
}

const DEMO_SKILLS_TEACH = [
  'React.js',
  'Python',
  'UI/UX Design',
  'Calculus III',
  'Spanish',
  'Machine Learning'
];

const DEMO_SKILLS_LEARN = [
  'Figma',
  'TypeScript',
  'Data Structures',
  'Public Speaking',
  'Docker',
  'Backend Architecture'
];

const DEMO_SWAPPERS: { [key: string]: MockSwapper } = {
  'React.js': {
    name: 'Elena Rostova',
    college: 'MIT • Computer Science',
    level: 7,
    xp: 680,
    teaches: ['React.js', 'Next.js', 'Tailwind'],
    learns: ['UI/UX Design', 'Figma'],
    avatarBg: 'from-orange-500 to-amber-500',
    matchScore: 98
  },
  'Python': {
    name: 'Devon Vance',
    college: 'Stanford • AI & Robotics',
    level: 9,
    xp: 890,
    teaches: ['Python', 'PyTorch', 'Data Science'],
    learns: ['TypeScript', 'Cloud DevOps'],
    avatarBg: 'from-blue-500 to-indigo-600',
    matchScore: 99
  },
  'UI/UX Design': {
    name: 'Sophia Martinez',
    college: 'UC Berkeley • Design & HCI',
    level: 8,
    xp: 750,
    teaches: ['UI/UX Design', 'Figma', 'Prototyping'],
    learns: ['React.js', 'Frontend Coding'],
    avatarBg: 'from-purple-500 to-pink-500',
    matchScore: 97
  },
  'Calculus III': {
    name: 'Marcus Chen',
    college: 'Caltech • Applied Math',
    level: 6,
    xp: 590,
    teaches: ['Calculus III', 'Linear Algebra', 'Physics'],
    learns: ['Python', 'Machine Learning'],
    avatarBg: 'from-emerald-500 to-teal-600',
    matchScore: 96
  },
  'Spanish': {
    name: 'Camila Duarte',
    college: 'Columbia • Linguistics & Pre-Law',
    level: 7,
    xp: 710,
    teaches: ['Spanish (Native)', 'French', 'Public Speaking'],
    learns: ['Web Development', 'Python'],
    avatarBg: 'from-rose-500 to-orange-500',
    matchScore: 95
  },
  'Machine Learning': {
    name: 'Kavita Raman',
    college: 'Georgia Tech • Machine Learning',
    level: 10,
    xp: 940,
    teaches: ['Machine Learning', 'TensorFlow', 'Deep Learning'],
    learns: ['UI/UX Design', 'System Architecture'],
    avatarBg: 'from-cyan-500 to-blue-600',
    matchScore: 99
  }
};

const LIVE_ACTIVITIES = [
  { studentA: 'Lucas (MIT)', teaches: 'React', studentB: 'Maya (Stanford)', learns: 'Figma', time: 'Just now' },
  { studentA: 'Aarav (Berkeley)', teaches: 'Python', studentB: 'Chloe (Harvard)', learns: 'Calculus', time: '1m ago' },
  { studentA: 'Siddharth (CMU)', teaches: 'Rust', studentB: 'Emma (Waterloo)', learns: 'UI Design', time: '3m ago' },
  { studentA: 'Zoe (Columbia)', teaches: 'Spanish', studentB: 'Kenji (UT Austin)', learns: 'TypeScript', time: '5m ago' }
];

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [selectedTeach, setSelectedTeach] = useState('React.js');
  const [selectedLearn, setSelectedLearn] = useState('Figma');

  const currentSwapper = DEMO_SWAPPERS[selectedTeach] || DEMO_SWAPPERS['React.js'];

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans selection:bg-[#ff6b00] selection:text-white relative overflow-x-hidden">
      
      {/* ── AMBIENT GRADIENTS & MESH LIGHTING ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[600px] bg-gradient-to-b from-[#ff6b00]/20 via-purple-600/10 to-transparent blur-[140px] rounded-full" />
        <div className="absolute top-[35%] -right-40 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full" />
        <div className="absolute top-[65%] -left-40 w-[600px] h-[600px] bg-orange-600/10 blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-25" />
      </div>

      {/* ── TOP NAV BAR ── */}
      <header className="relative z-50 border-b border-white/10 bg-[#090d16]/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="h-11 w-11 bg-gradient-to-tr from-[#ff6b00] via-orange-500 to-amber-400 rounded-2xl flex items-center justify-center shadow-[0_0_24px_rgba(255,107,0,0.4)] transition-transform duration-300 group-hover:scale-105">
              <Zap className="h-6 w-6 text-white fill-white" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white">
                Skill<span className="text-[#ff6b00]">Swap</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-white/10 text-orange-300 border border-white/10">
                Peer Hub
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#simulator" className="hover:text-[#ff6b00] transition-colors">Match Simulator</a>
            <a href="#how-it-works" className="hover:text-[#ff6b00] transition-colors">How It Works</a>
            <a href="#features" className="hover:text-[#ff6b00] transition-colors">Pacts & Rooms</a>
            <a href="#campuses" className="hover:text-[#ff6b00] transition-colors">Campuses</a>
          </nav>

          {/* Live Online Badge + CTA */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>1,420+ Swapping Now</span>
            </div>

            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 bg-gradient-to-r from-[#ff6b00] to-orange-500 hover:brightness-110 text-white font-black px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(255,107,0,0.35)] transition-all active:scale-95 text-sm"
              >
                <span>Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/login')}
                  className="text-sm font-bold text-slate-300 hover:text-white px-3.5 py-2 rounded-xl transition-all"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#ff6b00] to-orange-500 hover:brightness-110 text-white font-extrabold px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(255,107,0,0.35)] transition-all active:scale-95 text-sm"
                >
                  <span>Join Free</span>
                  <Sparkles className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── LIVE ACTIVITY MARQUEE TICKER ── */}
      <div className="relative z-20 border-b border-white/5 bg-white/[0.02] py-2.5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-xs font-medium text-slate-400 gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff6b00] animate-ping" />
            <span className="text-white font-bold uppercase tracking-wider text-[10px]">Real-Time Activity</span>
          </div>
          <div className="flex items-center gap-8 shrink-0">
            {LIVE_ACTIVITIES.map((act, i) => (
              <div key={i} className="flex items-center gap-2 text-slate-300 shrink-0">
                <span className="font-bold text-white">{act.studentA}</span>
                <span className="text-[#ff6b00]">({act.teaches})</span>
                <span className="text-slate-500">↔</span>
                <span className="font-bold text-white">{act.studentB}</span>
                <span className="text-amber-400">({act.learns})</span>
                <span className="text-slate-500 text-[10px]">[{act.time}]</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="relative z-10">
        
        {/* ── HERO SECTION: ULTRA-MODERN, VIBRANT, NO PPT SLIDES ── */}
        <section className="pt-16 pb-20 px-6 max-w-7xl mx-auto text-center">
          
          {/* Top Magnetic Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.05] border border-white/10 text-xs font-bold text-orange-400 mb-8 backdrop-blur-md shadow-inner">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff6b00]" />
            </span>
            <span>Zero Tuition • 100% Peer-to-Peer Student Exchange</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          </div>

          {/* Punchy Dynamic Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] max-w-5xl mx-auto mb-6">
            Stop Paying For Tutors.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b00] via-amber-400 to-orange-400">
              Trade Skills 1-on-1.
            </span>
          </h1>

          {/* Crisp 1-Sentence Subtitle */}
          <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Master what you need by teaching what you know. Instant student matching, collaborative Skill Pacts, and real-time swap rooms.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => navigate(user ? '/dashboard' : '/login')}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-[#ff6b00] via-orange-500 to-amber-500 hover:brightness-110 text-white font-black text-base px-8 py-4 rounded-2xl shadow-[0_0_35px_rgba(255,107,0,0.45)] transition-all active:scale-95"
            >
              <span>{user ? 'Enter Dashboard' : 'Find Your Swap Partner'}</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <a
              href="#simulator"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white font-bold text-base px-7 py-4 rounded-2xl border border-white/10 backdrop-blur-md transition-all"
            >
              <Compass className="h-5 w-5 text-[#ff6b00]" />
              <span>Test Interactive Matcher</span>
            </a>
          </div>

          {/* ── INTERACTIVE INSTANT SWAP SIMULATOR WIDGET ── */}
          <div id="simulator" className="max-w-5xl mx-auto text-left relative">
            
            {/* Glow framing */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#ff6b00] via-purple-600 to-blue-600 rounded-3xl blur-xl opacity-20 pointer-events-none" />

            <div className="relative bg-[#0f172a]/95 border border-white/15 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl overflow-hidden">
              
              {/* Studio Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono font-bold text-slate-400 ml-2">
                    interactive_swap_engine.v2
                  </span>
                </div>
                
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Instant Algorithm Match: {currentSwapper.matchScore}%</span>
                </div>
              </div>

              {/* Selector Panels: Teach vs Learn */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left Controls: Selectors */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Teach Chips */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#ff6b00] mb-3 flex items-center gap-1.5">
                      <Zap className="h-3.5 w-3.5" />
                      <span>Step 1: Skill You Can Teach</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {DEMO_SKILLS_TEACH.map((skill) => {
                        const active = selectedTeach === skill;
                        return (
                          <button
                            key={skill}
                            onClick={() => setSelectedTeach(skill)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                              active
                                ? 'bg-gradient-to-r from-[#ff6b00] to-orange-500 text-white shadow-[0_0_15px_rgba(255,107,0,0.4)] scale-105'
                                : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            {skill}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Learn Chips */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
                      <BrainCircuit className="h-3.5 w-3.5" />
                      <span>Step 2: Skill You Want To Learn</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {DEMO_SKILLS_LEARN.map((skill) => {
                        const active = selectedLearn === skill;
                        return (
                          <button
                            key={skill}
                            onClick={() => setSelectedLearn(skill)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                              active
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)] scale-105'
                                : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            {skill}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Micro Hint */}
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-1 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Click any skill above to preview live matching student pairs immediately.</span>
                  </div>
                </div>

                {/* Right Result: Live Dynamic Swapper Profile Card */}
                <div className="lg:col-span-5 bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/15 rounded-2xl p-5 shadow-inner">
                  
                  {/* Swapper Head */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-tr ${currentSwapper.avatarBg} flex items-center justify-center font-black text-white text-lg shadow-lg`}>
                        {currentSwapper.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-white text-sm flex items-center gap-1.5">
                          <span>{currentSwapper.name}</span>
                          <span className="text-[10px] font-bold bg-[#ff6b00]/20 text-[#ff6b00] px-2 py-0.5 rounded-full border border-[#ff6b00]/30">
                            Lvl {currentSwapper.level}
                          </span>
                        </h4>
                        <p className="text-xs text-slate-400 font-medium">{currentSwapper.college}</p>
                      </div>
                    </div>
                  </div>

                  {/* Mutual Match Exchange Pills */}
                  <div className="space-y-3 bg-[#090d16]/70 rounded-xl p-3.5 border border-white/5 mb-4 text-xs">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider mb-1">
                        Offers To Teach You:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-1 rounded-md border border-emerald-500/30">
                          {selectedLearn}
                        </span>
                        {currentSwapper.teaches.filter(s => s !== selectedLearn).map(s => (
                          <span key={s} className="bg-white/5 text-slate-400 font-medium px-2 py-1 rounded-md">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-1 border-t border-white/5">
                      <div className="text-[10px] uppercase font-bold text-[#ff6b00] tracking-wider mb-1">
                        Wants From You:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="bg-[#ff6b00]/20 text-orange-300 font-bold px-2.5 py-1 rounded-md border border-[#ff6b00]/30">
                          {selectedTeach}
                        </span>
                        <span className="text-slate-400 text-[11px] self-center ml-1 font-medium">• Perfect Complement!</span>
                      </div>
                    </div>
                  </div>

                  {/* Immediate Action Button */}
                  <button
                    onClick={() => navigate(user ? '/chat' : '/login')}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#ff6b00] to-orange-500 hover:brightness-110 text-white font-extrabold text-xs py-3 px-4 rounded-xl shadow-lg transition-all active:scale-95"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Connect & Start Swap Chat</span>
                  </button>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ── BENTO GRID: MODERN HIGH-IMPACT CAPABILITIES ── */}
        <section id="features" className="py-20 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-black text-[#ff6b00] uppercase tracking-widest px-3 py-1 rounded-full bg-[#ff6b00]/10 border border-[#ff6b00]/20">
              Modern Learning Architecture
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white mt-3 tracking-tight">
              Built Specifically for Student Collaborations
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto mt-2 font-medium">
              Everything structured around mutual accountability, direct messaging, and verifiable knowledge growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Bento 1: Smart Match Engine (Wide) */}
            <div className="md:col-span-2 bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 rounded-3xl p-7 relative overflow-hidden group hover:border-[#ff6b00]/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-[#ff6b00]/20 text-[#ff6b00] border border-[#ff6b00]/30 flex items-center justify-center">
                  <BrainCircuit className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                  Sub-second Pairing
                </span>
              </div>
              <h3 className="text-xl font-black text-white mb-2">Smart Complementary Matching</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-lg mb-6">
                Our algorithm looks at both sides: your listed strengths and exact learning targets. No endless browsing—you only see peers who teach what you want and need what you offer.
              </p>

              {/* Visual Match Visualization Bar */}
              <div className="bg-[#090d16] border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-orange-500 flex items-center justify-center font-bold text-white text-xs">
                    You
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Your Teaching: Python & SQL</div>
                    <div className="text-[10px] text-slate-400">Seeking: Figma & UI Design</div>
                  </div>
                </div>
                <div className="h-7 px-3 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center gap-1.5 text-emerald-400 text-xs font-extrabold shrink-0">
                  <Check className="h-3 w-3" />
                  <span>99% Match Pair</span>
                </div>
              </div>
            </div>

            {/* Bento 2: Skill Pacts (Compact) */}
            <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 rounded-3xl p-7 group hover:border-amber-400/50 transition-all flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-4">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-black text-white mb-2">Mutual Skill Pacts</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                  Set mutually committed goals and scheduled sessions. Both partners stay accountable through digital milestones.
                </p>
              </div>

              <div className="bg-[#090d16] border border-white/10 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">4 / 6 Sessions Completed</span>
                  <span className="text-amber-400 font-mono font-bold">66%</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-400 to-[#ff6b00] h-full w-2/3 rounded-full" />
                </div>
              </div>
            </div>

            {/* Bento 3: Live Classrooms */}
            <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 rounded-3xl p-7 group hover:border-blue-400/50 transition-all flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mb-4">
                  <Video className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-black text-white mb-2">Live Study Rooms</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                  Host or join student masterclasses with Google Meet, Zoom, and Teams integration in one click.
                </p>
              </div>

              <div className="bg-[#090d16] border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">EECS Masterclass</div>
                  <div className="text-[10px] text-slate-400">Live now • 18 students</div>
                </div>
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
            </div>

            {/* Bento 4: Gamified XP & Reputation (Wide) */}
            <div className="md:col-span-2 bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 rounded-3xl p-7 relative overflow-hidden group hover:border-purple-400/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                  <Flame className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-purple-300 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                  XP & Streaks
                </span>
              </div>
              <h3 className="text-xl font-black text-white mb-2">Campus Leaderboards & Reputation</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-lg mb-6">
                Earn verifiable reputation for every successful swap. Level up, maintain streaks, and showcase validated expertise to peers and recruiters.
              </p>

              {/* Progress and Level Metric */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-[#090d16] border border-white/10 rounded-2xl p-3.5 text-center">
                  <div className="text-lg font-black text-white">Lvl 12</div>
                  <div className="text-[10px] text-slate-400 font-bold">Top 5% Swapper</div>
                </div>
                <div className="bg-[#090d16] border border-white/10 rounded-2xl p-3.5 text-center">
                  <div className="text-lg font-black text-orange-400">🔥 14 Days</div>
                  <div className="text-[10px] text-slate-400 font-bold">Current Streak</div>
                </div>
                <div className="col-span-2 sm:col-span-1 bg-[#090d16] border border-white/10 rounded-2xl p-3.5 text-center">
                  <div className="text-lg font-black text-emerald-400">100%</div>
                  <div className="text-[10px] text-slate-400 font-bold">Completion Rate</div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── HOW IT WORKS: 3 FAST CARDS (NO ESSAY TEXT) ── */}
        <section id="how-it-works" className="py-20 px-6 max-w-7xl mx-auto border-t border-white/10">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-[#ff6b00] uppercase tracking-wider">3 Simple Steps</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">How It Works in 60 Seconds</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-7 hover:border-orange-500/40 transition-all">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-[#ff6b00] to-orange-500 text-white font-black flex items-center justify-center text-base mb-5 shadow-glow">
                1
              </div>
              <h3 className="text-lg font-extrabold text-white mb-2">List Skills</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
                Add skills you know and skills you need. Takes less than a minute.
              </p>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-7 hover:border-amber-500/40 transition-all">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-black flex items-center justify-center text-base mb-5 shadow-glow">
                2
              </div>
              <h3 className="text-lg font-extrabold text-white mb-2">Match & Chat</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
                Connect with complementary students instantly and message in real-time.
              </p>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-7 hover:border-purple-500/40 transition-all">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white font-black flex items-center justify-center text-base mb-5 shadow-glow">
                3
              </div>
              <h3 className="text-lg font-extrabold text-white mb-2">Create Pact & Grow</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
                Commit to mutual swap sessions, track milestones, and earn XP together.
              </p>
            </div>
          </div>
        </section>

        {/* ── UNIVERSITIES & IMPACT STATS ── */}
        <section id="campuses" className="py-16 px-6 max-w-7xl mx-auto border-t border-white/10">
          <div className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest mb-8">
            Students Swapping Knowledge Across Top Campuses
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-slate-400 font-extrabold text-base tracking-wide opacity-75">
            <span>MIT</span>
            <span>STANFORD</span>
            <span>UC BERKELEY</span>
            <span>HARVARD</span>
            <span>WATERLOO</span>
            <span>CARNEGIE MELLON</span>
            <span>CALTECH</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center mt-14 pt-10 border-t border-white/5">
            <div>
              <div className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b00] to-orange-400 mb-1">
                10k+
              </div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">Active Students</div>
            </div>
            <div>
              <div className="text-3xl sm:text-5xl font-black text-white mb-1">
                25k+
              </div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">Hours Swapped</div>
            </div>
            <div>
              <div className="text-3xl sm:text-5xl font-black text-emerald-400 mb-1">
                98%
              </div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">Pact Success Rate</div>
            </div>
            <div>
              <div className="text-3xl sm:text-5xl font-black text-amber-400 mb-1">
                $0
              </div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">Tuition Cost</div>
            </div>
          </div>
        </section>

        {/* ── BOTTOM HIGH-IMPACT CTA ── */}
        <section className="py-20 px-6 max-w-5xl mx-auto text-center">
          <div className="relative rounded-3xl p-10 sm:p-14 border border-white/15 bg-gradient-to-r from-orange-600/30 via-[#ff6b00]/20 to-purple-600/30 backdrop-blur-2xl overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-5xl font-black text-white mb-4 tracking-tight">
                Ready to Level Up Your Skills?
              </h2>
              <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-8 font-medium">
                No credit cards. No courses to buy. Just direct student-to-student knowledge exchange.
              </p>
              <button
                onClick={() => navigate(user ? '/dashboard' : '/login')}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-[#ff6b00] via-orange-500 to-amber-500 hover:brightness-110 text-white font-black text-base px-9 py-4 rounded-2xl shadow-[0_0_30px_rgba(255,107,0,0.5)] transition-all active:scale-95"
              >
                <span>{user ? 'Go to Your Dashboard' : 'Join SkillSwap Free'}</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* ── SLEEK FOOTER ── */}
      <footer className="border-t border-white/10 bg-[#060910] py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 bg-gradient-to-tr from-[#ff6b00] to-orange-500 rounded-lg flex items-center justify-center text-white">
              <Zap className="h-4 w-4" />
            </div>
            <span className="text-white font-extrabold text-sm">SkillSwap</span>
            <span>© 2026 SkillSwap Platform. Pure Student Collaboration.</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#simulator" className="hover:text-white transition-colors">Match Simulator</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <button onClick={() => navigate('/login')} className="hover:text-white transition-colors">
              Sign In / Register
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
};
