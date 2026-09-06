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
  User, 
  CheckCircle, 
  Star, 
  BookOpen, 
  ArrowLeft,
  Users
} from 'lucide-react';

export const Classes: React.FC = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<LiveClassDTO[]>([]);
  const [myGroups, setMyGroups] = useState<GroupDTO[]>([]);
  const [loading, setLoading] = useState(true);

  // Tabs
  const [activeTab, setActiveTab] = useState<'all' | 'conducting' | 'attending'>('all');

  // Schedule Modal
  const [isScheduling, setIsScheduling] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [groupId, setGroupId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState(60);
  const [platform, setPlatform] = useState('GOOGLE_MEET');
  const [meetingUrl, setMeetingUrl] = useState('');

  // Details & Attendance & Feedback Sub-View
  const [selectedClass, setSelectedClass] = useState<LiveClassDTO | null>(null);
  const [attendanceList, setAttendanceList] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComments, setFeedbackComments] = useState('');
  const [groupMembers, setGroupMembers] = useState<any[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

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

    try {
      await api.classes.create({
        title: title.trim(),
        description: description.trim(),
        groupId: groupId || undefined,
        startTime: new Date(startTime).toISOString(),
        durationMinutes: duration,
        meetingPlatform: platform,
        meetingUrl: meetingUrl.trim(),
      });
      setTitle('');
      setDescription('');
      setGroupId('');
      setStartTime('');
      setDuration(60);
      setPlatform('GOOGLE_MEET');
      setMeetingUrl('');
      setIsScheduling(false);
      await fetchData();
      alert('Class scheduled successfully!');
    } catch (err) {
      alert('Failed to schedule class');
    }
  };

  const handleRegister = async (classId: string) => {
    try {
      await api.classes.register(classId);
      await fetchData();
      alert('Registered for class successfully!');
    } catch (err) {
      alert('Failed to register for class');
    }
  };

  const viewClassDetails = async (c: LiveClassDTO) => {
    setSelectedClass(c);
    setLoadingDetails(true);
    try {
      const fb = await api.classes.getFeedback(c.id);
      setFeedbacks(fb);

      if (c.instructor.id === user?.id) {
        if (c.group) {
          const members = await api.groups.getMembers(c.group.id);
          setGroupMembers(members);
        } else {
          const connections = await api.connections.getMy();
          setGroupMembers(connections);
        }
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
      alert('Attendance updated!');
    } catch (err) {
      alert('Failed to update attendance');
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass) return;

    try {
      await api.classes.submitFeedback(selectedClass.id, {
        rating: feedbackRating,
        comments: feedbackComments.trim(),
      });
      setFeedbackComments('');
      setFeedbackRating(5);
      const fb = await api.classes.getFeedback(selectedClass.id);
      setFeedbacks(fb);
      alert('Feedback submitted successfully!');
    } catch (err) {
      alert('Failed to submit feedback. Have you attended this class?');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6b00]"></div>
      </div>
    );
  }

  const filteredClasses = classes.filter((c) => {
    if (activeTab === 'conducting') {
      return c.instructor.id === user?.id;
    }
    if (activeTab === 'attending') {
      return c.instructor.id !== user?.id;
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {selectedClass ? (
        /* Details Sub-View */
        <div className="space-y-6">
          <button
            onClick={() => setSelectedClass(null)}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#ff6b00] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Classes List</span>
          </button>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#ff6b00]">
                  <Video className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#0f172a] tracking-wide">{selectedClass.title}</h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Instructor: {selectedClass.instructor.fullName} {selectedClass.group && `• Group: ${selectedClass.group.name}`}
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-700 mt-4 leading-relaxed italic max-w-2xl font-medium">
                {selectedClass.description || 'No description available.'}
              </p>
              <div className="flex flex-wrap gap-4 mt-4 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-[#ff6b00]" />
                  <span>{new Date(selectedClass.startTime).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-[#ff6b00]" />
                  <span>{selectedClass.durationMinutes} mins</span>
                </div>
                <div className="flex items-center gap-1">
                  <Tv className="h-4 w-4 text-[#ff6b00]" />
                  <span>{selectedClass.meetingPlatform}</span>
                </div>
              </div>
            </div>

            <a
              href={selectedClass.meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-[#ff6b00] to-orange-600 hover:brightness-110 text-white font-extrabold rounded-xl py-3 px-6 text-sm flex items-center gap-1.5 transition-all shadow-glow shrink-0"
            >
              <span>Join Meeting</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Mark Attendance (Instructors Only) */}
            {selectedClass.instructor.id === user?.id && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                <h3 className="text-base font-extrabold text-[#0f172a] mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span>Mark Student Attendance</span>
                </h3>

                {loadingDetails ? (
                  <div className="text-center py-6 text-xs text-slate-500 font-bold">Loading list...</div>
                ) : (
                  <div className="space-y-3">
                    {groupMembers.length === 0 ? (
                      <p className="text-xs text-slate-500 font-medium">No students available in this group to mark.</p>
                    ) : (
                      groupMembers.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl"
                        >
                          <span className="text-xs font-bold text-[#0f172a]">{member.fullName}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleMarkAttendance(member.id, true)}
                              className="bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 text-xs px-2.5 py-1 rounded-lg font-bold transition-colors"
                            >
                              Attended
                            </button>
                            <button
                              onClick={() => handleMarkAttendance(member.id, false)}
                              className="bg-red-50 hover:bg-red-600 text-red-700 hover:text-white border border-red-200 text-xs px-2.5 py-1 rounded-lg font-bold transition-colors"
                            >
                              Absent
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Class Feedback & Reviews */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-extrabold text-[#0f172a] mb-4 flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                  <span>Class Reviews</span>
                </h3>

                {loadingDetails ? (
                  <div className="text-center py-4 text-xs text-slate-500 font-bold">Loading feedback...</div>
                ) : feedbacks.length === 0 ? (
                  <p className="text-xs text-slate-400 font-bold">No feedback submitted for this class yet.</p>
                ) : (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {feedbacks.map((f, i) => (
                      <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#0f172a]">{f.user?.fullName || 'Student'}</span>
                          <span className="text-xs text-amber-600 font-bold flex items-center gap-0.5">
                            {f.rating} <Star className="h-3 w-3 fill-current text-amber-500" />
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 italic font-medium">"{f.comments}"</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Feedback (Attendees Only) */}
              {selectedClass.instructor.id !== user?.id && (
                <form onSubmit={handleFeedbackSubmit} className="border-t border-slate-200 pt-4 space-y-4">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Leave Feedback</h4>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1 font-bold">Rating</label>
                    <select
                      value={feedbackRating}
                      onChange={(e) => setFeedbackRating(Number(e.target.value))}
                      className="bg-slate-50 border border-slate-300 focus:border-[#ff6b00] focus:bg-white text-[#0f172a] font-medium rounded-xl py-2 px-3 outline-none text-xs"
                    >
                      <option value={5}>5 Stars - Outstanding</option>
                      <option value={4}>4 Stars - Very Good</option>
                      <option value={3}>3 Stars - Good</option>
                      <option value={2}>2 Stars - Needs Improvement</option>
                      <option value={1}>1 Star - Poor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1 font-bold">Comments</label>
                    <textarea
                      rows={2}
                      required
                      value={feedbackComments}
                      onChange={(e) => setFeedbackComments(e.target.value)}
                      placeholder="What did you learn? How can the instructor improve?"
                      className="w-full bg-slate-50 border border-slate-300 focus:border-[#ff6b00] focus:bg-white text-[#0f172a] font-medium rounded-xl py-2 px-3 outline-none text-xs resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-[#0f172a] hover:bg-slate-800 text-white font-extrabold rounded-xl py-2 px-4 text-xs transition-all shadow-xs"
                  >
                    Submit Review
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Upcoming Classes Directory */
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-5 py-2.5 font-bold text-sm transition-all border-b-2 ${
                  activeTab === 'all' 
                    ? 'text-[#ff6b00] border-[#ff6b00]' 
                    : 'text-slate-500 border-transparent hover:text-[#0f172a]'
                }`}
              >
                All Upcoming
              </button>
              <button
                onClick={() => setActiveTab('conducting')}
                className={`px-5 py-2.5 font-bold text-sm transition-all border-b-2 ${
                  activeTab === 'conducting' 
                    ? 'text-[#ff6b00] border-[#ff6b00]' 
                    : 'text-slate-500 border-transparent hover:text-[#0f172a]'
                }`}
              >
                Classes I Conduct
              </button>
              <button
                onClick={() => setActiveTab('attending')}
                className={`px-5 py-2.5 font-bold text-sm transition-all border-b-2 ${
                  activeTab === 'attending' 
                    ? 'text-[#ff6b00] border-[#ff6b00]' 
                    : 'text-slate-500 border-transparent hover:text-[#0f172a]'
                }`}
              >
                Classes I Attend
              </button>
            </div>

            <button
              onClick={() => setIsScheduling(true)}
              className="bg-gradient-to-r from-[#ff6b00] to-orange-600 hover:brightness-110 active:scale-95 text-white font-extrabold text-xs rounded-xl py-2.5 px-4 flex items-center gap-1.5 transition-all shadow-glow"
            >
              <Plus className="h-4 w-4" />
              <span>Schedule Class</span>
            </button>
          </div>

          {filteredClasses.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-slate-300 rounded-2xl bg-white shadow-xs">
              <Tv className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 font-bold text-sm">No live classes found.</p>
              <p className="text-slate-500 text-xs mt-1 font-medium">Schedule a session or look out for public class listings!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClasses.map((c) => {
                const conducting = c.instructor.id === user?.id;
                return (
                  <div
                    key={c.id}
                    className="bg-white border border-slate-200 hover:border-orange-300 rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all duration-200"
                  >
                    <div>
                      <h4 className="font-extrabold text-[#0f172a] text-base truncate">{c.title}</h4>
                      <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1 truncate">
                        <User className="h-3 w-3 text-[#ff6b00]" />
                        <span>By {c.instructor.fullName}</span>
                      </p>

                      <div className="space-y-1.5 mt-4 text-xs font-semibold text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-[#ff6b00]" />
                          <span>{new Date(c.startTime).toLocaleDateString()} at {new Date(c.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-[#ff6b00]" />
                          <span>{c.durationMinutes} mins Duration</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 mt-3 line-clamp-2 h-8 italic font-medium">
                        {c.description || 'No description provided.'}
                      </p>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-slate-200 mt-4">
                      <button
                        onClick={() => viewClassDetails(c)}
                        className="flex-1 bg-slate-100 border border-slate-300 hover:bg-slate-200 text-[#0f172a] rounded-xl py-2 px-3 text-xs font-bold transition-all"
                      >
                        Details
                      </button>
                      {!conducting && (
                        <button
                          onClick={() => handleRegister(c.id)}
                          className="bg-gradient-to-r from-[#ff6b00] to-orange-600 text-white rounded-xl py-2 px-3 text-xs font-extrabold transition-all shadow-glow"
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

      {/* Schedule Class Modal */}
      {isScheduling && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white border border-slate-300 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-extrabold text-[#0f172a] mb-1">Schedule Live Class</h3>
            <p className="text-xs text-slate-500 font-medium mb-4">Host a digital classroom to teach concepts or practice skills live.</p>

            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Class Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master React Hooks"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-[#ff6b00] focus:bg-white text-[#0f172a] font-medium rounded-xl py-3 px-4 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  rows={2}
                  placeholder="Outline syllabus, goals, or prerequisites..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-[#ff6b00] focus:bg-white text-[#0f172a] font-medium rounded-xl py-3 px-4 outline-none text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Study Group</label>
                  <select
                    value={groupId}
                    onChange={(e) => setGroupId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-[#ff6b00] focus:bg-white text-[#0f172a] font-medium rounded-xl py-3 px-4 outline-none text-sm"
                  >
                    <option value="">None (Public Class)</option>
                    {myGroups.map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Duration (mins)</label>
                  <input
                    type="number"
                    min={15}
                    max={180}
                    required
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-[#ff6b00] focus:bg-white text-[#0f172a] font-medium rounded-xl py-3 px-4 outline-none text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Meeting Platform</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-[#ff6b00] focus:bg-white text-[#0f172a] font-medium rounded-xl py-3 px-4 outline-none text-sm"
                  >
                    <option value="GOOGLE_MEET">Google Meet</option>
                    <option value="ZOOM">Zoom</option>
                    <option value="TEAMS">MS Teams</option>
                    <option value="JITSI">Jitsi Meet</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Start Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-[#ff6b00] focus:bg-white text-[#0f172a] font-medium rounded-xl py-3 px-4 outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Meeting URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://meet.google.com/..."
                  value={meetingUrl}
                  onChange={(e) => setMeetingUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-[#ff6b00] focus:bg-white text-[#0f172a] font-medium rounded-xl py-3 px-4 outline-none text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsScheduling(false)}
                  className="bg-slate-100 border border-slate-300 text-slate-700 font-bold hover:bg-slate-200 rounded-xl py-2.5 px-5 text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#ff6b00] to-orange-600 text-white font-extrabold rounded-xl py-2.5 px-6 text-sm hover:brightness-110 active:scale-95 transition-all shadow-glow"
                >
                  Schedule Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
