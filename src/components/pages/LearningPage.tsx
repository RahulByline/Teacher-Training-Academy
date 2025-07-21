import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, TrendingUp, Award, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { Course } from '../../types';

const fallbackImage = '/images/default-course.jpg';

const LearningPage: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
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
  }, [user]);

  if (loading) {
    return <div className="text-center py-10">Loading your courses...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">My Learning</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <Link to={`/course/${course.id}/view`} key={course.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all">
            <div>
              <img 
                src={course.courseimage || fallbackImage} 
                alt={course.fullname} 
                className="w-full h-40 object-cover rounded-md mb-4" 
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = fallbackImage; }}
              />
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">{course.fullname}</h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${course.progress || 0}%` }}></div>
              </div>
              <p className="text-right text-sm text-gray-500 mt-1">{course.progress || 0}% Complete</p>
            </div>
            <div className="flex justify-end items-center mt-4 text-sm text-blue-600 font-semibold">
              <span>View Course &rarr;</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LearningPage;
