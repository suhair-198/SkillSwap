import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { SkillPactDTO } from '../services/types';
import { 
  Handshake, 
  Target, 
  Check, 
  X, 
  PlusCircle, 
  Award, 
  Clock, 
  Sparkles,
  Zap,
  TrendingUp,
  BookOpen,
  Users
} from 'lucide-react';

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    ACTIVE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    ACCEPTED: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    COMPLETED: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    CANCELLED: 'bg-red-500/10 text-red-400 border-red-500/20',
    REQUESTED: 'bg-[#ff6b00]/10 text-[#ff6b00] border-[#ff6b00]/20',
  };
  const labels: Record<string, string> = {
    ACTIVE: 'Active', ACCEPTED: 'Ready', COMPLETED: 'Completed', CANCELLED: 'Cancelled', REQUESTED: 'Pending'
  };
  return (
    <span className={`mono-tag px-2 py-0.5 rounded-full border ${styles[status] || styles.REQUESTED}`}>
      {labels[status] || status}
    </span>
  );
};

export const Pacts: React.FC = () => {
  const { user } = useAuth();
  const [pacts, setPacts] = useState<SkillPactDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPacts(); }, []);

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
    try { await api.pacts.accept(id); await fetchPacts(); }
    catch (err: any) { alert(`Failed to accept pact: ${err.message}`); }
  };

  const handleDecline = async (id: string) => {
    try { await api.pacts.decline(id); await fetchPacts(); }
    catch (err: any) { alert(`Failed to decline pact: ${err.message}`); }
  };

  const handleLogSession = async (id: string) => {
    try { await api.pacts.logSession(id); await fetchPacts(); }
    catch (err: any) { alert(`Failed to log session: ${err.message}`); }
  };

  const handleComplete = async (id: string) => {
    if (!confirm('Mark this pact as completed?')) return;
    try { await api.pacts.complete(id); await fetchPacts(); }
    catch (err: any) { alert(`Failed to complete pact: ${err.message}`); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff6b00] to-amber-500 flex items-center justify-center animate-glow-pulse">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="mono-tag text-[#ff6b00]">Loading Pacts...</span>
        </div>
      </div>
    );
  }

  const activePacts = pacts.filter(p => p.status === 'ACTIVE' || p.status === 'ACCEPTED');
  const pendingPacts = pacts.filter(p => p.status === 'REQUESTED');
  const completedPacts = pacts.filter(p => p.status === 'COMPLETED' || p.status === 'CANCELLED');

  const PactCard = ({ p }: { p: SkillPactDTO }) => {
    const isUserA = p.userA.id === user?.id;
    const otherUser = isUserA ? p.userB : p.userA;
    const myTeachSkill = isUserA ? p.skillA : p.skillB;
    const myLearnSkill = isUserA ? p.skillB : p.skillA;
    const isPending = p.status === 'REQUESTED';
    const isActive = p.status === 'ACTIVE' || p.status === 'ACCEPTED';

    return (
      <div className="bg-[#0a1020] border border-[#1a2540] rounded-2xl p-5 hover:border-[#ff6b00]/30 transition-all duration-200 flex flex-col gap-4 card-offset-sm">
        {/* Peer Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff6b00] to-amber-500 flex items-center justify-center font-bold text-white text-sm shadow-orange-glow-sm flex-shrink-0">
              {otherUser.fullName.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-white text-sm">{otherUser.fullName}</div>
              <div className="text-xs text-slate-500">{otherUser.college || 'SkillSwap'}</div>
            </div>
          </div>
          <StatusBadge status={p.status} />
        </div>

        {/* Skill Exchange */}
        <div className="grid grid-cols-2 gap-3 p-3 bg-[#111827] border border-[#1a2540] rounded-xl">
          <div>
            <div className="mono-tag text-slate-500 mb-1">YOU TEACH</div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-bold text-sm">{myTeachSkill.name}</span>
            </div>
          </div>
          <div>
            <div className="mono-tag text-slate-500 mb-1">YOU LEARN</div>
            <div className="flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-[#ff6b00]" />
              <span className="text-[#ff6b00] font-bold text-sm">{myLearnSkill.name}</span>
            </div>
          </div>
        </div>

        {/* Goals */}
        {p.goals && (
          <div className="text-xs text-slate-400 italic leading-relaxed bg-[#111827] border border-[#1a2540] p-3 rounded-xl">
            <span className="mono-tag text-slate-500 not-italic block mb-1">GOALS</span>
            "{p.goals}"
          </div>
        )}

        {/* Sessions (Active only) */}
        {isActive && (
          <div className="flex items-center justify-between pt-2 border-t border-[#1a2540]">
            <div>
              <div className="mono-tag text-slate-500">SESSIONS</div>
              <div className="text-xl font-bold text-white mt-0.5">{p.sessionsCount}</div>
            </div>
            <button
              onClick={() => handleLogSession(p.id)}
              className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-[#ff6b00]/10 border border-[#ff6b00]/20 hover:bg-[#ff6b00]/20 text-[#ff6b00] text-xs font-bold transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Log Session</span>
            </button>
          </div>
        )}

        {/* Actions */}
        {isPending && !isUserA ? (
          <div className="flex gap-2">
            <button
              onClick={() => handleAccept(p.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              Accept
            </button>
            <button
              onClick={() => handleDecline(p.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Decline
            </button>
          </div>
        ) : isPending && isUserA ? (
          <div className="text-center text-xs text-slate-500 py-2 border border-dashed border-[#1a2540] rounded-xl">
            ⏳ Waiting for peer acceptance
          </div>
        ) : isActive ? (
          <button
            onClick={() => handleComplete(p.id)}
            className="w-full flex items-center justify-center gap-2 btn-primary py-2.5 text-xs"
          >
            <Award className="w-4 h-4" />
            Mark as Completed
          </button>
        ) : null}
      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 animate-slide-in">
      {/* Hero Banner */}
      <div className="bg-[#0a1020] border border-[#1a2540] rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ff6b00] to-amber-500" />
        <div className="absolute top-[-50px] right-[-50px] w-48 h-48 rounded-full bg-[#ff6b00]/5 blur-xl" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Handshake className="w-5 h-5 text-[#ff6b00]" />
              <h2 className="text-xl font-bold text-white">Skill Swap Pacts</h2>
            </div>
            <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
              Create bilateral skill-exchange contracts with your peers. You teach what you know, they teach what you want. Log sessions together and level up!
            </p>
            <div className="flex items-center gap-4 pt-1">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-slate-400">{activePacts.length} Active</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#ff6b00]" />
                <span className="text-xs text-slate-400">{pendingPacts.length} Pending</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-xs text-slate-400">{completedPacts.length} Completed</span>
              </div>
            </div>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-[#ff6b00]/10 border border-[#ff6b00]/20 flex items-center justify-center flex-shrink-0 animate-glow-pulse">
            <Zap className="w-8 h-8 text-[#ff6b00]" />
          </div>
        </div>
      </div>

      {/* Pending Requests */}
      {pendingPacts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#ff6b00]" />
            <h3 className="font-bold text-white">Pending Requests</h3>
            <span className="mono-tag text-[#ff6b00] bg-[#ff6b00]/10 px-2 py-0.5 rounded-full border border-[#ff6b00]/20 ml-1">
              {pendingPacts.length}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pendingPacts.map((p) => <PactCard key={p.id} p={p} />)}
          </div>
        </div>
      )}

      {/* Active Pacts */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <h3 className="font-bold text-white">Active Pacts</h3>
          <span className="mono-tag text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 ml-1">
            {activePacts.length}
          </span>
        </div>
        {activePacts.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-[#1a2540] rounded-2xl bg-[#0a1020]">
            <Handshake className="w-10 h-10 text-[#1a2540] mx-auto mb-3" />
            <p className="text-slate-400 text-sm font-semibold">No active pacts yet</p>
            <p className="text-slate-600 text-xs mt-1">Connect with a peer and propose a skill swap from their profile!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activePacts.map((p) => <PactCard key={p.id} p={p} />)}
          </div>
        )}
      </div>

      {/* Completed Pacts */}
      {completedPacts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-white">Swap History</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedPacts.map((p) => {
              const isUserA = p.userA.id === user?.id;
              const otherUser = isUserA ? p.userB : p.userA;
              const myTeachSkill = isUserA ? p.skillA : p.skillB;
              const myLearnSkill = isUserA ? p.skillB : p.skillA;
              return (
                <div key={p.id} className="bg-[#0a1020] border border-[#1a2540] rounded-2xl p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#1a2540] flex items-center justify-center font-bold text-slate-400 text-sm">
                        {otherUser.fullName.charAt(0)}
                      </div>
                      <span className="text-sm font-semibold text-white truncate">{otherUser.fullName}</span>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>
                  <div className="text-xs text-slate-500 space-y-1">
                    <div>Taught: <span className="text-emerald-400 font-bold">{myTeachSkill.name}</span></div>
                    <div>Learned: <span className="text-[#ff6b00] font-bold">{myLearnSkill.name}</span></div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>{p.sessionsCount} sessions logged</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
