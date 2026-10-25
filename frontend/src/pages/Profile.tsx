import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { UserSkillDTO } from '../services/types';
import { 
  User, GraduationCap, Building, FileText, Plus, Trash2, 
  Save, BookOpen, Edit3, Sparkles, Award, Zap, X, CheckCircle
} from 'lucide-react';

const PROFICIENCY_CONFIG: Record<string, { bg: string; text: string; border: string; label: string }> = {
  EXPERT:       { bg: 'bg-rose-100',   text: 'text-rose-700',   border: 'border-rose-200',   label: 'Expert' },
  ADVANCED:     { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', label: 'Advanced' },
  INTERMEDIATE: { bg: 'bg-blue-100',   text: 'text-blue-700',   border: 'border-blue-200',   label: 'Intermediate' },
  BEGINNER:     { bg: 'bg-emerald-100',text: 'text-emerald-700',border: 'border-emerald-200',label: 'Beginner' },
};

export const Profile: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [skills, setSkills] = useState<UserSkillDTO[]>([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveMsg, setSaveMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [fullName, setFullName] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [bio, setBio] = useState('');

  const [skillName, setSkillName] = useState('');
  const [category, setCategory] = useState('Programming');
  const [proficiency, setProficiency] = useState('INTERMEDIATE');
  const [isKnown, setIsKnown] = useState(true);
  const [addingSkill, setAddingSkill] = useState(false);

  const categories = ['Programming', 'Web Development', 'Design', 'Data Science', 'Languages', 'Business', 'Music & Art', 'Soft Skills', 'Other'];

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setCollege(user.college || '');
      setDepartment(user.department || '');
      setBio(user.bio || '');
      fetchSkills();
    }
  }, [user]);

  const fetchSkills = async () => {
    if (!user) return;
    try {
      const skillData = await api.skills.getUserSkills(user.id);
      setSkills(skillData);
    } catch (err) {
      console.error('Error fetching user skills', err);
    } finally {
      setLoading(false);
    }
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(''), 5000);
  };

  const showSuccess = (msg: string) => {
    setSaveMsg(msg);
    setTimeout(() => setSaveMsg(''), 3000);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.users.updateProfile({ fullName, college, department, bio });
      await refreshUser();
      setIsEditingProfile(false);
      showSuccess('Profile updated successfully!');
    } catch (err: any) {
      showError(`Failed to update profile: ${err.message}`);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) return;
    setAddingSkill(true);
    try {
      await api.skills.add({ skillName: skillName.trim(), category, proficiencyLevel: proficiency, known: isKnown, isKnown });
      setSkillName('');
      setIsAddingSkill(false);
      await fetchSkills();
      await refreshUser();
      showSuccess(`"${skillName.trim()}" added successfully!`);
    } catch (err: any) {
      showError(`Failed to add skill: ${err.message}`);
    } finally {
      setAddingSkill(false);
    }
  };

  const handleRemoveSkill = async (skillId: string, isKnownSkill: boolean, skillNameLabel: string) => {
    if (!confirm(`Remove "${skillNameLabel}"?`)) return;
    try {
      await api.skills.remove(skillId, isKnownSkill);
      await fetchSkills();
      await refreshUser();
      showSuccess('Skill removed.');
    } catch (err: any) {
      showError(`Failed to remove skill: ${err.message}`);
    }
  };

  if (!user) return null;

  const knownSkills = skills.filter(s => Boolean(s.isKnown ?? s.known));
  const wantedSkills = skills.filter(s => !Boolean(s.isKnown ?? s.known));
  const xpPercent = Math.min(((user.xp || 0) % 1000) / 10, 100);

  return (
    <div className="space-y-6 pb-12 animate-slide-in max-w-4xl mx-auto">

      {/* Notification banners */}
      {saveMsg && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold animate-fade-in">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          {saveMsg}
        </div>
      )}
      {errorMsg && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-semibold animate-fade-in">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* ── Profile Header Card ── */}
      <div className="card-elevated overflow-hidden">
        {/* Banner */}
        <div className="h-24 bg-gradient-to-r from-[#f97316] via-[#fb923c] to-[#7c3aed] relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] opacity-50" />
        </div>

        <div className="px-6 pb-6 relative">
          {/* Avatar overlapping banner */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 -mt-8 mb-4">
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 rounded-2xl avatar text-3xl font-black shadow-xl border-4 border-white">
                {user.fullName.charAt(0)}
              </div>
              <div className="pb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-black text-gray-900">{user.fullName}</h2>
                  <span className="badge badge-purple flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Rep {user.reputation}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">
                  {user.college || 'No college'} · {user.department || 'No department'}
                </p>
              </div>
            </div>
            {!isEditingProfile && (
              <button
                onClick={() => setIsEditingProfile(true)}
                className="btn-secondary flex items-center gap-2"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Profile
              </button>
            )}
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
                <Award className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <div>
                <div className="text-xs text-gray-400">Level</div>
                <div className="text-sm font-black text-gray-900">LVL {user.level}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-purple-600" />
              </div>
              <div>
                <div className="text-xs text-gray-400">XP</div>
                <div className="text-sm font-black text-gray-900">{user.xp}</div>
              </div>
            </div>
            <div className="flex-1 min-w-[120px]">
              <div className="flex justify-between mb-1">
                <span className="text-xs text-gray-400">Level Progress</span>
                <span className="text-xs font-bold text-[#f97316]">{xpPercent.toFixed(0)}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${xpPercent}%` }} />
              </div>
            </div>
          </div>

          {/* Bio / Edit Form */}
          {isEditingProfile ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4 mt-5 pt-5 border-t border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Full Name', icon: User, value: fullName, setter: setFullName, required: true, placeholder: 'John Doe' },
                  { label: 'College', icon: GraduationCap, value: college, setter: setCollege, required: false, placeholder: 'MIT' },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">{f.label}</label>
                    <div className="relative">
                      <f.icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text" required={f.required}
                        value={f.value} onChange={(e) => f.setter(e.target.value)}
                        placeholder={f.placeholder}
                        className="input-light pl-10"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Department</label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text" value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Computer Science"
                    className="input-light pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Bio</label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    rows={3} value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell peers about yourself..."
                    className="input-light pl-10 resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex items-center gap-2">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
                <button type="button" onClick={() => setIsEditingProfile(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          ) : (
            <div className="mt-5 pt-5 border-t border-gray-100">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Bio</div>
              <p className="text-sm text-gray-600 leading-relaxed italic">
                {user.bio ? `"${user.bio}"` : 'No bio yet. Click Edit Profile to add one!'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Skills Manager ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Teach Skills */}
        <div className="card p-5 flex flex-col min-h-72">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <h3 className="font-bold text-gray-900">Skills I Teach</h3>
              </div>
              <p className="text-xs text-gray-400 mt-0.5 ml-9">Knowledge you can share</p>
            </div>
            <button
              onClick={() => { setIsKnown(true); setIsAddingSkill(true); }}
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
          <div className="space-y-2 flex-1">
            {knownSkills.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-10 border-2 border-dashed border-gray-200 rounded-2xl text-center bg-gray-50">
                <Award className="w-8 h-8 text-gray-300 mb-2" />
                <p className="text-xs text-gray-400 font-medium">Add a skill you can teach!</p>
              </div>
            ) : (
              knownSkills.map((us) => {
                const pc = PROFICIENCY_CONFIG[us.proficiencyLevel] || PROFICIENCY_CONFIG.BEGINNER;
                return (
                  <div key={us.id} className="flex items-center justify-between p-3 bg-emerald-50/50 border border-emerald-100 hover:border-emerald-200 rounded-xl group transition-all">
                    <div>
                      <div className="font-bold text-gray-900 text-sm">{us.skill.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{us.skill.category}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${pc.bg} ${pc.text} ${pc.border}`}>
                        {pc.label}
                      </span>
                      <button
                        onClick={() => handleRemoveSkill(us.skill.id!, true, us.skill.name)}
                        className="text-gray-300 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Learn Skills */}
        <div className="card p-5 flex flex-col min-h-72">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center">
                  <BookOpen className="w-3.5 h-3.5 text-[#f97316]" />
                </div>
                <h3 className="font-bold text-gray-900">Skills I Learn</h3>
              </div>
              <p className="text-xs text-gray-400 mt-0.5 ml-9">What you want to master</p>
            </div>
            <button
              onClick={() => { setIsKnown(false); setIsAddingSkill(true); }}
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-orange-50 border border-orange-200 hover:bg-orange-100 text-[#c2410c] text-xs font-bold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
          <div className="space-y-2 flex-1">
            {wantedSkills.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-10 border-2 border-dashed border-gray-200 rounded-2xl text-center bg-gray-50">
                <BookOpen className="w-8 h-8 text-gray-300 mb-2" />
                <p className="text-xs text-gray-400 font-medium">Add a skill you want to learn!</p>
              </div>
            ) : (
              wantedSkills.map((us) => {
                const pc = PROFICIENCY_CONFIG[us.proficiencyLevel] || PROFICIENCY_CONFIG.BEGINNER;
                return (
                  <div key={us.id} className="flex items-center justify-between p-3 bg-orange-50/50 border border-orange-100 hover:border-orange-200 rounded-xl group transition-all">
                    <div>
                      <div className="font-bold text-gray-900 text-sm">{us.skill.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{us.skill.category}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${pc.bg} ${pc.text} ${pc.border}`}>
                        {pc.label}
                      </span>
                      <button
                        onClick={() => handleRemoveSkill(us.skill.id!, false, us.skill.name)}
                        className="text-gray-300 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ── Add Skill Modal ── */}
      {isAddingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-7 shadow-2xl border border-gray-100 animate-slide-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-black text-gray-900">
                  {isKnown ? '🎓 Add Teaching Skill' : '📖 Add Learning Skill'}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {isKnown ? 'A skill you can share with peers' : 'A skill you want to learn from peers'}
                </p>
              </div>
              <button onClick={() => setIsAddingSkill(false)} className="text-gray-400 hover:text-gray-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSkill} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Skill Name</label>
                <input
                  type="text" required autoFocus
                  placeholder="e.g. JavaScript, Guitar, Spanish…"
                  value={skillName} onChange={(e) => setSkillName(e.target.value)}
                  className="input-light"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Category</label>
                <select
                  value={category} onChange={(e) => setCategory(e.target.value)}
                  className="input-light"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Proficiency Level</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(PROFICIENCY_CONFIG).map(([key, cfg]) => (
                    <button
                      key={key} type="button"
                      onClick={() => setProficiency(key)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border-2 transition-all ${
                        proficiency === key
                          ? `${cfg.bg} ${cfg.text} ${cfg.border} scale-[1.02] shadow-sm`
                          : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      {cfg.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsAddingSkill(false)} className="flex-1 btn-secondary py-2.5">Cancel</button>
                <button
                  type="submit"
                  disabled={addingSkill}
                  className={`flex-1 py-2.5 font-bold rounded-xl text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2 ${
                    isKnown
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-md'
                      : 'btn-primary'
                  }`}
                >
                  {addingSkill ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                  Add Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
