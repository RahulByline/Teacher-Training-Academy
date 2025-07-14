import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';
import { Course } from '../../types';
import { BookOpen, Clock, Users, Tag, ChevronRight, Star, Calendar } from 'lucide-react';
import { LoadingSpinner } from '../LoadingSpinner';
import { Button } from '../ui/Button';

export const CoursesSection: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Courses' },
    { id: 'teaching', name: 'Teaching Skills' },
    { id: 'assessment', name: 'Assessment' },
    { id: 'leadership', name: 'Leadership' },
    { id: 'technology', name: 'Technology' }
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('https://iomad.bylinelms.com/webservice/rest/server.php', {
          params: {
            wstoken: '4a2ba2d6742afc7d13ce4cf486ba7633',
            wsfunction: 'core_course_get_courses',
            moodlewsrestformat: 'json',
          },
        });

        if (response.data && Array.isArray(response.data)) {
          // Filter only visible courses and map to our Course interface
          const mappedCourses = response.data
            .filter((course: any) => course.visible !== 0) // Only visible courses
            .map((course: any) => ({
              id: course.id.toString(),
              fullname: course.fullname,
              shortname: course.shortname,
              summary: course.summary || '',
              categoryid: course.categoryid || course.category,
              courseimage: course.overviewfiles?.[0]?.fileurl || course.courseimage,
              categoryname: course.categoryname || 'General',
              format: course.format || 'topics',
              startdate: course.startdate,
              enddate: course.enddate,
              visible: course.visible,
              type: ['ILT', 'VILT', 'Self-paced'][Math.floor(Math.random() * 3)] as 'ILT' | 'VILT' | 'Self-paced',
              tags: ['Professional Development', 'Teaching Skills', 'Assessment'],
              enrollmentCount: Math.floor(Math.random() * 500) + 50, // Will be replaced with real data
              rating: Number((Math.random() * 1 + 4).toFixed(1)), // Will be replaced with real data
              level: ['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)] as 'Beginner' | 'Intermediate' | 'Advanced',
              duration: course.startdate && course.enddate ? 
                `${Math.ceil((course.enddate - course.startdate) / (7 * 24 * 60 * 60))} weeks` : 
                `${Math.floor(Math.random() * 8) + 4} weeks`
            }));
          
          setCourses(mappedCourses);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Course fetch failed:', error);
        setError('Failed to fetch courses from IOMAD API');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => {
    if (selectedCategory === 'all') return true;
    return course.categoryname?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
           course.fullname.toLowerCase().includes(selectedCategory.toLowerCase()) ||
           course.summary?.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ILT': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'VILT': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Self-paced': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const stripHtmlTags = (html: string) => {
    return html.replace(/<[^>]*>/g, '').trim();
  };

  return (
    <section id="courses" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className={`text-center mb-16 ${isRTL ? 'text-right' : 'text-left'}`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {t('coursesTitle')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover our comprehensive training programs - {courses.length} courses available
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-600 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              {category.name}
            </button>
          ))}
        </motion.div>

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
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" />
            <span className="ml-4 text-gray-600 dark:text-gray-300">Loading courses...</span>
          </div>
        )}

        {/* Courses Grid */}
        {!loading && !error && (
          <>
            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.slice(0, 6).map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="bg-white dark:bg-gray-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
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
                      
                      {/* Course Type Badge */}
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(course.type || 'Self-paced')}`}>
                          {course.type || 'Self-paced'}
                        </span>
                      </div>

                      {/* Rating Badge */}
                      {course.rating && (
                        <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full px-2 py-1 flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-xs font-medium text-gray-800">{course.rating}</span>
                        </div>
                      )}
                    </div>

                    {/* Course Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {course.fullname}
                      </h3>
                      
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
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                          <Tag className="w-3 h-3" />
                          {course.categoryname}
                        </span>
                        {course.level && (
                          <span className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs rounded-full">
                            {course.level}
                          </span>
                        )}
                      </div>

                      {/* Course Meta */}
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
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

                      {/* Course Dates */}
                      {(course.startdate || course.enddate) && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
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

                      {/* Action Button */}
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                        <span>View Details</span>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No courses found
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {selectedCategory === 'all' 
                    ? 'No courses are currently available.' 
                    : 'No courses found in this category. Try selecting a different category.'
                  }
                </p>
              </div>
            )}

            {/* View All Button */}
            {filteredCourses.length > 6 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-center mt-12"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-600"
                >
                  View All {courses.length} Courses
                </Button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
};