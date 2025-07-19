import React, { useEffect, useState } from 'react';
import { apiService } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { MessageSquare, BookOpen, ArrowUpRight } from 'lucide-react';

const TeacherDiscussionForumsPage: React.FC = () => {
  const { user } = useAuth();
  const [forums, setForums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchForums() {
      setLoading(true);
      setError(null);
      try {
        if (!user || !user.id) throw new Error('User not found');
        const courses = await apiService.getUserCourses(user.id);
        let allForums: any[] = [];
        for (const course of courses) {
          const contents = await apiService.getCourseContents(String(course.id));
          contents.forEach((section: any) => {
            (section.modules || []).forEach((mod: any) => {
              if (mod.modname === 'forum') {
                allForums.push({
                  ...mod,
                  courseName: course.fullname,
                });
              }
            });
          });
        }
        setForums(allForums);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch forums');
      } finally {
        setLoading(false);
      }
    }
    fetchForums();
  }, [user]);

  return (
    <div className="min-h-screen w-full bg-[#f9fafb] flex flex-col items-center justify-start py-12 px-2 md:px-8">
      <div className="w-full px-4">
        <div className="flex items-center gap-3 mb-8">
          <MessageSquare className="w-10 h-10 text-indigo-500" />
          <h1 className="text-3xl font-bold text-gray-900">Discussion Forums</h1>
        </div>
        <div className="bg-white rounded-3xl shadow-lg p-8 w-full">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Forums</h2>
          {loading ? (
            <div className="text-center text-gray-500 py-16 text-lg">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-16 text-lg">{error}</div>
          ) : forums.length === 0 ? (
            <div className="text-center text-gray-500 py-16 text-lg">No forums found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
              {forums.map((forum, idx) => (
                <div
                  key={forum.id + idx}
                  className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl shadow group p-6 flex flex-col h-56 min-w-0 max-h-56 justify-between border border-transparent hover:border-indigo-400 hover:shadow-2xl transition-all duration-200 cursor-pointer"
                  tabIndex={0}
                >
                  <div className="flex items-center gap-3 mb-4 w-full min-w-0">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-100 group-hover:bg-indigo-200 transition-all">
                      <MessageSquare className="w-6 h-6 text-indigo-500" />
                    </div>
                    <div className="flex-1 min-w-0 w-full">
                      <div className="font-semibold text-gray-900 text-base line-clamp-1 break-all min-w-0 w-full" title={forum.name}>{forum.name}</div>
                      <div className="flex flex-nowrap gap-2 mt-1 w-full overflow-hidden">
                        <span
                          className="inline-block bg-indigo-200 text-indigo-800 text-xs px-2 py-0.5 rounded-full font-medium max-w-[100px] truncate"
                          title={forum.courseName}
                        >
                          <BookOpen className="inline w-3 h-3 mr-1 align-text-bottom" /> {forum.courseName}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1" />
                  <div className="mt-2 text-xs text-gray-700 line-clamp-3 break-words" title={forum.description}>{forum.description || 'No description'}</div>
                  <div className="flex items-center justify-end mt-4">
                    {forum.url ? (
                      <a
                        href={forum.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-700 text-white text-xs font-semibold shadow hover:from-indigo-600 hover:to-indigo-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        title="Open forum in new tab"
                      >
                        View <ArrowUpRight className="w-4 h-4" />
                      </a>
                    ) : (
                      <button
                        className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-700 text-white text-xs font-semibold shadow hover:from-indigo-600 hover:to-indigo-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 opacity-60 cursor-not-allowed"
                        disabled
                        title="No forum URL available"
                      >
                        View <ArrowUpRight className="w-4 h-4" />
                      </button>
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

export default TeacherDiscussionForumsPage; 