import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { MatchResponse, UserDTO } from '../services/types';
import { 
  Flame, 
  Award, 
  ThumbsUp, 
  BookOpen, 
  Presentation, 
  FolderCheck, 
  Plus, 
  UserCheck, 
  Check, 
  ChevronRight, 
  TrendingUp 
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#45f3ff]"></div>
      </div>
    );
  }

  // Prepping chart data
  const chartData = [
    { name: 'Learning Hours', value: analytics?.learningHours || 0, color: '#45f3ff' },
    { name: 'Teaching Hours', value: analytics?.teachingHours || 0, color: '#6f42c1' },
    { name: 'Classes Attended', value: analytics?.classesAttendedCount || 0, color: '#ffc107' },
    { name: 'Classes Taught', value: analytics?.classesConductedCount || 0, color: '#20c997' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#1f2833]/40 border border-[#45f3ff]/10 rounded-2xl p-6 flex items-center justify-between shadow-lg">
          <div>
            <div className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Level Progress</div>
            <div className="text-3xl font-extrabold text-white mt-2">Lvl {analytics?.level}</div>
            <div className="text-xs text-gray-500 mt-1">{analytics?.xp} Total XP</div>
          </div>
          <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-[#45f3ff]/20 to-[#45f3ff]/5 flex items-center justify-center border border-[#45f3ff]/30">
            <Award className="h-6 w-6 text-[#45f3ff]" />
          </div>
        </div>

        <div className="bg-[#1f2833]/40 border border-[#45f3ff]/10 rounded-2xl p-6 flex items-center justify-between shadow-lg">
          <div>
            <div className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Reputation</div>
            <div className="text-3xl font-extrabold text-white mt-2">{analytics?.reputation}%</div>
            <div className="text-xs text-gray-500 mt-1">Peer feedback score</div>
          </div>
          <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-[#20c997]/20 to-[#20c997]/5 flex items-center justify-center border border-[#20c997]/30">
            <ThumbsUp className="h-6 w-6 text-[#20c997]" />
          </div>
        </div>

        <div className="bg-[#1f2833]/40 border border-[#45f3ff]/10 rounded-2xl p-6 flex items-center justify-between shadow-lg">
          <div>
            <div className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Active Pacts</div>
            <div className="text-3xl font-extrabold text-white mt-2">{analytics?.pactsActive} Active</div>
            <div className="text-xs text-gray-500 mt-1">{analytics?.pactsCompleted} Completed swaps</div>
          </div>
          <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-[#6f42c1]/20 to-[#6f42c1]/5 flex items-center justify-center border border-[#6f42c1]/30">
            <FolderCheck className="h-6 w-6 text-[#6f42c1]" />
          </div>
        </div>

        <div className="bg-[#1f2833]/40 border border-[#45f3ff]/10 rounded-2xl p-6 flex items-center justify-between shadow-lg">
          <div>
            <div className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Learning Streak</div>
            <div className="text-3xl font-extrabold text-white mt-2">{analytics?.streak} Days</div>
            <div className="text-xs text-gray-500 mt-1">Keep it up!</div>
          </div>
          <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-orange-500/20 to-orange-500/5 flex items-center justify-center border border-orange-500/30">
            <Flame className="h-6 w-6 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Main Panel grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Match Finder (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1f2833]/40 border border-[#45f3ff]/10 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white tracking-wide">Top Peer Matches</h3>
              <span className="text-xs text-gray-400">Based on your learning preferences</span>
            </div>

            {matches.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-gray-800 rounded-xl bg-black/10">
                <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-sm">No matches found yet.</p>
                <p className="text-gray-600 text-xs mt-1">Try adding more known or wanted skills to your profile!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {matches.map((match) => (
                  <div 
                    key={match.peer.id} 
                    className="p-5 bg-[#0b0c10]/80 rounded-xl border border-gray-800 hover:border-[#45f3ff]/30 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                  >
                    {/* Peer info */}
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#45f3ff]/20 to-[#6f42c1]/20 border border-[#45f3ff]/20 flex items-center justify-center font-bold text-white text-lg">
                          {match.peer.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-white flex items-center gap-2 text-base">
                            {match.peer.fullName}
                            <span className="bg-[#45f3ff]/15 text-[#45f3ff] text-xs font-semibold px-2 py-0.5 rounded-full border border-[#45f3ff]/20">
                              {match.matchingScore}% Match
                            </span>
                          </div>
                          <div className="text-xs text-gray-400">{match.peer.college} • {match.peer.department}</div>
                        </div>
                      </div>
                      
                      {match.peer.bio && (
                        <p className="text-sm text-gray-400 line-clamp-2 italic">"{match.peer.bio}"</p>
                      )}

                      {/* Skill chips */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                        <div>
                          <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block mb-1">Teaches You:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {match.skillsTeachedByPeer.map(s => (
                              <span key={s.name} className="bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs px-2 py-0.5 rounded-lg font-medium">{s.name}</span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-[#6f42c1] uppercase tracking-wider block mb-1">Wants from You:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {match.skillsWantedByPeer.map(s => (
                              <span key={s.name} className="bg-[#6f42c1]/10 text-violet-400 border border-[#6f42c1]/20 text-xs px-2 py-0.5 rounded-lg font-medium">{s.name}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="shrink-0 flex items-center justify-end">
                      {sentRequests.includes(match.peer.id) ? (
                        <button
                          disabled
                          className="bg-gray-800 text-gray-500 border border-gray-700 text-sm font-semibold rounded-xl py-2 px-4 flex items-center gap-1.5"
                        >
                          <Check className="h-4 w-4" />
                          <span>Sent</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleConnect(match.peer.id)}
                          className="bg-gradient-to-r from-[#45f3ff]/10 to-[#6f42c1]/10 hover:from-[#45f3ff] hover:to-[#6f42c1] text-[#45f3ff] hover:text-white border border-[#45f3ff]/30 hover:border-transparent text-sm font-semibold rounded-xl py-2.5 px-4 transition-all duration-300 flex items-center gap-1.5 hover:shadow-glow"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Connect</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stats chart summary */}
          <div className="bg-[#1f2833]/40 border border-[#45f3ff]/10 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-5 w-5 text-[#45f3ff]" />
              <h3 className="text-lg font-bold text-white tracking-wide">Activity Performance</h3>
            </div>
            
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={11} tickLine={false} />
                  <YAxis stroke="#6b7280" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2833', border: '1px solid rgba(69,243,255,0.2)', borderRadius: '12px' }}
                    labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                    itemStyle={{ color: '#45f3ff' }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={45}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Col: Leaderboard */}
        <div className="space-y-6">
          <div className="bg-[#1f2833]/40 border border-[#45f3ff]/10 rounded-2xl p-6 shadow-xl flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white tracking-wide">Top Swappers</h3>
              <span className="text-xs text-[#45f3ff] font-semibold">XP Leaderboard</span>
            </div>

            <div className="space-y-4 flex-1">
              {leaderboard.map((u, i) => {
                let medalColor = '';
                if (i === 0) medalColor = 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
                else if (i === 1) medalColor = 'text-gray-400 bg-gray-400/10 border-gray-400/20';
                else if (i === 2) medalColor = 'text-amber-600 bg-amber-600/10 border-amber-600/20';
                else medalColor = 'text-gray-500 bg-gray-900 border-gray-800';

                return (
                  <div 
                    key={u.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-800 bg-[#0b0c10]/40 hover:border-[#45f3ff]/20 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`h-8 w-8 rounded-lg border flex items-center justify-center font-bold text-sm shrink-0 ${medalColor}`}>
                        {i + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-white text-sm truncate">{u.fullName}</div>
                        <div className="text-xs text-gray-500 truncate">{u.college}</div>
                      </div>
                    </div>
                    
                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold text-[#45f3ff]">{u.xp} XP</div>
                      <div className="text-[10px] text-gray-500">Lvl {u.level}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
