import React, { useState, useEffect } from 'react';
import { X, Edit, CheckCircle, Info, Award, Star, Users, BookOpen, Flame } from 'lucide-react';

interface TrainerProfileModalProps {
  open: boolean;
  onClose: () => void;
}

const mockProfile = {
  avatar: '/public/avatar1.png',
  firstName: 'Sarah',
  lastName: 'Ahmed',
  email: 'sarah.ahmed@maarf.edu.sa',
  phone: '+966 50 123 4567',
  school: 'Maarif Al Riyadh School',
  role: 'Science Teacher',
  bio: 'Science teacher with 5 years of experience specializing in interactive learning methods. Passionate about making science accessible and engaging for middle school students.',
  interests: ['STEM Education', 'Project-Based Learning', 'Educational Technology'],
  preferences: {
    inPerson: true,
    virtual: true,
    self: true,
  },
  competencies: [
    { label: 'Classroom Management', level: 'Advanced' },
    { label: 'Digital Learning', level: 'Intermediate' },
    { label: 'Assessment Design', level: 'Beginner' },
  ],
};

const mockLearningPath = {
  current: 'Master Teacher Certification',
  next: 'Student Engagement Strategies',
  focus: ['Student Engagement Strategies', 'Technology Integration', 'Data-Driven Instruction'],
};

const mockAccounts = [
  { label: 'Microsoft Account', email: 'sarah.ahmed@maarf.edu.sa', connected: true },
  { label: 'Google Account', email: 'Not connected', connected: false },
  { label: 'LinkedIn', email: 'Not connected', connected: false },
];

const mockCapabilities = [
  { icon: Star, label: 'Learning Access', desc: 'Access to all assigned courses and resources.' },
  { icon: Award, label: 'Assessment & Certification', desc: 'Can view and manage trainee progress, assessments, and certifications.' },
  { icon: Users, label: 'Collaboration', desc: 'Engage with other trainers and trainees in discussions and group activities.' },
];

