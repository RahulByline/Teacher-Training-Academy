import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface AdminProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    username?: string;
    profileimageurl?: string;
    fullname?: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    city?: string;
    country?: string;
    description?: string;
    phone?: string;
    school?: string;
    role?: string;
    timezone?: string;
    moodleprofileid?: string;
    emailvisibility?: string;
    suspended?: boolean;
    pictureDescription?: string;
  };
  onSave: (data: any) => void;
}

const TABS = [
  'Profile Information',
  'Reports',
  'Privacy and policies',
  'Login activity',
  'Course details',
];

const countryList = [
  'Saudi Arabia', 'United States', 'United Kingdom', 'India', 'Canada', 'Australia', 'UAE', 'Egypt', 'Pakistan', 'Other'
];
const timezoneList = [
  'Server timezone (Asia/Riyadh)', 'Asia/Riyadh', 'Asia/Dubai', 'Asia/Kolkata', 'Europe/London', 'America/New_York', 'UTC'
];
const emailVisibilityOptions = [
  { value: '2', label: 'Visible to everyone' },
  { value: '1', label: 'Visible to course members' },
  { value: '0', label: 'Hidden from everyone' },
];

export const AdminProfileModal: React.FC<AdminProfileModalProps> = ({ isOpen, onClose, user, onSave }) => {
  const [form, setForm] = useState({
    username: user?.username || '',
    authMethod: 'Manual accounts',
    suspended: user?.suspended || false,
    newPassword: '',
    showPassword: false,
    firstname: user?.firstname || '',
    lastname: user?.lastname || '',
    email: user?.email || '',
    emailvisibility: user?.emailvisibility || '2',
    moodleprofileid: user?.moodleprofileid || '',
    city: user?.city || '',
    country: user?.country || '',
    timezone: user?.timezone || timezoneList[0],
    description: user?.description || '',
    profileimageurl: user?.profileimageurl || '',
    deletePicture: false,
    newPicture: undefined as File | undefined,
    pictureDescription: user?.pictureDescription || '',
  });
  const [uploading, setUploading] = useState(false);
  const [showGeneral, setShowGeneral] = useState(true);
  const [showPicture, setShowPicture] = useState(true);
  const [showAdditional, setShowAdditional] = useState(false);
  const [showInterests, setShowInterests] = useState(false);
  const [showOptional, setShowOptional] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (field: string, value: any) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploading(true);
      setForm(f => ({ ...f, newPicture: file }));
      const reader = new FileReader();
      reader.onload = (ev) => {
        setForm(f => ({ ...f, profileimageurl: ev.target?.result as string }));
        setUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-0 relative overflow-y-auto max-h-[90vh]"
          onClick={e => e.stopPropagation()}
        >
          <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" onClick={onClose}>
            <X size={24} />
          </button>
          {/* Tab Navigation */}
          <div className="flex border-b px-8 pt-6 bg-white sticky top-0 z-10">
            {TABS.map((tab, idx) => (
              <button
                key={tab}
                className={`mr-8 pb-2 text-sm font-medium focus:outline-none transition-colors ${
                  activeTab === idx
                    ? 'text-blue-700 border-b-2 border-blue-700'
                    : 'text-gray-500 hover:text-blue-700 border-b-2 border-transparent'
                }`}
                onClick={() => setActiveTab(idx)}
                type="button"
              >
                {tab}
              </button>
            ))}
          </div>
          {/* Only show Profile Information for now */}
          {activeTab === 0 && (
            <form onSubmit={handleSubmit} className="p-0">
              {/* General Section */}
              <div className="border-b px-8 pt-8 pb-4 flex items-center cursor-pointer select-none" onClick={() => setShowGeneral(v => !v)}>
                <span className="text-lg font-bold text-blue-700 mr-2">General</span>
                <span className="ml-auto text-xs text-blue-500">{showGeneral ? '▼' : '►'}</span>
              </div>
              {showGeneral && (
                <div className="px-8 pt-4 pb-8 grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Username <span className="text-red-500">*</span></label>
                      <input className="w-full border border-gray-300 px-2 py-1 text-sm" value={form.username} readOnly disabled />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Choose an authentication method <span className="text-red-500">*</span></label>
                      <input className="w-full border border-gray-300 px-2 py-1 text-sm" value={form.authMethod} readOnly disabled />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <input type="checkbox" checked={form.suspended} onChange={e => handleChange('suspended', e.target.checked)} />
                      <span className="text-sm">Suspended account</span>
                    </div>
                    <div></div>
                    <div className="relative">
                      <label className="block text-sm font-medium mb-1">New password</label>
                      <input
                        className="w-full border border-gray-300 px-2 py-1 text-sm pr-10"
                        type={form.showPassword ? 'text' : 'password'}
                        value={form.newPassword}
                        onChange={e => handleChange('newPassword', e.target.value)}
                        placeholder="Click to enter text"
                      />
                      <button type="button" className="absolute right-2 top-7 text-gray-400" onClick={() => handleChange('showPassword', !form.showPassword)}>
                        {form.showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      <div className="text-xs text-gray-400 mt-1">The password must have at least 8 characters, at least 1 digit(s), at least 1 lower case letter(s), at least 1 upper case letter(s), at least 1 special character(s).</div>
                    </div>
                    <div></div>
                    <div>
                      <label className="block text-sm font-medium mb-1">First name <span className="text-red-500">*</span></label>
                      <input className="w-full border border-gray-300 px-2 py-1 text-sm" value={form.firstname} onChange={e => handleChange('firstname', e.target.value)} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Last name <span className="text-red-500">*</span></label>
                      <input className="w-full border border-gray-300 px-2 py-1 text-sm" value={form.lastname} onChange={e => handleChange('lastname', e.target.value)} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email address <span className="text-red-500">*</span></label>
                      <input className="w-full border border-gray-300 px-2 py-1 text-sm" type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email visibility</label>
                      <select className="w-full border border-gray-300 px-2 py-1 text-sm" value={form.emailvisibility} onChange={e => handleChange('emailvisibility', e.target.value)}>
                        {emailVisibilityOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Moodle profile ID</label>
                      <input className="w-full border border-gray-300 px-2 py-1 text-sm" value={form.moodleprofileid} onChange={e => handleChange('moodleprofileid', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">City/town</label>
                      <input className="w-full border border-gray-300 px-2 py-1 text-sm" value={form.city} onChange={e => handleChange('city', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Select a country</label>
                      <select className="w-full border border-gray-300 px-2 py-1 text-sm" value={form.country} onChange={e => handleChange('country', e.target.value)}>
                        <option value="">Select a country...</option>
                        {countryList.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Timezone</label>
                      <select className="w-full border border-gray-300 px-2 py-1 text-sm" value={form.timezone} onChange={e => handleChange('timezone', e.target.value)}>
                        {timezoneList.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <textarea className="w-full border border-gray-300 px-2 py-1 text-sm min-h-[80px]" value={form.description} onChange={e => handleChange('description', e.target.value)} />
                    </div>
                  </div>
                </div>
              )}
              {/* User Picture Section */}
              <div className="border-b px-8 pt-8 pb-4 flex items-center cursor-pointer select-none" onClick={() => setShowPicture(v => !v)}>
                <span className="text-lg font-bold text-blue-700 mr-2">User picture</span>
                <span className="ml-auto text-xs text-blue-500">{showPicture ? '▼' : '►'}</span>
              </div>
              {showPicture && (
                <div className="px-8 pt-4 pb-8 grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-6 mb-4">
                    <div>
                      <img src={form.profileimageurl || '/default-profile.png'} alt="Profile" className="w-20 h-20 rounded object-cover border" />
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={form.deletePicture} onChange={e => handleChange('deletePicture', e.target.checked)} />
                      Delete picture
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">New picture</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full text-sm" />
                    <div className="text-xs text-gray-400 mt-1">You can drag and drop files here to add them.</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Picture description</label>
                    <input className="w-full border border-gray-300 px-2 py-1 text-sm" value={form.pictureDescription} onChange={e => handleChange('pictureDescription', e.target.value)} />
                  </div>
                </div>
              )}
              {/* Buttons */}
              <div className="flex justify-end gap-3 px-8 py-6 bg-gray-50 border-t">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Update profile
                </Button>
              </div>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}; 