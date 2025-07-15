import React from 'react';
import { Settings } from 'lucide-react';

const TrainerSettingsPage: React.FC = () => (
  <div className="flex flex-col items-center justify-center w-full h-full min-h-screen bg-[#f9fafb] p-8">
    <div className="flex items-center gap-3 mb-6">
      <Settings className="w-8 h-8 text-indigo-500" />
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
    </div>
    <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-2xl">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Profile & Preferences</h2>
      <div className="space-y-4">
        <div>
          <span className="font-medium text-gray-800">Profile settings and preferences will appear here.</span>
        </div>
        <div>
          <span className="text-gray-500 text-sm">This is a mock page. Integrate real settings as needed.</span>
        </div>
      </div>
    </div>
  </div>
);

export default TrainerSettingsPage; 