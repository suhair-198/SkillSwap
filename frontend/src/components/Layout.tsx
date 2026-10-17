import React, { useState } from 'react';
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
  Zap,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return <>{children}</>;

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Connections', path: '/connections', icon: Users },
    { name: 'Messages', path: '/chat', icon: MessageSquare },
    { name: 'Groups', path: '/groups', icon: FolderGit2 },
    { name: 'Live Classes', path: '/classes', icon: Tv },
    { name: 'Skill Pacts', path: '/pacts', icon: FileText },
  ];

  const pageName = location.pathname.substring(1).replace('-', ' ') || 'dashboard';

  const handleNav = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#060b14] text-white overflow-hidden">
      {/* ── Mobile Overlay ── */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed md:relative z-40 h-full
        w-[260px] flex flex-col
        bg-[#0a1020] border-r border-[#1a2540]
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo */}
        <div 
          onClick={() => handleNav('/')}
          className="flex items-center gap-3 px-5 py-5 border-b border-[#1a2540] cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#ff6b00] to-amber-500 flex items-center justify-center shadow-orange-glow-sm flex-shrink-0">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-base font-bold tracking-tight">
              Skill<span className="text-[#ff6b00]">Swap</span>
            </div>
            <div className="mono-tag text-[#ff6b00]/60" style={{ fontSize: '9px' }}>BETA v2.0</div>
          </div>
          <button 
            className="ml-auto md:hidden text-slate-500 hover:text-white"
            onClick={(e) => { e.stopPropagation(); setSidebarOpen(false); }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Mini-Profile */}
        <div className="px-4 py-4 border-b border-[#1a2540]">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#111827] border border-[#1a2540]">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#ff6b00] to-amber-500 flex items-center justify-center font-bold text-white text-sm flex-shrink-0 shadow-orange-glow-sm">
              {user.fullName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-sm text-white truncate">{user.fullName}</div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="mono-tag text-[#ff6b00]">LVL {user.level}</span>
                <span className="text-[#1a2540]">•</span>
                <span className="mono-tag text-slate-400">{user.xp} XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => handleNav(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group text-left relative
                  ${isActive 
                    ? 'bg-[#ff6b00]/10 text-[#ff6b00] border border-[#ff6b00]/20' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#ff6b00] rounded-r-full" />
                )}
                <Icon className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110
                  ${isActive ? 'text-[#ff6b00]' : ''}`}
                />
                <span className="flex-1">{item.name}</span>
                {isActive && <ChevronRight className="w-3 h-3 text-[#ff6b00]/50" />}
              </button>
            );
          })}
        </nav>

        {/* Streak + Logout */}
        <div className="px-3 py-4 border-t border-[#1a2540] space-y-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#ff6b00]/5 border border-[#ff6b00]/10">
            <Flame className="w-4 h-4 text-[#ff6b00] flex-shrink-0" />
            <span className="text-xs font-bold text-[#ff6b00]">{user.currentStreak} Day Streak</span>
          </div>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-red-500/20 hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#070d1a] bg-grid-pattern">
        {/* Header */}
        <header className="h-14 border-b border-[#1a2540] flex items-center justify-between px-4 md:px-6 bg-[#0a1020]/80 backdrop-blur-md sticky top-0 z-20 flex-shrink-0">
          {/* Left: Mobile menu + Page title */}
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#ff6b00] animate-pulse" />
              <span className="text-sm font-semibold text-white capitalize tracking-wide hidden sm:block">
                {pageName}
              </span>
            </div>
          </div>

          {/* Right: Stats */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="stat-chip hidden sm:flex">
              <Flame className="w-3 h-3" />
              <span>{user.currentStreak}d</span>
            </div>
            <div className="flex items-center gap-2 bg-[#111827] border border-[#1a2540] px-3 py-1.5 rounded-full">
              <Award className="w-3.5 h-3.5 text-[#ff6b00]" />
              <span className="text-xs font-bold text-white">Lvl {user.level}</span>
              <div className="hidden sm:block w-16 h-1.5 bg-[#1a2540] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#ff6b00] to-amber-400 rounded-full"
                  style={{ width: `${(user.xp % 1000) / 10}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 font-mono hidden md:block">{user.xp} XP</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
