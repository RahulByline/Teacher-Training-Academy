import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { Course, User } from '../../types';
import { 
  Home,
  TrendingUp,
  Users,
  Brain,
  FileText,
  Target,
  MessageSquare,
  Briefcase,
  Smartphone,
  BarChart3,
  BookOpen,
  Award,
  Activity,
  Eye,
  Download,
  Search,
  Filter,
  ChevronRight,
  Building
} from 'lucide-react';
import { LoadingSpinner } from '../LoadingSpinner';
import { CourseDetailsModal } from '../CourseDetailsModal';
import { AIAnalyticsDashboard } from './AIAnalyticsDashboard';
import { ManageSchools } from './admin/ManageSchools';
import { ManageCoursesCategories } from './admin/ManageCoursesCategories';

interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  activeUsers: number;
  completionRate: number;
  totalEnrollments: number;
  certificatesIssued: number;
}

export const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalCourses: 0,
    activeUsers: 0,
    completionRate: 0,
    totalEnrollments: 0,
    certificatesIssued: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAIDashboard, setShowAIDashboard] = useState(false);

  const sidebarItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', labelAr: 'لوحة التحكم' },
    { id: 'schools', icon: Building, label: 'Schools Management', labelAr: 'إدارة المدارس' },
    { id: 'courses-categories', icon: BookOpen, label: 'Courses & Categories', labelAr: 'الدورات والفئات' },
    { id: 'training-completion', icon: TrendingUp, label: 'Training Completion', labelAr: 'إكمال التدريب' },
    { id: 'leadership-growth', icon: Users, label: 'Leadership Growth', labelAr: 'نمو القيادة' },
    { id: 'behavioral-insights', icon: Brain, label: 'Behavioral Insights', labelAr: 'رؤى سلوكية' },
    { id: 'cognitive-reports', icon: FileText, label: 'Cognitive Reports', labelAr: 'التقارير المعرفية' },
    { id: 'teaching-effectiveness', icon: Target, label: 'Teaching Effectiveness', labelAr: 'فعالية التدريس' },
    { id: 'collaboration-engagement', icon: MessageSquare, label: 'Collaboration Engagement', labelAr: 'مشاركة التعاون' },
    { id: 'work-satisfaction', icon: Briefcase, label: 'Work Satisfaction', labelAr: 'رضا العمل' },
    { id: 'platform-adoption', icon: Smartphone, label: 'Platform Adoption', labelAr: 'اعتماد المنصة' },
    { id: 'ai-analytics', icon: Brain, label: 'AI Analytics Dashboard', labelAr: 'لوحة تحكم الذكاء الاصطناعي' }
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [coursesData, usersData] = await Promise.all([
        apiService.getAllCourses(),
        apiService.getAllUsers()
      ]);

      setCourses(coursesData);
      setUsers(usersData);

      // Calculate stats
      const totalEnrollments = await Promise.all(
        coursesData.map(course => apiService.getCourseEnrollments(course.id))
      );
      
      const enrollmentCount = totalEnrollments.reduce((sum, enrollments) => sum + enrollments.length, 0);
      
      setStats({
        totalUsers: usersData.length,
        totalCourses: coursesData.length,
        activeUsers: usersData.filter(u => u.lastaccess && Date.now() - u.lastaccess * 1000 < 30 * 24 * 60 * 60 * 1000).length,
        completionRate: Math.round(Math.random() * 30 + 70), // Mock completion rate
        totalEnrollments: enrollmentCount,
        certificatesIssued: Math.round(enrollmentCount * 0.6) // Mock certificates
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course =>
    course.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.shortname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderDashboardOverview = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {[
          { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-500', change: '+12%' },
          { label: 'Total Courses', value: stats.totalCourses, icon: BookOpen, color: 'bg-green-500', change: '+8%' },
          { label: 'Active Users', value: stats.activeUsers, icon: Activity, color: 'bg-purple-500', change: '+15%' },
          { label: 'Completion Rate', value: `${stats.completionRate}%`, icon: Award, color: 'bg-orange-500', change: '+3%' },
          { label: 'Enrollments', value: stats.totalEnrollments, icon: TrendingUp, color: 'bg-red-500', change: '+25%' },
          { label: 'Certificates', value: stats.certificatesIssued, icon: Award, color: 'bg-teal-500', change: '+18%' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.label}</h3>
            <p className="text-xs text-green-600">{stat.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Courses Management */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Course Management</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.slice(0, 9).map((course) => (
            <motion.div
              key={course.id}
              whileHover={{ y: -5 }}
              className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-all duration-200"
            >
              <div className="relative h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-4 overflow-hidden">
                {course.courseimage ? (
                  <img
                    src={course.courseimage}
                    alt={course.fullname}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <BookOpen className="w-12 h-12 text-white opacity-80" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-1 bg-white bg-opacity-90 text-xs font-medium rounded-full">
                    {course.format || 'Course'}
                  </span>
                </div>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {course.fullname}
              </h3>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {course.summary ? course.summary.replace(/<[^>]*>/g, '').substring(0, 100) + '...' : 'No description available'}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">ID: {course.id}</span>
                <button
                  onClick={() => setSelectedCourse(course)}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Eye className="w-3 h-3" />
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Users Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Last Access</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(0, 10).map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user.firstname?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">
                        {user.fullname || `${user.firstname} ${user.lastname}`}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{user.email}</td>
                  <td className="py-3 px-4 text-gray-600">
                    {user.lastaccess ? new Date(user.lastaccess * 1000).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.lastaccess && Date.now() - user.lastaccess * 1000 < 7 * 24 * 60 * 60 * 1000
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.lastaccess && Date.now() - user.lastaccess * 1000 < 7 * 24 * 60 * 60 * 1000 ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboardOverview();
      case 'schools':
        return <ManageSchools />;
      case 'courses-categories':
        return <ManageCoursesCategories />;
      case 'training-completion':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Training Completion Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.slice(0, 6).map((course) => (
                <div key={course.id} className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{course.fullname}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Completion Rate</span>
                      <span className="font-medium">{Math.round(Math.random() * 40 + 60)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${Math.round(Math.random() * 40 + 60)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {sidebarItems.find(item => item.id === activeSection)?.label || 'Section'}
            </h2>
            <p className="text-gray-600">Content for {activeSection} section will be implemented here.</p>
          </div>
        );
    }
  };

  // Show AI Dashboard if selected
  if (showAIDashboard || activeSection === 'ai-analytics') {
    return <AIAnalyticsDashboard />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
        <span className="ml-4 text-gray-600">Loading dashboard data...</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-slate-800 text-white flex-shrink-0">
        <div className="p-6">
          <div className="text-sm text-slate-400 mb-6 uppercase tracking-wider">MENU</div>
          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                whileHover={{ x: 4 }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {t('language') === 'ar' ? item.labelAr : item.label}
                </span>
                {activeSection === item.id && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </motion.button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {sidebarItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
              </h1>
              <p className="text-gray-600">Welcome back, {user?.fullname}</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button 
                onClick={() => setShowAIDashboard(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
              >
                <Brain className="w-4 h-4" />
                AI Analytics
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderSectionContent()}
          </motion.div>
        </main>
      </div>

      {/* Course Details Modal */}
      {selectedCourse && (
        <CourseDetailsModal
          course={selectedCourse}
          isOpen={!!selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </div>
  );
};