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
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Connections', path: '/connections', icon: Users },
    { name: 'Messages', path: '/chat', icon: MessageSquare },
    { name: 'Learning Groups', path: '/groups', icon: FolderGit2 },
    { name: 'Live Classes', path: '/classes', icon: Tv },
    { name: 'Skill Pacts', path: '/pacts', icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-[#0b0c10] text-[#c5c6c7] font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1f2833] border-r border-[#45f3ff]/20 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-[#45f3ff]/10">
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-[#45f3ff] animate-pulse" />
              <span className="text-xl font-bold tracking-wider text-white">
                Skill<span className="text-[#45f3ff]">Swap</span>
              </span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group text-left ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#45f3ff]/20 to-[#6f42c1]/20 border-l-4 border-[#45f3ff] text-white font-medium shadow-glow'
                      : 'hover:bg-white/5 hover:text-white text-gray-400'
                  }`}
                >
                  <Icon className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-[#45f3ff]' : ''}`} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Footer in Sidebar */}
        <div className="p-4 border-t border-[#45f3ff]/10 bg-black/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#45f3ff] to-[#6f42c1] flex items-center justify-center font-bold text-white shadow-glow">
              {user.fullName.charAt(0)}
            </div>
            <div className="truncate">
              <div className="font-semibold text-white truncate">{user.fullName}</div>
              <div className="text-xs text-gray-400 truncate">{user.email}</div>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-red-500/30 hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors duration-300 text-sm font-medium"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-[#45f3ff]/10 flex items-center justify-between px-8 bg-[#1f2833]/50 backdrop-blur-md sticky top-0 z-40 shrink-0">
          <div className="text-lg font-medium text-white capitalize">
            {location.pathname === '/' ? 'Match Finder' : location.pathname.substring(1).replace('-', ' ')}
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-6">
            {/* Streak */}
            <div className="flex items-center gap-2 bg-[#0b0c10]/80 px-3 py-1.5 rounded-full border border-orange-500/30">
              <Flame className="h-5 w-5 text-orange-500 fill-orange-500 animate-bounce" />
              <span className="text-sm font-semibold text-orange-400">{user.currentStreak} Day Streak</span>
            </div>

            {/* XP and Level */}
            <div className="flex items-center gap-4 bg-[#0b0c10]/80 px-4 py-1.5 rounded-full border border-[#45f3ff]/20">
              <div className="flex items-center gap-1.5">
                <Award className="h-5 w-5 text-[#45f3ff]" />
                <span className="text-sm font-bold text-white">Lvl {user.level}</span>
              </div>
              <div className="h-3 w-20 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#45f3ff] to-[#6f42c1]"
                  style={{ width: `${(user.xp % 1000) / 10}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-400 font-medium">{user.xp} XP</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#0b0c10]">
          {children}
        </main>
      </div>
    </div>
  );
};
