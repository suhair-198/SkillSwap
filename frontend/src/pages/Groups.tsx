import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { GroupDTO, UserDTO, LiveClassDTO } from '../services/types';
import { 
  FolderGit2, 
  Plus, 
  Users, 
  MessageSquare, 
  Calendar, 
  Crown, 
  Check,
  DoorOpen,
  ArrowLeft,
  Lock,
  Globe,
  Zap,
  X
} from 'lucide-react';

export const Groups: React.FC = () => {
  const navigate = useNavigate();
  
  const [publicGroups, setPublicGroups] = useState<GroupDTO[]>([]);
  const [myGroups, setMyGroups] = useState<GroupDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<'my' | 'explore'>('my');

  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDesc, setGroupDesc] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [creating, setCreating] = useState(false);

  const [selectedGroup, setSelectedGroup] = useState<GroupDTO | null>(null);
  const [groupMembers, setGroupMembers] = useState<UserDTO[]>([]);
  const [groupClasses, setGroupClasses] = useState<LiveClassDTO[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => { fetchGroupsData(); }, []);

  const fetchGroupsData = async () => {
    try {
      const [allPublic, mine] = await Promise.all([
        api.groups.getAllPublic(),
        api.groups.getMy()
      ]);
      setPublicGroups(allPublic);
      setMyGroups(mine);
    } catch (err) {
      console.error('Error fetching groups', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;
    setCreating(true);
    try {
      await api.groups.create({ name: groupName.trim(), description: groupDesc.trim(), isPrivate });
      setGroupName(''); setGroupDesc(''); setIsPrivate(false); setIsCreatingGroup(false);
      await fetchGroupsData();
    } catch (err: any) {
      alert(`Failed to create group: ${err.message || 'Please check your connection and try again.'}`);
    } finally {
      setCreating(false);
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    try {
      await api.groups.join(groupId);
      await fetchGroupsData();
    } catch (err: any) {
      alert(`Failed to join group: ${err.message}`);
    }
  };

  const handleLeaveGroup = async (groupId: string) => {
    if (!confirm('Leave this group?')) return;
    try {
      await api.groups.leave(groupId);
      setSelectedGroup(null);
      await fetchGroupsData();
    } catch (err: any) {
      alert(`Failed to leave group: ${err.message}`);
    }
  };

  const handleViewGroupDetails = async (grp: GroupDTO) => {
    setLoadingDetails(true);
    setSelectedGroup(grp);
    try {
      const [members, classes] = await Promise.all([
        api.groups.getMembers(grp.id),
        api.classes.getGroupClasses(grp.id)
      ]);
      setGroupMembers(members);
      setGroupClasses(classes);
    } catch (err) {
      console.error('Error loading group details', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const isMember = (groupId: string) => myGroups.some(g => g.id === groupId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff6b00] to-amber-500 flex items-center justify-center animate-glow-pulse">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="mono-tag text-[#ff6b00]">Loading Groups...</span>
        </div>
      </div>
    );
  }

  // ── Group Card ──
  const GroupCard = ({ g, mode }: { g: GroupDTO; mode: 'mine' | 'public' }) => {
    const member = isMember(g.id);
    return (
      <div className="bg-[#0a1020] border border-[#1a2540] rounded-2xl p-5 hover:border-[#ff6b00]/30 transition-all duration-200 flex flex-col gap-4 card-offset-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff6b00] to-amber-500 flex items-center justify-center font-bold text-white text-base flex-shrink-0 shadow-orange-glow-sm">
            {g.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-white text-sm truncate">{g.name}</h4>
              {g.isPrivate ? (
                <Lock className="w-3 h-3 text-slate-500 flex-shrink-0" />
              ) : (
                <Globe className="w-3 h-3 text-emerald-500/70 flex-shrink-0" />
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">by {g.creator.fullName}</p>
          </div>
        </div>

        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{g.description || 'No description provided.'}</p>

        <div className="flex gap-2 mt-auto pt-2 border-t border-[#1a2540]">
          {mode === 'mine' ? (
            <>
              <button
                onClick={() => handleViewGroupDetails(g)}
                className="flex-1 py-2 px-3 rounded-xl bg-[#111827] border border-[#1a2540] hover:border-[#ff6b00]/30 text-white text-xs font-semibold transition-all"
              >
                Manage
              </button>
              <button
                onClick={() => navigate(`/chat?groupId=${g.id}`)}
                className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-[#ff6b00] hover:bg-[#ff7a1a] text-white text-xs font-bold transition-colors shadow-orange-glow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat</span>
              </button>
            </>
          ) : (
            member ? (
              <button
                onClick={() => handleViewGroupDetails(g)}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Joined</span>
              </button>
            ) : (
              <button
                onClick={() => handleJoinGroup(g.id)}
                className="w-full py-2 px-3 rounded-xl bg-[#ff6b00] hover:bg-[#ff7a1a] text-white text-xs font-bold transition-colors shadow-orange-glow-sm"
              >
                Join Group
              </button>
            )
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-slide-in">
      {selectedGroup ? (
        /* ── Group Details View ── */
        <div className="space-y-6">
          <button
            onClick={() => setSelectedGroup(null)}
            className="flex items-center gap-2 text-slate-400 hover:text-[#ff6b00] transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Groups</span>
          </button>

          {/* Group Header */}
          <div className="bg-[#0a1020] border border-[#1a2540] rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#ff6b00]/5 rounded-bl-full" />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ff6b00] to-amber-500 flex items-center justify-center font-bold text-white text-2xl shadow-orange-glow">
                  {selectedGroup.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedGroup.name}</h2>
                  <p className="text-sm text-slate-400 mt-0.5">
                    Created by <span className="text-[#ff6b00]">{selectedGroup.creator.fullName}</span>
                  </p>
                  <p className="text-sm text-slate-400 mt-2 max-w-lg">{selectedGroup.description}</p>
                </div>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <button
                  onClick={() => navigate(`/chat?groupId=${selectedGroup.id}`)}
                  className="flex items-center gap-2 py-2.5 px-5 rounded-xl bg-[#ff6b00] hover:bg-[#ff7a1a] text-white text-sm font-bold shadow-orange-glow-sm transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Group Chat</span>
                </button>
                <button
                  onClick={() => handleLeaveGroup(selectedGroup.id)}
                  className="flex items-center gap-2 py-2.5 px-4 rounded-xl border border-red-500/20 hover:bg-red-500/10 text-red-400 text-sm font-bold transition-colors"
                >
                  <DoorOpen className="w-4 h-4" />
                  <span className="hidden sm:inline">Leave</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Members */}
            <div className="lg:col-span-2 bg-[#0a1020] border border-[#1a2540] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-[#ff6b00]" />
                <h3 className="font-bold text-white">Members ({groupMembers.length})</h3>
              </div>
              {loadingDetails ? (
                <div className="text-center py-6 text-slate-500 text-sm">Loading...</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {groupMembers.map((m) => {
                    const isCreator = m.id === selectedGroup.creator.id;
                    return (
                      <div key={m.id} className="flex items-center gap-3 p-3 bg-[#111827] border border-[#1a2540] rounded-xl">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff6b00] to-amber-500 flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
                          {m.fullName.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-white flex items-center gap-1.5">
                            {m.fullName}
                            {isCreator && <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />}
                          </div>
                          <div className="text-xs text-slate-500 truncate">{m.college || 'SkillSwap Student'}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Classes */}
            <div className="bg-[#0a1020] border border-[#1a2540] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-[#ff6b00]" />
                <h3 className="font-bold text-white">Classes</h3>
              </div>
              {loadingDetails ? (
                <div className="text-center py-6 text-slate-500 text-sm">Loading...</div>
              ) : groupClasses.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">No classes scheduled</div>
              ) : (
                <div className="space-y-2">
                  {groupClasses.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => navigate('/classes')}
                      className="p-3 bg-[#111827] border border-[#1a2540] hover:border-[#ff6b00]/30 rounded-xl cursor-pointer transition-all"
                    >
                      <div className="font-semibold text-white text-xs truncate">{c.title}</div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        {new Date(c.startTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </div>
                      <span className="mono-tag text-[#ff6b00] mt-1 inline-block">{c.meetingPlatform}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ── Groups Directory ── */
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">Learning Groups</h2>
              <p className="text-sm text-slate-400 mt-0.5">Collaborate and learn together</p>
            </div>
            <button
              onClick={() => setIsCreatingGroup(true)}
              className="flex items-center gap-2 btn-primary"
            >
              <Plus className="w-4 h-4" />
              <span>New Group</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-[#0a1020] border border-[#1a2540] p-1 rounded-xl w-fit">
            {(['my', 'explore'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeSubTab === tab
                    ? 'bg-[#ff6b00] text-white shadow-orange-glow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'my' ? `My Groups (${myGroups.length})` : 'Explore Public'}
              </button>
            ))}
          </div>

          {/* Group Grid */}
          {activeSubTab === 'my' ? (
            myGroups.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-[#1a2540] rounded-2xl bg-[#0a1020]">
                <FolderGit2 className="w-12 h-12 text-[#1a2540] mx-auto mb-4" />
                <p className="text-slate-400 font-semibold text-sm">No groups yet</p>
                <p className="text-slate-600 text-xs mt-1">Browse the Explore tab to find study groups</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {myGroups.map((g) => <GroupCard key={g.id} g={g} mode="mine" />)}
              </div>
            )
          ) : (
            publicGroups.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-[#1a2540] rounded-2xl bg-[#0a1020]">
                <Globe className="w-12 h-12 text-[#1a2540] mx-auto mb-4" />
                <p className="text-slate-400 font-semibold text-sm">No public groups found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {publicGroups.map((g) => <GroupCard key={g.id} g={g} mode="public" />)}
              </div>
            )
          )}
        </div>
      )}

      {/* ── Create Group Modal ── */}
      {isCreatingGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-[#0a1020] border border-[#1a2540] rounded-2xl p-6 card-offset animate-slide-in">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold text-white">Create Learning Group</h3>
                <p className="text-xs text-slate-400 mt-0.5">Build a study community</p>
              </div>
              <button onClick={() => setIsCreatingGroup(false)} className="text-slate-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block mono-tag text-slate-400 mb-1.5">Group Name</label>
                <input
                  type="text" required
                  placeholder="e.g. EECS Algorithms Study Group"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full bg-[#111827] border border-[#1a2540] focus:border-[#ff6b00] text-white rounded-xl py-2.5 px-4 outline-none transition-colors text-sm placeholder-slate-600"
                />
              </div>
              <div>
                <label className="block mono-tag text-slate-400 mb-1.5">Description</label>
                <textarea
                  rows={3}
                  placeholder="Goals, topics, study schedule..."
                  value={groupDesc}
                  onChange={(e) => setGroupDesc(e.target.value)}
                  className="w-full bg-[#111827] border border-[#1a2540] focus:border-[#ff6b00] text-white rounded-xl py-2.5 px-4 outline-none transition-colors text-sm resize-none placeholder-slate-600"
                />
              </div>
              <div className="flex items-center gap-3 p-3 bg-[#111827] border border-[#1a2540] rounded-xl">
                <button
                  type="button"
                  onClick={() => setIsPrivate(!isPrivate)}
                  className={`w-10 h-6 rounded-full transition-colors flex-shrink-0 relative ${isPrivate ? 'bg-[#ff6b00]' : 'bg-[#1a2540]'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${isPrivate ? 'left-5' : 'left-1'}`} />
                </button>
                <div>
                  <div className="text-sm font-semibold text-white">Private Group</div>
                  <div className="text-xs text-slate-500">Only invited members can join</div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingGroup(false)}
                  className="flex-1 btn-secondary py-2.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 btn-primary py-2.5 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {creating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
