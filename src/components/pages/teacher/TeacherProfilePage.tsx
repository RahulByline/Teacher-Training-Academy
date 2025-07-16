import React, { useEffect, useState } from 'react';
import { usersService } from '../../../services/usersService';
import { User } from '../../../types';

const defaultProfileImage = '/public/images/default-course.jpg';

const mockUser: User = {
  id: '1',
  email: 'sarah.ahmed@maarif.edu.sa',
  firstname: 'Sarah',
  lastname: 'Ahmed',
  fullname: 'Sarah Ahmed',
  username: 'sarah.ahmed',
  profileimageurl: '',
  department: 'Science',
  company: 'Maarif Al Riyadh School',
};

const TeacherProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Try to fetch real user data, fallback to mock
    const fetchUser = async () => {
      setLoading(true);
      try {
        // Replace '1' with actual logged-in user ID from context/auth
        const realUser = await usersService.getUserById('1');
        setUser(realUser);
      } catch (e) {
        setUser(mockUser);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!user) return;
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      await usersService.updateUser(user.id, user);
      alert('Profile updated successfully!');
    } catch (e) {
      setError('Failed to update profile.');
    }
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center items-center h-96">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8 mt-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h1>
      <div className="flex gap-8 mb-8">
        {/* Profile Image */}
        <div className="flex flex-col items-center">
          <img
            src={user?.profileimageurl || defaultProfileImage}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border"
          />
          <div className="mt-2 text-lg font-semibold">{user?.fullname}</div>
          <div className="text-gray-500 text-sm">{user?.department} Teacher</div>
          <div className="text-gray-400 text-xs">{user?.company}</div>
        </div>
        {/* Profile Form */}
        <div className="flex-1 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="firstname"
              value={user?.firstname || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastname"
              value={user?.lastname || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              value={user?.email || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              disabled
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <input
              type="text"
              name="department"
              value={user?.department || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">School / Company</label>
            <input
              type="text"
              name="company"
              value={user?.company || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default TeacherProfilePage; 