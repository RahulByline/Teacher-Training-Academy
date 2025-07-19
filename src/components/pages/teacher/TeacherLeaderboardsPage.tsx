import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Award, Star, TrendingUp, Users, Calendar, BookOpen } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { apiService } from '../../../services/api';

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1: return <Trophy className="w-8 h-8 text-yellow-400" />;
    case 2: return <Medal className="w-8 h-8 text-gray-400" />;
    case 3: return <Award className="w-8 h-8 text-orange-400" />;
    default: return <Star className="w-7 h-7 text-blue-400" />;
  }
};

const fallbackImage = '/public/images/default-course.jpg';

const roleBadge = (role: string) => {
  if (role === 'teacher') return <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">Teacher</span>;
  if (role === 'trainee') return <span className="ml-2 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Trainee</span>;
  return null;
};

// Fallback dummy users if real data is empty
const dummyLeaderboard = [
  { id: '1', name: 'Sarah Ahmed', profileImage: 'https://randomuser.me/api/portraits/women/44.jpg', department: 'Science', completedCourses: 12, totalPoints: 1450, lastActivity: 'Today', role: 'teacher', rank: 1 },
  { id: '2', name: 'Mohammed Al-Farsi', profileImage: 'https://randomuser.me/api/portraits/men/32.jpg', department: 'Mathematics', completedCourses: 10, totalPoints: 1320, lastActivity: 'Yesterday', role: 'trainee', rank: 2 },
  { id: '3', name: 'Aisha Noor', profileImage: 'https://randomuser.me/api/portraits/women/65.jpg', department: 'English', completedCourses: 9, totalPoints: 1200, lastActivity: '2 days ago', role: 'teacher', rank: 3 },
  { id: '4', name: 'Omar Khalid', profileImage: 'https://randomuser.me/api/portraits/men/41.jpg', department: 'Social Studies', completedCourses: 8, totalPoints: 1100, lastActivity: '3 days ago', role: 'trainee', rank: 4 },
  { id: '5', name: 'Fatima Zahra', profileImage: 'https://randomuser.me/api/portraits/women/68.jpg', department: 'Arabic', completedCourses: 7, totalPoints: 980, lastActivity: '4 days ago', role: 'teacher', rank: 5 },
  { id: '6', name: 'Sai Teja', profileImage: 'https://randomuser.me/api/portraits/men/23.jpg', department: 'Math', completedCourses: 6, totalPoints: 900, lastActivity: '5 days ago', role: 'trainee', rank: 6 },
  { id: '7', name: 'Madhavi', profileImage: 'https://randomuser.me/api/portraits/women/12.jpg', department: 'Science', completedCourses: 5, totalPoints: 850, lastActivity: '6 days ago', role: 'teacher', rank: 7 },
  { id: '8', name: 'Vijaya Lakshmi', profileImage: 'https://randomuser.me/api/portraits/women/21.jpg', department: 'English', completedCourses: 4, totalPoints: 800, lastActivity: '7 days ago', role: 'trainee', rank: 8 },
  { id: '9', name: 'Sheshi Kumar', profileImage: 'https://randomuser.me/api/portraits/men/55.jpg', department: 'Math', completedCourses: 3, totalPoints: 700, lastActivity: '8 days ago', role: 'teacher', rank: 9 },
  { id: '10', name: 'Kumar', profileImage: 'https://randomuser.me/api/portraits/men/77.jpg', department: 'Social Studies', completedCourses: 2, totalPoints: 600, lastActivity: '9 days ago', role: 'trainee', rank: 10 },
];

