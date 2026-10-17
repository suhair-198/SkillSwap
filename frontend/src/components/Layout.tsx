import React, { useState, useCallback, createContext, useContext } from 'react';
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
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle
} from 'lucide-react';

// ─── TOAST SYSTEM ────────────────────────────────────────────────────────────
type ToastType = 'success' | 'error' | 'info' | 'warning';
interface Toast { id: string; message: string; type: ToastType; }
interface ToastContextType { showToast: (message: string, type?: ToastType) => void; }

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });
export const useToast = () => useContext(ToastContext);

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const iconMap = {
    success: <CheckCircle className="w-4 h-4 flex-shrink-0" />,
    error: <AlertCircle className="w-4 h-4 flex-shrink-0" />,
    info: <Info className="w-4 h-4 flex-shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 flex-shrink-0" />,
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {iconMap[t.type]}
            <span className="flex-1">{t.message}</span>
            <button
              onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
              className="opacity-50 hover:opacity-100 transition-opacity ml-2"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
// ─────────────────────────────────────────────────────────────────────────────

interface LayoutProps { children: React.ReactNode; }

const LayoutInner: React.FC<LayoutProps> = ({ children }) => {
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

  const pageName = menuItems.find(m => m.path === location.pathname)?.name || 'SkillSwap';

  const handleNav = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const xpPercent = Math.min(((user.xp || 0) % 1000) / 10, 100);

  return (
    <div className="flex h-screen bg-[#fdf8f0] overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed md:relative z-40 h-full
        w-[270px] flex flex-col
        bg-white border-r border-gray-100
        shadow-[4px_0_20px_rgba(0,0,0,0.06)]
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Accent Bar */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#f97316] via-[#7c3aed] to-[#4f46e5]" />

        {/* Logo */}
        <div
          onClick={() => handleNav('/')}
          className="flex items-center gap-3 px-5 py-5 border-b border-gray-100 cursor-pointer ml-1"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#f97316] to-[#7c3aed] flex items-center justify-center shadow-md flex-shrink-0">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-base font-black tracking-tight text-gray-900">
              Skill<span className="text-[#f97316]">Swap</span>
            </div>
            <div className="mono-tag text-[#f97316]/60" style={{ fontSize: '9px' }}>BETA v2.0</div>
          </div>
          <button
            className="ml-auto md:hidden text-gray-400 hover:text-gray-700"
            onClick={(e) => { e.stopPropagation(); setSidebarOpen(false); }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Card */}
        <div className="px-4 py-4 border-b border-gray-100 ml-1">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-[#fff7ed] to-[#f5f3ff] border border-orange-100">
            <div className="avatar w-10 h-10 text-sm font-black flex-shrink-0">
              {user.fullName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-sm text-gray-900 truncate">{user.fullName}</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="badge badge-orange text-[10px] py-0.5">LVL {user.level}</span>
                <span className="text-[10px] text-gray-400 font-medium">{user.xp} XP</span>
              </div>
            </div>
          </div>
          {/* XP Progress */}
          <div className="mt-2.5 px-1">
            <div className="flex justify-between mb-1">
              <span className="mono-tag text-gray-400" style={{ fontSize: '9px' }}>XP PROGRESS</span>
              <span className="mono-tag text-[#f97316]" style={{ fontSize: '9px' }}>{xpPercent.toFixed(0)}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${xpPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 ml-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => handleNav(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 text-left relative
                  ${isActive
                    ? 'bg-gradient-to-r from-[#fff7ed] to-[#fef3c7] text-[#c2410c] shadow-sm'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                  }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-[#f97316] to-[#ea580c] rounded-r-full" />
                )}
                <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? 'text-[#f97316]' : 'text-gray-400'}`} />
                <span className="flex-1">{item.name}</span>
                {isActive && <ChevronRight className="w-3 h-3 text-[#f97316]/50" />}
              </button>
            );
          })}
        </nav>

        {/* Streak + Logout */}
        <div className="px-4 py-4 border-t border-gray-100 space-y-2 ml-1">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-50 border border-orange-100">
            <Flame className="w-4 h-4 text-[#f97316] flex-shrink-0" />
            <span className="text-xs font-bold text-[#c2410c]">{user.currentStreak} Day Streak 🔥</span>
          </div>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-red-100 hover:bg-red-50 text-red-500 hover:text-red-600 transition-colors text-sm font-semibold"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#fdf8f0] bg-grid-pattern">
        {/* Header */}
        <header className="h-14 border-b border-gray-200/80 flex items-center justify-between px-4 md:px-6 bg-white/90 backdrop-blur-md sticky top-0 z-20 flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-gray-500 hover:text-gray-800 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#f97316] animate-pulse" />
              <span className="text-sm font-bold text-gray-800 hidden sm:block">
                {pageName}
              </span>
            </div>
          </div>

          {/* Right stats */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="stat-chip hidden sm:flex">
              <Flame className="w-3 h-3" />
              <span>{user.currentStreak}d</span>
            </div>
            <div className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-full shadow-sm">
              <Award className="w-3.5 h-3.5 text-[#f97316]" />
              <span className="text-xs font-bold text-gray-800">Lvl {user.level}</span>
              <div className="hidden sm:block w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#f97316] to-[#7c3aed] rounded-full"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-gray-400 font-mono hidden md:block">{user.xp} XP</span>
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

export const Layout: React.FC<LayoutProps> = ({ children }) => (
  <ToastProvider>
    <LayoutInner>{children}</LayoutInner>
  </ToastProvider>
);
