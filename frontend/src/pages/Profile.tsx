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
  Presentation
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [skills, setSkills] = useState<UserSkillDTO[]>([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [loading, setLoading] = useState(true);

  // Profile Edit fields
  const [fullName, setFullName] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [bio, setBio] = useState('');

  // Skill Add fields
  const [skillName, setSkillName] = useState('');
  const [category, setCategory] = useState('Programming');
  const [proficiency, setProficiency] = useState('INTERMEDIATE');
  const [isKnown, setIsKnown] = useState(true); // true = teach, false = learn

  const categories = [
    'Programming',
    'Web Development',
    'Design',
    'Data Science',
    'Languages',
    'Business',
    'Music & Art',
    'Soft Skills',
    'Other'
  ];

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
      await api.users.updateProfile({
        fullName,
        college,
        department,
        bio
      });
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
      await api.skills.add({
        skillName: skillName.trim(),
        category,
        proficiencyLevel: proficiency,
        known: isKnown
      });
      setSkillName('');
      setIsAddingSkill(false);
      await fetchSkills();
      await refreshUser();
    } catch (err) {
      alert('Failed to add skill');
    }
  };

  const handleRemoveSkill = async (skillId: string, isKnownSkill: boolean) => {
    if (!confirm('Are you sure you want to remove this skill?')) return;
    try {
      await api.skills.remove(skillId, isKnownSkill);
      await fetchSkills();
      await refreshUser();
    } catch (err) {
      alert('Failed to remove skill');
    }
  };

  if (!user) return null;

  const knownSkills = skills.filter(s => s.isKnown);
  const wantedSkills = skills.filter(s => !s.isKnown);

  const getProficiencyColor = (level: string) => {
    switch (level) {
      case 'EXPERT': return 'bg-red-50 text-red-700 border-red-200';
      case 'ADVANCED': return 'bg-orange-50 text-[#ff6b00] border-orange-200';
      case 'INTERMEDIATE': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-emerald-50 text-emerald-700 border-emerald-200'; // BEGINNER
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Overview/Edit Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative overflow-hidden">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-xl bg-gradient-to-tr from-[#ff6b00] to-orange-500 flex items-center justify-center font-extrabold text-white text-3xl shadow-glow">
              {user.fullName.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#0f172a] flex items-center gap-2">
                {user.fullName}
                <span className="text-xs bg-slate-100 text-[#0f172a] font-extrabold px-2.5 py-0.5 rounded-full border border-slate-300 flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-[#ff6b00]" />
                  Rep: {user.reputation}
                </span>
              </h2>
              <p className="text-sm text-slate-500 font-medium">{user.college || 'No college set'} • {user.department || 'No department set'}</p>
            </div>
          </div>

          {!isEditingProfile && (
            <button
              onClick={() => setIsEditingProfile(true)}
              className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-[#0f172a] text-sm font-bold rounded-xl py-2 px-4 flex items-center gap-1.5 transition-all"
            >
              <Edit3 className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        {isEditingProfile ? (
          <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-2xl border-t border-slate-200 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-[#ff6b00] focus:bg-white text-[#0f172a] font-medium rounded-xl py-3 pl-10 pr-4 outline-none text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">College</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <GraduationCap className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-[#ff6b00] focus:bg-white text-[#0f172a] font-medium rounded-xl py-3 pl-10 pr-4 outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Department</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Building className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-[#ff6b00] focus:bg-white text-[#0f172a] font-medium rounded-xl py-3 pl-10 pr-4 outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Short Bio</label>
              <div className="relative">
                <span className="absolute top-3 left-3 text-slate-400">
                  <FileText className="h-4 w-4" />
                </span>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell peers about your interests, study habits, or learning goals..."
                  className="w-full bg-slate-50 border border-slate-300 focus:border-[#ff6b00] focus:bg-white text-[#0f172a] font-medium rounded-xl py-3 pl-10 pr-4 outline-none text-sm resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="bg-gradient-to-r from-[#ff6b00] to-orange-600 hover:brightness-110 text-white font-extrabold rounded-xl py-2.5 px-6 flex items-center gap-1.5 transition-all text-sm shadow-glow"
              >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded-xl py-2.5 px-6 transition-all text-sm font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="border-t border-slate-200 pt-6">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Bio</h4>
            <p className="text-sm text-slate-700 leading-relaxed max-w-3xl italic font-medium">
              {user.bio ? `"${user.bio}"` : 'No bio added yet. Add a bio to share your background!'}
            </p>
          </div>
        )}
      </div>

      {/* Skills Manager Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Teach Column */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-[#0f172a] flex items-center gap-2">
                <Presentation className="h-5 w-5 text-emerald-600" />
                <span>Skills I Teach</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Known skills you can share with peers</p>
            </div>
            <button
              onClick={() => {
                setIsKnown(true);
                setIsAddingSkill(true);
              }}
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-extrabold rounded-xl py-2 px-3 flex items-center gap-1 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Add</span>
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {knownSkills.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-12 border border-dashed border-slate-300 rounded-xl bg-slate-50 text-center">
                <Award className="h-10 w-10 text-slate-400 mb-2" />
                <p className="text-xs text-slate-500 font-bold">List any skill you are ready to teach!</p>
              </div>
            ) : (
              knownSkills.map((us) => (
                <div 
                  key={us.id} 
                  className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl hover:border-emerald-300 group transition-all"
                >
                  <div>
                    <div className="font-extrabold text-[#0f172a] text-sm">{us.skill.name}</div>
                    <div className="text-[10px] text-slate-500 font-medium mt-0.5">{us.skill.category}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-extrabold border px-2.5 py-0.5 rounded-full uppercase ${getProficiencyColor(us.proficiencyLevel)}`}>
                      {us.proficiencyLevel}
                    </span>
                    <button
                      onClick={() => handleRemoveSkill(us.skill.id!, true)}
                      className="text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Learn Column */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-[#0f172a] flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#ff6b00]" />
                <span>Skills I Learn</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Skills you want to master through swaps</p>
            </div>
            <button
              onClick={() => {
                setIsKnown(false);
                setIsAddingSkill(true);
              }}
              className="bg-orange-50 hover:bg-orange-100 text-[#ff6b00] border border-orange-200 text-xs font-extrabold rounded-xl py-2 px-3 flex items-center gap-1 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Add</span>
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {wantedSkills.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-12 border border-dashed border-slate-300 rounded-xl bg-slate-50 text-center">
                <BookOpen className="h-10 w-10 text-slate-400 mb-2" />
                <p className="text-xs text-slate-500 font-bold">List any skill you want to learn!</p>
              </div>
            ) : (
              wantedSkills.map((us) => (
                <div 
                  key={us.id} 
                  className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl hover:border-orange-300 group transition-all"
                >
                  <div>
                    <div className="font-extrabold text-[#0f172a] text-sm">{us.skill.name}</div>
                    <div className="text-[10px] text-slate-500 font-medium mt-0.5">{us.skill.category}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-extrabold border px-2.5 py-0.5 rounded-full uppercase ${getProficiencyColor(us.proficiencyLevel)}`}>
                      {us.proficiencyLevel}
                    </span>
                    <button
                      onClick={() => handleRemoveSkill(us.skill.id!, false)}
                      className="text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Skill Modal Overlay */}
      {isAddingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white border border-slate-300 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-extrabold text-[#0f172a] mb-1">
              Add Skill to {isKnown ? 'Teach' : 'Learn'}
            </h3>
            <p className="text-xs text-slate-500 font-medium mb-4">
              {isKnown 
                ? 'Known skills will help pair you with students requesting assistance.'
                : 'Wanted skills will help you match with instructors ready to teach.'}
            </p>

            <form onSubmit={handleAddSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Skill Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. JavaScript, Public Speaking, Guitar"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-[#ff6b00] focus:bg-white text-[#0f172a] font-medium rounded-xl py-3 px-4 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-[#ff6b00] focus:bg-white text-[#0f172a] font-medium rounded-xl py-3 px-4 outline-none text-sm"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Proficiency Level</label>
                <select
                  value={proficiency}
                  onChange={(e) => setProficiency(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-[#ff6b00] focus:bg-white text-[#0f172a] font-medium rounded-xl py-3 px-4 outline-none text-sm"
                >
                  <option value="BEGINNER">Beginner (1 - Basic concepts)</option>
                  <option value="INTERMEDIATE">Intermediate (2 - Solid understanding)</option>
                  <option value="ADVANCED">Advanced (3 - Deep practice)</option>
                  <option value="EXPERT">Expert (4 - Mentor capacity)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddingSkill(false)}
                  className="bg-slate-100 border border-slate-300 text-slate-700 font-bold hover:bg-slate-200 rounded-xl py-2.5 px-5 text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#ff6b00] to-orange-600 text-white font-extrabold rounded-xl py-2.5 px-6 text-sm hover:brightness-110 active:scale-95 transition-all shadow-glow"
                >
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
