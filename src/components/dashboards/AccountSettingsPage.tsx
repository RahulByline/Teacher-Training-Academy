import React, { useState, useEffect } from 'react';
import { X, Edit, CheckCircle, Info, Award, Star, Users, BookOpen, Flame } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { usersService } from '../../services/usersService';
import { useAuth } from '../../context/AuthContext';

const TABS = [
  'Profile Information',
  'Password & Security',
  'Notifications',
  'Language & Region',
  'Linked Accounts',
];

// No mockProfile. Only use real data.

const AccountSettingsPage: React.FC = () => {
  const { traineeId } = useParams();
  const { user: loggedInUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [tab, setTab] = useState(0);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!traineeId);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        let userData = null;
        if (traineeId) {
          userData = await usersService.getUserById(traineeId);
        } else if (loggedInUser && loggedInUser.id) {
          userData = await usersService.getUserById(loggedInUser.id);
        }
        if (userData) {
          setProfile(userData);
        } else {
          setProfile(null);
        }
      } catch (e) {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [traineeId, loggedInUser]);

  if (loading) return <div className="flex justify-center items-center h-96">Loading...</div>;
  if (!profile) return <div className="flex justify-center items-center h-96 text-gray-500">No profile data available.</div>;

  return (
    <div className="w-full p-8 m-8 max-w-5xl bg-white rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-2">Account Settings</h2>
      <div className="text-gray-500 mb-6">Manage your profile and preferences</div>
      {/* Tabs */}
      <div className="flex border-b mb-8">
        {TABS.map((t, i) => (
          <button
            key={t}
            className={`px-6 py-2 -mb-px border-b-2 font-medium text-sm transition-colors ${tab === i ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-gray-500 hover:text-indigo-600'}`}
            onClick={() => setTab(i)}
          >
            {t}
          </button>
        ))}
      </div>
      {/* Tab Content */}
      {tab === 0 && (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Left: Profile Info */}
        <div className="flex flex-col items-center md:items-start">
            <img
              src={
                profile.profileimageurl
                  ? profile.profileimageurl.includes('token=')
                    ? profile.profileimageurl
                    : `${profile.profileimageurl}?token=4a2ba2d6742afc7d13ce4cf486ba7633`
                  : profile.avatar || '/public/avatar1.png'
              }
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mb-2 border-4 border-indigo-100"
              onError={e => { (e.currentTarget as HTMLImageElement).src = '/public/avatar1.png'; }}
            />
            <div className="font-bold text-lg mb-1">{profile.fullname || `${profile.firstname || ''} ${profile.lastname || ''}`}</div>
            <div className="text-xs text-gray-500 mb-2">
              {profile.role || profile.position || (profile.roles && Array.isArray(profile.roles) && profile.roles[0]?.name) || 'No role'}
              <br />
              {profile.school || profile.company || ''}
            </div>
            <div className="text-xs text-gray-500 mb-2">{profile.email}</div>
          <button className="text-indigo-600 text-xs font-medium flex items-center gap-1 mb-4"><Edit className="w-4 h-4" /> Change Photo</button>
          <div className="w-full">
            <div className="text-xs text-gray-400 mb-1">Teaching Competencies</div>
              <div className="space-y-2">
                {(profile.competencies || []).map((c: any, i: number) => (
                  <div key={c.label} className="mb-1">
                    <div className="flex justify-between mb-0.5">
                      <span className="text-xs font-medium text-gray-700">{c.label}</span>
                      <span className="text-xs font-medium text-gray-500">{c.level}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`${c.color} h-2 rounded-full`} style={{ width: `${c.value}%` }}></div>
                    </div>
                  </div>
              ))}
            </div>
            </div>
          </div>
          {/* Right: Editable Form */}
        <form className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={e => { e.preventDefault(); setSaving(true); setTimeout(() => { setSaving(false); }, 1000); }}>
          <div>
            <label className="block text-xs font-semibold mb-1">First Name</label>
              <input className="w-full border rounded px-3 py-2 mb-3" value={profile.firstname || ''} onChange={e => setProfile((p: typeof profile) => ({ ...p, firstname: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Last Name</label>
              <input className="w-full border rounded px-3 py-2 mb-3" value={profile.lastname || ''} onChange={e => setProfile((p: typeof profile) => ({ ...p, lastname: e.target.value }))} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold mb-1">Email Address</label>
              <input className="w-full border rounded px-3 py-2 mb-3" value={profile.email || ''} onChange={e => setProfile((p: typeof profile) => ({ ...p, email: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Phone Number</label>
              <input className="w-full border rounded px-3 py-2 mb-3" value={profile.phone} onChange={e => setProfile((p: typeof profile) => ({ ...p, phone: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">School</label>
              <input className="w-full border rounded px-3 py-2 mb-3" value={profile.school} onChange={e => setProfile((p: typeof profile) => ({ ...p, school: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Role</label>
              <input className="w-full border rounded px-3 py-2 mb-3" value={profile.role || profile.position || (profile.roles && Array.isArray(profile.roles) && profile.roles[0]?.name) || ''} onChange={e => setProfile((p: typeof profile) => ({ ...p, role: e.target.value }))} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold mb-1">Professional Bio</label>
              <textarea className="w-full border rounded px-3 py-2 mb-3" rows={2} value={profile.bio} onChange={e => setProfile((p: typeof profile) => ({ ...p, bio: e.target.value }))} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold mb-1">Professional Interests</label>
            <div className="flex flex-wrap gap-2 mb-2">
                {(profile.interests || []).map((interest: string, i: number) => (
                <span key={interest} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">{interest}</span>
              ))}
            </div>
            <input className="w-full border rounded px-3 py-2" placeholder="Add new interest..." />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold mb-1">Learning Preferences</label>
            <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={profile.preferences?.inPerson ?? false} onChange={e => setProfile((p: typeof profile) => ({ ...p, preferences: { ...p.preferences, inPerson: e.target.checked } }))} /> Instructor-Led Training (ILT)</label>
                <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={profile.preferences?.virtual ?? false} onChange={e => setProfile((p: typeof profile) => ({ ...p, preferences: { ...p.preferences, virtual: e.target.checked } }))} /> Virtual Instructor-Led Training (VILT)</label>
                <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={profile.preferences?.self ?? false} onChange={e => setProfile((p: typeof profile) => ({ ...p, preferences: { ...p.preferences, self: e.target.checked } }))} /> Self-Paced Learning</label>
            </div>
          </div>
          <div className="md:col-span-2 flex justify-end gap-2 mt-2">
              <button type="button" className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white font-semibold" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
      )}
      {/* Other Tabs Placeholder */}
      {tab !== 0 && (
        <div className="flex items-center justify-center h-64 text-gray-400 text-lg">Coming soon...</div>
      )}
    </div>
  );
};

export default AccountSettingsPage; 