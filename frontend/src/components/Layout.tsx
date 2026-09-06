import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  User, 
  Users, 
  MessageSquare, 
  FolderGit2, 
  Tv, 
  FileText, 
  LogOut, 
  Award, 
  Flame, 
  Zap 
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return <>{children}</>;

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Connections', path: '/connections', icon: Users },
    { name: 'Messages', path: '/chat', icon: MessageSquare },
    { name: 'Learning Groups', path: '/groups', icon: FolderGit2 },
    { name: 'Live Classes', path: '/classes', icon: Tv },
    { name: 'Skill Pacts', path: '/pacts', icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 font-sans overflow-hidden">
      {/* Sidebar - Deep Navy Blue */}
      <aside className="w-64 bg-[#0f172a] text-slate-300 border-r border-slate-800 flex flex-col justify-between shrink-0 shadow-lg">
        <div>
          {/* Logo */}
          <div 
            onClick={() => navigate('/')}
            className="h-16 flex items-center px-6 border-b border-slate-800/80 cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 bg-gradient-to-tr from-[#ff6b00] to-amber-500 rounded-xl flex items-center justify-center shadow-glow">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-wider text-white">
                Skill<span className="text-[#ff6b00]">Swap</span>
              </span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="p-4 space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-left ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#ff6b00] to-orange-600 text-white font-semibold shadow-glow'
                      : 'hover:bg-slate-800/80 hover:text-white text-slate-400'
                  }`}
                >
                  <Icon className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-white' : ''}`} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Footer in Sidebar */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#ff6b00] to-amber-500 flex items-center justify-center font-bold text-white shadow-glow">
              {user.fullName.charAt(0)}
            </div>
            <div className="truncate">
              <div className="font-bold text-white text-sm truncate">{user.fullName}</div>
              <div className="text-xs text-slate-400 truncate">{user.email}</div>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-red-500/30 hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors duration-200 text-sm font-medium"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-slate-200 flex items-center justify-between px-8 bg-white/90 backdrop-blur-md sticky top-0 z-40 shrink-0 shadow-xs">
          <div className="text-lg font-bold text-[#0f172a] capitalize tracking-wide">
            {location.pathname === '/dashboard' || location.pathname === '/' ? 'Match Finder' : location.pathname.substring(1).replace('-', ' ')}
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-6">
            {/* Streak */}
            <div className="flex items-center gap-2 bg-orange-50 px-3.5 py-1.5 rounded-full border border-orange-200">
              <Flame className="h-5 w-5 text-[#ff6b00] fill-[#ff6b00] animate-bounce" />
              <span className="text-xs font-bold text-orange-600">{user.currentStreak} Day Streak</span>
            </div>

            {/* XP and Level */}
            <div className="flex items-center gap-4 bg-slate-100 px-4 py-1.5 rounded-full border border-slate-200">
              <div className="flex items-center gap-1.5">
                <Award className="h-4 w-4 text-[#ff6b00]" />
                <span className="text-xs font-bold text-slate-800">Lvl {user.level}</span>
              </div>
              <div className="h-2.5 w-20 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#ff6b00] to-orange-400"
                  style={{ width: `${(user.xp % 1000) / 10}%` }}
                ></div>
              </div>
              <span className="text-xs text-slate-500 font-semibold">{user.xp} XP</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#f8fafc]">
          {children}
        </main>
      </div>
    </div>
  );
};
