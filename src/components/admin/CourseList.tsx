import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Edit, 
  Trash2, 
  Move, 
  Eye, 
  Calendar,
  Users,
  Clock,
  MoreVertical
} from 'lucide-react';
import { Button } from '../ui/Button';
import { toast } from '../ui/Toaster';

interface Course {
  id: number;
  fullname: string;
  shortname: string;
  summary: string;
  categoryid: number;
  visible: number;
  startdate: number;
  enddate: number;
  format: string;
}

interface Category {
  id: number;
  name: string;
}

interface CourseListProps {
  courses: Course[];
  selectedCategory: Category;
  onCourseUpdate: () => void;
}

export const CourseList: React.FC<CourseListProps> = ({
  courses,
  selectedCategory,
  onCourseUpdate
}) => {
  const [hoveredCourse, setHoveredCourse] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'format'>('name');
  const [selectedCourses, setSelectedCourses] = useState<Set<number>>(new Set());

  const handleEdit = (course: Course, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info(`Edit course: ${course.fullname}`);
    // TODO: Implement edit functionality
  };

  const handleDelete = (course: Course, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${course.fullname}"?`)) {
      toast.info(`Delete course: ${course.fullname}`);
      // TODO: Implement delete functionality
    }
  };

  const handleMove = (course: Course, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info(`Move course: ${course.fullname}`);
    // TODO: Implement move functionality
  };

  const handleView = (course: Course) => {
    toast.info(`View course: ${course.fullname}`);
    // TODO: Implement view functionality
  };

  const toggleCourseSelection = (courseId: number) => {
    const newSelected = new Set(selectedCourses);
    if (newSelected.has(courseId)) {
      newSelected.delete(courseId);
    } else {
      newSelected.add(courseId);
    }
    setSelectedCourses(newSelected);
  };

  const formatDate = (timestamp: number) => {
    if (!timestamp) return 'Not set';
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '').trim();
  };

  const sortedCourses = [...courses].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.fullname.localeCompare(b.fullname);
      case 'date':
        return (b.startdate || 0) - (a.startdate || 0);
      case 'format':
        return a.format.localeCompare(b.format);
      default:
        return 0;
    }
  });

  return (
    <div className="h-full flex flex-col">
      {/* Controls */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Sort by:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="name">Name</option>
                <option value="date">Start Date</option>
                <option value="format">Format</option>
              </select>
            </div>
            
            {selectedCourses.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedCourses.size} selected
                </span>
                <Button size="sm" variant="outline">
                  <Move className="w-4 h-4" />
                  Move Selected
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Course List */}
      <div className="flex-1 overflow-y-auto">
        {courses.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Courses Found
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                This category doesn't have any courses yet.
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {sortedCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`group relative cursor-pointer transition-all duration-200 ${
                  selectedCourses.has(course.id)
                    ? 'bg-blue-50 dark:bg-blue-900/30'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                onClick={() => handleView(course)}
                onMouseEnter={() => setHoveredCourse(course.id)}
                onMouseLeave={() => setHoveredCourse(null)}
              >
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Selection Checkbox */}
                    <div className="flex items-center pt-1">
                      <input
                        type="checkbox"
                        checked={selectedCourses.has(course.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleCourseSelection(course.id);
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>

                    {/* Course Icon */}
                    <div className="flex-shrink-0 pt-1">
                      <BookOpen className="w-5 h-5 text-blue-500" />
                    </div>

                    {/* Course Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {course.fullname}
                          </h3>
                          <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
                            {course.shortname}
                          </p>
                          
                          {course.summary && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                              {stripHtml(course.summary).substring(0, 150)}
                              {stripHtml(course.summary).length > 150 ? '...' : ''}
                            </p>
                          )}

                          {/* Course Meta */}
                          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>Start: {formatDate(course.startdate)}</span>
                            </div>
                            {course.enddate && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>End: {formatDate(course.enddate)}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                                {course.format}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                course.visible 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                              }`}>
                                {course.visible ? 'Visible' : 'Hidden'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className={`flex items-center gap-1 transition-opacity duration-200 ${
                          hoveredCourse === course.id || selectedCourses.has(course.id) 
                            ? 'opacity-100' 
                            : 'opacity-0'
                        }`}>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleView(course);
                            }}
                            className="p-1 h-auto"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => handleEdit(course, e)}
                            className="p-1 h-auto"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => handleMove(course, e)}
                            className="p-1 h-auto"
                          >
                            <Move className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => handleDelete(course, e)}
                            className="p-1 h-auto text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};