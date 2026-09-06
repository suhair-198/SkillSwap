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
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans selection:bg-orange-100 selection:text-[#ff6b00] overflow-x-hidden">
      {/* Light Gradient Lighting Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-orange-100/60 via-slate-100/30 to-transparent blur-[120px]"></div>
        <div className="absolute top-[40%] right-[10%] w-[400px] h-[400px] bg-amber-100/40 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[10%] left-[5%] w-[500px] h-[500px] bg-slate-200/50 rounded-full blur-[140px]"></div>
      </div>

      {/* Navigation Header */}
      <header className="relative z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl sticky top-0 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="h-10 w-10 bg-gradient-to-tr from-[#ff6b00] to-orange-500 rounded-xl flex items-center justify-center shadow-glow transition-transform duration-300 group-hover:scale-105">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-wider text-[#0f172a]">
              Skill<span className="text-[#ff6b00]">Swap</span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-[#ff6b00] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#ff6b00] transition-colors">How It Works</a>
            <a href="#categories" className="hover:text-[#ff6b00] transition-colors">Categories</a>
            <a href="#community" className="hover:text-[#ff6b00] transition-colors">Community</a>
          </nav>

          {/* Auth Action Buttons */}
          <div className="flex items-center gap-4">
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 bg-gradient-to-r from-[#ff6b00] to-orange-600 hover:brightness-110 text-white font-bold px-5 py-2.5 rounded-xl shadow-glow transition-all active:scale-[0.98] text-sm"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="text-sm font-semibold text-slate-700 hover:text-[#ff6b00] px-4 py-2 rounded-xl hover:bg-slate-100 transition-all"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#ff6b00] to-orange-600 hover:brightness-110 text-white font-bold px-5 py-2.5 rounded-xl shadow-glow transition-all active:scale-[0.98] text-sm"
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
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 px-4 py-2 rounded-full text-xs font-bold text-[#ff6b00] shadow-xs mb-8">
            <Sparkles className="h-4 w-4" />
            <span>The #1 Peer-to-Peer Student Skill Exchange</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-[#0f172a] tracking-tight leading-[1.15] max-w-5xl mx-auto mb-6">
            Teach What You Know.{' '}
            <span className="bg-gradient-to-r from-[#ff6b00] via-orange-500 to-[#0f172a] bg-clip-text text-transparent">
              Learn What You Want.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
            SkillSwap connects college students to trade knowledge 1-on-1. Master React, Calculus, or Design by teaching Python, Physics, or Guitar—zero tuition, pure student collaboration.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => navigate(user ? '/dashboard' : '/login')}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-[#ff6b00] to-orange-600 hover:brightness-110 text-white font-extrabold text-base px-8 py-4 rounded-2xl shadow-glow-lg transition-all active:scale-[0.98]"
            >
              <span>{user ? 'Open SkillSwap Dashboard' : 'Join SkillSwap Free'}</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-[#0f172a] font-bold text-base px-7 py-4 rounded-2xl border border-slate-300 shadow-sm transition-all"
            >
              <BookOpen className="h-5 w-5 text-[#ff6b00]" />
              <span>See How It Works</span>
            </a>
          </div>

          {/* INTERACTIVE MATCH PREVIEW MOCKUP CARD */}
          <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xl text-left relative overflow-hidden">
            {/* Header Badge */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider">Live Match Preview</span>
              </div>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                98% Compatibility Score
              </span>
            </div>

            {/* Swapper Match Row */}
            <div className="grid md:grid-cols-2 gap-6 items-center">
              {/* Student A */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 relative group hover:border-orange-300 transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-[#ff6b00] to-orange-400 flex items-center justify-center font-bold text-white text-lg shadow-glow">
                    A
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[#0f172a] text-base">Alex Chen</h3>
                    <p className="text-xs text-slate-500 font-medium">EECS Major • MIT '25</p>
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-500 font-semibold">Teaches:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      <span className="bg-orange-100 text-[#ff6b00] px-2.5 py-1 rounded-md font-bold">React.js</span>
                      <span className="bg-orange-100 text-[#ff6b00] px-2.5 py-1 rounded-md font-bold">Node.js</span>
                    </div>
                  </div>
                  <div className="pt-1">
                    <span className="text-slate-500 font-semibold">Wants to Learn:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      <span className="bg-slate-200 text-[#0f172a] px-2.5 py-1 rounded-md font-bold">UI/UX Design</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Swap Connection Center Indicator */}
              <div className="flex md:hidden justify-center my-[-8px]">
                <div className="h-10 w-10 bg-[#ff6b00] text-white rounded-full flex items-center justify-center shadow-glow">
                  <Zap className="h-5 w-5 fill-white" />
                </div>
              </div>

              {/* Student B */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 relative group hover:border-[#0f172a]/30 transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-[#0f172a] flex items-center justify-center font-bold text-white text-lg shadow-md">
                    S
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[#0f172a] text-base">Sarah Jenkins</h3>
                    <p className="text-xs text-slate-500 font-medium">Design Lead • Stanford '26</p>
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-500 font-semibold">Teaches:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      <span className="bg-slate-200 text-[#0f172a] px-2.5 py-1 rounded-md font-bold">UI/UX Design</span>
                      <span className="bg-slate-200 text-[#0f172a] px-2.5 py-1 rounded-md font-bold">Figma</span>
                    </div>
                  </div>
                  <div className="pt-1">
                    <span className="text-slate-500 font-semibold">Wants to Learn:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      <span className="bg-orange-100 text-[#ff6b00] px-2.5 py-1 rounded-md font-bold">React.js</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Pact Preview Bar */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl">
              <div className="flex items-center gap-3 text-xs text-slate-700 font-semibold">
                <FileText className="h-4 w-4 text-[#ff6b00]" />
                <span>Proposed Skill Pact: <strong>2 Sessions/Week</strong> • Frontend & Design</span>
              </div>
              <button 
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto bg-[#ff6b00] hover:bg-orange-600 text-white font-extrabold text-xs px-4 py-2.5 rounded-lg transition-colors shadow-glow"
              >
                Create Skill Pact Now
              </button>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-20 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-xs font-extrabold text-[#ff6b00] uppercase tracking-widest mb-3">Platform Features</h2>
            <p className="text-3xl md:text-5xl font-black text-[#0f172a]">Everything You Need to Master Any Skill</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl hover:border-orange-300 shadow-sm transition-all hover:-translate-y-1">
              <div className="h-12 w-12 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-[#ff6b00] mb-5">
                <BrainCircuit className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0f172a] mb-2">Smart Skill Matching</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Algorithm matches your learning goals with peers who excel in those areas and want to learn what you offer.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl hover:border-[#0f172a]/40 shadow-sm transition-all hover:-translate-y-1">
              <div className="h-12 w-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-[#0f172a] mb-5">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0f172a] mb-2">Skill Pacts</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Formalize mutual learning agreements with custom goals, session logs, and verified completion certificates.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl hover:border-orange-300 shadow-sm transition-all hover:-translate-y-1">
              <div className="h-12 w-12 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-[#ff6b00] mb-5">
                <Video className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0f172a] mb-2">Live Workshops</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Join or host student-led virtual study rooms, live coding sessions, and interactive group masterclasses.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl hover:border-amber-300 shadow-sm transition-all hover:-translate-y-1">
              <div className="h-12 w-12 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600 mb-5">
                <Flame className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0f172a] mb-2">Gamified XP & Streaks</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Earn XP points, level up your profile, climb college leaderboards, and maintain daily learning streaks.
              </p>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="py-20 px-6 max-w-7xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-lg my-10">
          <div className="text-center mb-16">
            <h2 className="text-xs font-extrabold text-[#ff6b00] uppercase tracking-widest mb-3">Simple Process</h2>
            <p className="text-3xl md:text-4xl font-black text-[#0f172a]">How SkillSwap Works in 3 Steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-slate-50 border border-slate-200 p-8 rounded-2xl relative">
              <div className="h-10 w-10 bg-[#ff6b00] text-white font-extrabold rounded-xl flex items-center justify-center text-lg mb-6 shadow-glow">
                1
              </div>
              <h3 className="text-xl font-bold text-[#0f172a] mb-3">List Your Skills</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Set up your profile with skills you can teach (e.g. Python, French) and skills you want to learn (e.g. Figma, Calculus).
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 border border-slate-200 p-8 rounded-2xl relative">
              <div className="h-10 w-10 bg-[#0f172a] text-white font-extrabold rounded-xl flex items-center justify-center text-lg mb-6 shadow-md">
                2
              </div>
              <h3 className="text-xl font-bold text-[#0f172a] mb-3">Find Your Match</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Browse complementary student profiles or let our intelligent match engine suggest optimal study partners.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 border border-slate-200 p-8 rounded-2xl relative">
              <div className="h-10 w-10 bg-emerald-600 text-white font-extrabold rounded-xl flex items-center justify-center text-lg mb-6 shadow-md">
                3
              </div>
              <h3 className="text-xl font-bold text-[#0f172a] mb-3">Swap & Level Up</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Connect via chat or video call, create a Skill Pact, complete sessions, and earn reputation badges together.
              </p>
            </div>
          </div>
        </section>

        {/* POPULAR CATEGORIES */}
        <section id="categories" className="py-20 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-xs font-extrabold text-[#ff6b00] uppercase tracking-widest mb-3">Diverse Subjects</h2>
            <p className="text-3xl md:text-4xl font-black text-[#0f172a]">Popular Skill Categories</p>
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
                <div key={i} className="bg-white border border-slate-200 hover:border-orange-300 p-5 rounded-2xl text-center group cursor-pointer shadow-sm transition-all hover:-translate-y-1">
                  <div className="h-10 w-10 bg-orange-50 rounded-xl flex items-center justify-center mx-auto text-[#ff6b00] mb-3 group-hover:bg-[#ff6b00] group-hover:text-white transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-[#0f172a] text-sm mb-1">{cat.name}</h4>
                  <span className="text-xs text-slate-500 font-medium">{cat.count}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* COMMUNITY IMPACT STATS */}
        <section id="community" className="py-16 px-6 max-w-7xl mx-auto border-t border-b border-slate-200 my-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-5xl font-black text-[#ff6b00] mb-2">10k+</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider font-extrabold">Active Swappers</div>
            </div>
            <div>
              <div className="text-3xl md:text-5xl font-black text-[#0f172a] mb-2">25k+</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider font-extrabold">Hours Shared</div>
            </div>
            <div>
              <div className="text-3xl md:text-5xl font-black text-emerald-600 mb-2">98%</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider font-extrabold">Match Rating</div>
            </div>
            <div>
              <div className="text-3xl md:text-5xl font-black text-amber-600 mb-2">50+</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider font-extrabold">Campuses</div>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA BANNER */}
        <section className="py-20 px-6 max-w-5xl mx-auto text-center">
          <div className="bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white p-10 md:p-14 rounded-3xl shadow-xl relative overflow-hidden">
            <h2 className="text-3xl md:text-5xl font-black mb-6">
              Ready to Swap Your Skills?
            </h2>
            <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto mb-8 font-medium">
              Join thousands of college students leveling up their knowledge together. Zero cost, maximum impact.
            </p>
            <button
              onClick={() => navigate(user ? '/dashboard' : '/login')}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[#ff6b00] to-orange-500 hover:brightness-110 text-white font-extrabold text-base px-8 py-4 rounded-2xl shadow-glow transition-all active:scale-[0.98]"
            >
              <span>{user ? 'Go to Your Dashboard' : 'Get Started Now'}</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 bg-gradient-to-tr from-[#ff6b00] to-orange-500 rounded-lg flex items-center justify-center text-white">
              <Zap className="h-4 w-4" />
            </div>
            <span className="text-[#0f172a] font-bold text-sm">SkillSwap</span>
            <span>© 2026 SkillSwap Platform. Peer-to-Peer Student Exchange.</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#features" className="hover:text-[#ff6b00] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#ff6b00] transition-colors">How It Works</a>
            <button onClick={() => navigate('/login')} className="hover:text-[#ff6b00] transition-colors">Login / Register</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
