import React, { useEffect, useState } from 'react';
import { usersService } from '../../../services/usersService';
import { useAuth } from '../../../context/AuthContext';
import { Save, Edit, User as UserIcon, Mail, Building, MapPin, Phone, Award, Star, Info, X, Link2, Users, BookOpen, CheckCircle, Flame, ArrowUpRight } from 'lucide-react';

const defaultProfileImage = '/public/images/default-course.jpg';

const TeacherProfilePage: React.FC = () => {
  const { user: currentUser, updateUser } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        if (currentUser?.id) {
          const realUser = await usersService.getUserById(currentUser.id);
          setUser(realUser);
        } else {
          setUser(currentUser);
        }
      } catch (e) {
        setUser(currentUser);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!user) return;
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      updateUser(user);
      try {
        await usersService.updateUser(user.id, user);
      } catch (backendError) {
        console.warn('Backend update failed, but local update succeeded:', backendError);
      }
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (e) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setUser(currentUser);
    setIsEditing(false);
    setError(null);
    setSuccess(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <p className="text-lg text-gray-600">User not found</p>
        </div>
      </div>
    );
  }

  // Mock data for cards if real data is not available
  const learningPath = {
    title: 'Master Teacher Certification',
    expectedCompletion: 'December 2025',
    focusAreas: [
      'Student Engagement Strategies',
      'Technology Integration',
      'Data-Driven Instruction',
    ],
  };
  const connectedAccounts = {
    microsoft: { connected: true, email: user?.email },
    google: { connected: false },
    linkedin: { connected: false },
  };
  const roleCapabilities = {
    role: user?.role || 'Regular Teacher',
    access: true,
    assessment: true,
    collaboration: true,
    canLead: false,
  };

  return (
    <div className="min-h-screen w-full bg-[#f9fafb] flex flex-col items-center justify-start py-8 px-2 md:px-8">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>
        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        {/* Modern Account Settings Layout */}
        <div className="w-full bg-white rounded-2xl shadow p-10 flex flex-col gap-8">
          <div className="text-2xl font-bold mb-2">Profile Information</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left: Profile Info & Competencies */}
            <div className="flex flex-col items-center md:items-start">
              <img
                src={user?.profileimageurl || defaultProfileImage}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover mb-2 border-4 border-indigo-100 cursor-pointer"
              />
              <div className="font-bold text-lg mb-1 text-center md:text-left">{user?.fullname}</div>
              <div className="text-xs text-gray-500 mb-2 text-center md:text-left">
                {user?.role || 'Teacher'}<br />
                {user?.department || 'Department'}
              </div>
              <div className="text-xs text-gray-500 mb-2 text-center md:text-left">{user?.email}</div>
              <button className="text-indigo-600 text-xs font-medium flex items-center gap-1 mb-4"><Edit className="w-4 h-4" /> Change Photo</button>
              <div className="w-full">
                <div className="text-xs text-gray-400 mb-1">Teaching Competencies</div>
                <div className="space-y-2">
                  {(user.competencies || []).map((c: any, i: number) => (
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
            <form className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={e => { e.preventDefault(); handleSave(); }}>
              <div>
                <label className="block text-xs font-semibold mb-1">First Name</label>
                <input
                  type="text"
                  name="firstname"
                  value={user?.firstname || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full border rounded px-3 py-2 mb-3 disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastname"
                  value={user?.lastname || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full border rounded px-3 py-2 mb-3 disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={user?.email || ''}
                  onChange={handleChange}
                  disabled={true}
                  className="w-full border rounded px-3 py-2 mb-3 bg-gray-100 text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Department</label>
                <input
                  type="text"
                  name="department"
                  value={user?.department || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full border rounded px-3 py-2 mb-3 disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">School / Company</label>
                <input
                  type="text"
                  name="company"
                  value={user?.company || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full border rounded px-3 py-2 mb-3 disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={user?.phone || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full border rounded px-3 py-2 mb-3 disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={user?.username || ''}
                  onChange={handleChange}
                  disabled={true}
                  className="w-full border rounded px-3 py-2 mb-3 bg-gray-100 text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
              </div>
              <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                {isEditing && (
                  <>
                    <button type="button" className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold" onClick={handleCancel}>Cancel</button>
                    <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white font-semibold" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
        {/* Bottom: Modern two-column and full-width card layout */}
        <div className="w-full flex flex-col gap-8 mt-8">
          {/* Top row: two columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Learning Path Preferences */}
            <div className="bg-white rounded-2xl shadow p-8 flex flex-col">
              <div className="flex items-center mb-4">
                <Award className="w-7 h-7 text-indigo-500 mr-2" />
                <div className="font-semibold text-lg flex-1">Learning Path Preferences</div>
                <button className="text-indigo-600 text-xs font-medium">Edit</button>
              </div>
              <div className="mb-2 text-xs text-gray-500">Current Career Goal</div>
              <div className="bg-indigo-50 rounded-xl p-4 mb-4 flex items-center gap-3">
                <Star className="w-6 h-6 text-indigo-400" />
                <div>
                  <div className="font-medium text-indigo-800 text-sm">{learningPath.title}</div>
                  <div className="text-xs text-gray-500">Expected completion: {learningPath.expectedCompletion}</div>
                </div>
              </div>
              <div className="mb-1 text-xs text-gray-500">Development Focus Areas</div>
              <ul className="mb-0">
                {learningPath.focusAreas.map((area: string) => (
                  <li key={area} className="flex items-center gap-2 text-sm text-green-700 mb-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                    {area}
                  </li>
                ))}
              </ul>
            </div>
            {/* Connected Accounts */}
            <div className="bg-white rounded-2xl shadow p-8 flex flex-col">
              <div className="flex items-center mb-4">
                <Link2 className="w-7 h-7 text-indigo-500 mr-2" />
                <div className="font-semibold text-lg flex-1">Connected Accounts</div>
                <button className="text-indigo-600 text-xs font-medium">Manage</button>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft" className="w-5 h-5" />
                  <span className="text-sm font-medium">Microsoft Account</span>
                  <span className="text-xs text-gray-500">{connectedAccounts?.microsoft?.email}</span>
                  {connectedAccounts?.microsoft?.connected ? <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Connected</span> : <button className="ml-2 text-xs text-indigo-600 font-medium">Connect</button>}
                </div>
                <div className="flex items-center gap-2">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-5 h-5" />
                  <span className="text-sm font-medium">Google Account</span>
                  {connectedAccounts?.google?.connected ? <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Connected</span> : <button className="ml-2 text-xs text-indigo-600 font-medium">Connect</button>}
                </div>
                <div className="flex items-center gap-2">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" alt="LinkedIn" className="w-5 h-5" />
                  <span className="text-sm font-medium">LinkedIn</span>
                  {connectedAccounts?.linkedin?.connected ? <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Connected</span> : <button className="ml-2 text-xs text-indigo-600 font-medium">Connect</button>}
                </div>
              </div>
            </div>
          </div>
          {/* Bottom: Role & Capabilities full-width card */}
          <div className="bg-white rounded-2xl shadow p-8 flex flex-col gap-6">
            <div className="flex items-center mb-4">
              <Users className="w-7 h-7 text-indigo-500 mr-2" />
              <div className="font-semibold text-lg flex-1">Your Role & Capabilities</div>
              <span className="ml-auto text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">{roleCapabilities?.role || 'Regular Teacher'}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Learning Access */}
              <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-2 border border-gray-100">
                <BookOpen className="w-6 h-6 text-green-500 mb-1" />
                <div className="font-semibold text-green-900 mb-1">Learning Access</div>
                <ul className="text-sm text-green-900">
                  <li className="flex items-center gap-2 mb-1"><span className="text-green-500">✔</span> Access personalized learning paths</li>
                  <li className="flex items-center gap-2 mb-1"><span className="text-green-500">✔</span> Enroll in all course types (ILT, VILT, Self-paced)</li>
                  <li className="flex items-center gap-2"><span className="text-green-500">✔</span> View and download course materials</li>
                </ul>
              </div>
              {/* Assessment & Certification */}
              <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-2 border border-gray-100">
                <CheckCircle className="w-6 h-6 text-blue-500 mb-1" />
                <div className="font-semibold text-blue-900 mb-1">Assessment & Certification</div>
                <ul className="text-sm text-blue-900">
                  <li className="flex items-center gap-2 mb-1"><span className="text-green-500">✔</span> Complete course assessments</li>
                  <li className="flex items-center gap-2 mb-1"><span className="text-green-500">✔</span> Receive feedback on submissions</li>
                  <li className="flex items-center gap-2"><span className="text-green-500">✔</span> Track certification progress</li>
                </ul>
              </div>
              {/* Collaboration */}
              <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-2 border border-gray-100">
                <Flame className="w-6 h-6 text-purple-500 mb-1" />
                <div className="font-semibold text-purple-900 mb-1">Collaboration</div>
                <ul className="text-sm text-purple-900">
                  <li className="flex items-center gap-2 mb-1"><span className="text-green-500">✔</span> Participate in discussion forums</li>
                  <li className="flex items-center gap-2 mb-1"><span className="text-green-500">✔</span> Join peer learning groups</li>
                  <li className="flex items-center gap-2"><span className="text-gray-400">✖</span> <span className="line-through text-gray-400">Create or lead training sessions</span></li>
                </ul>
              </div>
            </div>
            {/* Career Growth Opportunity */}
            <div className="bg-blue-50 rounded-xl p-6 flex items-center gap-4 mt-2">
              <Info className="w-8 h-8 text-blue-500" />
              <div>
                <div className="font-semibold text-blue-900 mb-1">Career Growth Opportunity</div>
                <div className="text-sm text-blue-800 mb-1">Complete the "Master Trainer Preparation" learning path to qualify for the Master Trainer role with expanded capabilities and leadership opportunities.</div>
                <a href="#" className="text-sm text-blue-600 font-medium flex items-center gap-1 hover:underline">Learn more <ArrowUpRight className="w-4 h-4" /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfilePage; 