import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { SkillPactDTO } from '../services/types';
import { 
  Handshake, 
  BookOpen, 
  Target, 
  Check, 
  X, 
  PlusCircle, 
  Award, 
  Clock, 
  Sparkles,
  Zap,
  TrendingUp
} from 'lucide-react';

export const Pacts: React.FC = () => {
  const { user } = useAuth();
  const [pacts, setPacts] = useState<SkillPactDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPacts();
  }, []);

  const fetchPacts = async () => {
    try {
      const data = await api.pacts.getMy();
      setPacts(data);
    } catch (err) {
      console.error('Error fetching pacts', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id: string) => {
    try {
      await api.pacts.accept(id);
      await fetchPacts();
      alert('Skill Pact accepted!');
    } catch (err) {
      alert('Failed to accept Skill Pact');
    }
  };

  const handleDecline = async (id: string) => {
    try {
      await api.pacts.decline(id);
      await fetchPacts();
      alert('Skill Pact declined');
    } catch (err) {
      alert('Failed to decline Skill Pact');
    }
  };

  const handleLogSession = async (id: string) => {
    try {
      await api.pacts.logSession(id);
      await fetchPacts();
      alert('Study session logged! XP increased.');
    } catch (err) {
      alert('Failed to log session');
    }
  };

  const handleComplete = async (id: string) => {
    if (!confirm('Are you sure you want to mark this pact as completed? Both users will get completion rewards.')) return;
    try {
      await api.pacts.complete(id);
      await fetchPacts();
      alert('Skill Pact completed! Congratulations!');
    } catch (err) {
      alert('Failed to complete Skill Pact');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6b00]"></div>
      </div>
    );
  }

  // Segmenting pacts
  const activePacts = pacts.filter(p => p.status === 'ACTIVE' || p.status === 'ACCEPTED');
  const pendingPacts = pacts.filter(p => p.status === 'REQUESTED');
  const completedPacts = pacts.filter(p => p.status === 'COMPLETED' || p.status === 'CANCELLED');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-bold">Active</span>;
      case 'ACCEPTED':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2.5 py-0.5 rounded-full font-bold">Ready</span>;
      case 'COMPLETED':
        return <span className="bg-amber-50 text-amber-800 border border-amber-200 text-xs px-2.5 py-0.5 rounded-full font-bold">Completed</span>;
      case 'CANCELLED':
        return <span className="bg-red-50 text-red-700 border border-red-200 text-xs px-2.5 py-0.5 rounded-full font-bold">Cancelled</span>;
      default:
        return <span className="bg-orange-50 text-[#ff6b00] border border-orange-200 text-xs px-2.5 py-0.5 rounded-full font-bold">Pending Request</span>;
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Introduction Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-xl font-black text-[#0f172a] tracking-wide flex items-center gap-2">
            <Handshake className="h-6 w-6 text-[#ff6b00]" />
            <span>Skill Swap Pacts</span>
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed font-medium">
            A Skill Pact is a collaborative contract between two peers. Swap knowledge systematically: you teach your peer your skill, they teach you theirs. Log sessions to increase XP and level up together!
          </p>
        </div>
        <div className="h-16 w-16 bg-orange-50 rounded-2xl border border-orange-200 flex items-center justify-center shrink-0 shadow-glow">
          <Zap className="h-8 w-8 text-[#ff6b00]" />
        </div>
      </div>

      {/* Grid panels */}
      <div className="space-y-8">
        
        {/* Pending Requests */}
        {pendingPacts.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-[#0f172a] tracking-wider uppercase flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#ff6b00]" />
              <span>Pact Requests ({pendingPacts.length})</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingPacts.map((p) => {
                const isUserA = p.userA.id === user?.id;
                const otherUser = isUserA ? p.userB : p.userA;
                const myTeachSkill = isUserA ? p.skillA : p.skillB;
                const myLearnSkill = isUserA ? p.skillB : p.skillA;

                return (
                  <div 
                    key={p.id}
                    className="bg-white border border-slate-200 hover:border-orange-300 rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-orange-100 border border-orange-200 flex items-center justify-center font-bold text-[#ff6b00] text-sm shadow-glow">
                            {otherUser.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-extrabold text-[#0f172a] text-sm">{otherUser.fullName}</div>
                            <div className="text-[10px] text-slate-500 font-medium">{otherUser.college}</div>
                          </div>
                        </div>
                        {getStatusBadge(p.status)}
                      </div>

                      <div className="grid grid-cols-2 gap-3 bg-slate-50 border border-slate-200 p-3 rounded-xl mb-4 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 font-extrabold block mb-0.5">YOU WILL TEACH:</span>
                          <span className="text-emerald-700 font-bold">{myTeachSkill.name}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 font-extrabold block mb-0.5">YOU WILL LEARN:</span>
                          <span className="text-[#ff6b00] font-bold">{myLearnSkill.name}</span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-600 italic font-medium mb-4 leading-relaxed bg-slate-50 border border-slate-200 p-3 rounded-xl">
                        <span className="font-bold text-[#0f172a] block not-italic mb-1">Collaborative Goals:</span>
                        "{p.goals || 'No goals specified.'}"
                      </div>
                    </div>

                    {!isUserA ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAccept(p.id)}
                          className="flex-1 bg-emerald-50 hover:bg-emerald-600 border border-emerald-200 hover:border-transparent text-emerald-700 hover:text-white font-bold rounded-xl py-2 px-3 text-xs flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Accept Pact</span>
                        </button>
                        <button
                          onClick={() => handleDecline(p.id)}
                          className="flex-1 bg-red-50 hover:bg-red-600 border border-red-200 hover:border-transparent text-red-700 hover:text-white font-bold rounded-xl py-2 px-3 text-xs flex items-center justify-center gap-1.5 transition-all"
                        >
                          <X className="h-3.5 w-3.5" />
                          <span>Decline</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-center text-slate-500 font-semibold border border-slate-200 rounded-xl py-2 bg-slate-50">
                        Waiting for peer acceptance
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Active Pacts */}
        <div className="space-y-4">
          <h3 className="text-base font-extrabold text-[#0f172a] tracking-wider uppercase flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            <span>Active Pacts ({activePacts.length})</span>
          </h3>

          {activePacts.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-300 rounded-2xl bg-white shadow-xs">
              <Handshake className="h-10 w-10 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600 text-xs font-bold">No active Skill Pacts yet.</p>
              <p className="text-slate-500 text-[10px] font-medium mt-1">Connect with a peer in the connections page and propose a swap pact!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activePacts.map((p) => {
                const isUserA = p.userA.id === user?.id;
                const otherUser = isUserA ? p.userB : p.userA;
                const myTeachSkill = isUserA ? p.skillA : p.skillB;
                const myLearnSkill = isUserA ? p.skillB : p.skillA;

                return (
                  <div 
                    key={p.id}
                    className="bg-white border border-slate-200 hover:border-orange-300 rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-[#ff6b00] to-orange-400 flex items-center justify-center font-bold text-white text-sm shadow-glow">
                            {otherUser.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-extrabold text-[#0f172a] text-sm">{otherUser.fullName}</div>
                            <div className="text-[10px] text-slate-500 font-medium">{otherUser.college}</div>
                          </div>
                        </div>
                        {getStatusBadge(p.status)}
                      </div>

                      <div className="grid grid-cols-2 gap-3 bg-slate-50 border border-slate-200 p-3 rounded-xl mb-4 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 font-extrabold block mb-0.5">YOU TEACH:</span>
                          <span className="text-emerald-700 font-bold">{myTeachSkill.name}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 font-extrabold block mb-0.5">YOU LEARN:</span>
                          <span className="text-[#ff6b00] font-bold">{myLearnSkill.name}</span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-600 italic font-medium mb-4 leading-relaxed bg-slate-50 border border-slate-200 p-3 rounded-xl">
                        <span className="font-bold text-[#0f172a] block not-italic mb-1">Milestones & Schedule:</span>
                        "{p.goals || 'No goals specified.'}"
                      </div>

                      {/* Session logging stats */}
                      <div className="flex items-center justify-between border-t border-slate-200 pt-4 mb-4">
                        <div>
                          <span className="text-[10px] text-slate-500 font-extrabold block">SESSIONS LOGGED</span>
                          <span className="text-lg font-black text-[#0f172a]">{p.sessionsCount} Meetings</span>
                        </div>
                        <button
                          onClick={() => handleLogSession(p.id)}
                          className="bg-orange-50 hover:bg-[#ff6b00] text-[#ff6b00] hover:text-white border border-orange-200 hover:border-transparent font-extrabold text-xs rounded-xl py-2 px-3 flex items-center gap-1 transition-all"
                        >
                          <PlusCircle className="h-4 w-4" />
                          <span>Log Session</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleComplete(p.id)}
                        className="w-full bg-gradient-to-r from-[#ff6b00] to-orange-600 hover:brightness-110 text-white font-extrabold rounded-xl py-2.5 px-3 text-xs flex items-center justify-center gap-1.5 transition-all shadow-glow"
                      >
                        <Award className="h-4 w-4" />
                        <span>Mark as Completed</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* History / Completed Pacts */}
        {completedPacts.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-[#0f172a] tracking-wider uppercase flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-600" />
              <span>Swap History ({completedPacts.length})</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedPacts.map((p) => {
                const isUserA = p.userA.id === user?.id;
                const otherUser = isUserA ? p.userB : p.userA;
                const myTeachSkill = isUserA ? p.skillA : p.skillB;
                const myLearnSkill = isUserA ? p.skillB : p.skillA;

                return (
                  <div 
                    key={p.id}
                    className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-extrabold text-[#0f172a] text-xs truncate">{otherUser.fullName}</div>
                        {getStatusBadge(p.status)}
                      </div>

                      <div className="text-[11px] text-slate-600 font-medium space-y-1">
                        <div>Taught: <span className="text-emerald-700 font-bold">{myTeachSkill.name}</span></div>
                        <div>Learnt: <span className="text-[#ff6b00] font-bold">{myLearnSkill.name}</span></div>
                        <div className="pt-2 text-slate-500 font-bold flex items-center gap-1 text-[10px]">
                          <Sparkles className="h-3 w-3 text-amber-500" />
                          <span>Logged {p.sessionsCount} sessions</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