const TeacherLeaderboardsPage: React.FC = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<'all' | 'teacher' | 'trainee'>('all');

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      setError(null);
      try {
        const users = await apiService.getAllUsers();
        const filtered = users.filter((u: any) => u.role === 'teacher' || u.role === 'trainee');
        const entries: any[] = [];
        await Promise.all(
          filtered.map(async (person: any) => {
            try {
              const courses = await apiService.getUserCourses(person.id);
              const completedCourses = courses.filter((c: any) => c.progress === 100).length;
              const totalPoints = completedCourses * 100 + (person.lastaccess ? Math.max(0, 50 - Math.floor((Date.now() - person.lastaccess * 1000) / (24 * 60 * 60 * 1000))) : 0);
              entries.push({
                id: person.id,
                name: person.fullname || `${person.firstname} ${person.lastname}`,
                profileImage: person.profileimageurl || fallbackImage,
                department: person.department || 'Department',
                completedCourses,
                totalPoints,
                lastActivity: person.lastaccess ? new Date(person.lastaccess * 1000).toLocaleDateString() : 'Never',
                role: person.role,
              });
            } catch (err) {
              // skip
            }
          })
        );
        entries.sort((a, b) => b.totalPoints - a.totalPoints);
        entries.forEach((entry, idx) => (entry.rank = idx + 1));
        if (entries.length === 0) {
          dummyLeaderboard.forEach((entry, idx) => (entry.rank = idx + 1));
          setLeaderboard(dummyLeaderboard);
        } else {
          setLeaderboard(entries);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch leaderboard');
        // fallback to dummy data on error
        dummyLeaderboard.forEach((entry, idx) => (entry.rank = idx + 1));
        setLeaderboard(dummyLeaderboard);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, [user]);

  const filteredLeaderboard = roleFilter === 'all' ? leaderboard : leaderboard.filter(e => e.role === roleFilter);
  const top3 = filteredLeaderboard.slice(0, 3);
  const rest = filteredLeaderboard.slice(3);

  return (
    <div className="min-h-screen w-full bg-[#f9fafb] flex flex-col items-center justify-start py-12 px-2 md:px-8">
      <div className="w-full px-4">
        <div className="flex items-center gap-3 mb-8">
          <Trophy className="w-10 h-10 text-yellow-500" />
          <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
        <div className="ml-auto flex gap-2">
          <button onClick={() => setRoleFilter('all')} className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${roleFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-indigo-50'}`}>All</button>
          <button onClick={() => setRoleFilter('teacher')} className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${roleFilter === 'teacher' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-indigo-50'}`}>Teachers</button>
          <button onClick={() => setRoleFilter('trainee')} className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${roleFilter === 'trainee' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-indigo-50'}`}>Trainees</button>
        </div>
        </div>
        <div className="bg-white rounded-3xl shadow-lg p-8 w-full">
          {/* Podium for Top 3 */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex justify-center gap-6 w-full max-w-2xl">
              {top3.map((entry, idx) => (
                <div key={entry.id} className={`flex flex-col items-center px-4 py-6 rounded-2xl shadow-lg ${idx === 0 ? 'bg-yellow-50' : idx === 1 ? 'bg-gray-100' : 'bg-orange-50'} w-1/3 mx-2`}>
                  <div className="flex items-center gap-2 mb-2">
                    {getRankIcon(entry.rank)}
                    <span className="text-xl font-bold">{entry.rank === 1 ? '1st' : entry.rank === 2 ? '2nd' : '3rd'}</span>
                  </div>
                  <img
                    src={entry.profileImage}
                    alt={entry.name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-indigo-200 mb-2 shadow"
                  />
                  <div className="font-semibold text-lg text-gray-900 mb-1 flex items-center">{entry.name}{roleBadge(entry.role)}</div>
                  <div className="text-xs text-gray-500 mb-1">{entry.department}</div>
                  <div className="flex gap-2 items-center text-sm font-semibold text-indigo-700">
                    <TrendingUp className="w-4 h-4" /> {entry.totalPoints} pts
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* List for the rest */}
          <div className="bg-indigo-50 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2 px-2">
              <span className="font-semibold text-indigo-900">Today's Leaderboard</span>
              <span className="text-xs text-gray-500">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="divide-y divide-indigo-100">
              {rest.map((entry) => (
                <div key={entry.id} className="flex items-center gap-3 py-3 px-2">
                  <span className="w-6 text-center font-bold text-gray-700">{entry.rank}</span>
                  <img
                    src={entry.profileImage}
                    alt={entry.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-indigo-200"
                  />
                  <span className="flex-1 font-medium text-gray-900 flex items-center">{entry.name}{roleBadge(entry.role)}</span>
                  <span className="text-xs text-gray-500 mr-2">{entry.department}</span>
                  <span className="flex items-center gap-1 text-indigo-700 font-semibold text-sm"><TrendingUp className="w-4 h-4" />{entry.totalPoints}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherLeaderboardsPage; 