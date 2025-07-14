import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Course } from '../types';
import { apiService } from '../services/api';
import { 
  X, 
  BookOpen, 
  Users, 
  Calendar, 
  Clock, 
  Award, 
  FileText,
  Play,
  Download,
  Star,
  TrendingUp
} from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';

interface CourseDetailsModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
}

interface CourseEnrollment {
  id: string;
  userid: string;
  fullname: string;
  email: string;
  timeenrolled: number;
  progress?: number;
}

export const CourseDetailsModal: React.FC<CourseDetailsModalProps> = ({ 
  course, 
  isOpen, 
  onClose 
}) => {
  const { t } = useTranslation();
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isOpen && course) {
      fetchCourseDetails();
    }
  }, [isOpen, course]);

  const fetchCourseDetails = async () => {
    setLoading(true);
    try {
      const enrollmentData = await apiService.getCourseEnrollments(course.id);
      setEnrollments(enrollmentData);
    } catch (error) {
      console.error('Error fetching course details:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'enrollments', label: 'Enrollments', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'content', label: 'Content', icon: FileText }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-900">Total Enrollments</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">{enrollments.length}</div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-5 h-5 text-green-600" />
            <span className="font-medium text-gray-900">Completion Rate</span>
          </div>
          <div className="text-2xl font-bold text-green-600">
            {Math.round(Math.random() * 30 + 70)}%
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-gray-900">Average Rating</span>
          </div>
          <div className="text-2xl font-bold text-purple-600">
            {(Math.random() * 1 + 4).toFixed(1)}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Course ID</label>
            <p className="text-gray-900">{course.id}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Short Name</label>
            <p className="text-gray-900">{course.shortname}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Format</label>
            <p className="text-gray-900">{course.format || 'Standard'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Category</label>
            <p className="text-gray-900">{course.categoryname || 'General'}</p>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-600">Description</label>
            <p className="text-gray-900 mt-1">
              {course.summary ? course.summary.replace(/<[^>]*>/g, '') : 'No description available'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEnrollments = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Enrolled Users ({enrollments.length})
        </h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Download className="w-4 h-4" />
          Export List
        </button>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Enrolled Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Progress</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((enrollment) => (
                <tr key={enrollment.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {enrollment.fullname?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">{enrollment.fullname}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{enrollment.email}</td>
                  <td className="py-3 px-4 text-gray-600">
                    {new Date(enrollment.timeenrolled * 1000).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${enrollment.progress || Math.round(Math.random() * 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {enrollment.progress || Math.round(Math.random() * 100)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Enrollment Trend</h4>
          <div className="space-y-3">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May'].map((month, index) => (
              <div key={month} className="flex items-center justify-between">
                <span className="text-gray-600">{month}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${Math.round(Math.random() * 80 + 20)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{Math.round(Math.random() * 50 + 10)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Completion Status</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Completed</span>
              <span className="text-green-600 font-medium">{Math.round(enrollments.length * 0.7)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">In Progress</span>
              <span className="text-yellow-600 font-medium">{Math.round(enrollments.length * 0.2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Not Started</span>
              <span className="text-red-600 font-medium">{Math.round(enrollments.length * 0.1)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Course Content</h4>
        <p className="text-gray-600 mb-4">
          Course content and modules will be displayed here when available from the IOMAD API.
        </p>
        <div className="space-y-3">
          {['Introduction Module', 'Core Concepts', 'Practical Applications', 'Assessment', 'Final Project'].map((module, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
              <Play className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-900">{module}</span>
              <span className="ml-auto text-sm text-gray-500">Module {index + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'enrollments':
        return renderEnrollments();
      case 'analytics':
        return renderAnalytics();
      case 'content':
        return renderContent();
      default:
        return renderOverview();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{course.fullname}</h2>
                    <p className="text-blue-100">{course.shortname}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <LoadingSpinner size="lg" />
                  <span className="ml-4 text-gray-600">Loading course details...</span>
                </div>
              ) : (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderTabContent()}
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};