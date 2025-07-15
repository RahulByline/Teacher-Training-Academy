import React from 'react';
import { Users } from 'lucide-react';

const mockCommunity = [
  { name: 'Sarah Johnson', role: 'Master Trainer' },
  { name: 'Mohammed Al-Ghamdi', role: 'Trainer' },
  { name: 'Aisha Al-Sulaiman', role: 'Trainer' },
  { name: 'Khalid Al-Harbi', role: 'Trainer' },
];

const CommunityPage: React.FC = () => (
  <div className="flex flex-col items-center justify-center w-full h-full min-h-screen bg-[#f9fafb] p-8">
    <div className="flex items-center gap-3 mb-6">
      <Users className="w-8 h-8 text-indigo-500" />
      <h1 className="text-2xl font-bold text-gray-900">Trainer Community</h1>
    </div>
    <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-2xl">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Community Members</h2>
      <ul className="divide-y divide-gray-100">
        {mockCommunity.map((member) => (
          <li key={member.name} className="py-3 flex flex-col md:flex-row md:items-center md:gap-4">
            <span className="font-medium text-gray-800">{member.name}</span>
            <span className="text-xs text-gray-500 ml-2">{member.role}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default CommunityPage; 