import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, Mail, Lock, User, GraduationCap, Building } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Form State
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
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-200/50 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-200/70 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-8 shadow-xl relative z-10">
        {/* Brand Logo */}
        <div className="flex flex-col items-center mb-8">
          <div 
            onClick={() => navigate('/')}
            className="h-12 w-12 bg-gradient-to-tr from-[#ff6b00] to-orange-500 rounded-2xl flex items-center justify-center shadow-glow mb-3 cursor-pointer"
          >
            <Zap className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-black text-[#0f172a] tracking-tight">
            {isRegistering ? 'Create Your Account' : 'Welcome to SkillSwap'}
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            {isRegistering ? 'Connect with peers and share your skills' : 'Sign in to swap skills with students'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-xl p-3 mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name (Register Only) */}
          {isRegistering && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <User className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-[#ff6b00] focus:bg-white text-[#0f172a] font-medium rounded-xl py-3 pl-10 pr-4 outline-none transition-colors text-sm"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@college.edu"
                className="w-full bg-slate-50 border border-slate-300 focus:border-[#ff6b00] focus:bg-white text-[#0f172a] font-medium rounded-xl py-3 pl-10 pr-4 outline-none transition-colors text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-300 focus:border-[#ff6b00] focus:bg-white text-[#0f172a] font-medium rounded-xl py-3 pl-10 pr-4 outline-none transition-colors text-sm"
              />
            </div>
          </div>

          {/* College & Department (Register Only) */}
          {isRegistering && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">College</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <GraduationCap className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="MIT"
                    className="w-full bg-slate-50 border border-slate-300 focus:border-[#ff6b00] focus:bg-white text-[#0f172a] font-medium rounded-xl py-3 pl-10 pr-4 outline-none transition-colors text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Department</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Building className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="EECS"
                    className="w-full bg-slate-50 border border-slate-300 focus:border-[#ff6b00] focus:bg-white text-[#0f172a] font-medium rounded-xl py-3 pl-10 pr-4 outline-none transition-colors text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#ff6b00] to-orange-600 hover:brightness-110 active:scale-[0.98] text-white font-extrabold rounded-xl py-3 mt-6 transition-all shadow-glow text-sm disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? 'Authenticating...' : isRegistering ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {/* Divider & Switch */}
        <div className="mt-6 pt-6 border-t border-slate-200 text-center space-y-4">
          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
            }}
            className="text-sm font-bold text-[#ff6b00] hover:underline block w-full"
          >
            {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>

          {/* Quick Demo Login Buttons */}
          <div className="pt-2">
            <span className="text-xs text-slate-500 uppercase tracking-wider font-extrabold block mb-2">Quick Demo Accounts</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmail('alice@skillswap.com');
                  setPassword('password');
                }}
                className="bg-slate-50 hover:bg-orange-50 border border-slate-300 hover:border-orange-300 text-xs py-2 rounded-lg font-bold text-slate-700 hover:text-[#ff6b00] transition-colors"
              >
                Alice (MIT)
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('bob@skillswap.com');
                  setPassword('password');
                }}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-300 hover:border-slate-400 text-xs py-2 rounded-lg font-bold text-slate-700 transition-colors"
              >
                Bob (Harvard)
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('charlie@skillswap.com');
                  setPassword('password');
                }}
                className="bg-slate-50 hover:bg-emerald-50 border border-slate-300 hover:border-emerald-300 text-xs py-2 rounded-lg font-bold text-slate-700 hover:text-emerald-700 transition-colors"
              >
                Charlie
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
