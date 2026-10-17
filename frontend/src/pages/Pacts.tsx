import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { SkillPactDTO } from '../services/types';
import { 
  Handshake, Target, Check, X, PlusCircle, Award, 
  Clock, Sparkles, Zap, TrendingUp, BookOpen, AlertCircle
} from 'lucide-react';

const StatusConfig: Record<string, { bg: string; text: string; border: string; label: string; dot: string }> = {
  ACTIVE:    { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Active',     dot: 'bg-emerald-500' },
  ACCEPTED:  { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200',    label: 'Ready',      dot: 'bg-blue-500' },
  COMPLETED: { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   label: 'Completed',  dot: 'bg-amber-500' },
  CANCELLED: { bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200',     label: 'Cancelled',  dot: 'bg-red-400' },
  REQUESTED: { bg: 'bg-orange-50',  text: 'text-orange-700',  border: 'border-orange-200',  label: 'Pending',    dot: 'bg-orange-400' },
};

const StatusBadge = ({ status }: { status: string }) => {
  const cfg = StatusConfig[status] || StatusConfig.REQUESTED;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

export const Pacts: React.FC = () => {
  const { user } = useAuth();
  const [pacts, setPacts] = useState<SkillPactDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => { fetchPacts(); }, []);

  const fetchPacts = async () => {
    try {
      const data = await api.pacts.getMy();
      setPacts(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load pacts');
    } finally {
      setLoading(false);
    }
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(''), 5000);
  };

  const handleAccept = async (id: string) => {
    try { await api.pacts.accept(id); await fetchPacts(); }
    catch (err: any) { showError(`Failed to accept pact: ${err.message}`); }
  };

  const handleDecline = async (id: string) => {
    try { await api.pacts.decline(id); await fetchPacts(); }
    catch (err: any) { showError(`Failed to decline pact: ${err.message}`); }
  };

  const handleLogSession = async (id: string) => {
    try { await api.pacts.logSession(id); await fetchPacts(); }
    catch (err: any) { showError(`Failed to log session: ${err.message}`); }
  };

  const handleComplete = async (id: string) => {
    if (!confirm('Mark this pact as completed? This cannot be undone.')) return;
    try { await api.pacts.complete(id); await fetchPacts(); }
    catch (err: any) { showError(`Failed to complete pact: ${err.message}`); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#f97316] to-[#7c3aed] flex items-center justify-center animate-glow-pulse shadow-lg">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <span className="mono-tag text-[#f97316]">Loading Pacts...</span>
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
      <div className="card p-5 flex flex-col gap-4 hover:shadow-lg transition-all">
        {/* Peer Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="avatar w-10 h-10 text-sm font-black flex-shrink-0">
              {otherUser.fullName.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-gray-900 text-sm">{otherUser.fullName}</div>
              <div className="text-xs text-gray-400">{otherUser.college || 'SkillSwap'}</div>
            </div>
          </div>
          <StatusBadge status={p.status} />
        </div>

        {/* Skill Exchange */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
            <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">You Teach</div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span className="text-emerald-800 font-bold text-sm truncate">{myTeachSkill.name}</span>
            </div>
          </div>
          <div className="p-3 bg-orange-50 border border-orange-100 rounded-xl">
            <div className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">You Learn</div>
            <div className="flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-[#f97316] flex-shrink-0" />
              <span className="text-orange-800 font-bold text-sm truncate">{myLearnSkill.name}</span>
            </div>
          </div>
        </div>

        {/* Goals */}
        {p.goals && (
          <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl">
            <div className="text-[10px] font-black text-purple-500 uppercase tracking-widest mb-1">Goals</div>
            <p className="text-xs text-purple-800 italic leading-relaxed">"{p.goals}"</p>
          </div>
        )}

        {/* Sessions */}
        {isActive && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sessions Logged</div>
              <div className="text-2xl font-black text-gray-900 mt-0.5">{p.sessionsCount}</div>
            </div>
            <button
              onClick={() => handleLogSession(p.id)}
              className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-orange-50 border border-orange-200 hover:bg-orange-100 text-orange-700 text-xs font-bold transition-colors"
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
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              Accept Pact
            </button>
            <button
              onClick={() => handleDecline(p.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-red-50 border border-red-200 hover:bg-red-100 text-red-600 text-xs font-bold transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Decline
            </button>
          </div>
        ) : isPending && isUserA ? (
          <div className="text-center text-xs text-gray-400 py-2.5 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 font-medium">
            ⏳ Waiting for peer acceptance…
          </div>
        ) : isActive ? (
          <button
            onClick={() => handleComplete(p.id)}
            className="w-full btn-purple flex items-center justify-center gap-2 py-2.5 text-sm rounded-xl"
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

      {errorMsg && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-semibold animate-fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* Hero Banner */}
      <div className="card-elevated overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-[#f97316] via-[#7c3aed] to-[#4f46e5]" />
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-100 to-purple-100 flex items-center justify-center">
                  <Handshake className="w-6 h-6 text-[#f97316]" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900">Skill Swap Pacts</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Bilateral skill-exchange agreements</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 max-w-xl leading-relaxed">
                Create skill-exchange contracts with peers. You teach what you know, they teach what you want. Log sessions and level up together!
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs text-gray-500 font-medium">{activePacts.length} Active</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-orange-400" />
                  <span className="text-xs text-gray-500 font-medium">{pendingPacts.length} Pending</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-xs text-gray-500 font-medium">{completedPacts.length} Completed</span>
                </div>
              </div>
            </div>
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#fff7ed] to-[#f5f3ff] border-2 border-orange-100 flex items-center justify-center flex-shrink-0 animate-float shadow-lg">
              <Zap className="w-10 h-10 text-[#f97316]" />
            </div>
          </div>
        </div>
      </div>

      {/* Pending Requests */}
      {pendingPacts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5 text-[#f97316]" />
            </div>
            <h3 className="font-bold text-gray-900">Pending Requests</h3>
            <span className="badge badge-orange">{pendingPacts.length}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pendingPacts.map((p) => <PactCard key={p.id} p={p} />)}
          </div>
        </div>
      )}

      {/* Active Pacts */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <h3 className="font-bold text-gray-900">Active Pacts</h3>
          <span className="badge badge-emerald">{activePacts.length}</span>
        </div>
        {activePacts.length === 0 ? (
          <div className="text-center py-14 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-100 to-purple-100 flex items-center justify-center mx-auto mb-4">
              <Handshake className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-500 font-bold">No active pacts yet</p>
            <p className="text-gray-400 text-sm mt-1">Connect with a peer and propose a skill swap from their profile!</p>
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
            <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
              <Award className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <h3 className="font-bold text-gray-900">Swap History</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedPacts.map((p) => {
              const isUserA = p.userA.id === user?.id;
              const otherUser = isUserA ? p.userB : p.userA;
              const myTeachSkill = isUserA ? p.skillA : p.skillB;
              const myLearnSkill = isUserA ? p.skillB : p.skillA;
              return (
                <div key={p.id} className="card p-4 flex flex-col gap-3 opacity-80">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="avatar w-8 h-8 text-xs font-black">
                        {otherUser.fullName.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-gray-800 truncate">{otherUser.fullName}</span>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>Taught: <span className="text-emerald-600 font-bold">{myTeachSkill.name}</span></div>
                    <div>Learned: <span className="text-[#f97316] font-bold">{myLearnSkill.name}</span></div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-amber-600 font-medium">
                    <Sparkles className="w-3 h-3" />
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
