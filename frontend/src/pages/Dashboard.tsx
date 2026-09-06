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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6b00]"></div>
      </div>
    );
  }

  // Prepping chart data with Orange and Navy theme
  const chartData = [
    { name: 'Learning Hours', value: analytics?.learningHours || 0, color: '#ff6b00' },
    { name: 'Teaching Hours', value: analytics?.teachingHours || 0, color: '#0f172a' },
    { name: 'Classes Attended', value: analytics?.classesAttendedCount || 0, color: '#d97706' },
    { name: 'Classes Taught', value: analytics?.classesConductedCount || 0, color: '#059669' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between shadow-xs">
          <div>
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Level Progress</div>
            <div className="text-3xl font-black text-[#0f172a] mt-2">Lvl {analytics?.level}</div>
            <div className="text-xs text-slate-500 font-medium mt-1">{analytics?.xp} Total XP</div>
          </div>
          <div className="h-12 w-12 rounded-xl bg-orange-50 flex items-center justify-center border border-orange-200">
            <Award className="h-6 w-6 text-[#ff6b00]" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between shadow-xs">
          <div>
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Reputation</div>
            <div className="text-3xl font-black text-[#0f172a] mt-2">{analytics?.reputation}%</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Peer feedback score</div>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-200">
            <ThumbsUp className="h-6 w-6 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between shadow-xs">
          <div>
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Active Pacts</div>
            <div className="text-3xl font-black text-[#0f172a] mt-2">{analytics?.pactsActive} Active</div>
            <div className="text-xs text-slate-500 font-medium mt-1">{analytics?.pactsCompleted} Completed swaps</div>
          </div>
          <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200">
            <FolderCheck className="h-6 w-6 text-[#0f172a]" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between shadow-xs">
          <div>
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Learning Streak</div>
            <div className="text-3xl font-black text-[#0f172a] mt-2">{analytics?.streak} Days</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Keep it up!</div>
          </div>
          <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-200">
            <Flame className="h-6 w-6 text-amber-600" />
          </div>
        </div>
      </div>

      {/* Main Panel grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Match Finder (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-[#0f172a] tracking-wide">Top Peer Matches</h3>
              <span className="text-xs font-semibold text-slate-500">Based on your learning preferences</span>
            </div>

            {matches.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-300 rounded-xl bg-slate-50">
                <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 font-semibold text-sm">No matches found yet.</p>
                <p className="text-slate-500 text-xs mt-1">Try adding more known or wanted skills to your profile!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {matches.map((match) => (
                  <div 
                    key={match.peer.id} 
                    className="p-5 bg-slate-50 rounded-xl border border-slate-200 hover:border-orange-300 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                  >
                    {/* Peer info */}
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#ff6b00] to-orange-400 flex items-center justify-center font-bold text-white text-lg shadow-glow">
                          {match.peer.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-extrabold text-[#0f172a] flex items-center gap-2 text-base">
                            {match.peer.fullName}
                            <span className="bg-orange-100 text-[#ff6b00] text-xs font-extrabold px-2 py-0.5 rounded-full border border-orange-200">
                              {match.matchingScore}% Match
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 font-medium">{match.peer.college} • {match.peer.department}</div>
                        </div>
                      </div>
                      
                      {match.peer.bio && (
                        <p className="text-sm text-slate-600 line-clamp-2 italic font-medium">"{match.peer.bio}"</p>
                      )}

                      {/* Skill chips */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                        <div>
                          <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider block mb-1">Teaches You:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {match.skillsTeachedByPeer.map(s => (
                              <span key={s.name} className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2.5 py-0.5 rounded-lg font-bold">{s.name}</span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-extrabold text-[#0f172a] uppercase tracking-wider block mb-1">Wants from You:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {match.skillsWantedByPeer.map(s => (
                              <span key={s.name} className="bg-slate-200 text-[#0f172a] border border-slate-300 text-xs px-2.5 py-0.5 rounded-lg font-bold">{s.name}</span>
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
                          className="bg-slate-200 text-slate-500 border border-slate-300 text-sm font-bold rounded-xl py-2 px-4 flex items-center gap-1.5"
                        >
                          <Check className="h-4 w-4" />
                          <span>Sent</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleConnect(match.peer.id)}
                          className="bg-gradient-to-r from-[#ff6b00] to-orange-600 hover:brightness-110 text-white border border-transparent text-sm font-extrabold rounded-xl py-2.5 px-4 transition-all duration-200 flex items-center gap-1.5 shadow-glow"
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
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-5 w-5 text-[#ff6b00]" />
              <h3 className="text-lg font-bold text-[#0f172a] tracking-wide">Activity Performance</h3>
            </div>
            
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                    labelStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                    itemStyle={{ color: '#ff6b00' }}
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
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-[#0f172a] tracking-wide">Top Swappers</h3>
              <span className="text-xs text-[#ff6b00] font-extrabold">XP Leaderboard</span>
            </div>

            <div className="space-y-3 flex-1">
              {leaderboard.map((u, i) => {
                let medalColor = '';
                if (i === 0) medalColor = 'text-amber-600 bg-amber-50 border-amber-200';
                else if (i === 1) medalColor = 'text-slate-600 bg-slate-100 border-slate-200';
                else if (i === 2) medalColor = 'text-amber-800 bg-amber-100 border-amber-300';
                else medalColor = 'text-slate-500 bg-slate-50 border-slate-200';

                return (
                  <div 
                    key={u.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:border-orange-300 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`h-8 w-8 rounded-lg border flex items-center justify-center font-bold text-xs shrink-0 ${medalColor}`}>
                        {i + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-[#0f172a] text-sm truncate">{u.fullName}</div>
                        <div className="text-xs text-slate-500 font-medium truncate">{u.college}</div>
                      </div>
                    </div>
                    
                    <div className="text-right shrink-0">
                      <div className="text-sm font-extrabold text-[#ff6b00]">{u.xp} XP</div>
                      <div className="text-[10px] text-slate-500 font-semibold">Lvl {u.level}</div>
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
