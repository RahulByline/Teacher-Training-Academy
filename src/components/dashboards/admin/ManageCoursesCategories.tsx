import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Plus, 
  Users, 
  Settings, 
  Building, 
  UserPlus,
  MapPin,
  Route,
  BarChart3,
  Search,
  Filter,
  RefreshCw,
  TrendingUp,
  Award,
  Target,
  Layers,
  ChevronRight,
  Eye
} from 'lucide-react';
import { LoadingSpinner } from '../../LoadingSpinner';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { coursesService } from '../../../services/coursesService';

interface CourseFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  route: string;
  color: string;
  count?: number;
  isActive?: boolean;
  subtitle?: string;
}

export const ManageCoursesCategories: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalCategories: 0,
    totalEnrollments: 0,
    activeLearningPaths: 0
  });

  const courseFeatures: CourseFeature[] = [
    {
      id: 'create-category',
      title: 'Create Course / Category',
      description: 'Add new courses and organize them into categories',
      subtitle: 'Course Management',
      icon: Plus,
      route: '/add-category',
      color: 'from-green-500 to-emerald-600',
      count: stats.totalCategories,
      isActive: true
    },
    {
      id: 'user-enrolments',
      title: 'User Enrolments',
      description: 'Manage student enrollments and track progress',
      subtitle: 'Enrollment Management',
      icon: Users,
      route: '/courses-categories/user-enrolments',
      color: 'from-blue-500 to-cyan-600',
      count: stats.totalEnrollments,
      isActive: true
    },
    {
      id: 'iomad-settings',
      title: 'Manage IOMAD Course Settings',
      description: 'Configure advanced course settings and parameters',
      subtitle: 'Course Configuration',
      icon: Settings,
      route: '/courses-categories/iomad-settings',
      color: 'from-purple-500 to-violet-600',
      isActive: true
    },
    {
      id: 'assign-to-school',
      title: 'Assign to School',
      description: 'Assign courses to specific schools and institutions',
      subtitle: 'School Assignment',
      icon: Building,
      route: '/courses-categories/assign-to-school',
      color: 'from-orange-500 to-red-600',
      isActive: true
    },
    {
      id: 'school-groups',
      title: 'Manage School Groups',
      description: 'Create and manage groups within schools',
      subtitle: 'Group Management',
      icon: UserPlus,
      route: '/courses-categories/school-groups',
      color: 'from-teal-500 to-cyan-600',
      isActive: true
    },
    {
      id: 'assign-course-groups',
      title: 'Assign Course Groups',
      description: 'Assign courses to specific user groups',
      subtitle: 'Group Assignment',
      icon: Layers,
      route: '/courses-categories/assign-course-groups',
      color: 'from-indigo-500 to-purple-600',
      isActive: true
    },
    {
      id: 'teaching-locations',
      title: 'Teaching Locations',
      description: 'Manage physical and virtual teaching locations',
      subtitle: 'Location Management',
      icon: MapPin,
      route: '/courses-categories/teaching-locations',
      color: 'from-pink-500 to-rose-600',
      isActive: true
    },
    {
      id: 'learning-paths',
      title: 'Learning Paths',
      description: 'Create structured learning journeys and pathways',
      subtitle: 'Path Management',
      icon: Route,
      route: '/courses-categories/learning-paths',
      color: 'from-yellow-500 to-orange-600',
      count: stats.activeLearningPaths,
      isActive: true
    }
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [coursesData, categoriesData] = await Promise.all([
        coursesService.getAllCourses(),
        coursesService.getAllCategories()
      ]);

      setStats({
        totalCourses: coursesData.length,
        totalCategories: categoriesData.length,
        totalEnrollments: Math.floor(Math.random() * 5000) + 1000, // Mock data
        activeLearningPaths: Math.floor(Math.random() * 50) + 10 // Mock data
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set mock data on error
      setStats({
        totalCourses: 125,
        totalCategories: 15,
        totalEnrollments: 2847,
        activeLearningPaths: 23
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureClick = (feature: CourseFeature) => {
    if (feature.isActive) {
      navigate(feature.route);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
        <span className="ml-4 text-gray-600 dark:text-gray-300">Loading courses data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Courses & Categories Management
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Comprehensive course administration and learning management tools
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={fetchDashboardData} variant="outline">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button onClick={() => navigate('/add-category')}>
            <Plus className="w-4 h-4" />
            Quick Add
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Courses</p>
              <p className="text-3xl font-bold">{stats.totalCourses}</p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Categories</p>
              <p className="text-3xl font-bold">{stats.totalCategories}</p>
            </div>
            <Layers className="w-8 h-8 text-green-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Enrollments</p>
              <p className="text-3xl font-bold">{stats.totalEnrollments.toLocaleString()}</p>
            </div>
            <Users className="w-8 h-8 text-purple-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Learning Paths</p>
              <p className="text-3xl font-bold">{stats.activeLearningPaths}</p>
            </div>
            <Route className="w-8 h-8 text-orange-200" />
          </div>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {courseFeatures.map((feature, index) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            onClick={() => handleFeatureClick(feature)}
            className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group ${
              !feature.isActive ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {/* Gradient Header */}
            <div className={`h-3 bg-gradient-to-r ${feature.color}`}></div>
            
            <div className="p-6">
              {/* Icon and Title */}
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200 flex-shrink-0`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                    {feature.title}
                  </h3>
                  {feature.subtitle && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {feature.subtitle}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-2">
                {feature.description}
              </p>

              {/* Count and Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {feature.count !== undefined && (
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {feature.count.toLocaleString()}
                    </span>
                  )}
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    feature.isActive 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {feature.isActive ? 'Available' : 'Coming Soon'}
                  </span>
                </div>
                <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      >
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <Target className="w-6 h-6 text-blue-600" />
          Quick Actions
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={() => navigate('/add-category')}
            className="bg-gradient-to-r from-green-500 to-emerald-600 justify-start h-auto p-4"
          >
            <div className="flex items-center gap-3">
              <Plus className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold">Create New</div>
                <div className="text-xs opacity-90">Add course or category</div>
              </div>
            </div>
          </Button>
          
          <Button
            onClick={() => navigate('/courses-categories/user-enrolments')}
            variant="outline"
            className="justify-start h-auto p-4"
          >
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold">Manage Enrollments</div>
                <div className="text-xs opacity-70">View and edit enrollments</div>
              </div>
            </div>
          </Button>
          
          <Button
            onClick={() => navigate('/courses-categories/learning-paths')}
            variant="outline"
            className="justify-start h-auto p-4"
          >
            <div className="flex items-center gap-3">
              <Route className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold">Learning Paths</div>
                <div className="text-xs opacity-70">Create learning journeys</div>
              </div>
            </div>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};