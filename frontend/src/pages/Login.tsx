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
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0c10] px-4">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#45f3ff]/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#6f42c1]/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#1f2833]/80 backdrop-blur-md rounded-2xl border border-[#45f3ff]/20 p-8 shadow-glow-lg relative z-10">
        {/* Brand Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 bg-gradient-to-tr from-[#45f3ff] to-[#6f42c1] rounded-xl flex items-center justify-center shadow-glow mb-3">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-wide">
            {isRegistering ? 'Create your profile' : 'Welcome to SkillSwap'}
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {isRegistering ? 'Connect with peers and share your skills' : 'Sign in to swap skills with students'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg p-3 mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name (Register Only) */}
          {isRegistering && (
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <User className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-[#0b0c10]/60 border border-gray-700 focus:border-[#45f3ff] text-white rounded-xl py-3 pl-10 pr-4 outline-none transition-colors text-sm"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@college.edu"
                className="w-full bg-[#0b0c10]/60 border border-gray-700 focus:border-[#45f3ff] text-white rounded-xl py-3 pl-10 pr-4 outline-none transition-colors text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0b0c10]/60 border border-gray-700 focus:border-[#45f3ff] text-white rounded-xl py-3 pl-10 pr-4 outline-none transition-colors text-sm"
              />
            </div>
          </div>

          {/* College & Department (Register Only) */}
          {isRegistering && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">College</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    <GraduationCap className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="MIT"
                    className="w-full bg-[#0b0c10]/60 border border-gray-700 focus:border-[#45f3ff] text-white rounded-xl py-3 pl-10 pr-4 outline-none transition-colors text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Department</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    <Building className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="EECS"
                    className="w-full bg-[#0b0c10]/60 border border-gray-700 focus:border-[#45f3ff] text-white rounded-xl py-3 pl-10 pr-4 outline-none transition-colors text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#45f3ff] to-[#6f42c1] hover:brightness-110 active:scale-[0.98] text-white font-semibold rounded-xl py-3 mt-6 transition-all shadow-glow text-sm disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? 'Authenticating...' : isRegistering ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {/* Divider & Switch */}
        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
            }}
            className="text-sm text-[#45f3ff] hover:underline"
          >
            {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};
