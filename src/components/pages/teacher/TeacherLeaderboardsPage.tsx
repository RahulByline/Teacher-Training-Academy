import React, { useEffect, useState } from 'react';
import { apiService } from '../../../services/api';

interface LeaderboardEntry {
  id: string;
  name: string;
  role?: string;
  completedCourses: number;
}

const TeacherLeaderboardsPage: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      setError(null);
      try {
        const users = await apiService.getAllUsers();
        // Only include users with the 'teacher' role
        const teachers = users.filter((user: any) => user.role === 'teacher');
        const entries: LeaderboardEntry[] = [];
        await Promise.all(
          teachers.map(async (user: any) => {
            try {
              const courses = await apiService.getUserCourses(user.id);
              const completedCourses = courses.filter((c: any) => c.progress === 100).length;
              entries.push({
                id: user.id,
                name: user.fullname || `${user.firstname} ${user.lastname}`,
                role: user.role,
                completedCourses,
              });
            } catch (err) {
              // Ignore errors for individual users
            }
          })
        );
        entries.sort((a, b) => b.completedCourses - a.completedCourses);
        setLeaderboard(entries);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch leaderboard');
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-screen bg-[#f9fafb] p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Leaderboards</h1>
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : leaderboard.length === 0 ? (
        <div className="text-gray-500">No leaderboard data found.</div>
      ) : (
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md p-8">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-left py-2 px-4">Rank</th>
                <th className="text-left py-2 px-4">Name</th>
                <th className="text-left py-2 px-4">Role</th>
                <th className="text-left py-2 px-4">Completed Courses</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, idx) => (
                <tr key={entry.id} className={idx < 3 ? 'bg-yellow-50 font-bold' : ''}>
                  <td className="py-2 px-4">{idx + 1}</td>
                  <td className="py-2 px-4">{entry.name}</td>
                  <td className="py-2 px-4 capitalize">{entry.role || '-'}</td>
                  <td className="py-2 px-4">{entry.completedCourses}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TeacherLeaderboardsPage; 