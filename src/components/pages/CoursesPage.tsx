import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { BookOpen, Eye, Star } from 'lucide-react';
import { Course } from '../../types';

const mockCourses = [
  { id: '1', title: 'Digital Learning Basics', progress: 100, enrolled: 28, rating: 4.8, summary: 'Intro to digital learning tools.' },
  { id: '2', title: 'Assessment Design', progress: 75, enrolled: 18, rating: 4.7, summary: 'Designing effective assessments.' },
  { id: '3', title: 'Classroom Management', progress: 50, enrolled: 24, rating: 4.6, summary: 'Managing classrooms efficiently.' },
  { id: '4', title: 'Mentoring', progress: 30, enrolled: 12, rating: 4.9, summary: 'Mentoring new teachers.' },
];

export default function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.id) {
      setLoading(true);
      setError(null);
      apiService.getUserCourses(user.id)
        .then(setCourses)
        .catch((err) => setError(err.message || 'Failed to fetch courses'))
        .finally(() => setLoading(false));
    }
  }, [user && user.id]);

  const coursesToShow = courses.length
    ? courses.map((c) => ({
        id: c.id,
        title: c.fullname,
        progress: c.progress || 0,
        enrolled: c.enrollmentCount || 0,
        rating: c.rating || 4.8,
        summary: c.summary || '',
      }))
    : mockCourses;

  return (
    <div className="flex flex-col w-full h-full min-h-screen min-w-screen bg-[#f9fafb] p-8">
      <h1 className="text-2xl font-bold mb-6">My Courses</h1>
      <div className="bg-white rounded-2xl shadow-md p-6 w-full h-full">
        {loading ? (
          <div className="text-center text-gray-500 py-8">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coursesToShow.map((course) => (
              <div key={course.id} className="border border-gray-200 rounded-lg p-6 bg-white flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">{course.title}</h4>
                  <button className="p-1 text-gray-600 hover:text-blue-600">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-4">{course.summary || 'No description available'}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Enrolled:</span>
                    <span className="font-medium">{course.enrolled}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Progress:</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating:</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{course.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 