import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Zap, 
  ArrowRight, 
  Sparkles, 
  Users, 
  MessageSquare, 
  CheckCircle2,
  ArrowRightLeft,
  BookOpen,
  Trophy,
  ShieldCheck
} from 'lucide-react';

interface MockPeer {
  name: string;
  college: string;
  teaches: string;
  learns: string;
  matchScore: number;
  initials: string;
}

const PEER_MATCHES: Record<string, MockPeer> = {
  'Python': {
    name: 'Devon Vance',
    college: 'Stanford • AI & Robotics',
    teaches: 'Python',
    learns: 'TypeScript',
    matchScore: 99,
    initials: 'DV'
  },
  'React': {
    name: 'Elena Rostova',
    college: 'MIT • Computer Science',
    teaches: 'React',
    learns: 'UI/UX Design',
    matchScore: 98,
    initials: 'ER'
  },
  'UI/UX Design': {
    name: 'Sophia Martinez',
    college: 'UC Berkeley • Design & HCI',
    teaches: 'UI/UX Design',
    learns: 'Frontend Code',
    matchScore: 97,
    initials: 'SM'
  },
  'Calculus': {
    name: 'Marcus Chen',
    college: 'Caltech • Applied Math',
    teaches: 'Calculus',
    learns: 'Data Science',
    matchScore: 96,
    initials: 'MC'
  }
};

