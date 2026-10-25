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
  Search,
  UserPlus
} from 'lucide-react';

export const Connections: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'my' | 'received' | 'sent' | 'discover'>('my');
  const [myConnections, setMyConnections] = useState<UserDTO[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<ConnectionDTO[]>([]);
  const [sentRequests, setSentRequests] = useState<ConnectionDTO[]>([]);
  const [discoverPeers, setDiscoverPeers] = useState<UserDTO[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
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
      const [connections, received, sent, allUsers] = await Promise.all([
        api.connections.getMy(),
        api.connections.getPendingReceived(),
        api.connections.getPendingSent(),
        api.users.search()
      ]);
      setMyConnections(connections);
      setReceivedRequests(received);
      setSentRequests(sent);
      setDiscoverPeers(allUsers);
    } catch (err) {
      console.error('Error fetching connections', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchPeers = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearching(true);
    try {
      const results = await api.users.search(searchQuery.trim() || undefined);
      setDiscoverPeers(results);
    } catch (err) {
      console.error('Error searching peers', err);
    } finally {
      setSearching(false);
    }
  };

  const handleSendConnection = async (receiverId: string) => {
    try {
      const newConn = await api.connections.sendRequest(receiverId);
      setSentRequests(prev => [...prev, newConn]);
    } catch (err: any) {
      alert(err.message || 'Failed to send connection request');
    }
  };

  const handleAcceptRequest = async (connectionId: string) => {
    const targetReq = receivedRequests.find(r => r.id === connectionId);
    setReceivedRequests(prev => prev.filter(r => r.id !== connectionId));
    if (targetReq?.requester) {
      setMyConnections(prev => [targetReq.requester, ...prev]);
    }
    try {
      await api.connections.acceptRequest(connectionId);
      fetchConnectionsData();
    } catch (err) {
      alert('Failed to accept request');
      fetchConnectionsData();
    }
  };

  const handleDeclineRequest = async (connectionId: string) => {
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
      setMyKnownSkills(mySkills.filter(s => Boolean(s.isKnown ?? s.known)));
      setPeerKnownSkills(peerSkills.filter(s => Boolean(s.isKnown ?? s.known)));
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

  const isConnected = (userId: string) => myConnections.some(c => c.id === userId);
  const isPendingSent = (userId: string) => sentRequests.some(r => r.receiver?.id === userId);
  const isPendingReceived = (userId: string) => receivedRequests.some(r => r.requester?.id === userId);

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
          onClick={() => setActiveTab('discover')}
          className={`px-6 py-3 font-bold text-sm transition-all duration-200 border-b-2 ${
            activeTab === 'discover' 
              ? 'text-[#ff6b00] border-[#ff6b00]' 
              : 'text-slate-500 border-transparent hover:text-[#0f172a]'
          }`}
        >
          Discover Peers
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
        {activeTab === 'discover' && (
          <div className="space-y-6">
            <form onSubmit={handleSearchPeers} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search peers by name, college, or department..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#ff6b00]"
                />
              </div>
              <button
                type="submit"
                disabled={searching}
                className="bg-[#ff6b00] hover:bg-[#e05f00] text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                <span>Search</span>
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {discoverPeers.length === 0 ? (
                <div className="col-span-full text-center py-16 border border-dashed border-slate-300 rounded-2xl bg-white shadow-xs">
                  <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 font-bold text-sm">No peers found.</p>
                </div>
              ) : (
                discoverPeers.map((peer) => {
                  const connected = isConnected(peer.id);
                  const pendingSent = isPendingSent(peer.id);
                  const pendingRecv = isPendingReceived(peer.id);

                  return (
                    <div 
                      key={peer.id}
                      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-orange-300 transition-all duration-200"
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-[#ff6b00] to-orange-400 flex items-center justify-center font-bold text-white text-lg shadow-glow">
                            {peer.fullName ? peer.fullName.charAt(0) : '?'}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-[#0f172a] text-base">{peer.fullName}</h4>
                            <p className="text-xs text-slate-500 font-medium">
                              {peer.college || 'College not set'} • {peer.department || 'Department not set'}
                            </p>
                          </div>
                        </div>
                        {peer.bio && (
                          <p className="text-xs text-slate-600 mb-4 line-clamp-2 italic font-medium">"{peer.bio}"</p>
                        )}
                      </div>

                      <div className="pt-2">
                        {connected ? (
                          <div className="flex gap-2">
                            <span className="flex-1 text-center py-2 text-xs font-bold bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
                              Connected
                            </span>
                            <button
                              onClick={() => navigate(`/chat?userId=${peer.id}`)}
                              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                            >
                              Chat
                            </button>
                          </div>
                        ) : pendingSent ? (
                          <button disabled className="w-full py-2 bg-slate-100 border border-slate-200 text-slate-400 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Request Pending</span>
                          </button>
                        ) : pendingRecv ? (
                          <button
                            onClick={() => setActiveTab('received')}
                            className="w-full py-2 bg-orange-50 border border-orange-200 text-orange-700 rounded-xl text-xs font-bold"
                          >
                            Respond to Request
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSendConnection(peer.id)}
                            className="w-full py-2 bg-gradient-to-r from-[#ff6b00] to-orange-600 hover:opacity-95 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-glow"
                          >
                            <UserPlus className="h-3.5 w-3.5" />
                            <span>Send Connection Request</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {activeTab === 'my' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myConnections.length === 0 ? (
              <div className="col-span-full text-center py-16 border border-dashed border-slate-300 rounded-2xl bg-white shadow-xs">
                <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 font-bold text-sm">No connections found yet.</p>
                <p className="text-slate-500 text-xs mt-1">Explore matching peers or discover users to connect!</p>
                <button
                  onClick={() => setActiveTab('discover')}
                  className="mt-4 px-4 py-2 bg-[#ff6b00] text-white text-xs font-bold rounded-xl"
                >
                  Discover Peers
                </button>
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
                        {peer.fullName ? peer.fullName.charAt(0) : '?'}
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
                      {req.requester?.fullName ? req.requester.fullName.charAt(0) : '?'}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0f172a] text-sm">{req.requester?.fullName}</h4>
                      <p className="text-xs text-slate-500 font-medium">{req.requester?.college} • {req.requester?.department}</p>
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
                      {req.receiver?.fullName ? req.receiver.fullName.charAt(0) : '?'}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0f172a] text-sm">{req.receiver?.fullName}</h4>
                      <p className="text-xs text-slate-500 font-medium">{req.receiver?.college} • {req.receiver?.department}</p>
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
                <div>
                  <label className="block text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">Skill You Will Teach</label>
                  {myKnownSkills.length === 0 ? (
                    <div className="text-xs font-bold text-red-600 border border-red-200 rounded-xl p-3 bg-red-50">
                      You haven't listed any skills in your profile to teach. Please add some first!
                    </div>
                  ) : (
                    <select
                      value={selectedMySkillId}
                      onChange={(e) => setSelectedMySkillId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-[#0f172a] font-bold focus:outline-none focus:border-[#ff6b00]"
                      required
                    >
                      <option value="">Select skill you teach...</option>
                      {myKnownSkills.map((s) => (
                        <option key={s.skill.id} value={s.skill.id}>
                          {s.skill.name} ({s.proficiencyLevel})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#ff6b00] uppercase tracking-wider mb-2">Skill Peer Will Teach</label>
                  {peerKnownSkills.length === 0 ? (
                    <div className="text-xs font-bold text-amber-600 border border-amber-200 rounded-xl p-3 bg-amber-50">
                      This peer has not listed any skills to teach yet.
                    </div>
                  ) : (
                    <select
                      value={selectedPeerSkillId}
                      onChange={(e) => setSelectedPeerSkillId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-[#0f172a] font-bold focus:outline-none focus:border-[#ff6b00]"
                      required
                    >
                      <option value="">Select skill they teach...</option>
                      {peerKnownSkills.map((s) => (
                        <option key={s.skill.id} value={s.skill.id}>
                          {s.skill.name} ({s.proficiencyLevel})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Pact Goals & Commitment</label>
                <textarea
                  value={pactGoals}
                  onChange={(e) => setPactGoals(e.target.value)}
                  placeholder="e.g. Meet twice weekly for 1-hour sessions to build a project together."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-[#0f172a] font-medium h-24 focus:outline-none focus:border-[#ff6b00]"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsProposingPact(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={myKnownSkills.length === 0 || peerKnownSkills.length === 0}
                  className="px-5 py-2 bg-gradient-to-r from-[#ff6b00] to-orange-600 text-white rounded-xl text-xs font-extrabold shadow-glow hover:opacity-95 disabled:opacity-50"
                >
                  Confirm & Propose
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
