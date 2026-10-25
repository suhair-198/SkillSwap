import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ConnectionDTO, UserDTO, UserSkillDTO } from '../services/types';
import { 
  Users, 
  MessageSquare, 
  Handshake, 
  Check, 
  X, 
  Clock, 
  Sparkles,
  Target,
  ChevronRight
} from 'lucide-react';

export const Connections: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'my' | 'received' | 'sent'>('my');
  const [myConnections, setMyConnections] = useState<UserDTO[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<ConnectionDTO[]>([]);
  const [sentRequests, setSentRequests] = useState<ConnectionDTO[]>([]);
  const [loading, setLoading] = useState(true);

  // Propose Pact State
  const [isProposingPact, setIsProposingPact] = useState(false);
  const [selectedPeer, setSelectedPeer] = useState<UserDTO | null>(null);
  const [myKnownSkills, setMyKnownSkills] = useState<UserSkillDTO[]>([]);
  const [peerKnownSkills, setPeerKnownSkills] = useState<UserSkillDTO[]>([]);
  const [selectedMySkillId, setSelectedMySkillId] = useState('');
  const [selectedPeerSkillId, setSelectedPeerSkillId] = useState('');
  const [pactGoals, setPactGoals] = useState('');

  useEffect(() => {
    fetchConnectionsData();
  }, []);

  const fetchConnectionsData = async () => {
    try {
      const [connections, received, sent] = await Promise.all([
        api.connections.getMy(),
        api.connections.getPendingReceived(),
        api.connections.getPendingSent()
      ]);
      setMyConnections(connections);
      setReceivedRequests(received);
      setSentRequests(sent);
    } catch (err) {
      console.error('Error fetching connections', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (connectionId: string) => {
    const targetReq = receivedRequests.find(r => r.id === connectionId);
    // Optimistic UI update: instantly update state without waiting
    setReceivedRequests(prev => prev.filter(r => r.id !== connectionId));
    if (targetReq?.requester) {
      setMyConnections(prev => [targetReq.requester, ...prev]);
    }
    try {
      await api.connections.acceptRequest(connectionId);
      // Sync fresh data in background
      fetchConnectionsData();
    } catch (err) {
      // Revert if failed
      alert('Failed to accept request');
      fetchConnectionsData();
    }
  };

  const handleDeclineRequest = async (connectionId: string) => {
    // Optimistic UI update: instantly update state
    setReceivedRequests(prev => prev.filter(r => r.id !== connectionId));
    try {
      await api.connections.declineRequest(connectionId);
      fetchConnectionsData();
    } catch (err) {
      alert('Failed to decline request');
      fetchConnectionsData();
    }
  };

  const openPactModal = async (peer: UserDTO) => {
    setSelectedPeer(peer);
    setIsProposingPact(true);
    setSelectedMySkillId('');
    setSelectedPeerSkillId('');
    setPactGoals('');

    try {
      const [mySkills, peerSkills] = await Promise.all([
        api.skills.getMy(),
        api.skills.getUserSkills(peer.id)
      ]);
      setMyKnownSkills(mySkills.filter(s => s.isKnown));
      setPeerKnownSkills(peerSkills.filter(s => s.isKnown));
    } catch (err) {
      console.error('Error loading skills for pact', err);
    }
  };

  const handleProposePactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPeer || !selectedMySkillId || !selectedPeerSkillId || !pactGoals.trim()) return;

    try {
      await api.pacts.create({
        userBId: selectedPeer.id,
        skillAId: selectedMySkillId,
        skillBId: selectedPeerSkillId,
        goals: pactGoals.trim()
      });
      setIsProposingPact(false);
      setSelectedPeer(null);
      alert('Skill Pact proposed successfully!');
    } catch (err) {
      alert('Failed to propose Skill Pact');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6b00]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('my')}
          className={`px-6 py-3 font-bold text-sm transition-all duration-200 border-b-2 ${
            activeTab === 'my' 
              ? 'text-[#ff6b00] border-[#ff6b00]' 
              : 'text-slate-500 border-transparent hover:text-[#0f172a]'
          }`}
        >
          Connections ({myConnections.length})
        </button>
        <button
          onClick={() => setActiveTab('received')}
          className={`px-6 py-3 font-bold text-sm transition-all duration-200 border-b-2 ${
            activeTab === 'received' 
              ? 'text-[#ff6b00] border-[#ff6b00]' 
              : 'text-slate-500 border-transparent hover:text-[#0f172a]'
          }`}
        >
          Received Requests ({receivedRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`px-6 py-3 font-bold text-sm transition-all duration-200 border-b-2 ${
            activeTab === 'sent' 
              ? 'text-[#ff6b00] border-[#ff6b00]' 
              : 'text-slate-500 border-transparent hover:text-[#0f172a]'
          }`}
        >
          Sent Requests ({sentRequests.length})
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'my' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myConnections.length === 0 ? (
              <div className="col-span-full text-center py-16 border border-dashed border-slate-300 rounded-2xl bg-white shadow-xs">
                <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 font-bold text-sm">No connections found yet.</p>
                <p className="text-slate-500 text-xs mt-1">Explore matching peers on the Dashboard to connect!</p>
              </div>
            ) : (
              myConnections.map((peer) => (
                <div 
                  key={peer.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-orange-300 transition-all duration-200 group"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-[#ff6b00] to-orange-400 flex items-center justify-center font-bold text-white text-lg shadow-glow">
                        {peer.fullName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-[#0f172a] text-base">{peer.fullName}</h4>
                        <p className="text-xs text-slate-500 font-medium">{peer.college || 'No college set'} • {peer.department || 'No department'}</p>
                      </div>
                    </div>
                    {peer.bio && (
                      <p className="text-sm text-slate-600 mb-4 line-clamp-2 italic font-medium">"{peer.bio}"</p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => navigate(`/chat?userId=${peer.id}`)}
                      className="flex-1 bg-slate-100 border border-slate-300 hover:bg-slate-200 text-[#0f172a] rounded-xl py-2 px-4 flex items-center justify-center gap-2 text-sm font-bold transition-all"
                    >
                      <MessageSquare className="h-4 w-4 text-[#ff6b00]" />
                      <span>Chat</span>
                    </button>
                    
                    <button
                      onClick={() => openPactModal(peer)}
                      className="flex-1 bg-gradient-to-r from-[#ff6b00] to-orange-600 text-white rounded-xl py-2 px-4 flex items-center justify-center gap-2 text-sm font-extrabold transition-all shadow-glow"
                    >
                      <Handshake className="h-4 w-4" />
                      <span>Swap Pact</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'received' && (
          <div className="space-y-4">
            {receivedRequests.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-slate-300 rounded-2xl bg-white shadow-xs">
                <Clock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 font-bold text-sm">No pending connection requests received.</p>
              </div>
            ) : (
              receivedRequests.map((req) => (
                <div 
                  key={req.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#ff6b00] to-orange-400 flex items-center justify-center font-bold text-white text-lg shadow-glow">
                      {req.requester.fullName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0f172a] text-sm">{req.requester.fullName}</h4>
                      <p className="text-xs text-slate-500 font-medium">{req.requester.college} • {req.requester.department}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAcceptRequest(req.id)}
                      className="bg-emerald-50 hover:bg-emerald-600 border border-emerald-200 hover:border-transparent text-emerald-700 hover:text-white font-bold rounded-xl py-2 px-4 text-xs flex items-center gap-1 transition-all"
                    >
                      <Check className="h-4 w-4" />
                      <span>Accept</span>
                    </button>
                    <button
                      onClick={() => handleDeclineRequest(req.id)}
                      className="bg-red-50 hover:bg-red-600 border border-red-200 hover:border-transparent text-red-700 hover:text-white font-bold rounded-xl py-2 px-4 text-xs flex items-center gap-1 transition-all"
                    >
                      <X className="h-4 w-4" />
                      <span>Decline</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'sent' && (
          <div className="space-y-4">
            {sentRequests.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-slate-300 rounded-2xl bg-white shadow-xs">
                <Clock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 font-bold text-sm">No pending connection requests sent.</p>
              </div>
            ) : (
              sentRequests.map((req) => (
                <div 
                  key={req.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-slate-200 flex items-center justify-center font-bold text-[#0f172a] text-lg">
                      {req.receiver.fullName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0f172a] text-sm">{req.receiver.fullName}</h4>
                      <p className="text-xs text-slate-500 font-medium">{req.receiver.college} • {req.receiver.department}</p>
                    </div>
                  </div>

                  <span className="text-xs font-bold bg-slate-100 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    Pending response
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Propose Pact Modal */}
      {isProposingPact && selectedPeer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white border border-slate-300 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-2">
              <Handshake className="h-5 w-5 text-[#ff6b00]" />
              <h3 className="text-lg font-extrabold text-[#0f172a]">Create a Skill Pact</h3>
            </div>
            <p className="text-xs text-slate-500 font-medium mb-6">
              Establish a structured swap pact with <span className="text-[#0f172a] font-bold">{selectedPeer.fullName}</span>. Choose what you will teach each other and set collaborative milestones.
            </p>

            <form onSubmit={handleProposePactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* My Skill A */}
                <div>
                  <label className="block text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">Skill You Will Teach</label>
                  {myKnownSkills.length === 0 ? (
                    <div className="text-xs font-bold text-red-600 border border-red-200 rounded-xl p-3 bg-red-50">
                      You haven't listed any skills in your profile to teach. Please add some first!
                    </div>
                  ) : (
                    <select
                      required
                      value={selectedMySkillId}
                      onChange={(e) => setSelectedMySkillId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 focus:border-[#ff6b00] focus:bg-white text-[#0f172a] font-medium rounded-xl py-3 px-4 outline-none text-sm"
                    >
                      <option value="">Select a skill...</option>
                      {myKnownSkills.map(s => (
                        <option key={s.skill.id} value={s.skill.id}>
                          {s.skill.name} ({s.proficiencyLevel})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Peer Skill B */}
                <div>
                  <label className="block text-xs font-bold text-[#ff6b00] uppercase tracking-wider mb-2">Skill Peer Will Teach</label>
                  {peerKnownSkills.length === 0 ? (
                    <div className="text-xs font-bold text-red-600 border border-red-200 rounded-xl p-3 bg-red-50">
                      Peer has not listed any skills they can teach.
                    </div>
                  ) : (
                    <select
                      required
                      value={selectedPeerSkillId}
                      onChange={(e) => setSelectedPeerSkillId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 focus:border-[#ff6b00] focus:bg-white text-[#0f172a] font-medium rounded-xl py-3 px-4 outline-none text-sm"
                    >
                      <option value="">Select a skill...</option>
                      {peerKnownSkills.map(s => (
                        <option key={s.skill.id} value={s.skill.id}>
                          {s.skill.name} ({s.proficiencyLevel})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Pact Goals & Schedule</label>
                <div className="relative">
                  <Target className="absolute top-3 left-3 text-slate-400 h-4 w-4" />
                  <textarea
                    rows={4}
                    required
                    value={pactGoals}
                    onChange={(e) => setPactGoals(e.target.value)}
                    placeholder="e.g. We will meet on Zoom every Monday at 5 PM for Java and Wednesdays at 5 PM for Spanish."
                    className="w-full bg-slate-50 border border-slate-300 focus:border-[#ff6b00] focus:bg-white text-[#0f172a] font-medium rounded-xl py-3 pl-10 pr-4 outline-none text-sm resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsProposingPact(false);
                    setSelectedPeer(null);
                  }}
                  className="bg-slate-100 border border-slate-300 text-slate-700 font-bold hover:bg-slate-200 rounded-xl py-2.5 px-5 text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedMySkillId || !selectedPeerSkillId}
                  className="bg-gradient-to-r from-[#ff6b00] to-orange-600 text-white font-extrabold rounded-xl py-2.5 px-6 text-sm hover:brightness-110 active:scale-95 transition-all shadow-glow disabled:opacity-50 disabled:pointer-events-none"
                >
                  Send Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
