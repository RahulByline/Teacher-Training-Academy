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
  <div className="min-h-screen w-full bg-[#f9fafb] flex flex-col items-center justify-start py-12 px-2 md:px-8">
    <div className="w-full px-4">
      <div className="flex items-center gap-3 mb-8">
        <Trophy className="w-10 h-10 text-indigo-500" />
        <h1 className="text-3xl font-bold text-gray-900">Achievements</h1>
      </div>
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Badges & Awards</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mockAchievements.map((badge) => (
            <div key={badge.label} className="flex flex-col items-center p-6 rounded-2xl shadow bg-indigo-50 border border-indigo-100 min-w-[120px] hover:shadow-xl transition-all">
              <badge.icon className="w-10 h-10 mb-2 text-indigo-500" />
              <span className="font-semibold text-gray-800 text-center">{badge.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 text-sm text-gray-700">Next: <b>Curriculum Design Specialist</b> (pending 2 courses)</div>
      </div>
    </div>
  </div>
);

export default AchievementsPage; 