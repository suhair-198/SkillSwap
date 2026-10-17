import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LiveClassDTO, GroupDTO } from '../services/types';
import { 
  Tv, 
  Plus, 
  Calendar, 
  Clock, 
  Video, 
  ExternalLink, 
  CheckCircle, 
  Star, 
  ArrowLeft,
  Users,
  Zap,
  X
} from 'lucide-react';

const PLATFORM_COLORS: Record<string, string> = {
  GOOGLE_MEET: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  ZOOM: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  TEAMS: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  JITSI: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
};

export const Classes: React.FC = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<LiveClassDTO[]>([]);
  const [myGroups, setMyGroups] = useState<GroupDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'conducting' | 'attending'>('all');

  const [isScheduling, setIsScheduling] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [groupId, setGroupId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState(60);
  const [platform, setPlatform] = useState('GOOGLE_MEET');
  const [meetingUrl, setMeetingUrl] = useState('');
  const [scheduling, setScheduling] = useState(false);

  const [selectedClass, setSelectedClass] = useState<LiveClassDTO | null>(null);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComments, setFeedbackComments] = useState('');
  const [groupMembers, setGroupMembers] = useState<any[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [upcomingClasses, groups] = await Promise.all([
        api.classes.getUpcoming(),
        api.groups.getMy(),
      ]);
      setClasses(upcomingClasses);
      setMyGroups(groups);
    } catch (err) {
      console.error('Error fetching classes data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !startTime || !meetingUrl.trim()) return;
    setScheduling(true);
    try {
      await api.classes.create({
        title: title.trim(), description: description.trim(),
        groupId: groupId || undefined,
        startTime: new Date(startTime).toISOString(),
        durationMinutes: duration, meetingPlatform: platform, meetingUrl: meetingUrl.trim(),
      });
      setTitle(''); setDescription(''); setGroupId(''); setStartTime('');
      setDuration(60); setPlatform('GOOGLE_MEET'); setMeetingUrl('');
      setIsScheduling(false);
      await fetchData();
    } catch (err: any) {
      alert(`Failed to schedule class: ${err.message || 'Please check your connection.'}`);
    } finally {
      setScheduling(false);
    }
  };

  const handleRegister = async (classId: string) => {
    try {
      await api.classes.register(classId);
      await fetchData();
    } catch (err: any) {
      alert(`Failed to register: ${err.message}`);
    }
  };

  const viewClassDetails = async (c: LiveClassDTO) => {
    setSelectedClass(c);
    setLoadingDetails(true);
    try {
      const fb = await api.classes.getFeedback(c.id);
      setFeedbacks(fb);
      if (c.instructor.id === user?.id) {
        const members = c.group
          ? await api.groups.getMembers(c.group.id)
          : await api.connections.getMy();
        setGroupMembers(members);
      }
    } catch (err) {
      console.error('Error loading details', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleMarkAttendance = async (userId: string, attended: boolean) => {
    if (!selectedClass) return;
    try {
      await api.classes.markAttendance(selectedClass.id, userId, attended);
    } catch (err: any) {
      alert(`Failed to update attendance: ${err.message}`);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass) return;
    try {
      await api.classes.submitFeedback(selectedClass.id, { rating: feedbackRating, comments: feedbackComments.trim() });
      setFeedbackComments(''); setFeedbackRating(5);
      const fb = await api.classes.getFeedback(selectedClass.id);
      setFeedbacks(fb);
    } catch (err: any) {
      alert(`Failed to submit feedback: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff6b00] to-amber-500 flex items-center justify-center animate-glow-pulse">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="mono-tag text-[#ff6b00]">Loading Classes...</span>
        </div>
      </div>
    );
  }

  const filteredClasses = classes.filter((c) => {
    if (activeTab === 'conducting') return c.instructor.id === user?.id;
    if (activeTab === 'attending') return c.instructor.id !== user?.id;
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-slide-in">
      {selectedClass ? (
        /* ── Class Details ── */
        <div className="space-y-6">
          <button
            onClick={() => setSelectedClass(null)}
            className="flex items-center gap-2 text-slate-400 hover:text-[#ff6b00] transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Classes</span>
          </button>

          {/* Class Header */}
          <div className="bg-[#0a1020] border border-[#1a2540] rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#ff6b00]/5 rounded-bl-full" />
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 relative z-10">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-[#ff6b00]/10 border border-[#ff6b00]/20 flex items-center justify-center text-[#ff6b00]">
                    <Video className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedClass.title}</h2>
                    <p className="text-sm text-slate-400 mt-0.5">
                      by <span className="text-[#ff6b00]">{selectedClass.instructor.fullName}</span>
                      {selectedClass.group && <> · {selectedClass.group.name}</>}
                    </p>
                  </div>
                </div>
                {selectedClass.description && (
                  <p className="text-sm text-slate-400 leading-relaxed">{selectedClass.description}</p>
                )}
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-[#ff6b00]" />
                    <span>{new Date(selectedClass.startTime).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-[#ff6b00]" />
                    <span>{selectedClass.durationMinutes} mins</span>
                  </div>
                  <span className={`mono-tag px-2 py-0.5 rounded-full border ${PLATFORM_COLORS[selectedClass.meetingPlatform] || 'text-slate-400 bg-[#1a2540] border-[#1a2540]'}`}>
                    {selectedClass.meetingPlatform}
                  </span>
                </div>
              </div>
              <a
                href={selectedClass.meetingUrl}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 btn-primary flex-shrink-0"
              >
                <span>Join Meeting</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mark Attendance */}
            {selectedClass.instructor.id === user?.id && (
              <div className="bg-[#0a1020] border border-[#1a2540] rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-bold text-white">Mark Attendance</h3>
                </div>
                {loadingDetails ? (
                  <div className="text-center py-6 text-slate-500 text-sm">Loading...</div>
                ) : groupMembers.length === 0 ? (
                  <p className="text-xs text-slate-500">No students to mark attendance for.</p>
                ) : (
                  <div className="space-y-2">
                    {groupMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 bg-[#111827] border border-[#1a2540] rounded-xl">
                        <span className="text-sm font-semibold text-white">{member.fullName}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleMarkAttendance(member.id, true)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-colors"
                          >
                            ✓ Present
                          </button>
                          <button
                            onClick={() => handleMarkAttendance(member.id, false)}
                            className="px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-colors"
                          >
                            ✗ Absent
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Feedback */}
            <div className="bg-[#0a1020] border border-[#1a2540] rounded-2xl p-5 space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-4 h-4 text-amber-400" />
                  <h3 className="font-bold text-white">Class Reviews</h3>
                </div>
                {loadingDetails ? (
                  <div className="text-center py-4 text-slate-500 text-sm">Loading...</div>
                ) : feedbacks.length === 0 ? (
                  <p className="text-xs text-slate-500">No reviews yet.</p>
                ) : (
                  <div className="space-y-2 max-h-52 overflow-y-auto">
                    {feedbacks.map((f, i) => (
                      <div key={i} className="p-3 bg-[#111827] border border-[#1a2540] rounded-xl">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-white">{f.user?.fullName || 'Student'}</span>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: f.rating }).map((_, j) => (
                              <Star key={j} className="w-3 h-3 text-amber-400 fill-amber-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-slate-400 italic">"{f.comments}"</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedClass.instructor.id !== user?.id && (
                <form onSubmit={handleFeedbackSubmit} className="border-t border-[#1a2540] pt-4 space-y-3">
                  <h4 className="mono-tag text-slate-400">Leave a Review</h4>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(r => (
                      <button key={r} type="button" onClick={() => setFeedbackRating(r)}>
                        <Star className={`w-5 h-5 transition-colors ${r <= feedbackRating ? 'text-amber-400 fill-amber-400' : 'text-[#1a2540]'}`} />
                      </button>
                    ))}
                  </div>
                  <textarea
                    rows={2} required
                    value={feedbackComments}
                    onChange={(e) => setFeedbackComments(e.target.value)}
                    placeholder="What did you learn? How can the instructor improve?"
                    className="w-full bg-[#111827] border border-[#1a2540] focus:border-[#ff6b00] text-white rounded-xl py-2.5 px-3 outline-none text-xs resize-none placeholder-slate-600"
                  />
                  <button type="submit" className="btn-primary text-xs py-2">
                    Submit Review
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ── Classes Directory ── */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">Live Classes</h2>
              <p className="text-sm text-slate-400 mt-0.5">Schedule and join live learning sessions</p>
            </div>
            <button onClick={() => setIsScheduling(true)} className="flex items-center gap-2 btn-primary">
              <Plus className="w-4 h-4" />
              <span>Schedule Class</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-[#0a1020] border border-[#1a2540] p-1 rounded-xl w-fit flex-wrap">
            {(['all', 'conducting', 'attending'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all capitalize ${
                  activeTab === tab ? 'bg-[#ff6b00] text-white shadow-orange-glow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'all' ? 'All Upcoming' : tab === 'conducting' ? 'I Conduct' : 'I Attend'}
              </button>
            ))}
          </div>

          {filteredClasses.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-[#1a2540] rounded-2xl bg-[#0a1020]">
              <Tv className="w-12 h-12 text-[#1a2540] mx-auto mb-4" />
              <p className="text-slate-400 font-semibold text-sm">No classes found</p>
              <p className="text-slate-600 text-xs mt-1">Schedule a session or look out for public class listings</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClasses.map((c) => {
                const conducting = c.instructor.id === user?.id;
                const platformStyle = PLATFORM_COLORS[c.meetingPlatform] || 'text-slate-400 bg-[#1a2540] border-[#1a2540]';
                return (
                  <div
                    key={c.id}
                    className="bg-[#0a1020] border border-[#1a2540] rounded-2xl p-5 hover:border-[#ff6b00]/30 transition-all duration-200 flex flex-col gap-4 card-offset-sm"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-bold text-white text-sm leading-tight">{c.title}</h4>
                        <span className={`mono-tag px-2 py-0.5 rounded-full border flex-shrink-0 ${platformStyle}`}>
                          {c.meetingPlatform.split('_')[0]}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">by {c.instructor.fullName}</p>

                      <div className="space-y-1.5 mt-3">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Calendar className="w-3.5 h-3.5 text-[#ff6b00] flex-shrink-0" />
                          <span>{new Date(c.startTime).toLocaleDateString()} at {new Date(c.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Clock className="w-3.5 h-3.5 text-[#ff6b00] flex-shrink-0" />
                          <span>{c.durationMinutes} min session</span>
                        </div>
                      </div>

                      {c.description && (
                        <p className="text-xs text-slate-500 mt-3 line-clamp-2 leading-relaxed">{c.description}</p>
                      )}
                    </div>

                    <div className="flex gap-2 mt-auto pt-3 border-t border-[#1a2540]">
                      <button
                        onClick={() => viewClassDetails(c)}
                        className="flex-1 py-2 px-3 rounded-xl bg-[#111827] border border-[#1a2540] hover:border-[#ff6b00]/30 text-white text-xs font-semibold transition-all"
                      >
                        Details
                      </button>
                      {!conducting && (
                        <button
                          onClick={() => handleRegister(c.id)}
                          className="py-2 px-3 rounded-xl bg-[#ff6b00] hover:bg-[#ff7a1a] text-white text-xs font-bold transition-colors shadow-orange-glow-sm"
                        >
                          Register
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Schedule Modal ── */}
      {isScheduling && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-[#0a1020] border border-[#1a2540] rounded-2xl p-6 card-offset animate-slide-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold text-white">Schedule Live Class</h3>
                <p className="text-xs text-slate-400 mt-0.5">Host a live learning session</p>
              </div>
              <button onClick={() => setIsScheduling(false)} className="text-slate-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              {[
                { label: 'Class Title', id: 'title', placeholder: 'e.g. Master React Hooks', type: 'text', value: title, setter: setTitle, required: true },
              ].map((f) => (
                <div key={f.id}>
                  <label className="block mono-tag text-slate-400 mb-1.5">{f.label}</label>
                  <input
                    type={f.type} required={f.required}
                    placeholder={f.placeholder}
                    value={f.value}
                    onChange={(e) => f.setter(e.target.value)}
                    className="w-full bg-[#111827] border border-[#1a2540] focus:border-[#ff6b00] text-white rounded-xl py-2.5 px-4 outline-none text-sm placeholder-slate-600"
                  />
                </div>
              ))}

              <div>
                <label className="block mono-tag text-slate-400 mb-1.5">Description</label>
                <textarea
                  rows={2} placeholder="Syllabus, goals, prerequisites..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#111827] border border-[#1a2540] focus:border-[#ff6b00] text-white rounded-xl py-2.5 px-4 outline-none text-sm resize-none placeholder-slate-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mono-tag text-slate-400 mb-1.5">Study Group</label>
                  <select
                    value={groupId} onChange={(e) => setGroupId(e.target.value)}
                    className="w-full bg-[#111827] border border-[#1a2540] focus:border-[#ff6b00] text-white rounded-xl py-2.5 px-3 outline-none text-sm"
                  >
                    <option value="">None (Public)</option>
                    {myGroups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block mono-tag text-slate-400 mb-1.5">Duration (mins)</label>
                  <input
                    type="number" min={15} max={180} required
                    value={duration} onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full bg-[#111827] border border-[#1a2540] focus:border-[#ff6b00] text-white rounded-xl py-2.5 px-4 outline-none text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mono-tag text-slate-400 mb-1.5">Platform</label>
                  <select
                    value={platform} onChange={(e) => setPlatform(e.target.value)}
                    className="w-full bg-[#111827] border border-[#1a2540] focus:border-[#ff6b00] text-white rounded-xl py-2.5 px-3 outline-none text-sm"
                  >
                    <option value="GOOGLE_MEET">Google Meet</option>
                    <option value="ZOOM">Zoom</option>
                    <option value="TEAMS">MS Teams</option>
                    <option value="JITSI">Jitsi</option>
                  </select>
                </div>
                <div>
                  <label className="block mono-tag text-slate-400 mb-1.5">Start Time</label>
                  <input
                    type="datetime-local" required
                    value={startTime} onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-[#111827] border border-[#1a2540] focus:border-[#ff6b00] text-white rounded-xl py-2.5 px-3 outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block mono-tag text-slate-400 mb-1.5">Meeting URL</label>
                <input
                  type="url" required
                  placeholder="https://meet.google.com/..."
                  value={meetingUrl} onChange={(e) => setMeetingUrl(e.target.value)}
                  className="w-full bg-[#111827] border border-[#1a2540] focus:border-[#ff6b00] text-white rounded-xl py-2.5 px-4 outline-none text-sm placeholder-slate-600"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsScheduling(false)} className="flex-1 btn-secondary py-2.5">Cancel</button>
                <button type="submit" disabled={scheduling} className="flex-1 btn-primary py-2.5 flex items-center justify-center gap-2 disabled:opacity-50">
                  {scheduling && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
