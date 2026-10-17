import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LiveClassDTO, GroupDTO } from '../services/types';
import { 
  Tv, Plus, Calendar, Clock, Video, ExternalLink, 
  CheckCircle, Star, ArrowLeft, Users, Zap, X, AlertCircle
} from 'lucide-react';

const PLATFORM_CONFIG: Record<string, { label: string; class: string; emoji: string }> = {
  GOOGLE_MEET: { label: 'Google Meet', class: 'platform-meet', emoji: '🟢' },
  ZOOM:        { label: 'Zoom',        class: 'platform-zoom', emoji: '🔵' },
  TEAMS:       { label: 'MS Teams',    class: 'platform-teams', emoji: '🟣' },
  JITSI:       { label: 'Jitsi',       class: 'platform-jitsi', emoji: '🟡' },
};

export const Classes: React.FC = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<LiveClassDTO[]>([]);
  const [myGroups, setMyGroups] = useState<GroupDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'conducting' | 'attending'>('all');
  const [errorMsg, setErrorMsg] = useState('');

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
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(''), 5000);
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
      showError(`Failed to schedule class: ${err.message || 'Please check your connection.'}`);
    } finally {
      setScheduling(false);
    }
  };

  const handleRegister = async (classId: string) => {
    try {
      await api.classes.register(classId);
      await fetchData();
    } catch (err: any) {
      showError(`Failed to register: ${err.message}`);
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
      showError(`Failed to update attendance: ${err.message}`);
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
      showError(`Failed to submit feedback: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#f97316] to-[#7c3aed] flex items-center justify-center animate-glow-pulse shadow-lg">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <span className="mono-tag text-[#f97316]">Loading Classes...</span>
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

      {errorMsg && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-semibold animate-fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {errorMsg}
        </div>
      )}

      {selectedClass ? (
        /* ── Class Details ── */
        <div className="space-y-6">
          <button
            onClick={() => setSelectedClass(null)}
            className="flex items-center gap-2 text-gray-500 hover:text-[#f97316] transition-colors text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Classes</span>
          </button>

          {/* Class Header */}
          <div className="card-elevated overflow-hidden">
            <div className="h-16 bg-gradient-to-r from-[#f97316] to-[#7c3aed]" />
            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 -mt-10 rounded-2xl bg-white border-4 border-white shadow-xl flex items-center justify-center">
                      <Video className="w-5 h-5 text-[#f97316]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-gray-900">{selectedClass.title}</h2>
                      <p className="text-sm text-gray-500">
                        by <span className="text-[#f97316] font-semibold">{selectedClass.instructor.fullName}</span>
                        {selectedClass.group && <> · {selectedClass.group.name}</>}
                      </p>
                    </div>
                  </div>
                  {selectedClass.description && (
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">{selectedClass.description}</p>
                  )}
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl">
                      <Calendar className="w-3.5 h-3.5 text-[#f97316]" />
                      <span>{new Date(selectedClass.startTime).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl">
                      <Clock className="w-3.5 h-3.5 text-[#f97316]" />
                      <span>{selectedClass.durationMinutes} mins</span>
                    </div>
                    <span className={`mono-tag px-3 py-1.5 rounded-xl border ${PLATFORM_CONFIG[selectedClass.meetingPlatform]?.class || 'badge-gray'}`}>
                      {PLATFORM_CONFIG[selectedClass.meetingPlatform]?.emoji} {PLATFORM_CONFIG[selectedClass.meetingPlatform]?.label || selectedClass.meetingPlatform}
                    </span>
                  </div>
                </div>
                <a
                  href={selectedClass.meetingUrl}
                  target="_blank" rel="noopener noreferrer"
                  className="btn-primary flex items-center gap-2 flex-shrink-0"
                >
                  <span>Join Meeting</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Attendance */}
            {selectedClass.instructor.id === user?.id && (
              <div className="card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-gray-900">Mark Attendance</h3>
                </div>
                {loadingDetails ? (
                  <div className="text-center py-6 text-gray-400 text-sm">Loading...</div>
                ) : groupMembers.length === 0 ? (
                  <p className="text-sm text-gray-400">No students to mark attendance for.</p>
                ) : (
                  <div className="space-y-2">
                    {groupMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl">
                        <span className="text-sm font-semibold text-gray-800">{member.fullName}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleMarkAttendance(member.id, true)}
                            className="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition-colors"
                          >
                            ✓ Present
                          </button>
                          <button
                            onClick={() => handleMarkAttendance(member.id, false)}
                            className="px-3 py-1 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors"
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
            <div className="card p-5 space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Star className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  <h3 className="font-bold text-gray-900">Class Reviews</h3>
                </div>
                {loadingDetails ? (
                  <div className="text-center py-4 text-gray-400 text-sm">Loading...</div>
                ) : feedbacks.length === 0 ? (
                  <p className="text-sm text-gray-400">No reviews yet. Be the first!</p>
                ) : (
                  <div className="space-y-2 max-h-52 overflow-y-auto">
                    {feedbacks.map((f, i) => (
                      <div key={i} className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-gray-800">{f.user?.fullName || 'Student'}</span>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: f.rating }).map((_, j) => (
                              <Star key={j} className="w-3 h-3 text-amber-500 fill-amber-500" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 italic">"{f.comments}"</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedClass.instructor.id !== user?.id && (
                <form onSubmit={handleFeedbackSubmit} className="border-t border-gray-100 pt-4 space-y-3">
                  <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wide">Leave a Review</h4>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(r => (
                      <button key={r} type="button" onClick={() => setFeedbackRating(r)}>
                        <Star className={`w-6 h-6 transition-colors ${r <= feedbackRating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                      </button>
                    ))}
                  </div>
                  <textarea
                    rows={2} required
                    value={feedbackComments}
                    onChange={(e) => setFeedbackComments(e.target.value)}
                    placeholder="What did you learn? How can the instructor improve?"
                    className="input-light resize-none text-xs"
                  />
                  <button type="submit" className="btn-primary text-xs py-2">Submit Review</button>
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
              <h2 className="section-title">📺 Live Classes</h2>
              <p className="section-subtitle">Schedule and join live learning sessions</p>
            </div>
            <button onClick={() => setIsScheduling(true)} className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span>Schedule Class</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl w-fit flex-wrap">
            {(['all', 'conducting', 'attending'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'all' ? 'All Upcoming' : tab === 'conducting' ? 'I Conduct' : 'I Attend'}
              </button>
            ))}
          </div>

          {filteredClasses.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50">
              <Tv className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-bold">No classes found</p>
              <p className="text-gray-400 text-sm mt-1">Schedule a session or look out for public class listings</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClasses.map((c) => {
                const conducting = c.instructor.id === user?.id;
                const plat = PLATFORM_CONFIG[c.meetingPlatform] || { label: c.meetingPlatform, class: 'badge-gray', emoji: '🔗' };
                return (
                  <div key={c.id} className="card p-5 flex flex-col gap-4 hover:shadow-lg transition-all">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-bold text-gray-900 text-sm leading-tight">{c.title}</h4>
                        <span className={`mono-tag px-2 py-0.5 rounded-full border flex-shrink-0 ${plat.class}`}>
                          {plat.emoji} {c.meetingPlatform.split('_')[0]}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">by {c.instructor.fullName}</p>
                      {conducting && (
                        <span className="badge badge-orange mt-1">You're teaching</span>
                      )}

                      <div className="space-y-1.5 mt-3">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Calendar className="w-3.5 h-3.5 text-[#f97316] flex-shrink-0" />
                          <span>{new Date(c.startTime).toLocaleDateString()} at {new Date(c.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Clock className="w-3.5 h-3.5 text-[#f97316] flex-shrink-0" />
                          <span>{c.durationMinutes} min session</span>
                        </div>
                      </div>

                      {c.description && (
                        <p className="text-xs text-gray-400 mt-3 line-clamp-2 leading-relaxed">{c.description}</p>
                      )}
                    </div>

                    <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
                      <button
                        onClick={() => viewClassDetails(c)}
                        className="flex-1 py-2 px-3 rounded-xl bg-gray-50 border border-gray-200 hover:border-gray-300 text-gray-700 text-xs font-semibold transition-all"
                      >
                        Details
                      </button>
                      {!conducting && (
                        <button
                          onClick={() => handleRegister(c.id)}
                          className="btn-primary py-2 px-4 text-xs rounded-xl"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-7 shadow-2xl border border-gray-100 animate-slide-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-black text-gray-900">📺 Schedule Live Class</h3>
                <p className="text-xs text-gray-400 mt-0.5">Host a live learning session</p>
              </div>
              <button onClick={() => setIsScheduling(false)} className="text-gray-400 hover:text-gray-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Class Title</label>
                <input
                  type="text" required
                  placeholder="e.g. Master React Hooks"
                  value={title} onChange={(e) => setTitle(e.target.value)}
                  className="input-light"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Description</label>
                <textarea
                  rows={2}
                  placeholder="Syllabus, goals, prerequisites..."
                  value={description} onChange={(e) => setDescription(e.target.value)}
                  className="input-light resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Study Group</label>
                  <select value={groupId} onChange={(e) => setGroupId(e.target.value)} className="input-light">
                    <option value="">None (Public)</option>
                    {myGroups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Duration (mins)</label>
                  <input
                    type="number" min={15} max={180} required
                    value={duration} onChange={(e) => setDuration(Number(e.target.value))}
                    className="input-light"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Platform</label>
                  <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="input-light">
                    <option value="GOOGLE_MEET">Google Meet</option>
                    <option value="ZOOM">Zoom</option>
                    <option value="TEAMS">MS Teams</option>
                    <option value="JITSI">Jitsi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Start Time</label>
                  <input
                    type="datetime-local" required
                    value={startTime} onChange={(e) => setStartTime(e.target.value)}
                    className="input-light"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Meeting URL</label>
                <input
                  type="url" required
                  placeholder="https://meet.google.com/..."
                  value={meetingUrl} onChange={(e) => setMeetingUrl(e.target.value)}
                  className="input-light"
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
