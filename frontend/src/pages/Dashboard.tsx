import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { MatchResponse, UserDTO } from '../services/types';
import { 
  Flame, 
  Award, 
  ThumbsUp, 
  BookOpen, 
  FolderCheck, 
  Plus, 
  Check, 
  TrendingUp,
  Zap,
  Trophy,
  ArrowUpRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

export const Dashboard: React.FC = () => {
  const [matches, setMatches] = useState<MatchResponse[]>([]);
  const [leaderboard, setLeaderboard] = useState<UserDTO[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [sentRequests, setSentRequests] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

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
      } catch (err) {
        console.error('Error fetching dashboard data', err);
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
    } catch (err) {
      alert('Failed to send connection request');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff6b00] to-amber-500 flex items-center justify-center animate-glow-pulse">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="mono-tag text-[#ff6b00]">Loading Dashboard...</span>
        </div>
      </div>
    );
  }

  const chartData = [
    { name: 'Learn Hrs', value: analytics?.learningHours || 0, color: '#ff6b00' },
    { name: 'Teach Hrs', value: analytics?.teachingHours || 0, color: '#0f172a' },
    { name: 'Classes', value: analytics?.classesAttendedCount || 0, color: '#f59e0b' },
    { name: 'Taught', value: analytics?.classesConductedCount || 0, color: '#10b981' },
  ];

  const statCards = [
    {
      label: 'Level Progress',
      value: `Lvl ${analytics?.level || 1}`,
      sub: `${analytics?.xp || 0} Total XP`,
      icon: Award,
      color: 'from-[#ff6b00] to-amber-500',
      bg: 'bg-[#ff6b00]/10',
      border: 'border-[#ff6b00]/20',
      textColor: 'text-[#ff6b00]',
    },
    {
      label: 'Reputation',
      value: `${analytics?.reputation || 0}%`,
      sub: 'Peer feedback',
      icon: ThumbsUp,
      color: 'from-emerald-500 to-teal-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      textColor: 'text-emerald-400',
    },
    {
      label: 'Active Pacts',
      value: `${analytics?.pactsActive || 0}`,
      sub: `${analytics?.pactsCompleted || 0} completed`,
      icon: FolderCheck,
      color: 'from-blue-500 to-indigo-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      textColor: 'text-blue-400',
    },
    {
      label: 'Learning Streak',
      value: `${analytics?.streak || 0} Days`,
      sub: 'Keep it going!',
      icon: Flame,
      color: 'from-rose-500 to-pink-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      textColor: 'text-rose-400',
    },
  ];

  return (
    <div className="space-y-6 pb-8 animate-slide-in">
      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className={`bg-[#0a1020] border ${card.border} rounded-2xl p-4 card-offset-sm relative overflow-hidden`}>
              <div className={`absolute top-0 right-0 w-20 h-20 ${card.bg} rounded-bl-[60px] flex items-end justify-start p-3`}>
                <Icon className={`w-5 h-5 ${card.textColor}`} />
              </div>
              <div className="mono-tag text-slate-500 mb-2">{card.label}</div>
              <div className={`text-2xl font-bold ${card.textColor}`}>{card.value}</div>
              <div className="text-xs text-slate-500 mt-1">{card.sub}</div>
            </div>
          );
        })}
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Match Finder */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0a1020] border border-[#1a2540] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1a2540]">
              <div>
                <h3 className="font-bold text-white">Top Peer Matches</h3>
                <p className="text-xs text-slate-500 mt-0.5">Based on your skill profile</p>
              </div>
              <span className="mono-tag text-[#ff6b00] bg-[#ff6b00]/10 px-2 py-1 rounded-lg border border-[#ff6b00]/20">
                {matches.length} matches
              </span>
            </div>

            <div className="p-4 space-y-3">
              {matches.length === 0 ? (
                <div className="text-center py-12 rounded-xl border border-dashed border-[#1a2540]">
                  <BookOpen className="w-10 h-10 text-[#1a2540] mx-auto mb-3" />
                  <p className="text-slate-500 text-sm font-medium">No matches found yet</p>
                  <p className="text-slate-600 text-xs mt-1">Add skills to your profile to get matched</p>
                </div>
              ) : (
                matches.map((match) => (
                  <div
                    key={match.peer.id}
                    className="p-4 bg-[#111827] border border-[#1a2540] hover:border-[#ff6b00]/30 rounded-xl transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div className="space-y-3 flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff6b00] to-amber-500 flex items-center justify-center font-bold text-white text-base flex-shrink-0 shadow-orange-glow-sm">
                          {match.peer.fullName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-white text-sm flex items-center gap-2 flex-wrap">
                            {match.peer.fullName}
                            <span className="mono-tag text-[#ff6b00] bg-[#ff6b00]/10 px-2 py-0.5 rounded-full border border-[#ff6b00]/20">
                              {match.matchingScore}%
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 truncate">{match.peer.college} · {match.peer.department}</div>
                        </div>
                      </div>

                      {match.peer.bio && (
                        <p className="text-xs text-slate-400 line-clamp-1 italic pl-1">"{match.peer.bio}"</p>
                      )}

                      <div className="flex flex-wrap gap-1.5">
                        {match.skillsTeachedByPeer.slice(0, 3).map(s => (
                          <span key={s.name} className="px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                            ↓ {s.name}
                          </span>
                        ))}
                        {match.skillsWantedByPeer.slice(0, 2).map(s => (
                          <span key={s.name} className="px-2 py-0.5 rounded-lg bg-[#ff6b00]/10 border border-[#ff6b00]/20 text-[#ff6b00] text-[10px] font-bold">
                            ↑ {s.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      {sentRequests.includes(match.peer.id) ? (
                        <button disabled className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1a2540] text-slate-500 text-xs font-bold border border-[#1a2540]">
                          <Check className="w-3.5 h-3.5" />
                          <span>Sent</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleConnect(match.peer.id)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ff6b00] hover:bg-[#ff7a1a] text-white text-xs font-bold transition-colors shadow-orange-glow-sm"
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
          <div className="bg-[#0a1020] border border-[#1a2540] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="w-4 h-4 text-[#ff6b00]" />
              <h3 className="font-bold text-white">Activity Overview</h3>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#334155" fontSize={10} tickLine={false} tick={{ fill: '#64748b' }} />
                  <YAxis stroke="#334155" fontSize={10} tickLine={false} tick={{ fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1a2540', borderRadius: '10px' }}
                    labelStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '12px' }}
                    itemStyle={{ color: '#ff6b00' }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={40}>
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
        <div className="bg-[#0a1020] border border-[#1a2540] rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1a2540] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-white">Top Swappers</h3>
            </div>
            <span className="mono-tag text-amber-400">XP Board</span>
          </div>

          <div className="p-4 space-y-2">
            {leaderboard.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">No leaderboard data yet</div>
            ) : (
              leaderboard.slice(0, 10).map((u, i) => {
                const isTop3 = i < 3;
                const medals = ['🥇', '🥈', '🥉'];
                return (
                  <div
                    key={u.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${
                      isTop3
                        ? 'bg-[#ff6b00]/5 border-[#ff6b00]/20 hover:border-[#ff6b00]/40'
                        : 'bg-[#111827] border-[#1a2540] hover:border-[#ff6b00]/20'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm ${
                      isTop3 ? 'bg-[#ff6b00]/20 text-[#ff6b00]' : 'bg-[#1a2540] text-slate-400'
                    }`}>
                      {isTop3 ? medals[i] : i + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-white text-sm truncate">{u.fullName}</div>
                      <div className="text-xs text-slate-500 truncate">{u.college}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-bold text-[#ff6b00]">{u.xp}</div>
                      <div className="mono-tag text-slate-500" style={{ fontSize: '9px' }}>XP</div>
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