const TrainerProfileModal: React.FC<TrainerProfileModalProps> = ({ open, onClose }) => {
  const [profile, setProfile] = useState(mockProfile);
  const [tab, setTab] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      // TODO: Fetch real profile data from API
      setProfile(mockProfile);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 relative">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700" onClick={onClose}><X className="w-6 h-6" /></button>
        <h2 className="text-2xl font-bold mb-2">Account Settings</h2>
        <div className="text-gray-500 mb-6">Manage your profile and preferences</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Profile Info */}
          <div className="flex flex-col items-center md:items-start">
            <img src={profile.avatar} alt="Profile" className="w-24 h-24 rounded-full object-cover mb-2 border-4 border-indigo-100" />
            <div className="font-bold text-lg mb-1">{profile.firstName} {profile.lastName}</div>
            <div className="text-xs text-gray-500 mb-2">Science Teacher<br />Maarif Al Riyadh School</div>
            <button className="text-indigo-600 text-xs font-medium flex items-center gap-1 mb-4"><Edit className="w-4 h-4" /> Change Photo</button>
            <div className="w-full">
              <div className="text-xs text-gray-400 mb-1">Teaching Competencies</div>
              <div className="flex gap-2 mb-2">
                {profile.competencies.map((c, i) => (
                  <span key={c.label} className={`px-3 py-1 rounded-full text-xs font-semibold ${i === tab ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'} cursor-pointer`} onClick={() => setTab(i)}>{c.label}</span>
                ))}
              </div>
              <div className="flex gap-2">
                {profile.competencies.map((c, i) => (
                  <span key={c.label + '-level'} className={`px-2 py-1 rounded text-xs ${i === tab ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-500'}`}>{c.level}</span>
                ))}
              </div>
            </div>
          </div>
          {/* Form Fields */}
          <form className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={e => { e.preventDefault(); setSaving(true); setTimeout(() => { setSaving(false); onClose(); }, 1000); }}>
            <div>
              <label className="block text-xs font-semibold mb-1">First Name</label>
              <input className="w-full border rounded px-3 py-2 mb-3" value={profile.firstName} onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Last Name</label>
              <input className="w-full border rounded px-3 py-2 mb-3" value={profile.lastName} onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold mb-1">Email Address</label>
              <input className="w-full border rounded px-3 py-2 mb-3" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Phone Number</label>
              <input className="w-full border rounded px-3 py-2 mb-3" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">School</label>
              <input className="w-full border rounded px-3 py-2 mb-3" value={profile.school} onChange={e => setProfile(p => ({ ...p, school: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Role</label>
              <input className="w-full border rounded px-3 py-2 mb-3" value={profile.role} onChange={e => setProfile(p => ({ ...p, role: e.target.value }))} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold mb-1">Professional Bio</label>
              <textarea className="w-full border rounded px-3 py-2 mb-3" rows={2} value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold mb-1">Professional Interests</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {profile.interests.map((interest, i) => (
                  <span key={interest} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">{interest}</span>
                ))}
              </div>
              <input className="w-full border rounded px-3 py-2" placeholder="Add new interest..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold mb-1">Learning Preferences</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={profile.preferences.inPerson} onChange={e => setProfile(p => ({ ...p, preferences: { ...p.preferences, inPerson: e.target.checked } }))} /> In-Person Training (ILT)</label>
                <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={profile.preferences.virtual} onChange={e => setProfile(p => ({ ...p, preferences: { ...p.preferences, virtual: e.target.checked } }))} /> Virtual Instructor-Led Training (VILT)</label>
                <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={profile.preferences.self} onChange={e => setProfile(p => ({ ...p, preferences: { ...p.preferences, self: e.target.checked } }))} /> Self-Paced Learning</label>
              </div>
            </div>
            <div className="md:col-span-2 flex justify-end gap-2 mt-2">
              <button type="button" className="px-4 py-2 rounded bg-gray-100 text-gray-700" onClick={onClose}>Cancel</button>
              <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white font-semibold" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </form>
        </div>
        {/* Lower Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Learning Path Preferences */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-gray-800">Learning Path Preferences</div>
              <button className="text-xs text-indigo-600 font-medium">Edit</button>
            </div>
            <div className="text-xs text-gray-500 mb-1">Current Career Goal</div>
            <div className="font-semibold text-indigo-700 mb-1">{mockLearningPath.current}</div>
            <div className="text-xs text-gray-500 mb-2">Expected Completion: December 2025</div>
            <div className="text-xs text-gray-500 mb-1">Development Focus:</div>
            <ul className="list-disc ml-5 text-xs text-gray-700">
              {mockLearningPath.focus.map(f => <li key={f}>{f}</li>)}
            </ul>
          </div>
          {/* Connected Accounts */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-gray-800">Connected Accounts</div>
              <button className="text-xs text-indigo-600 font-medium">Manage</button>
            </div>
            <ul className="text-xs text-gray-700">
              {mockAccounts.map(acc => (
                <li key={acc.label} className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{acc.label}:</span> {acc.email} {acc.connected ? <CheckCircle className="w-4 h-4 text-green-500 ml-1" /> : <span className="text-gray-400 ml-1">Not connected</span>}
                </li>
              ))}
            </ul>
          </div>
          {/* Role & Capabilities */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-gray-800">Your Role & Capabilities</div>
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">Regular Trainer</span>
            </div>
            <ul className="mb-2">
              {mockCapabilities.map(cap => (
                <li key={cap.label} className="flex items-center gap-2 mb-1">
                  <cap.icon className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs text-gray-700 font-semibold">{cap.label}</span>
                  <span className="text-xs text-gray-500">{cap.desc}</span>
                </li>
              ))}
            </ul>
            <div className="bg-yellow-50 rounded-xl p-3 flex flex-col items-start mt-2">
              <span className="font-semibold text-yellow-800 flex items-center mb-1"><Info className="w-4 h-4 mr-1 inline" /> Career Growth Opportunity</span>
              <span className="text-xs text-gray-700">Complete the "Master Trainer Preparation" learning path to qualify for the Master Trainer role with expanded capabilities and leadership opportunities.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerProfileModal; 