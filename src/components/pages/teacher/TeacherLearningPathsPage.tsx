import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { apiService } from '../../../services/api';
import { BookOpen, TrendingUp, Clock } from 'lucide-react';

const TeacherLearningPathsPage: React.FC = () => {
  const { user } = useAuth();
  const [learningPaths, setLearningPaths] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLearningPaths() {
      if (!user?.id) return;
      setLoading(true);
      setError(null);
      try {
        const paths = await apiService.getUserLearningPath(user.id);
        setLearningPaths(Array.isArray(paths) ? paths : []);
      } catch (e: any) {
        setError(e.message || 'Failed to fetch learning paths');
      } finally {
        setLoading(false);
      }
    }
    fetchLearningPaths();
  }, [user?.id]);

  return (
    <div className="min-h-screen w-full bg-[#f9fafb] flex flex-col items-center justify-start py-12 px-2 md:px-8">
      <div className="w-full px-4">
        <div className="flex items-center gap-3 mb-8">
          <BookOpen className="w-10 h-10 text-indigo-500" />
          <h1 className="text-3xl font-bold text-gray-900">Learning Paths</h1>
        </div>
        <div className="bg-white rounded-3xl shadow-lg p-8 w-full">
          {loading ? (
            <div className="text-center text-gray-500 py-16 text-lg">Loading learning paths...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-16 text-lg">{error}</div>
          ) : learningPaths.length === 0 ? (
            <div className="text-center text-gray-500 py-16 text-lg">No learning paths found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {learningPaths.map((path) => (
                <div key={path.id || path.title} className="bg-indigo-50 border border-indigo-100 rounded-2xl shadow p-6 flex flex-col gap-2 hover:shadow-xl transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <BookOpen className="w-7 h-7 text-indigo-500" />
                    <span className="font-semibold text-gray-900 text-lg">{path.title || path.label}</span>
                    {path.level && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded ml-2">{path.level}</span>}
                  </div>
                  <span className="text-sm text-gray-600 mb-1">{path.description || 'No description available.'}</span>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-2">
                    {path.type && <span className="flex items-center gap-1"><TrendingUp className="w-4 h-4" />{path.type}</span>}
                    {path.duration && <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{path.duration}</span>}
                    {typeof path.progress === 'number' && (
                      <span className="flex items-center gap-1">
                        Progress: <span className="font-semibold text-indigo-600">{path.progress}%</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherLearningPathsPage; 