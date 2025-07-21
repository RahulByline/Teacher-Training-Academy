import React, { useEffect, useState } from 'react';
import { Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usersService } from '../../services/usersService';

const TrainerSettingsPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ firstname: '', lastname: '', email: '', profileimageurl: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const profile = await usersService.getUserById(user.id);
        setForm({
          firstname: profile.firstname || '',
          lastname: profile.lastname || '',
          email: profile.email || '',
          profileimageurl: profile.profileimageurl || '',
        });
      } catch (e: any) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await usersService.updateUser(user.id, {
        firstname: form.firstname,
        lastname: form.lastname,
        email: form.email,
        // profileimageurl is not always updatable via API, so skip unless supported
      });
      updateUser({ ...user, ...form });
      setSuccess(true);
    } catch (e: any) {
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full min-h-screen bg-[#f9fafb] p-4 pt-2 mt-[10px]">
      <div className="flex items-center gap-3 mb-4 mt-2">
        <Settings className="w-8 h-8 text-indigo-500" />
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>
      <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-xl">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Profile & Preferences</h2>
        {loading ? (
          <div className="text-center text-gray-500 py-8">Loading...</div>
        ) : (
          <form className="space-y-4" onSubmit={handleSave}>
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-800">First Name</label>
              <input
                name="firstname"
                value={form.firstname}
                onChange={handleChange}
                className="border rounded px-3 py-2"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-800">Last Name</label>
              <input
                name="lastname"
                value={form.lastname}
                onChange={handleChange}
                className="border rounded px-3 py-2"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-800">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="border rounded px-3 py-2"
                required
              />
            </div>
            {form.profileimageurl && (
              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-800">Profile Image</label>
                <img src={form.profileimageurl} alt="Profile" className="w-20 h-20 rounded-full object-cover border" />
              </div>
            )}
            {error && <div className="text-red-600 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">Profile updated successfully!</div>}
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded font-semibold mt-2 disabled:opacity-50"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default TrainerSettingsPage; 