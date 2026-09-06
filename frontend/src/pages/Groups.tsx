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
  ArrowLeft
} from 'lucide-react';

export const Groups: React.FC = () => {
  const navigate = useNavigate();
  
  // Lists
  const [publicGroups, setPublicGroups] = useState<GroupDTO[]>([]);
  const [myGroups, setMyGroups] = useState<GroupDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<'my' | 'explore'>('my');

  // Create Group Modal
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDesc, setGroupDesc] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  // Group Details Sub-View
  const [selectedGroup, setSelectedGroup] = useState<GroupDTO | null>(null);
  const [groupMembers, setGroupMembers] = useState<UserDTO[]>([]);
  const [groupClasses, setGroupClasses] = useState<LiveClassDTO[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchGroupsData();
  }, []);

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

    try {
      await api.groups.create({
        name: groupName.trim(),
        description: groupDesc.trim(),
        isPrivate
      });
      setGroupName('');
      setGroupDesc('');
      setIsPrivate(false);
      setIsCreatingGroup(false);
      await fetchGroupsData();
    } catch (err) {
      alert('Failed to create group');
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    try {
      await api.groups.join(groupId);
      await fetchGroupsData();
      alert('Joined group successfully!');
    } catch (err) {
      alert('Failed to join group');
    }
  };

  const handleLeaveGroup = async (groupId: string) => {
    if (!confirm('Are you sure you want to leave this learning group?')) return;
    try {
      await api.groups.leave(groupId);
      setSelectedGroup(null);
      await fetchGroupsData();
    } catch (err) {
      alert('Failed to leave group');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6b00]"></div>
      </div>
    );
  }

  const isMember = (groupId: string) => myGroups.some(g => g.id === groupId);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {selectedGroup ? (
        /* Group Details Sub-View */
        <div className="space-y-6">
          {/* Back button */}
          <button
            onClick={() => setSelectedGroup(null)}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#ff6b00] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Groups List</span>
          </button>

          {/* Group Jumbotron */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-[#ff6b00] to-orange-400 flex items-center justify-center font-extrabold text-white text-xl shrink-0 shadow-glow">
                  #
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#0f172a] tracking-wide">{selectedGroup.name}</h2>
                  <p className="text-xs text-slate-500 font-medium">Created by {selectedGroup.creator.fullName}</p>
                </div>
              </div>
              <p className="text-sm text-slate-700 mt-4 leading-relaxed italic max-w-2xl font-medium">
                {selectedGroup.description || 'No description available for this group.'}
              </p>
            </div>

            <div className="flex gap-3 shrink-0">
              <button
                onClick={() => navigate(`/chat?groupId=${selectedGroup.id}`)}
                className="bg-gradient-to-r from-[#ff6b00] to-orange-600 text-white rounded-xl py-2.5 px-5 text-sm font-extrabold flex items-center gap-1.5 transition-all shadow-glow"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Group Chat</span>
              </button>
              <button
                onClick={() => handleLeaveGroup(selectedGroup.id)}
                className="bg-red-50 hover:bg-red-600 border border-red-200 hover:border-transparent text-red-700 hover:text-white font-bold rounded-xl py-2.5 px-5 text-sm flex items-center gap-1.5 transition-all"
              >
                <DoorOpen className="h-4 w-4" />
                <span>Leave</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Col: Members List (Span 2) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                <h3 className="text-base font-extrabold text-[#0f172a] tracking-wide mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#ff6b00]" />
                  <span>Group Members ({groupMembers.length})</span>
                </h3>

                {loadingDetails ? (
                  <div className="text-center py-6 text-xs text-slate-500 font-bold">Loading members...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {groupMembers.map((m) => {
                      const isCreator = m.id === selectedGroup.creator.id;
                      return (
                        <div 
                          key={m.id}
                          className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl"
                        >
                          <div className="h-9 w-9 bg-gradient-to-tr from-[#ff6b00] to-orange-400 flex items-center justify-center font-bold text-white text-sm rounded-lg shrink-0 shadow-glow">
                            {m.fullName.charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-extrabold text-[#0f172a] text-xs flex items-center gap-1">
                              {m.fullName}
                              {isCreator && <Crown className="h-3 w-3 text-amber-500 fill-amber-500" />}
                            </div>
                            <div className="text-[10px] text-slate-500 font-medium truncate">{m.college || 'Swap Student'}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Col: Group Classes */}
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                <h3 className="text-base font-extrabold text-[#0f172a] tracking-wide mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[#ff6b00]" />
                  <span>Group Classes</span>
                </h3>

                {loadingDetails ? (
                  <div className="text-center py-6 text-xs text-slate-500 font-bold">Loading classes...</div>
                ) : groupClasses.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400 font-bold">No classes scheduled for this group.</div>
                ) : (
                  <div className="space-y-3">
                    {groupClasses.map((c) => (
                      <div 
                        key={c.id}
                        onClick={() => navigate('/classes')} 
                        className="p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-orange-300 cursor-pointer transition-all"
                      >
                        <div className="font-extrabold text-[#0f172a] text-xs truncate">{c.title}</div>
                        <div className="text-[10px] text-slate-500 font-medium mt-1">
                          {new Date(c.startTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </div>
                        <div className="text-[9px] font-bold text-[#ff6b00] mt-0.5">{c.meetingPlatform}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Groups Directory View */
        <div className="space-y-6">
          {/* Header row */}
          <div className="flex justify-between items-center">
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => setActiveSubTab('my')}
                className={`px-5 py-2.5 font-bold text-sm transition-all border-b-2 ${
                  activeSubTab === 'my' 
                    ? 'text-[#ff6b00] border-[#ff6b00]' 
                    : 'text-slate-500 border-transparent hover:text-[#0f172a]'
                }`}
              >
                My Groups
              </button>
              <button
                onClick={() => setActiveSubTab('explore')}
                className={`px-5 py-2.5 font-bold text-sm transition-all border-b-2 ${
                  activeSubTab === 'explore' 
                    ? 'text-[#ff6b00] border-[#ff6b00]' 
                    : 'text-slate-500 border-transparent hover:text-[#0f172a]'
                }`}
              >
                Explore Public Directory
              </button>
            </div>

            <button
              onClick={() => setIsCreatingGroup(true)}
              className="bg-gradient-to-r from-[#ff6b00] to-orange-600 hover:brightness-110 active:scale-95 text-white font-extrabold text-xs rounded-xl py-2.5 px-4 flex items-center gap-1.5 transition-all shadow-glow"
            >
              <Plus className="h-4 w-4" />
              <span>New Group</span>
            </button>
          </div>

          {/* Group Grids */}
          <div>
            {activeSubTab === 'my' ? (
              myGroups.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-slate-300 rounded-2xl bg-white shadow-xs">
                  <FolderGit2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 font-bold text-sm">You haven't joined any groups yet.</p>
                  <p className="text-slate-500 text-xs mt-1 font-medium">Browse the Explore Directory tab to find and join study groups!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myGroups.map((g) => (
                    <div 
                      key={g.id}
                      className="bg-white border border-slate-200 hover:border-orange-300 rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all duration-200"
                    >
                      <div>
                        <h4 className="font-extrabold text-[#0f172a] text-base truncate">{g.name}</h4>
                        <p className="text-xs text-slate-500 font-medium mt-1 truncate">Created by {g.creator.fullName}</p>
                        <p className="text-xs text-slate-600 mt-3 line-clamp-2 h-8 italic font-medium">
                          {g.description || 'No description available.'}
                        </p>
                      </div>
                      <div className="flex gap-2 pt-4">
                        <button
                          onClick={() => handleViewGroupDetails(g)}
                          className="flex-1 bg-slate-100 border border-slate-300 hover:bg-slate-200 text-[#0f172a] rounded-xl py-2 px-3 text-xs font-bold transition-all flex items-center justify-center gap-1"
                        >
                          <span>Manage</span>
                        </button>
                        <button
                          onClick={() => navigate(`/chat?groupId=${g.id}`)}
                          className="bg-gradient-to-r from-[#ff6b00] to-orange-600 text-white rounded-xl py-2 px-3 text-xs font-extrabold transition-all flex items-center justify-center gap-1 shadow-glow"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>Chat</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              publicGroups.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-slate-300 rounded-2xl bg-white shadow-xs">
                  <FolderGit2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 font-bold text-sm">No public groups found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {publicGroups.map((g) => {
                    const member = isMember(g.id);
                    return (
                      <div 
                        key={g.id}
                        className="bg-white border border-slate-200 hover:border-orange-300 rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all duration-200"
                      >
                        <div>
                          <h4 className="font-extrabold text-[#0f172a] text-base truncate">{g.name}</h4>
                          <p className="text-xs text-slate-500 font-medium mt-1 truncate">Created by {g.creator.fullName}</p>
                          <p className="text-xs text-slate-600 mt-3 line-clamp-2 h-8 italic font-medium">
                            {g.description || 'No description available.'}
                          </p>
                        </div>
                        <div className="pt-4 flex justify-end">
                          {member ? (
                            <button
                              onClick={() => handleViewGroupDetails(g)}
                              className="w-full bg-slate-100 border border-slate-300 text-slate-700 font-bold rounded-xl py-2 px-3 text-xs flex items-center justify-center gap-1.5"
                            >
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                              <span>Joined</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleJoinGroup(g.id)}
                              className="w-full bg-gradient-to-r from-[#ff6b00] to-orange-600 text-white rounded-xl py-2 px-3 text-xs font-extrabold transition-all shadow-glow"
                            >
                              Join Group
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Create Group Modal Overlay */}
      {isCreatingGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white border border-slate-300 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-extrabold text-[#0f172a] mb-1">Create Learning Group</h3>
            <p className="text-xs text-slate-500 font-medium mb-4">Establish a study room to coordinate group learning and schedule web sessions.</p>

            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Group Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EECS Algorithms Group"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-[#ff6b00] focus:bg-white text-[#0f172a] font-medium rounded-xl py-3 px-4 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  rows={3}
                  placeholder="Goals, topics discussed, or study schedules..."
                  value={groupDesc}
                  onChange={(e) => setGroupDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-[#ff6b00] focus:bg-white text-[#0f172a] font-medium rounded-xl py-3 px-4 outline-none text-sm resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreatingGroup(false)}
                  className="bg-slate-100 border border-slate-300 text-slate-700 font-bold hover:bg-slate-200 rounded-xl py-2.5 px-5 text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#ff6b00] to-orange-600 text-white font-extrabold rounded-xl py-2.5 px-6 text-sm hover:brightness-110 active:scale-95 transition-all shadow-glow"
                >
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
