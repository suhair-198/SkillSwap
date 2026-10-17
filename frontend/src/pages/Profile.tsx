import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { UserSkillDTO } from '../services/types';
import { 
  User, 
  GraduationCap, 
  Building, 
  FileText, 
  Plus, 
  Trash2, 
  Save, 
  BookOpen, 
  Edit3, 
  Sparkles,
  Award,
  Presentation,
  Zap,
  X
} from 'lucide-react';

const PROFICIENCY_STYLES: Record<string, string> = {
  EXPERT: 'bg-red-500/10 text-red-400 border-red-500/20',
  ADVANCED: 'bg-[#ff6b00]/10 text-[#ff6b00] border-[#ff6b00]/20',
  INTERMEDIATE: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  BEGINNER: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

export const Profile: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [skills, setSkills] = useState<UserSkillDTO[]>([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [loading, setLoading] = useState(true);

  const [fullName, setFullName] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [bio, setBio] = useState('');

  const [skillName, setSkillName] = useState('');
  const [category, setCategory] = useState('Programming');
  const [proficiency, setProficiency] = useState('INTERMEDIATE');
  const [isKnown, setIsKnown] = useState(true);

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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.users.updateProfile({ fullName, college, department, bio });
      await refreshUser();
      setIsEditingProfile(false);
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) return;
    try {
      await api.skills.add({ skillName: skillName.trim(), category, proficiencyLevel: proficiency, known: isKnown });
      setSkillName(''); setIsAddingSkill(false);
      await fetchSkills(); await refreshUser();
    } catch (err: any) {
      alert(`Failed to add skill: ${err.message}`);
    }
  };

  const handleRemoveSkill = async (skillId: string, isKnownSkill: boolean) => {
    if (!confirm('Remove this skill?')) return;
    try {
      await api.skills.remove(skillId, isKnownSkill);
      await fetchSkills(); await refreshUser();
    } catch (err: any) {
      alert(`Failed to remove skill: ${err.message}`);
    }
  };

  if (!user) return null;

  const knownSkills = skills.filter(s => s.isKnown);
  const wantedSkills = skills.filter(s => !s.isKnown);

  return (
    <div className="space-y-6 pb-12 animate-slide-in">
      {/* ── Profile Header ── */}
      <div className="bg-[#0a1020] border border-[#1a2540] rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ff6b00] to-amber-500" />
        <div className="absolute top-[-40px] right-[-40px] w-48 h-48 rounded-full bg-[#ff6b00]/5 blur-xl" />

        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ff6b00] to-amber-500 flex items-center justify-center font-bold text-white text-3xl shadow-orange-glow flex-shrink-0">
              {user.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-white">{user.fullName}</h2>
                <span className="mono-tag text-[#ff6b00] bg-[#ff6b00]/10 px-2 py-0.5 rounded-full border border-[#ff6b00]/20 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Rep: {user.reputation}
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                {user.college || 'No college'} · {user.department || 'No department'}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <div>
                  <span className="mono-tag text-amber-400">LVL {user.level}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-24 h-1.5 bg-[#1a2540] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#ff6b00] to-amber-400 rounded-full" style={{ width: `${(user.xp % 1000) / 10}%` }} />
                  </div>
                  <span className="mono-tag text-slate-500">{user.xp} XP</span>
                </div>
              </div>
            </div>
          </div>

          {!isEditingProfile && (
            <button
              onClick={() => setIsEditingProfile(true)}
              className="flex items-center gap-2 py-2 px-4 rounded-xl bg-[#111827] border border-[#1a2540] hover:border-[#ff6b00]/30 text-white text-sm font-semibold transition-all"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>

        {/* Bio / Edit Form */}
        {isEditingProfile ? (
          <form onSubmit={handleUpdateProfile} className="space-y-4 mt-6 pt-6 border-t border-[#1a2540]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Full Name', icon: User, value: fullName, setter: setFullName, required: true },
                { label: 'College', icon: GraduationCap, value: college, setter: setCollege, required: false },
              ].map((f) => (
                <div key={f.label}>
                  <label className="block mono-tag text-slate-400 mb-1.5">{f.label}</label>
                  <div className="relative">
                    <f.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text" required={f.required}
                      value={f.value} onChange={(e) => f.setter(e.target.value)}
                      className="w-full bg-[#111827] border border-[#1a2540] focus:border-[#ff6b00] text-white rounded-xl py-2.5 pl-10 pr-4 outline-none text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div>
              <label className="block mono-tag text-slate-400 mb-1.5">Department</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text" value={department} onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-[#111827] border border-[#1a2540] focus:border-[#ff6b00] text-white rounded-xl py-2.5 pl-10 pr-4 outline-none text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block mono-tag text-slate-400 mb-1.5">Bio</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <textarea
                  rows={3} value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell peers about yourself..."
                  className="w-full bg-[#111827] border border-[#1a2540] focus:border-[#ff6b00] text-white rounded-xl py-2.5 pl-10 pr-4 outline-none text-sm resize-none placeholder-slate-600"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="flex items-center gap-2 btn-primary">
                <Save className="w-4 h-4" /> Save
              </button>
              <button type="button" onClick={() => setIsEditingProfile(false)} className="btn-secondary px-4">Cancel</button>
            </div>
          </form>
        ) : (
          <div className="mt-5 pt-5 border-t border-[#1a2540]">
            <div className="mono-tag text-slate-500 mb-2">BIO</div>
            <p className="text-sm text-slate-400 leading-relaxed italic">
              {user.bio ? `"${user.bio}"` : 'No bio yet. Click Edit Profile to add one!'}
            </p>
          </div>
        )}
      </div>

      {/* ── Skills Manager ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Teach Skills */}
        <div className="bg-[#0a1020] border border-[#1a2540] rounded-2xl p-5 flex flex-col min-h-80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-white">Skills I Teach</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Knowledge you can share</p>
            </div>
            <button
              onClick={() => { setIsKnown(true); setIsAddingSkill(true); }}
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
          <div className="space-y-2 flex-1">
            {knownSkills.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-10 border border-dashed border-[#1a2540] rounded-xl text-center">
                <Award className="w-8 h-8 text-[#1a2540] mb-2" />
                <p className="text-xs text-slate-500">Add a skill you can teach!</p>
              </div>
            ) : (
              knownSkills.map((us) => (
                <div key={us.id} className="flex items-center justify-between p-3 bg-[#111827] border border-[#1a2540] hover:border-emerald-500/20 rounded-xl group transition-all">
                  <div>
                    <div className="font-semibold text-white text-sm">{us.skill.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{us.skill.category}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`mono-tag px-2 py-0.5 rounded-full border ${PROFICIENCY_STYLES[us.proficiencyLevel] || PROFICIENCY_STYLES.BEGINNER}`}>
                      {us.proficiencyLevel}
                    </span>
                    <button
                      onClick={() => handleRemoveSkill(us.skill.id!, true)}
                      className="text-[#1a2540] hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Learn Skills */}
        <div className="bg-[#0a1020] border border-[#1a2540] rounded-2xl p-5 flex flex-col min-h-80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#ff6b00]" />
                <h3 className="font-bold text-white">Skills I Learn</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">What you want to master</p>
            </div>
            <button
              onClick={() => { setIsKnown(false); setIsAddingSkill(true); }}
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-[#ff6b00]/10 border border-[#ff6b00]/20 hover:bg-[#ff6b00]/20 text-[#ff6b00] text-xs font-bold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
          <div className="space-y-2 flex-1">
            {wantedSkills.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-10 border border-dashed border-[#1a2540] rounded-xl text-center">
                <BookOpen className="w-8 h-8 text-[#1a2540] mb-2" />
                <p className="text-xs text-slate-500">Add a skill you want to learn!</p>
              </div>
            ) : (
              wantedSkills.map((us) => (
                <div key={us.id} className="flex items-center justify-between p-3 bg-[#111827] border border-[#1a2540] hover:border-[#ff6b00]/20 rounded-xl group transition-all">
                  <div>
                    <div className="font-semibold text-white text-sm">{us.skill.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{us.skill.category}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`mono-tag px-2 py-0.5 rounded-full border ${PROFICIENCY_STYLES[us.proficiencyLevel] || PROFICIENCY_STYLES.BEGINNER}`}>
                      {us.proficiencyLevel}
                    </span>
                    <button
                      onClick={() => handleRemoveSkill(us.skill.id!, false)}
                      className="text-[#1a2540] hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Add Skill Modal ── */}
      {isAddingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-[#0a1020] border border-[#1a2540] rounded-2xl p-6 card-offset animate-slide-in">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold text-white">Add Skill to {isKnown ? 'Teach' : 'Learn'}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isKnown ? 'A skill you can share with others' : 'A skill you want to learn from peers'}
                </p>
              </div>
              <button onClick={() => setIsAddingSkill(false)} className="text-slate-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSkill} className="space-y-4">
              <div>
                <label className="block mono-tag text-slate-400 mb-1.5">Skill Name</label>
                <input
                  type="text" required
                  placeholder="e.g. JavaScript, Guitar, Spanish"
                  value={skillName} onChange={(e) => setSkillName(e.target.value)}
                  className="w-full bg-[#111827] border border-[#1a2540] focus:border-[#ff6b00] text-white rounded-xl py-2.5 px-4 outline-none text-sm placeholder-slate-600"
                />
              </div>
              <div>
                <label className="block mono-tag text-slate-400 mb-1.5">Category</label>
                <select
                  value={category} onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#111827] border border-[#1a2540] focus:border-[#ff6b00] text-white rounded-xl py-2.5 px-4 outline-none text-sm"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block mono-tag text-slate-400 mb-2">Proficiency Level</label>
                <div className="grid grid-cols-2 gap-2">
                  {['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'].map((p) => (
                    <button
                      key={p} type="button"
                      onClick={() => setProficiency(p)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        proficiency === p
                          ? `${PROFICIENCY_STYLES[p]} scale-[1.02]`
                          : 'bg-[#111827] border-[#1a2540] text-slate-500 hover:text-white'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsAddingSkill(false)} className="flex-1 btn-secondary py-2.5">Cancel</button>
                <button type="submit" className="flex-1 btn-primary py-2.5">Add Skill</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
