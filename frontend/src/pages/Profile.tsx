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
      await refreshUser(); // XP might increase or skills count update
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
      case 'EXPERT': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'ADVANCED': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'INTERMEDIATE': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-teal-500/10 text-teal-400 border-teal-500/20'; // BEGINNER
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Overview/Edit Card */}
      <div className="bg-[#1f2833]/40 border border-[#45f3ff]/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-12 -right-12 h-40 w-40 bg-[#45f3ff]/10 rounded-full blur-3xl"></div>

        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-xl bg-gradient-to-tr from-[#45f3ff] to-[#6f42c1] flex items-center justify-center font-bold text-white text-3xl shadow-glow">
              {user.fullName.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {user.fullName}
                <span className="text-xs bg-[#6f42c1]/20 text-violet-300 font-semibold px-2 py-0.5 rounded-full border border-[#6f42c1]/30 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Rep: {user.reputation}
                </span>
              </h2>
              <p className="text-sm text-gray-400">{user.college || 'No college set'} • {user.department || 'No department set'}</p>
            </div>
          </div>

          {!isEditingProfile && (
            <button
              onClick={() => setIsEditingProfile(true)}
              className="bg-[#1f2833] hover:bg-white/5 border border-gray-700 hover:border-gray-500 text-white text-sm font-semibold rounded-xl py-2 px-4 flex items-center gap-1.5 transition-all"
            >
              <Edit3 className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        {isEditingProfile ? (
          <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-2xl border-t border-gray-800 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#0b0c10]/60 border border-gray-700 focus:border-[#45f3ff] text-white rounded-xl py-3 pl-10 pr-4 outline-none text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">College</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    <GraduationCap className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full bg-[#0b0c10]/60 border border-gray-700 focus:border-[#45f3ff] text-white rounded-xl py-3 pl-10 pr-4 outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Department</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    <Building className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-[#0b0c10]/60 border border-gray-700 focus:border-[#45f3ff] text-white rounded-xl py-3 pl-10 pr-4 outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Short Bio</label>
              <div className="relative">
                <span className="absolute top-3 left-3 text-gray-500">
                  <FileText className="h-4 w-4" />
                </span>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell peers about your interests, study habits, or learning goals..."
                  className="w-full bg-[#0b0c10]/60 border border-gray-700 focus:border-[#45f3ff] text-white rounded-xl py-3 pl-10 pr-4 outline-none text-sm resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="bg-gradient-to-r from-[#45f3ff] to-[#6f42c1] hover:brightness-110 text-white font-semibold rounded-xl py-2.5 px-6 flex items-center gap-1.5 transition-all text-sm shadow-glow"
              >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="bg-[#1f2833] hover:bg-white/5 border border-gray-700 text-gray-300 hover:text-white rounded-xl py-2.5 px-6 transition-all text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="border-t border-gray-800 pt-6">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Bio</h4>
            <p className="text-sm text-gray-300 leading-relaxed max-w-3xl italic">
              {user.bio ? `"${user.bio}"` : 'No bio added yet. Add a bio to share your background!'}
            </p>
          </div>
        )}
      </div>

      {/* Skills Manager Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Teach Column */}
        <div className="bg-[#1f2833]/40 border border-[#45f3ff]/10 rounded-2xl p-6 shadow-xl flex flex-col min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Presentation className="h-5 w-5 text-teal-400" />
                <span>Skills I Teach</span>
              </h3>
              <p className="text-xs text-gray-400 mt-1">Known skills you can share with peers</p>
            </div>
            <button
              onClick={() => {
                setIsKnown(true);
                setIsAddingSkill(true);
              }}
              className="bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/30 text-xs font-bold rounded-xl py-2 px-3 flex items-center gap-1 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Add</span>
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {knownSkills.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-12 border border-dashed border-gray-800 rounded-xl bg-black/10 text-center">
                <Award className="h-10 w-10 text-gray-700 mb-2" />
                <p className="text-xs text-gray-500 font-medium">List any skill you are ready to teach!</p>
              </div>
            ) : (
              knownSkills.map((us) => (
                <div 
                  key={us.id} 
                  className="flex items-center justify-between p-3.5 bg-[#0b0c10]/60 border border-gray-800 rounded-xl hover:border-teal-500/30 group transition-all"
                >
                  <div>
                    <div className="font-semibold text-white text-sm">{us.skill.name}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">{us.skill.category}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full uppercase ${getProficiencyColor(us.proficiencyLevel)}`}>
                      {us.proficiencyLevel}
                    </span>
                    <button
                      onClick={() => handleRemoveSkill(us.skill.id!, true)}
                      className="text-gray-500 hover:text-red-400 transition-colors"
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
        <div className="bg-[#1f2833]/40 border border-[#45f3ff]/10 rounded-2xl p-6 shadow-xl flex flex-col min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-violet-400" />
                <span>Skills I Learn</span>
              </h3>
              <p className="text-xs text-gray-400 mt-1">Skills you want to master through swaps</p>
            </div>
            <button
              onClick={() => {
                setIsKnown(false);
                setIsAddingSkill(true);
              }}
              className="bg-[#6f42c1]/10 hover:bg-[#6f42c1]/20 text-violet-400 border border-[#6f42c1]/30 text-xs font-bold rounded-xl py-2 px-3 flex items-center gap-1 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Add</span>
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {wantedSkills.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-12 border border-dashed border-gray-800 rounded-xl bg-black/10 text-center">
                <BookOpen className="h-10 w-10 text-gray-700 mb-2" />
                <p className="text-xs text-gray-500 font-medium">List any skill you want to learn!</p>
              </div>
            ) : (
              wantedSkills.map((us) => (
                <div 
                  key={us.id} 
                  className="flex items-center justify-between p-3.5 bg-[#0b0c10]/60 border border-gray-800 rounded-xl hover:border-[#6f42c1]/30 group transition-all"
                >
                  <div>
                    <div className="font-semibold text-white text-sm">{us.skill.name}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">{us.skill.category}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full uppercase ${getProficiencyColor(us.proficiencyLevel)}`}>
                      {us.proficiencyLevel}
                    </span>
                    <button
                      onClick={() => handleRemoveSkill(us.skill.id!, false)}
                      className="text-gray-500 hover:text-red-400 transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#1f2833] border border-[#45f3ff]/20 rounded-2xl p-6 shadow-glow-lg animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-white mb-1">
              Add Skill to {isKnown ? 'Teach' : 'Learn'}
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              {isKnown 
                ? 'Known skills will help pair you with students requesting assistance.'
                : 'Wanted skills will help you match with instructors ready to teach.'}
            </p>

            <form onSubmit={handleAddSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Skill Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. JavaScript, Public Speaking, Guitar"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  className="w-full bg-[#0b0c10]/60 border border-gray-700 focus:border-[#45f3ff] text-white rounded-xl py-3 px-4 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#0b0c10]/60 border border-gray-700 focus:border-[#45f3ff] text-white rounded-xl py-3 px-4 outline-none text-sm"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Proficiency Level</label>
                <select
                  value={proficiency}
                  onChange={(e) => setProficiency(e.target.value)}
                  className="w-full bg-[#0b0c10]/60 border border-gray-700 focus:border-[#45f3ff] text-white rounded-xl py-3 px-4 outline-none text-sm"
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
                  className="bg-transparent border border-gray-700 text-gray-400 hover:text-white rounded-xl py-2.5 px-5 text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#45f3ff] to-[#6f42c1] text-white font-semibold rounded-xl py-2.5 px-6 text-sm hover:brightness-110 active:scale-95 transition-all shadow-glow"
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
