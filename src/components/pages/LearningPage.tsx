import React, { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';

const mockLearning = [
  { title: 'Digital Learning Basics', progress: 100 },
  { title: 'Assessment Design', progress: 80 },
  { title: 'Mentoring Skills', progress: 60 },
  { title: 'Classroom Management', progress: 40 },
];

const LearningPage: React.FC = () => {
  const { user } = useAuth();
  const [learning, setLearning] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLearning() {
      if (user && user.id) {
        setLoading(true);
        setError(null);
        try {
          const courses = await apiService.getUserCourses(user.id);
          const realLearning = Array.isArray(courses) && courses.length > 0
            ? courses.map((course: any) => ({
                title: course.fullname,
                progress: typeof course.progress === 'number' ? course.progress : Math.floor(Math.random() * 100),
              }))
            : [];
          setLearning(realLearning);
        } catch (err: any) {
          setError(err.message || 'Failed to fetch learning data');
        } finally {
          setLoading(false);
        }
      }
    }
    fetchLearning();
  }, [user && user.id]);

  const learningToShow = learning.length ? learning : mockLearning;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-screen bg-[#f9fafb] p-8">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-8 h-8 text-indigo-500" />
        <h1 className="text-2xl font-bold text-gray-900">My Learning</h1>
      </div>
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-2xl">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Learning Paths</h2>
        {loading ? (
          <div className="text-center text-gray-500 py-8">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <ul className="space-y-4">
            {learningToShow.map((item) => (
              <li key={item.title} className="flex flex-col gap-1">
                <span className="font-medium text-gray-800">{item.title}</span>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-indigo-500 h-3 rounded-full" style={{ width: `${item.progress}%` }}></div>
                </div>
                <span className="text-xs text-gray-500">{item.progress}% complete</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LearningPage; 