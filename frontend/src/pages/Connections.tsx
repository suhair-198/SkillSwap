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
    try {
      await api.connections.acceptRequest(connectionId);
      await fetchConnectionsData();
    } catch (err) {
      alert('Failed to accept request');
    }
  };

  const handleDeclineRequest = async (connectionId: string) => {
    try {
      await api.connections.declineRequest(connectionId);
      await fetchConnectionsData();
    } catch (err) {
      alert('Failed to decline request');
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
      // Filter for skills that are taught (isKnown = true)
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#45f3ff]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        <button
          onClick={() => setActiveTab('my')}
          className={`px-6 py-3 font-semibold text-sm transition-all duration-300 border-b-2 ${
            activeTab === 'my' 
              ? 'text-[#45f3ff] border-[#45f3ff] font-bold' 
              : 'text-gray-400 border-transparent hover:text-white'
          }`}
        >
          Connections ({myConnections.length})
        </button>
        <button
          onClick={() => setActiveTab('received')}
          className={`px-6 py-3 font-semibold text-sm transition-all duration-300 border-b-2 ${
            activeTab === 'received' 
              ? 'text-[#45f3ff] border-[#45f3ff] font-bold' 
              : 'text-gray-400 border-transparent hover:text-white'
          }`}
        >
          Received Requests ({receivedRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`px-6 py-3 font-semibold text-sm transition-all duration-300 border-b-2 ${
            activeTab === 'sent' 
              ? 'text-[#45f3ff] border-[#45f3ff] font-bold' 
              : 'text-gray-400 border-transparent hover:text-white'
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
              <div className="col-span-full text-center py-16 border border-dashed border-gray-800 rounded-2xl bg-black/10">
                <Users className="h-12 w-12 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-400 text-sm">No connections found yet.</p>
                <p className="text-gray-600 text-xs mt-1">Explore matching peers on the Dashboard to connect!</p>
              </div>
            ) : (
              myConnections.map((peer) => (
                <div 
                  key={peer.id}
                  className="bg-[#1f2833]/40 border border-[#45f3ff]/10 rounded-2xl p-5 shadow-lg flex flex-col justify-between hover:border-[#45f3ff]/20 transition-all duration-300 group"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-[#45f3ff]/20 to-[#6f42c1]/20 border border-[#45f3ff]/20 flex items-center justify-center font-bold text-white text-lg">
                        {peer.fullName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-base">{peer.fullName}</h4>
                        <p className="text-xs text-gray-400">{peer.college || 'No college set'} • {peer.department || 'No department'}</p>
                      </div>
                    </div>
                    {peer.bio && (
                      <p className="text-sm text-gray-300 mb-4 line-clamp-2 italic">"{peer.bio}"</p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => navigate(`/chat?userId=${peer.id}`)}
                      className="flex-1 bg-[#1f2833] border border-gray-700 hover:border-gray-500 text-white rounded-xl py-2 px-4 flex items-center justify-center gap-2 text-sm font-semibold transition-all"
                    >
                      <MessageSquare className="h-4 w-4 text-[#45f3ff]" />
                      <span>Chat</span>
                    </button>
                    
                    <button
                      onClick={() => openPactModal(peer)}
                      className="flex-1 bg-gradient-to-r from-[#45f3ff]/10 to-[#6f42c1]/10 hover:from-[#45f3ff] hover:to-[#6f42c1] text-[#45f3ff] hover:text-white border border-[#45f3ff]/30 hover:border-transparent rounded-xl py-2 px-4 flex items-center justify-center gap-2 text-sm font-semibold transition-all hover:shadow-glow"
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
              <div className="text-center py-16 border border-dashed border-gray-800 rounded-2xl bg-black/10">
                <Clock className="h-12 w-12 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-400 text-sm">No pending connection requests received.</p>
              </div>
            ) : (
              receivedRequests.map((req) => (
                <div 
                  key={req.id}
                  className="bg-[#1f2833]/40 border border-[#45f3ff]/10 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#45f3ff]/20 to-[#6f42c1]/20 border border-[#45f3ff]/20 flex items-center justify-center font-bold text-white text-lg">
                      {req.requester.fullName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{req.requester.fullName}</h4>
                      <p className="text-xs text-gray-400">{req.requester.college} • {req.requester.department}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAcceptRequest(req.id)}
                      className="bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/30 hover:border-transparent text-emerald-400 hover:text-white font-semibold rounded-xl py-2 px-4 text-xs flex items-center gap-1 transition-all"
                    >
                      <Check className="h-4 w-4" />
                      <span>Accept</span>
                    </button>
                    <button
                      onClick={() => handleDeclineRequest(req.id)}
                      className="bg-red-500/10 hover:bg-red-500 border border-red-500/30 hover:border-transparent text-red-400 hover:text-white font-semibold rounded-xl py-2 px-4 text-xs flex items-center gap-1 transition-all"
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
              <div className="text-center py-16 border border-dashed border-gray-800 rounded-2xl bg-black/10">
                <Clock className="h-12 w-12 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-400 text-sm">No pending connection requests sent.</p>
              </div>
            ) : (
              sentRequests.map((req) => (
                <div 
                  key={req.id}
                  className="bg-[#1f2833]/40 border border-[#45f3ff]/10 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#45f3ff]/20 to-[#6f42c1]/20 border border-[#45f3ff]/20 flex items-center justify-center font-bold text-white text-lg">
                      {req.receiver.fullName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{req.receiver.fullName}</h4>
                      <p className="text-xs text-gray-400">{req.receiver.college} • {req.receiver.department}</p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold bg-gray-900 border border-gray-800 text-gray-400 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-[#1f2833] border border-[#45f3ff]/20 rounded-2xl p-6 shadow-glow-lg animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2 mb-2">
              <Handshake className="h-5 w-5 text-[#45f3ff]" />
              <h3 className="text-lg font-bold text-white">Create a Skill Pact</h3>
            </div>
            <p className="text-xs text-gray-400 mb-6">
              Establish a structured swap pact with <span className="text-white font-bold">{selectedPeer.fullName}</span>. Choose what you will teach each other and set collaborative milestones.
            </p>

            <form onSubmit={handleProposePactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* My Skill A */}
                <div>
                  <label className="block text-xs font-bold text-teal-400 uppercase tracking-wider mb-2">Skill You Will Teach</label>
                  {myKnownSkills.length === 0 ? (
                    <div className="text-xs text-red-400 border border-red-500/20 rounded-xl p-3 bg-red-500/5">
                      You haven't listed any skills in your profile to teach. Please add some first!
                    </div>
                  ) : (
                    <select
                      required
                      value={selectedMySkillId}
                      onChange={(e) => setSelectedMySkillId(e.target.value)}
                      className="w-full bg-[#0b0c10]/60 border border-gray-700 focus:border-[#45f3ff] text-white rounded-xl py-3 px-4 outline-none text-sm"
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
                  <label className="block text-xs font-bold text-violet-400 uppercase tracking-wider mb-2">Skill Peer Will Teach</label>
                  {peerKnownSkills.length === 0 ? (
                    <div className="text-xs text-red-400 border border-red-500/20 rounded-xl p-3 bg-red-500/5">
                      Peer has not listed any skills they can teach.
                    </div>
                  ) : (
                    <select
                      required
                      value={selectedPeerSkillId}
                      onChange={(e) => setSelectedPeerSkillId(e.target.value)}
                      className="w-full bg-[#0b0c10]/60 border border-gray-700 focus:border-[#45f3ff] text-white rounded-xl py-3 px-4 outline-none text-sm"
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
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Pact Goals & Schedule</label>
                <div className="relative">
                  <Target className="absolute top-3 left-3 text-gray-500 h-4 w-4" />
                  <textarea
                    rows={4}
                    required
                    value={pactGoals}
                    onChange={(e) => setPactGoals(e.target.value)}
                    placeholder="e.g. We will meet on Zoom every Monday at 5 PM for Java and Wednesdays at 5 PM for Spanish. Goal is to build a basic app and learn conversational Spanish."
                    className="w-full bg-[#0b0c10]/60 border border-gray-700 focus:border-[#45f3ff] text-white rounded-xl py-3 pl-10 pr-4 outline-none text-sm resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsProposingPact(false);
                    setSelectedPeer(null);
                  }}
                  className="bg-transparent border border-gray-700 text-gray-400 hover:text-white rounded-xl py-2.5 px-5 text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedMySkillId || !selectedPeerSkillId}
                  className="bg-gradient-to-r from-[#45f3ff] to-[#6f42c1] text-white font-semibold rounded-xl py-2.5 px-6 text-sm hover:brightness-110 active:scale-95 transition-all shadow-glow disabled:opacity-50 disabled:pointer-events-none"
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
