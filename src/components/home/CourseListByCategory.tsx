import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star, 
  ChevronRight, 
  ArrowLeft,
  Calendar,
  Tag,
  Play,
  Award
} from 'lucide-react';
import { LoadingSpinner } from '../LoadingSpinner';
import { Course } from '../../types';

interface CourseListByCategoryProps {
  categoryId: string;
  categoryName: string;
  onBack: () => void;
}

export const CourseListByCategory: React.FC<CourseListByCategoryProps> = ({
  categoryId,
  categoryName,
  onBack
}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    const fetchCoursesByCategory = async () => {
      setLoading(true);
      setError(null);
      try {
        let response;
        
        if (categoryId === 'all') {
          // Fetch all courses
          response = await axios.get('https://iomad.bylinelms.com/webservice/rest/server.php', {
            params: {
              wstoken: '4a2ba2d6742afc7d13ce4cf486ba7633',
              wsfunction: 'core_course_get_courses',
              moodlewsrestformat: 'json',
            },
          });
        } else {
          // Fetch courses by specific category
          response = await axios.get('https://iomad.bylinelms.com/webservice/rest/server.php', {
            params: {
              wstoken: '4a2ba2d6742afc7d13ce4cf486ba7633',
              wsfunction: 'core_course_get_courses_by_field',
              field: 'category',
              value: categoryId,
              moodlewsrestformat: 'json',
            },
          });
        }

        // FIX: Use response.data.courses
        if (response.data && Array.isArray(response.data.courses)) {
          const mappedCourses = response.data.courses
            .filter((course: any) => course.visible !== 0)
            .map((course: any) => ({
              id: course.id.toString(),
              fullname: course.fullname,
              shortname: course.shortname,
              summary: course.summary || '',
              courseimage: course.overviewfiles?.[0]?.fileurl || course.courseimage,
              categoryname: course.categoryname || 'General',
              format: course.format || 'topics',
              startdate: course.startdate,
              enddate: course.enddate,
              visible: course.visible,
              type: ['ILT', 'VILT', 'Self-paced'][Math.floor(Math.random() * 3)] as 'ILT' | 'VILT' | 'Self-paced',
              tags: ['Professional Development', 'Teaching Skills', 'Assessment'],
              enrollmentCount: Math.floor(Math.random() * 500) + 50,
              rating: Number((Math.random() * 1 + 4).toFixed(1)),
              level: ['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)] as 'Beginner' | 'Intermediate' | 'Advanced',
              duration: `${Math.floor(Math.random() * 8) + 4} weeks`,
              instructor: `Dr. ${['Sarah Ahmed', 'Mohammed Ali', 'Fatima Hassan', 'Ahmed Khan'][Math.floor(Math.random() * 4)]}`
            }));
          
          setCourses(mappedCourses);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching courses by category:', error);
        setError('Failed to fetch courses for this category');
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesByCategory();
  }, [categoryId]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ILT': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'VILT': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Self-paced': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const stripHtmlTags = (html: string) => {
    return html.replace(/<[^>]*>/g, '').trim();
  };

  return (
    <div className="space-y-8">
      {/* Header with Back Button */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm border border-gray-200 dark:border-gray-600"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back to Categories</span>
          </button>
          
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {categoryName}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {loading ? 'Loading...' : `${courses.length} courses available`}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="lg" />
          <span className="ml-4 text-gray-600 dark:text-gray-300">Loading courses...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-20">
          <div className="text-red-500 mb-4">
            <BookOpen className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Unable to Load Courses
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {error}. Please try again later.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Courses Grid */}
      {!loading && !error && (
        <>
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  {/* Course Image */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
                    {course.courseimage ? (
                      <img
                        src={`${course.courseimage}?token=4a2ba2d6742afc7d13ce4cf486ba7633`}
                        alt={course.fullname}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.parentElement?.querySelector('.fallback-icon');
                          if (fallback) fallback.classList.remove('hidden');
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-white opacity-80" />
                      </div>
                    )}
                    
                    {course.courseimage && (
                      <div className="fallback-icon hidden absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                        <BookOpen className="w-16 h-16 text-white opacity-80" />
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(course.type || 'Self-paced')}`}>
                        {course.type || 'Self-paced'}
                      </span>
                      {course.level && (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                          {course.level}
                        </span>
                      )}
                    </div>

                    {/* Rating */}
                    {course.rating && (
                      <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full px-2 py-1 flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs font-medium text-gray-800">{course.rating}</span>
                      </div>
                    )}

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-6">
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {course.fullname}
                    </h4>
                    
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-3">
                      {course.shortname}
                    </p>
                    
                    {course.summary && (
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                        {stripHtmlTags(course.summary).substring(0, 120)}
                        {stripHtmlTags(course.summary).length > 120 ? '...' : ''}
                      </p>
                    )}

                    {/* Course Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                        <Tag className="w-3 h-3" />
                        {course.categoryname}
                      </span>
                    </div>

                    {/* Course Meta */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-4">
                          {course.duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {course.duration}
                            </span>
                          )}
                          {course.enrollmentCount && (
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {course.enrollmentCount}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Instructor */}
                      {course.instructor && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <Award className="w-4 h-4" />
                          <span>Instructor: {course.instructor}</span>
                        </div>
                      )}

                      {/* Course Dates */}
                      {(course.startdate || course.enddate) && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <Calendar className="w-3 h-3" />
                          {course.startdate && (
                            <span>
                              Starts: {new Date(course.startdate * 1000).toLocaleDateString()}
                            </span>
                          )}
                          {course.startdate && course.enddate && <span>•</span>}
                          {course.enddate && (
                            <span>
                              Ends: {new Date(course.enddate * 1000).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group">
                      <span>View Course Details</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Courses Found
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                No courses are available in this category at the moment.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};