import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { GroupDTO, UserDTO, LiveClassDTO } from '../services/types';
import { 
  FolderGit2, Plus, Users, MessageSquare, Calendar, Crown, Check,
  DoorOpen, ArrowLeft, Lock, Globe, Zap, X, AlertCircle
} from 'lucide-react';

const categoryColors = ['from-orange-400 to-rose-400', 'from-purple-400 to-indigo-400', 'from-emerald-400 to-teal-400', 'from-blue-400 to-cyan-400', 'from-amber-400 to-yellow-400'];

export const Groups: React.FC = () => {
  const navigate = useNavigate();
  const [publicGroups, setPublicGroups] = useState<GroupDTO[]>([]);
  const [myGroups, setMyGroups] = useState<GroupDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<'my' | 'explore'>('my');
  const [errorMsg, setErrorMsg] = useState('');

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
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load groups');
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
      setErrorMsg(`Failed to create group: ${err.message || 'Please check your connection.'}`);
      setTimeout(() => setErrorMsg(''), 5000);
    } finally {
      setCreating(false);
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    try {
      await api.groups.join(groupId);
      await fetchGroupsData();
    } catch (err: any) {
      setErrorMsg(`Failed to join group: ${err.message}`);
      setTimeout(() => setErrorMsg(''), 5000);
    }
  };

  const handleLeaveGroup = async (groupId: string) => {
    if (!confirm('Leave this group?')) return;
    try {
      await api.groups.leave(groupId);
      setSelectedGroup(null);
      await fetchGroupsData();
    } catch (err: any) {
      setErrorMsg(`Failed to leave group: ${err.message}`);
      setTimeout(() => setErrorMsg(''), 5000);
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
  const getColorForGroup = (name: string) => categoryColors[name.charCodeAt(0) % categoryColors.length];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#f97316] to-[#7c3aed] flex items-center justify-center animate-glow-pulse shadow-lg">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <span className="mono-tag text-[#f97316]">Loading Groups...</span>
        </div>
      </div>
    );
  }

  // ── Group Card ──
  const GroupCard = ({ g, mode }: { g: GroupDTO; mode: 'mine' | 'public' }) => {
    const member = isMember(g.id);
    const colorGrad = getColorForGroup(g.name);
    return (
      <div className="card p-5 hover:shadow-lg flex flex-col gap-4 group transition-all duration-200">
        <div className="flex items-start gap-3">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colorGrad} flex items-center justify-center font-black text-white text-lg flex-shrink-0 shadow-md`}>
            {g.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-gray-900 text-sm">{g.name}</h4>
              {g.isPrivate ? (
                <span className="badge badge-gray flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> Private
                </span>
              ) : (
                <span className="badge badge-emerald flex items-center gap-1">
                  <Globe className="w-2.5 h-2.5" /> Public
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">by {g.creator.fullName}</p>
          </div>
        </div>

        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
          {g.description || 'No description provided. Join to learn more!'}
        </p>

        <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
          {mode === 'mine' ? (
            <>
              <button
                onClick={() => handleViewGroupDetails(g)}
                className="flex-1 py-2 px-3 rounded-xl bg-gray-50 border border-gray-200 hover:border-gray-300 text-gray-700 text-xs font-semibold transition-all"
              >
                Manage
              </button>
              <button
                onClick={() => navigate(`/chat?groupId=${g.id}`)}
                className="flex items-center gap-1.5 btn-primary py-2 px-4 text-xs rounded-xl"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat</span>
              </button>
            </>
          ) : (
            member ? (
              <button
                onClick={() => handleViewGroupDetails(g)}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Joined — View</span>
              </button>
            ) : (
              <button
                onClick={() => handleJoinGroup(g.id)}
                className="w-full btn-primary py-2 px-3 text-xs rounded-xl"
              >
                Join Group →
              </button>
            )
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-slide-in">

      {errorMsg && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-semibold animate-fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {errorMsg}
        </div>
      )}

      {selectedGroup ? (
        /* ── Group Details ── */
        <div className="space-y-6">
          <button
            onClick={() => setSelectedGroup(null)}
            className="flex items-center gap-2 text-gray-500 hover:text-[#f97316] transition-colors text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Groups</span>
          </button>

          {/* Group Header */}
          <div className="card-elevated overflow-hidden">
            <div className={`h-20 bg-gradient-to-r ${getColorForGroup(selectedGroup.name)}`} />
            <div className="p-6 -mt-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div className="flex items-end gap-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getColorForGroup(selectedGroup.name)} flex items-center justify-center font-black text-white text-3xl shadow-xl border-4 border-white`}>
                    {selectedGroup.name.charAt(0)}
                  </div>
                  <div className="pb-1">
                    <h2 className="text-xl font-black text-gray-900">{selectedGroup.name}</h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Created by <span className="text-[#f97316] font-semibold">{selectedGroup.creator.fullName}</span>
                    </p>
                    <p className="text-sm text-gray-500 mt-1 max-w-lg">{selectedGroup.description}</p>
                  </div>
                </div>
                <div className="flex gap-3 flex-shrink-0">
                  <button
                    onClick={() => navigate(`/chat?groupId=${selectedGroup.id}`)}
                    className="btn-primary flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Group Chat</span>
                  </button>
                  <button
                    onClick={() => handleLeaveGroup(selectedGroup.id)}
                    className="flex items-center gap-2 py-2.5 px-4 rounded-xl border border-red-200 hover:bg-red-50 text-red-500 text-sm font-semibold transition-colors"
                  >
                    <DoorOpen className="w-4 h-4" />
                    <span className="hidden sm:inline">Leave</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Members */}
            <div className="lg:col-span-2 card p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900">Members ({groupMembers.length})</h3>
              </div>
              {loadingDetails ? (
                <div className="text-center py-6 text-gray-400 text-sm">Loading...</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {groupMembers.map((m) => {
                    const isCreator = m.id === selectedGroup.creator.id;
                    return (
                      <div key={m.id} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl">
                        <div className="avatar w-9 h-9 text-sm font-black flex-shrink-0">
                          {m.fullName.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                            {m.fullName}
                            {isCreator && <Crown className="w-3 h-3 text-amber-500 fill-amber-500" />}
                          </div>
                          <div className="text-xs text-gray-400 truncate">{m.college || 'SkillSwap Student'}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Classes */}
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Calendar className="w-3.5 h-3.5 text-[#f97316]" />
                </div>
                <h3 className="font-bold text-gray-900">Classes</h3>
              </div>
              {loadingDetails ? (
                <div className="text-center py-6 text-gray-400 text-sm">Loading...</div>
              ) : groupClasses.length === 0 ? (
                <div className="text-center py-8 text-gray-300 text-xs">
                  <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-200" />
                  No classes scheduled
                </div>
              ) : (
                <div className="space-y-2">
                  {groupClasses.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => navigate('/classes')}
                      className="p-3 bg-orange-50 border border-orange-100 hover:border-orange-200 rounded-xl cursor-pointer transition-all"
                    >
                      <div className="font-bold text-gray-900 text-xs truncate">{c.title}</div>
                      <div className="text-[10px] text-gray-400 mt-1">
                        {new Date(c.startTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </div>
                      <span className="badge badge-orange mt-1">{c.meetingPlatform}</span>
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
              <h2 className="section-title">🏫 Learning Groups</h2>
              <p className="section-subtitle">Collaborate and grow with your peers</p>
            </div>
            <button
              onClick={() => setIsCreatingGroup(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Group</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl w-fit">
            {(['my', 'explore'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeSubTab === tab
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'my' ? `My Groups (${myGroups.length})` : 'Explore Public'}
              </button>
            ))}
          </div>

          {/* Group Grid */}
          {activeSubTab === 'my' ? (
            myGroups.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50">
                <FolderGit2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-bold">No groups yet</p>
                <p className="text-gray-400 text-sm mt-1">Browse the Explore tab to find study groups</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {myGroups.map((g) => <GroupCard key={g.id} g={g} mode="mine" />)}
              </div>
            )
          ) : (
            publicGroups.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50">
                <Globe className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-bold">No public groups found</p>
                <p className="text-gray-400 text-sm mt-1">Create one and start a community!</p>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-7 shadow-2xl border border-gray-100 animate-slide-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-black text-gray-900">🏫 Create Learning Group</h3>
                <p className="text-xs text-gray-400 mt-0.5">Build a study community</p>
              </div>
              <button onClick={() => setIsCreatingGroup(false)} className="text-gray-400 hover:text-gray-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Group Name</label>
                <input
                  type="text" required
                  placeholder="e.g. EECS Algorithms Study Group"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="input-light"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Description</label>
                <textarea
                  rows={3}
                  placeholder="Goals, topics, study schedule..."
                  value={groupDesc}
                  onChange={(e) => setGroupDesc(e.target.value)}
                  className="input-light resize-none"
                />
              </div>

              {/* Privacy Toggle */}
              <div
                className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-2xl cursor-pointer"
                onClick={() => setIsPrivate(!isPrivate)}
              >
                <button
                  type="button"
                  className={`w-11 h-6 rounded-full transition-colors flex-shrink-0 relative ${isPrivate ? 'bg-[#f97316]' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${isPrivate ? 'left-6' : 'left-1'}`} />
                </button>
                <div>
                  <div className="text-sm font-bold text-gray-800">Private Group</div>
                  <div className="text-xs text-gray-400">Only invited members can join</div>
                </div>
                {isPrivate ? <Lock className="w-4 h-4 text-[#f97316] ml-auto" /> : <Globe className="w-4 h-4 text-emerald-500 ml-auto" />}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsCreatingGroup(false)} className="flex-1 btn-secondary py-2.5">Cancel</button>
                <button
                  type="submit" disabled={creating}
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
