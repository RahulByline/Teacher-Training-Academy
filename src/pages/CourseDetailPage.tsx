import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';
import { Course } from '../types';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Button } from '../components/ui/Button';
import { 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  Users, 
  Award, 
  Play,
  Download,
  Star,
  Calendar
} from 'lucide-react';

export const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      
      try {
        const courses = await apiService.getAllCourses();
        const foundCourse = courses.find(c => c.id === id);
        setCourse(foundCourse || null);
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-96">
          <LoadingSpinner size="lg" />
          <span className="ml-4 text-gray-600 dark:text-gray-300">Loading course...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Course Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The course you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/courses')}>
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/courses')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Courses
        </Button>

        {/* Course Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl font-bold mb-4"
              >
                {course.fullname}
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-blue-100 mb-6"
              >
                {course.shortname}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-4 mb-6"
              >
                <div className="flex items-center gap-2 bg-white bg-opacity-20 rounded-full px-4 py-2">
                  <Clock className="w-4 h-4" />
                  <span>8 weeks</span>
                </div>
                <div className="flex items-center gap-2 bg-white bg-opacity-20 rounded-full px-4 py-2">
                  <Users className="w-4 h-4" />
                  <span>150 enrolled</span>
                </div>
                <div className="flex items-center gap-2 bg-white bg-opacity-20 rounded-full px-4 py-2">
                  <Star className="w-4 h-4" />
                  <span>4.8 rating</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex gap-4"
              >
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Play className="w-5 h-5" />
                  Start Course
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <Download className="w-5 h-5" />
                  Download Syllabus
                </Button>
              </motion.div>
            </div>

            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="relative h-64 bg-white bg-opacity-20 rounded-2xl overflow-hidden"
              >
                {course.courseimage ? (
                  <img
                    src={course.courseimage}
                    alt={course.fullname}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <BookOpen className="w-24 h-24 text-white opacity-60" />
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Course Description
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                {course.summary ? (
                  <div dangerouslySetInnerHTML={{ __html: course.summary }} />
                ) : (
                  <p className="text-gray-600 dark:text-gray-300">
                    This comprehensive course is designed to enhance your professional skills and knowledge in the field of education. Through interactive sessions, practical exercises, and expert guidance, you'll develop the competencies needed to excel in your teaching career.
                  </p>
                )}
              </div>
            </motion.div>

            {/* Course Modules */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Course Modules
              </h2>
              <div className="space-y-4">
                {[
                  'Introduction to Modern Teaching Methods',
                  'Classroom Management Strategies',
                  'Assessment and Evaluation Techniques',
                  'Technology Integration in Education',
                  'Student Engagement and Motivation',
                  'Professional Development Planning'
                ].map((module, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {module}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Duration: 1-2 weeks
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Course Information
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Duration:</span>
                  <span className="font-medium text-gray-900 dark:text-white">8 weeks</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Format:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{course.format || 'Mixed'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Level:</span>
                  <span className="font-medium text-gray-900 dark:text-white">Intermediate</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Language:</span>
                  <span className="font-medium text-gray-900 dark:text-white">English/Arabic</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Certificate:</span>
                  <span className="font-medium text-gray-900 dark:text-white">Yes</span>
                </div>
              </div>
            </motion.div>

            {/* Instructor */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Instructor
              </h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">DR</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Dr. Sarah Ahmed
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Education Specialist
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Prerequisites */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Prerequisites
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• Basic teaching experience</li>
                <li>• Computer literacy</li>
                <li>• English proficiency</li>
                <li>• Commitment to complete the course</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};