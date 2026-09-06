import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Zap, 
  ArrowRight, 
  Sparkles, 
  Users, 
  CheckCircle2, 
  BookOpen, 
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
  ChevronRight
} from 'lucide-react';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#c5c6c7] font-sans selection:bg-[#45f3ff] selection:text-black overflow-x-hidden">
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#45f3ff]/15 via-[#6f42c1]/10 to-transparent blur-[140px]"></div>
        <div className="absolute top-[40%] right-[10%] w-[400px] h-[400px] bg-[#6f42c1]/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] left-[5%] w-[500px] h-[500px] bg-[#45f3ff]/10 rounded-full blur-[150px]"></div>
      </div>

      {/* Navigation Header */}
      <header className="relative z-50 border-b border-[#45f3ff]/10 bg-[#0b0c10]/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="h-10 w-10 bg-gradient-to-tr from-[#45f3ff] to-[#6f42c1] rounded-xl flex items-center justify-center shadow-glow transition-transform duration-300 group-hover:scale-105">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-wider text-white">
              Skill<span className="text-[#45f3ff]">Swap</span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#features" className="hover:text-[#45f3ff] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#45f3ff] transition-colors">How It Works</a>
            <a href="#categories" className="hover:text-[#45f3ff] transition-colors">Categories</a>
            <a href="#community" className="hover:text-[#45f3ff] transition-colors">Community</a>
          </nav>

          {/* Auth Action Buttons */}
          <div className="flex items-center gap-4">
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 bg-gradient-to-r from-[#45f3ff] to-[#6f42c1] hover:brightness-110 text-white font-semibold px-5 py-2.5 rounded-xl shadow-glow transition-all active:scale-[0.98] text-sm"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="text-sm font-medium text-gray-300 hover:text-white px-4 py-2 rounded-xl hover:bg-white/5 transition-all"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#45f3ff] to-[#6f42c1] hover:brightness-110 text-white font-semibold px-5 py-2.5 rounded-xl shadow-glow transition-all active:scale-[0.98] text-sm"
                >
                  <span>Get Started</span>
                  <Sparkles className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10">
        {/* HERO SECTION */}
        <section className="pt-16 pb-24 px-6 max-w-7xl mx-auto text-center">
          {/* Top Pill Tag */}
          <div className="inline-flex items-center gap-2 bg-[#1f2833]/80 border border-[#45f3ff]/30 px-4 py-2 rounded-full text-xs font-semibold text-[#45f3ff] shadow-glow mb-8 animate-pulse">
            <Sparkles className="h-4 w-4" />
            <span>The #1 Peer-to-Peer Student Skill Exchange</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.15] max-w-5xl mx-auto mb-6">
            Teach What You Know.{' '}
            <span className="bg-gradient-to-r from-[#45f3ff] via-[#6f42c1] to-[#45f3ff] bg-clip-text text-transparent">
              Learn What You Want.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            SkillSwap connects college students to trade knowledge 1-on-1. Master React, Calculus, or Design by teaching Python, Physics, or Guitar—zero tuition, pure student collaboration.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => navigate(user ? '/dashboard' : '/login')}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-[#45f3ff] to-[#6f42c1] hover:brightness-110 text-white font-bold text-base px-8 py-4 rounded-2xl shadow-glow-lg transition-all active:scale-[0.98]"
            >
              <span>{user ? 'Open SkillSwap Dashboard' : 'Join SkillSwap Free'}</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1f2833]/60 hover:bg-[#1f2833] text-white font-semibold text-base px-7 py-4 rounded-2xl border border-gray-700 hover:border-[#45f3ff]/40 transition-all"
            >
              <BookOpen className="h-5 w-5 text-[#45f3ff]" />
              <span>See How It Works</span>
            </a>
          </div>

          {/* INTERACTIVE MATCH PREVIEW MOCKUP CARD */}
          <div className="max-w-4xl mx-auto bg-[#1f2833]/70 backdrop-blur-xl border border-[#45f3ff]/30 rounded-3xl p-6 md:p-8 shadow-glow-lg text-left relative overflow-hidden">
            {/* Ambient Lighting */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#45f3ff]/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Header Badge */}
            <div className="flex items-center justify-between border-b border-[#45f3ff]/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Live Match Preview</span>
              </div>
              <span className="text-xs text-gray-400 bg-[#0b0c10] px-3 py-1 rounded-full border border-gray-800">
                98% Compatibility Score
              </span>
            </div>

            {/* Swapper Match Row */}
            <div className="grid md:grid-cols-2 gap-6 items-center">
              {/* Student A */}
              <div className="bg-[#0b0c10]/90 border border-gray-800 rounded-2xl p-5 relative group hover:border-[#45f3ff]/40 transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-[#45f3ff] to-blue-600 flex items-center justify-center font-bold text-white text-lg shadow-glow">
                    A
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Alex Chen</h3>
                    <p className="text-xs text-gray-400">EECS Major • MIT '25</p>
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-gray-400">Teaches:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      <span className="bg-[#45f3ff]/15 text-[#45f3ff] px-2.5 py-1 rounded-md font-medium">React.js</span>
                      <span className="bg-[#45f3ff]/15 text-[#45f3ff] px-2.5 py-1 rounded-md font-medium">Node.js</span>
                    </div>
                  </div>
                  <div className="pt-1">
                    <span className="text-gray-400">Wants to Learn:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      <span className="bg-[#6f42c1]/20 text-purple-300 px-2.5 py-1 rounded-md font-medium">UI/UX Design</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Swap Connection Center Indicator */}
              <div className="flex md:hidden justify-center my-[-8px]">
                <div className="h-10 w-10 bg-[#45f3ff] text-black rounded-full flex items-center justify-center shadow-glow">
                  <Zap className="h-5 w-5 fill-black" />
                </div>
              </div>

              {/* Student B */}
              <div className="bg-[#0b0c10]/90 border border-gray-800 rounded-2xl p-5 relative group hover:border-[#6f42c1]/40 transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-[#6f42c1] to-pink-600 flex items-center justify-center font-bold text-white text-lg shadow-glow">
                    S
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Sarah Jenkins</h3>
                    <p className="text-xs text-gray-400">Design Lead • Stanford '26</p>
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-gray-400">Teaches:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      <span className="bg-[#6f42c1]/20 text-purple-300 px-2.5 py-1 rounded-md font-medium">UI/UX Design</span>
                      <span className="bg-[#6f42c1]/20 text-purple-300 px-2.5 py-1 rounded-md font-medium">Figma</span>
                    </div>
                  </div>
                  <div className="pt-1">
                    <span className="text-gray-400">Wants to Learn:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      <span className="bg-[#45f3ff]/15 text-[#45f3ff] px-2.5 py-1 rounded-md font-medium">React.js</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Pact Preview Bar */}
            <div className="mt-6 pt-4 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0b0c10]/50 p-4 rounded-xl">
              <div className="flex items-center gap-3 text-xs text-gray-300">
                <FileText className="h-4 w-4 text-[#45f3ff]" />
                <span>Proposed Skill Pact: <strong>2 Sessions/Week</strong> • Frontend & Design</span>
              </div>
              <button 
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto bg-[#45f3ff] hover:bg-[#34dbe7] text-black font-bold text-xs px-4 py-2 rounded-lg transition-colors shadow-glow"
              >
                Create Skill Pact Now
              </button>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-20 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold text-[#45f3ff] uppercase tracking-widest mb-3">Platform Features</h2>
            <p className="text-3xl md:text-5xl font-extrabold text-white">Everything You Need to Master Any Skill</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-[#1f2833]/60 backdrop-blur-md border border-[#45f3ff]/20 p-6 rounded-2xl hover:border-[#45f3ff]/50 transition-all hover:-translate-y-1">
              <div className="h-12 w-12 rounded-xl bg-[#45f3ff]/10 border border-[#45f3ff]/30 flex items-center justify-center text-[#45f3ff] mb-5">
                <BrainCircuit className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Smart Skill Matching</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Algorithm matches your learning goals with peers who excel in those areas and want to learn what you offer.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#1f2833]/60 backdrop-blur-md border border-[#6f42c1]/20 p-6 rounded-2xl hover:border-[#6f42c1]/50 transition-all hover:-translate-y-1">
              <div className="h-12 w-12 rounded-xl bg-[#6f42c1]/10 border border-[#6f42c1]/30 flex items-center justify-center text-purple-400 mb-5">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Skill Pacts</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Formalize mutual learning agreements with custom goals, session logs, and verified completion certificates.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#1f2833]/60 backdrop-blur-md border border-[#45f3ff]/20 p-6 rounded-2xl hover:border-[#45f3ff]/50 transition-all hover:-translate-y-1">
              <div className="h-12 w-12 rounded-xl bg-[#45f3ff]/10 border border-[#45f3ff]/30 flex items-center justify-center text-[#45f3ff] mb-5">
                <Video className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Live Workshops</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Join or host student-led virtual study rooms, live coding sessions, and interactive group masterclasses.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#1f2833]/60 backdrop-blur-md border border-orange-500/20 p-6 rounded-2xl hover:border-orange-500/50 transition-all hover:-translate-y-1">
              <div className="h-12 w-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-5">
                <Flame className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Gamified XP & Streaks</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Earn XP points, level up your profile, climb college leaderboards, and maintain daily learning streaks.
              </p>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="py-20 px-6 max-w-7xl mx-auto bg-[#1f2833]/30 rounded-3xl border border-gray-800 my-10">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold text-[#45f3ff] uppercase tracking-widest mb-3">Simple Process</h2>
            <p className="text-3xl md:text-4xl font-extrabold text-white">How SkillSwap Works in 3 Steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-[#0b0c10] border border-gray-800 p-8 rounded-2xl relative">
              <div className="h-10 w-10 bg-[#45f3ff] text-black font-extrabold rounded-xl flex items-center justify-center text-lg mb-6 shadow-glow">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-3">List Your Skills</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Set up your profile with skills you can teach (e.g. Python, French) and skills you want to learn (e.g. Figma, Calculus).
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#0b0c10] border border-gray-800 p-8 rounded-2xl relative">
              <div className="h-10 w-10 bg-[#6f42c1] text-white font-extrabold rounded-xl flex items-center justify-center text-lg mb-6 shadow-glow">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Find Your Match</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Browse complementary student profiles or let our intelligent match engine suggest optimal study partners.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#0b0c10] border border-gray-800 p-8 rounded-2xl relative">
              <div className="h-10 w-10 bg-emerald-400 text-black font-extrabold rounded-xl flex items-center justify-center text-lg mb-6 shadow-glow">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Swap & Level Up</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Connect via chat or video call, create a Skill Pact, complete sessions, and earn reputation badges together.
              </p>
            </div>
          </div>
        </section>

        {/* POPULAR CATEGORIES */}
        <section id="categories" className="py-20 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold text-[#45f3ff] uppercase tracking-widest mb-3">Diverse Subjects</h2>
            <p className="text-3xl md:text-4xl font-extrabold text-white">Popular Skill Categories</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[
              { icon: Code, name: 'Programming', count: '1,200+ Skills' },
              { icon: Palette, name: 'Design & Art', count: '850+ Skills' },
              { icon: GraduationCap, name: 'Academics & STEM', count: '1,500+ Skills' },
              { icon: MessageSquare, name: 'Languages', count: '640+ Skills' },
              { icon: Award, name: 'Music & Hobbies', count: '420+ Skills' },
            ].map((cat, i) => {
              const Icon = cat.icon;
              return (
                <div key={i} className="bg-[#1f2833]/50 border border-gray-800 hover:border-[#45f3ff]/40 p-5 rounded-2xl text-center group cursor-pointer transition-all hover:-translate-y-1">
                  <div className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center mx-auto text-[#45f3ff] mb-3 group-hover:bg-[#45f3ff]/20 transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-white text-sm mb-1">{cat.name}</h4>
                  <span className="text-xs text-gray-500">{cat.count}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* COMMUNITY IMPACT STATS */}
        <section id="community" className="py-16 px-6 max-w-7xl mx-auto border-t border-b border-gray-800 my-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-5xl font-black text-[#45f3ff] mb-2">10k+</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Active Swappers</div>
            </div>
            <div>
              <div className="text-3xl md:text-5xl font-black text-purple-400 mb-2">25k+</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Hours Shared</div>
            </div>
            <div>
              <div className="text-3xl md:text-5xl font-black text-emerald-400 mb-2">98%</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Match Rating</div>
            </div>
            <div>
              <div className="text-3xl md:text-5xl font-black text-orange-400 mb-2">50+</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Campuses</div>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA BANNER */}
        <section className="py-20 px-6 max-w-5xl mx-auto text-center">
          <div className="bg-gradient-to-r from-[#1f2833] via-[#0b0c10] to-[#1f2833] border border-[#45f3ff]/30 p-10 md:p-14 rounded-3xl shadow-glow-lg relative overflow-hidden">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
              Ready to Swap Your Skills?
            </h2>
            <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto mb-8">
              Join thousands of college students leveling up their knowledge together. Zero cost, maximum impact.
            </p>
            <button
              onClick={() => navigate(user ? '/dashboard' : '/login')}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[#45f3ff] to-[#6f42c1] hover:brightness-110 text-white font-bold text-base px-8 py-4 rounded-2xl shadow-glow transition-all active:scale-[0.98]"
            >
              <span>{user ? 'Go to Your Dashboard' : 'Get Started Now'}</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-800 bg-[#0b0c10] py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 bg-gradient-to-tr from-[#45f3ff] to-[#6f42c1] rounded-lg flex items-center justify-center text-white">
              <Zap className="h-4 w-4" />
            </div>
            <span className="text-white font-semibold text-sm">SkillSwap</span>
            <span>© 2026 SkillSwap Platform. Peer-to-Peer Student Exchange.</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#features" className="hover:text-gray-300 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-gray-300 transition-colors">How It Works</a>
            <button onClick={() => navigate('/login')} className="hover:text-gray-300 transition-colors">Login / Register</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
