import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { MatchResponse, UserDTO } from '../services/types';
import { 
  Flame, Award, ThumbsUp, BookOpen, FolderCheck, 
  Plus, Check, TrendingUp, Zap, Trophy, ArrowUpRight,
  Users, WifiOff
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const Dashboard: React.FC = () => {
  const [matches, setMatches] = useState<MatchResponse[]>([]);
  const [leaderboard, setLeaderboard] = useState<UserDTO[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [sentRequests, setSentRequests] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [backendOffline, setBackendOffline] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [matchData, leaderboardData, analyticsData, pendingSent] = await Promise.all([
          api.matches.get(),
          api.users.getLeaderboard(),
          api.users.getAnalytics(),
          api.connections.getPendingSent()
        ]);
        setMatches(matchData);
        setLeaderboard(leaderboardData);
        setAnalytics(analyticsData);
        setSentRequests(pendingSent.map(req => req.receiver.id));
        setBackendOffline(false);
      } catch (err: any) {
        console.error('Error fetching dashboard data', err);
        if (err.message?.includes('fetch') || err.message?.includes('network') || err.message?.includes('Failed')) {
          setBackendOffline(true);
        }
        setError(err.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleConnect = async (receiverId: string) => {
    try {
      await api.connections.sendRequest(receiverId);
      setSentRequests(prev => [...prev, receiverId]);
    } catch (err: any) {
      setError(`Failed to send connection request: ${err.message}`);
      setTimeout(() => setError(''), 4000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#f97316] to-[#7c3aed] flex items-center justify-center animate-glow-pulse shadow-lg">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <span className="mono-tag text-[#f97316]">Loading Dashboard...</span>
        </div>
      </div>
    );
  }

  const chartData = [
    { name: 'Learn Hrs', value: analytics?.learningHours || 0, color: '#f97316' },
    { name: 'Teach Hrs', value: analytics?.teachingHours || 0, color: '#7c3aed' },
    { name: 'Classes', value: analytics?.classesAttendedCount || 0, color: '#059669' },
    { name: 'Taught', value: analytics?.classesConductedCount || 0, color: '#d97706' },
  ];

  const statCards = [
    {
      label: 'Level Progress',
      value: `Lvl ${analytics?.level || 1}`,
      sub: `${analytics?.xp || 0} Total XP`,
      icon: Award,
      bg: 'bg-gradient-to-br from-[#fff7ed] to-[#fef3c7]',
      border: 'border-orange-200',
      iconBg: 'bg-orange-100',
      iconColor: 'text-[#f97316]',
      valueColor: 'text-[#c2410c]',
    },
    {
      label: 'Reputation',
      value: `${analytics?.reputation || 0}%`,
      sub: 'Peer feedback',
      icon: ThumbsUp,
      bg: 'bg-gradient-to-br from-[#ecfdf5] to-[#d1fae5]',
      border: 'border-emerald-200',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      valueColor: 'text-emerald-700',
    },
    {
      label: 'Active Pacts',
      value: `${analytics?.pactsActive || 0}`,
      sub: `${analytics?.pactsCompleted || 0} completed`,
      icon: FolderCheck,
      bg: 'bg-gradient-to-br from-[#eff6ff] to-[#dbeafe]',
      border: 'border-blue-200',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      valueColor: 'text-blue-700',
    },
    {
      label: 'Learning Streak',
      value: `${analytics?.streak || 0} Days`,
      sub: 'Keep it going! 🔥',
      icon: Flame,
      bg: 'bg-gradient-to-br from-[#fff1f2] to-[#ffe4e6]',
      border: 'border-rose-200',
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-500',
      valueColor: 'text-rose-600',
    },
  ];

  return (
    <div className="space-y-6 pb-8 animate-slide-in">

      {/* Offline Banner */}
      {backendOffline && (
        <div className="offline-banner">
          <WifiOff className="w-4 h-4 flex-shrink-0" />
          <span>Backend server is offline. Data shown may be cached or limited. Start the backend to enable full functionality.</span>
        </div>
      )}

      {/* Error Banner */}
      {error && !backendOffline && (
        <div className="offline-banner" style={{ background: '#fff1f2', borderColor: '#fecdd3', color: '#9f1239' }}>
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className={`${card.bg} border ${card.border} rounded-2xl p-5 relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-200`}>
              <div className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center mb-3`}>
                <Icon className={`w-4 h-4 ${card.iconColor}`} />
              </div>
              <div className="mono-tag text-gray-400 mb-1">{card.label}</div>
              <div className={`text-2xl font-black ${card.valueColor}`}>{card.value}</div>
              <div className="text-xs text-gray-500 mt-1">{card.sub}</div>
            </div>
          );
        })}
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Match Finder + Chart */}
        <div className="lg:col-span-2 space-y-6">

          {/* Peer Matches */}
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-gray-900">🎯 Top Peer Matches</h3>
                <p className="text-xs text-gray-400 mt-0.5">Based on your skill profile</p>
              </div>
              <span className="badge badge-orange">{matches.length} matches</span>
            </div>

            <div className="p-4 space-y-3">
              {matches.length === 0 ? (
                <div className="text-center py-12 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50">
                  <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm font-semibold">No matches found yet</p>
                  <p className="text-gray-400 text-xs mt-1">Add skills to your profile to get matched!</p>
                </div>
              ) : (
                matches.map((match) => (
                  <div
                    key={match.peer.id}
                    className="p-4 bg-gray-50 border border-gray-100 hover:border-orange-200 hover:bg-orange-50/30 rounded-2xl transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div className="space-y-3 flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <div className="avatar w-11 h-11 text-base font-black flex-shrink-0">
                          {match.peer.fullName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-gray-900 text-sm flex items-center gap-2 flex-wrap">
                            {match.peer.fullName}
                            <span className="badge badge-orange">{match.matchingScore}% match</span>
                          </div>
                          <div className="text-xs text-gray-400 truncate mt-0.5">
                            {match.peer.college} · {match.peer.department}
                          </div>
                        </div>
                      </div>

                      {match.peer.bio && (
                        <p className="text-xs text-gray-500 line-clamp-1 italic pl-1">"{match.peer.bio}"</p>
                      )}

                      <div className="flex flex-wrap gap-1.5">
                        {match.skillsTeachedByPeer.slice(0, 3).map(s => (
                          <span key={s.name} className="skill-tag skill-tag-teach">
                            ↓ {s.name}
                          </span>
                        ))}
                        {match.skillsWantedByPeer.slice(0, 2).map(s => (
                          <span key={s.name} className="skill-tag skill-tag-learn">
                            ↑ {s.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      {sentRequests.includes(match.peer.id) ? (
                        <button disabled className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-100 text-gray-400 text-xs font-bold border border-gray-200">
                          <Check className="w-3.5 h-3.5" />
                          <span>Sent</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleConnect(match.peer.id)}
                          className="btn-primary flex items-center gap-1.5 px-4 py-2 text-xs rounded-xl"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Connect</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Activity Chart */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-[#f97316]" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Activity Overview</h3>
                <p className="text-xs text-gray-400">Your learning & teaching hours</p>
              </div>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#e5e7eb" fontSize={11} tickLine={false} tick={{ fill: '#9ca3af', fontWeight: 600 }} />
                  <YAxis stroke="#e5e7eb" fontSize={11} tickLine={false} tick={{ fill: '#9ca3af' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #f3f4f6', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                    labelStyle={{ color: '#111827', fontWeight: 'bold', fontSize: '13px' }}
                    itemStyle={{ color: '#f97316' }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={44}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right: Leaderboard */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-0.5">
              <Trophy className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-gray-900">Top Swappers</h3>
            </div>
            <p className="text-xs text-gray-400">XP Leaderboard</p>
          </div>

          <div className="p-4 space-y-2">
            {leaderboard.length === 0 ? (
              <div className="text-center py-10">
                <Users className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No leaderboard data yet</p>
              </div>
            ) : (
              leaderboard.slice(0, 10).map((u, i) => {
                const isTop3 = i < 3;
                const medals = ['🥇', '🥈', '🥉'];
                const colors = ['bg-amber-50 border-amber-200', 'bg-gray-50 border-gray-200', 'bg-orange-50 border-orange-200'];
                return (
                  <div
                    key={u.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-150 ${
                      isTop3 ? colors[i] : 'bg-white border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm ${
                      isTop3 ? 'bg-white shadow-sm' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {isTop3 ? medals[i] : i + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-gray-900 text-sm truncate">{u.fullName}</div>
                      <div className="text-xs text-gray-400 truncate">{u.college}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-black text-[#f97316]">{u.xp}</div>
                      <div className="mono-tag text-gray-400" style={{ fontSize: '9px' }}>XP</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
