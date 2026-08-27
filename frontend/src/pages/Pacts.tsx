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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#45f3ff]"></div>
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
        return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-0.5 rounded-full font-semibold">Active</span>;
      case 'ACCEPTED':
        return <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs px-2.5 py-0.5 rounded-full font-semibold">Ready</span>;
      case 'COMPLETED':
        return <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-xs px-2.5 py-0.5 rounded-full font-semibold">Completed</span>;
      case 'CANCELLED':
        return <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-xs px-2.5 py-0.5 rounded-full font-semibold">Cancelled</span>;
      default:
        return <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs px-2.5 py-0.5 rounded-full font-semibold">Pending Request</span>;
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Introduction Card */}
      <div className="bg-gradient-to-r from-[#1f2833]/80 to-[#0b0c10]/80 border border-[#45f3ff]/20 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#45f3ff]/5 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            <Handshake className="h-6 w-6 text-[#45f3ff]" />
            <span>Skill Swap Pacts</span>
          </h2>
          <p className="text-sm text-gray-300 max-w-2xl leading-relaxed">
            A Skill Pact is a collaborative contract between two peers. Swap knowledge systematically: you teach your peer your skill, they teach you theirs. Log sessions to increase XP and level up together!
          </p>
        </div>
        <div className="h-16 w-16 bg-gradient-to-tr from-[#45f3ff]/20 to-[#6f42c1]/20 rounded-2xl border border-[#45f3ff]/30 flex items-center justify-center shrink-0">
          <Zap className="h-8 w-8 text-[#45f3ff] animate-pulse" />
        </div>
      </div>

      {/* Grid panels */}
      <div className="space-y-8">
        
        {/* Pending Requests */}
        {pendingPacts.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white tracking-wider uppercase text-gray-400 flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-400" />
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
                    className="bg-[#1f2833]/40 border border-orange-500/20 hover:border-orange-500/30 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center font-bold text-orange-400 text-sm">
                            {otherUser.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-white text-sm">{otherUser.fullName}</div>
                            <div className="text-[10px] text-gray-500">{otherUser.college}</div>
                          </div>
                        </div>
                        {getStatusBadge(p.status)}
                      </div>

                      <div className="grid grid-cols-2 gap-3 bg-black/20 p-3 rounded-xl mb-4 text-xs">
                        <div>
                          <span className="text-[10px] text-gray-500 font-bold block mb-0.5">YOU WILL TEACH:</span>
                          <span className="text-teal-400 font-bold">{myTeachSkill.name}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-500 font-bold block mb-0.5">YOU WILL LEARN:</span>
                          <span className="text-violet-400 font-bold">{myLearnSkill.name}</span>
                        </div>
                      </div>

                      <div className="text-xs text-gray-400 italic mb-4 leading-relaxed bg-black/10 p-3 rounded-xl">
                        <span className="font-bold text-gray-300 block not-italic mb-1">Collaborative Goals:</span>
                        "{p.goals || 'No goals specified.'}"
                      </div>
                    </div>

                    {!isUserA ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAccept(p.id)}
                          className="flex-1 bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/30 hover:border-transparent text-emerald-400 hover:text-white font-semibold rounded-xl py-2 px-3 text-xs flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Accept Pact</span>
                        </button>
                        <button
                          onClick={() => handleDecline(p.id)}
                          className="flex-1 bg-red-500/10 hover:bg-red-500 border border-red-500/30 hover:border-transparent text-red-400 hover:text-white font-semibold rounded-xl py-2 px-3 text-xs flex items-center justify-center gap-1.5 transition-all"
                        >
                          <X className="h-3.5 w-3.5" />
                          <span>Decline</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-center text-gray-500 border border-gray-800 rounded-xl py-2 bg-black/10">
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
          <h3 className="text-base font-bold text-white tracking-wider uppercase text-gray-400 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span>Active Pacts ({activePacts.length})</span>
          </h3>

          {activePacts.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-800 rounded-2xl bg-black/10">
              <Handshake className="h-10 w-10 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-400 text-xs font-semibold">No active Skill Pacts yet.</p>
              <p className="text-gray-600 text-[10px] mt-1">Connect with a peer in the connections page and propose a swap pact!</p>
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
                    className="bg-[#1f2833]/40 border border-[#45f3ff]/10 hover:border-[#45f3ff]/20 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-[#45f3ff]/10 border border-[#45f3ff]/20 flex items-center justify-center font-bold text-[#45f3ff] text-sm">
                            {otherUser.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-white text-sm">{otherUser.fullName}</div>
                            <div className="text-[10px] text-gray-500">{otherUser.college}</div>
                          </div>
                        </div>
                        {getStatusBadge(p.status)}
                      </div>

                      <div className="grid grid-cols-2 gap-3 bg-black/20 p-3 rounded-xl mb-4 text-xs">
                        <div>
                          <span className="text-[10px] text-gray-500 font-bold block mb-0.5">YOU TEACH:</span>
                          <span className="text-teal-400 font-bold">{myTeachSkill.name}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-500 font-bold block mb-0.5">YOU LEARN:</span>
                          <span className="text-violet-400 font-bold">{myLearnSkill.name}</span>
                        </div>
                      </div>

                      <div className="text-xs text-gray-400 italic mb-4 leading-relaxed bg-black/10 p-3 rounded-xl">
                        <span className="font-bold text-gray-300 block not-italic mb-1">Milestones & Schedule:</span>
                        "{p.goals || 'No goals specified.'}"
                      </div>

                      {/* Session logging stats */}
                      <div className="flex items-center justify-between border-t border-gray-800 pt-4 mb-4">
                        <div>
                          <span className="text-[10px] text-gray-500 font-bold block">SESSIONS LOGGED</span>
                          <span className="text-lg font-extrabold text-white">{p.sessionsCount} Meetings</span>
                        </div>
                        <button
                          onClick={() => handleLogSession(p.id)}
                          className="bg-[#45f3ff]/10 hover:bg-[#45f3ff] text-[#45f3ff] hover:text-black border border-[#45f3ff]/30 hover:border-transparent font-bold text-xs rounded-xl py-2 px-3 flex items-center gap-1 transition-all"
                        >
                          <PlusCircle className="h-4 w-4" />
                          <span>Log Session</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleComplete(p.id)}
                        className="w-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500 hover:to-teal-500 text-emerald-400 hover:text-white border border-emerald-500/30 hover:border-transparent font-semibold rounded-xl py-2.5 px-3 text-xs flex items-center justify-center gap-1.5 transition-all"
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
            <h3 className="text-base font-bold text-white tracking-wider uppercase text-gray-400 flex items-center gap-2">
              <Award className="h-4 w-4 text-yellow-400" />
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
                    className="bg-[#1f2833]/20 border border-gray-800 rounded-2xl p-4 shadow-md flex flex-col justify-between opacity-80"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-semibold text-white text-xs truncate">{otherUser.fullName}</div>
                        {getStatusBadge(p.status)}
                      </div>

                      <div className="text-[11px] text-gray-400 space-y-1">
                        <div>Taught: <span className="text-teal-400 font-bold">{myTeachSkill.name}</span></div>
                        <div>Learnt: <span className="text-violet-400 font-bold">{myLearnSkill.name}</span></div>
                        <div className="pt-2 text-gray-500 flex items-center gap-1 text-[10px]">
                          <Sparkles className="h-3 w-3 text-yellow-500" />
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