const POPULAR_TEACH = ['Python', 'React', 'UI/UX Design', 'Calculus'];
const POPULAR_LEARN = ['TypeScript', 'UI/UX Design', 'Data Science', 'Machine Learning'];

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [selectedTeach, setSelectedTeach] = useState('Python');
  const [selectedLearn, setSelectedLearn] = useState('TypeScript');

  const currentPeer = PEER_MATCHES[selectedTeach] || PEER_MATCHES['Python'];

  return (
    <div className="min-h-screen bg-[#fdf8f0] text-gray-900 font-sans selection:bg-orange-500 selection:text-white flex flex-col">
      
      {/* ── TOP NAV BAR ── */}
      <header className="border-b border-gray-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-18 flex items-center justify-between">
          
          {/* Logo */}
          <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="h-10 w-10 bg-gradient-to-tr from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <Zap className="h-5 w-5 text-white fill-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-gray-900">
                Skill<span className="text-orange-500">Swap</span>
              </span>
            </div>
          </div>

          {/* Quick Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
            <a href="#how-it-works" className="hover:text-orange-600 transition-colors">How It Works</a>
            <a href="#preview" className="hover:text-orange-600 transition-colors">Find a Partner</a>
          </nav>

          {/* Action Button */}
          <div className="flex items-center gap-3">
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-4 py-2 rounded-xl text-sm shadow-md shadow-orange-500/20 active:scale-95 transition-all"
              >
                <span>Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => navigate('/login')}
                  className="text-sm font-semibold text-gray-600 hover:text-gray-900 px-3.5 py-2 rounded-xl transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-4 py-2 rounded-xl text-sm shadow-md shadow-orange-500/20 active:scale-95 transition-all"
                >
                  <span>Get Started</span>
                  <Sparkles className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── LIGHT THEMED HERO SECTION ── */}
      <main className="flex-1">
        <section className="pt-16 pb-14 px-6 max-w-5xl mx-auto text-center">
          
          {/* Subtle Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/70 border border-orange-200 text-orange-800 text-xs font-bold mb-6">
            <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            <span>Zero Tuition • 100% Peer Student Exchange</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight leading-[1.12] max-w-3xl mx-auto mb-5">
            Stop Paying For Tutors.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500">
              Trade Skills 1-on-1.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
            Master what you need by teaching what you know. Instant student matching, collaborative Skill Pacts, and real-time chat.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-14">
            <button
              onClick={() => navigate(user ? '/dashboard' : '/login')}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-base px-7 py-3.5 rounded-xl shadow-lg shadow-orange-500/25 active:scale-95 transition-all"
            >
              <span>{user ? 'Go to Dashboard' : 'Find Your Swap Partner'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigate(user ? '/classes' : '/login')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-base px-6 py-3.5 rounded-xl border border-gray-200 shadow-sm transition-all"
            >
              <BookOpen className="h-4 w-4 text-orange-500" />
              <span>Browse Live Study Rooms</span>
            </button>
          </div>

          {/* ── SIMPLE INTERACTIVE PREVIEW CARD (LIGHT THEMED) ── */}
          <div id="preview" className="max-w-3xl mx-auto text-left">
            <div className="bg-white border border-gray-200/90 rounded-2xl p-6 sm:p-7 shadow-lg shadow-gray-200/50">
              
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                    <ArrowRightLeft className="h-4 w-4" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm">How a Swap Works</h3>
                </div>
                <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{currentPeer.matchScore}% Match</span>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                {/* Selectors */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      1. You Teach:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {POPULAR_TEACH.map((skill) => (
                        <button
                          key={skill}
                          onClick={() => setSelectedTeach(skill)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            selectedTeach === skill
                              ? 'bg-orange-500 text-white shadow-sm'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      2. You Learn:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {POPULAR_LEARN.map((skill) => (
                        <button
                          key={skill}
                          onClick={() => setSelectedLearn(skill)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            selectedLearn === skill
                              ? 'bg-amber-500 text-white shadow-sm'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Match Result */}
                <div className="bg-orange-50/60 border border-orange-100 rounded-xl p-4.5 flex flex-col justify-between">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                      {currentPeer.initials}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{currentPeer.name}</h4>
                      <p className="text-xs text-gray-500">{currentPeer.college}</p>
                    </div>
                  </div>

                  <div className="text-xs text-gray-600 bg-white rounded-lg p-3 border border-orange-100 mb-3.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Teaches you:</span>
                      <span className="font-bold text-gray-900">{selectedLearn}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Learns from you:</span>
                      <span className="font-bold text-orange-600">{selectedTeach}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(user ? '/chat' : '/login')}
                    className="w-full flex items-center justify-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2.5 rounded-lg transition-colors"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>Connect & Start Chat</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

        </section>

        {/* ── 3 SIMPLE STEPS: CLEAN & CONCISE ── */}
        <section id="how-it-works" className="py-12 px-6 max-w-5xl mx-auto border-t border-gray-200/70">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-gray-900">How SkillSwap Works</h2>
            <p className="text-sm text-gray-500 mt-1">Simple peer-to-peer knowledge bartering in three steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white border border-gray-200/80 rounded-xl p-5 shadow-sm">
              <div className="h-8 w-8 rounded-lg bg-orange-100 text-orange-600 font-bold flex items-center justify-center text-sm mb-3.5">
                1
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-1">List Your Skills</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Add skills you can teach and skills you want to learn. It only takes a minute to set up your profile.
              </p>
            </div>

            <div className="bg-white border border-gray-200/80 rounded-xl p-5 shadow-sm">
              <div className="h-8 w-8 rounded-lg bg-amber-100 text-amber-600 font-bold flex items-center justify-center text-sm mb-3.5">
                2
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-1">Get Matched</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Our algorithm matches you with students whose teaching and learning goals complement yours.
              </p>
            </div>

            <div className="bg-white border border-gray-200/80 rounded-xl p-5 shadow-sm">
              <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-600 font-bold flex items-center justify-center text-sm mb-3.5">
                3
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-1">Swap & Earn XP</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Chat in real-time, create mutual Skill Pacts, schedule study sessions, and climb campus leaderboards.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* ── CONCISE FOOTER ── */}
      <footer className="border-t border-gray-200 bg-white py-6 px-6 mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-orange-500 rounded-md flex items-center justify-center text-white">
              <Zap className="h-3.5 w-3.5 fill-white" />
            </div>
            <span className="font-bold text-gray-800">SkillSwap</span>
            <span>© 2026 Peer Learning Platform.</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="#how-it-works" className="hover:text-gray-900 transition-colors">How It Works</a>
            <button onClick={() => navigate('/login')} className="hover:text-gray-900 transition-colors">
              Sign In
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
};
