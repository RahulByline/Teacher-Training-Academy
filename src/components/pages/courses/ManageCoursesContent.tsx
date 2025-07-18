import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { coursesService } from '../../../services/coursesService';
import { Button } from '../../ui/Button';
import { BookOpen, ChevronRight, ChevronDown, ChevronUp, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Course {
  id: string;
  fullname: string;
  shortname?: string;
  summary?: string;
  categoryid: string;
  categoryname?: string;
  courseimage?: string;
}

interface Category {
  id: string;
  name: string;
}

const ManageCoursesContent: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      coursesService.getAllCourses(),
      coursesService.getAllCategories()
    ])
      .then(([coursesData, categoriesData]) => {
        setCourses(coursesData.map((c: any) => ({ ...c, id: String(c.id), categoryid: String(c.categoryid) })));
        setCategories(categoriesData.map((cat: any) => ({ id: String(cat.id), name: cat.name })));
      })
      .catch(() => setError('Failed to load courses or categories.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center items-center min-h-96 text-lg">Loading courses...</div>;
  if (error) return <div className="flex justify-center items-center min-h-96 text-red-600 text-lg">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <BookOpen className="w-7 h-7 text-blue-600" /> Manage Courses Content
      </h1>
      <div className="space-y-4">
        {categories.map(category => {
          const categoryCourses = courses.filter(c => c.categoryid === category.id);
          return (
            <motion.div key={category.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <button
                className="w-full flex items-center justify-between px-6 py-4 text-lg font-semibold text-left text-gray-900 dark:text-white focus:outline-none"
                onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
              >
                <span>{category.name} <span className="ml-2 text-sm font-normal text-gray-500">({categoryCourses.length})</span></span>
                {expandedCategory === category.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              <AnimatePresence initial={false}>
                {expandedCategory === category.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-4"
                  >
                    {categoryCourses.length === 0 ? (
                      <div className="text-gray-500 py-4">No courses in this category.</div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {categoryCourses.map(course => (
                          <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 flex flex-col justify-between shadow"
                          >
                            <div className="flex items-center gap-4 mb-2">
                              {course.courseimage ? (
                                <img
                                  src={course.courseimage}
                                  alt={course.fullname}
                                  className="w-14 h-14 rounded-lg object-cover border"
                                  onError={e => { (e.currentTarget as HTMLImageElement).src = '/images/default-course.jpg'; }}
                                />
                              ) : (
                                <div className="w-14 h-14 rounded-lg bg-gray-200 flex items-center justify-center">
                                  <ImageIcon className="w-7 h-7 text-gray-400" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 truncate">{course.fullname}</h2>
                                {course.shortname && <div className="text-xs text-gray-500 mb-1">{course.shortname}</div>}
                                {course.summary && <div className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">{course.summary}</div>}
                              </div>
                            </div>
                            <Button
                              variant="primary"
                              size="md"
                              className="mt-2 flex items-center gap-2"
                              onClick={() => {
                                console.log('Navigating to manage content for course:', course);
                                if (course.id && course.id !== 'undefined' && course.id !== '') {
                                  navigate(`/courses-categories/manage-content/${course.id}`);
                                } else {
                                  alert('Invalid course ID. Cannot navigate to manage content.');
                                }
                              }}
                            >
                              Manage Content <ChevronRight className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ManageCoursesContent; 