import React from 'react';
import { Trophy, BadgeCheck, Star, Users, BookOpen } from 'lucide-react';

const mockAchievements = [
  { label: 'Master Trainer', icon: BadgeCheck },
  { label: '5-Star Educator', icon: Star },
  { label: '100+ Trainees', icon: Users },
  { label: 'Digital Expert', icon: BookOpen },
  { label: 'Impact Maker', icon: Trophy },
];

const AchievementsPage: React.FC = () => (
  <div className="flex flex-col items-center justify-center w-full h-full min-h-screen bg-[#f9fafb] p-8">
    <div className="flex items-center gap-3 mb-6">
      <Trophy className="w-8 h-8 text-indigo-500" />
      <h1 className="text-2xl font-bold text-gray-900">Achievements</h1>
    </div>
    <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-2xl">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Badges & Awards</h2>
      <div className="grid grid-cols-2 gap-4">
        {mockAchievements.map((badge) => (
          <div key={badge.label} className="flex flex-col items-center p-4 rounded-2xl shadow bg-white min-w-[120px]">
            <badge.icon className="w-8 h-8 mb-2 text-indigo-500" />
            <span className="font-semibold text-gray-800 text-center">{badge.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 text-sm text-gray-700">Next: <b>Curriculum Design Specialist</b> (pending 2 courses)</div>
    </div>
  </div>
);

export default AchievementsPage; 