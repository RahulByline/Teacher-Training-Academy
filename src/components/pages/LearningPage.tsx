import React, { useEffect, useState } from 'react';
import { BookOpen, TrendingUp, Award, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';

const fallbackImage = '/images/default-course.jpg';

const LearningPage: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLearning() {
      if (user && user.id) {
        setLoading(true);
        setError(null);
        try {
          const fetchedCourses = await apiService.getUserCourses(user.id);
          setCourses(Array.isArray(fetchedCourses) ? fetchedCourses : []);
        } catch (err: any) {
          setError(err.message || 'Failed to fetch learning data');
        } finally {
          setLoading(false);
        }
      }
    }
    fetchLearning();
  }, [user && user.id]);

  // Recent Activity: completed courses
  const recentActivity = courses
    .filter((c) => c.progress === 100)
    .sort((a, b) => (b.enddate || 0) - (a.enddate || 0))
    .slice(0, 3);

  // Recommendations: not yet completed
  const recommendations = courses.filter((c) => (c.progress || 0) < 100).slice(0, 3);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-screen bg-[#f9fafb] p-8">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-8 h-8 text-indigo-500" />
        <h1 className="text-2xl font-bold text-gray-900">My Learning</h1>
      </div>
      <div className="w-full max-w-6xl">
        {loading ? (
          <div className="text-center text-gray-500 py-8">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : courses.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No courses found.</div>
        ) : (
          <>
            {/* Recommendations Section */}
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-semibold text-gray-800">Recommended for You</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {recommendations.length === 0 ? (
                  <div className="text-gray-500 col-span-full">No recommendations at this time.</div>
                ) : recommendations.map((course) => (
                  <div key={course.id} className="bg-white rounded-2xl shadow-md p-6 flex flex-col">
                    <div className="h-32 w-full flex items-center justify-center mb-4 bg-gray-100 rounded-xl overflow-hidden">
                      <img
                        src={course.courseimage || fallbackImage}
                        alt={course.fullname}
                        className="h-full w-auto max-w-full object-contain"
                        onError={e => (e.currentTarget.src = fallbackImage)}
                      />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">{course.fullname}</h3>
                    <p className="text-xs text-blue-600 mb-2">{course.shortname}</p>
                    {course.summary && (
                      <p className="text-xs text-gray-700 mb-2 line-clamp-2">{course.summary}</p>
                    )}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-indigo-500 h-2 rounded-full"
                        style={{ width: `${course.progress || 0}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 mb-2">{course.progress || 0}% complete</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-5 h-5 text-green-500" />
                <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {recentActivity.length === 0 ? (
                  <div className="text-gray-500 col-span-full">No recent completions.</div>
                ) : recentActivity.map((course) => (
                  <div key={course.id} className="bg-white rounded-2xl shadow-md p-6 flex flex-col">
                    <div className="h-32 w-full flex items-center justify-center mb-4 bg-gray-100 rounded-xl overflow-hidden">
                      <img
                        src={course.courseimage || fallbackImage}
                        alt={course.fullname}
                        className="h-full w-auto max-w-full object-contain"
                        onError={e => (e.currentTarget.src = fallbackImage)}
                      />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">{course.fullname}</h3>
                    <p className="text-xs text-blue-600 mb-2">{course.shortname}</p>
                    {course.summary && (
                      <p className="text-xs text-gray-700 mb-2 line-clamp-2">{course.summary}</p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <Clock className="w-3 h-3" />
                      {course.enddate ? `Completed on ${new Date(course.enddate * 1000).toLocaleDateString()}` : 'Completed'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* All Courses Section */}
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-indigo-500" />
                <h2 className="text-lg font-semibold text-gray-800">All My Courses</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course) => (
                  <div key={course.id} className="bg-white rounded-2xl shadow-md p-6 flex flex-col">
                    <div className="h-40 w-full flex items-center justify-center mb-4 bg-gray-100 rounded-xl overflow-hidden">
                      <img
                        src={course.courseimage || fallbackImage}
                        alt={course.fullname}
                        className="h-full w-auto max-w-full object-contain"
                        onError={e => (e.currentTarget.src = fallbackImage)}
                      />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 mb-1">{course.fullname}</h2>
                    <p className="text-sm text-blue-600 mb-2">{course.shortname}</p>
                    {course.summary && (
                      <p className="text-sm text-gray-700 mb-2 line-clamp-3">{course.summary}</p>
                    )}
                    {course.instructor && (
                      <p className="text-xs text-gray-500 mb-2">Instructor: {course.instructor}</p>
                    )}
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                      <div
                        className="bg-indigo-500 h-3 rounded-full"
                        style={{ width: `${course.progress || 0}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 mb-2">{course.progress || 0}% complete</span>
                    {course.startdate && (
                      <span className="text-xs text-gray-400">Start: {new Date(course.startdate * 1000).toLocaleDateString()}</span>
                    )}
                    {course.enddate && (
                      <span className="text-xs text-gray-400 ml-2">End: {new Date(course.enddate * 1000).toLocaleDateString()}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LearningPage;
