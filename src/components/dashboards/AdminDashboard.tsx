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
  Building,
  Settings,
  CheckCircle,
  Coins,
  Share2,
  Calendar,
  HelpCircle
} from 'lucide-react';
import { LoadingSpinner } from '../LoadingSpinner';
import { CourseDetailsModal } from '../CourseDetailsModal';
import { AIAnalyticsDashboard } from './AIAnalyticsDashboard';
import { ManageSchools } from './admin/ManageSchools';
import { UsersDashboard } from './admin/UsersDashboard';
import { ManageCoursesCategories } from './admin/ManageCoursesCategories';
import { Button } from '../ui/Button';
import { DashboardHeader } from '../dashboard/DashboardHeader';
import { MetricCard } from '../dashboard/MetricCard';
import { AdminProfileModal } from './AdminProfileModal';

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
  const { user, logout, updateUser } = useAuth();
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
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleProfileClick = () => {
    setProfileModalOpen(true);
    setDropdownOpen(false);
  };
  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  const sidebarItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', labelAr: 'لوحة التحكم' },
    { id: 'enrollments', icon: BarChart3, label: 'Enrollments', labelAr: 'التسجيلات' },
    { id: 'schools', icon: Building, label: 'Schools Management', labelAr: 'إدارة المدارس' },
    { id: 'users', icon: Users, label: 'Users Management', labelAr: 'إدارة المستخدمين' },
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
        coursesData.map(course => apiService.getCourseEnrollments(String(course.id)))
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
        return (
          <>
            <ManagementDashboardHeader />
            <TeacherPerformanceAndROISection />
            <DashboardDeepAnalyticsSection />
            <MasterTrainerAndSuccessionSection />
          </>
        );
      case 'enrollments':
        return <EnrollmentsSection />;
      case 'schools':
        return <ManageSchools />;
      case 'users':
        return <UsersDashboard />;
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
      case 'user-management':
        return <UsersDashboard />;
      case 'courses-programs':
        return <ManageCoursesCategories />;
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

  const quarters = [
    'Q1 2025 (Jan-Mar)',
    'Q2 2025 (Apr-Jun)',
    'Q3 2025 (Jul-Sep)',
    'Q4 2025 (Oct-Dec)'
  ];
  const statCards = [
    {
      title: 'Total Active Teachers',
      value: '1,248',
      icon: <Users className="w-6 h-6 text-blue-500" />, 
      iconBg: 'bg-blue-50',
      growth: '+8.2%',
      growthDesc: 'vs last quarter',
      growthColor: 'text-green-600',
      growthArrow: true
    },
    {
      title: 'Course Completion Rate',
      value: '78.3%',
      icon: <CheckCircle className="w-6 h-6 text-green-500" />, 
      iconBg: 'bg-green-50',
      growth: '+5.7%',
      growthDesc: 'vs last quarter',
      growthColor: 'text-green-600',
      growthArrow: true
    },
    {
      title: 'Certified Master Trainers',
      value: '86',
      icon: <Award className="w-6 h-6 text-purple-500" />, 
      iconBg: 'bg-purple-50',
      growth: '+12.4%',
      growthDesc: 'vs last quarter',
      growthColor: 'text-green-600',
      growthArrow: true
    },
    {
      title: 'Training ROI',
      value: '3.2x',
      icon: <Coins className="w-6 h-6 text-yellow-500" />, 
      iconBg: 'bg-yellow-50',
      growth: '+0.4x',
      growthDesc: 'vs last quarter',
      growthColor: 'text-green-600',
      growthArrow: true
    }
  ];
  const ManagementDashboardHeader = () => {
    const [selectedQuarter, setSelectedQuarter] = React.useState(quarters[1]);
    const handleDownload = () => {
      // Implement download logic here
      alert('Download triggered!');
    };
    const handleShare = () => {
      // Implement share logic here
      alert('Share triggered!');
    };
    return (
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Management Dashboard</h1>
            <p className="text-gray-500 text-base">Comprehensive analytics for Maarif Teacher Training Academy</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedQuarter}
              onChange={e => setSelectedQuarter(e.target.value)}
            >
              {quarters.map(q => <option key={q} value={q}>{q}</option>)}
            </select>
            <button
              onClick={handleDownload}
              className="p-2 rounded-lg border hover:bg-gray-100 transition"
              title="Download"
            >
              <Download className="w-5 h-5 text-gray-500" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-lg border hover:bg-gray-100 transition"
              title="Share"
            >
              <Share2 className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, idx) => (
            <div key={card.title} className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-2 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="text-gray-500 text-sm font-medium">{card.title}</div>
                <div className={`rounded-full p-2 ${card.iconBg}`}>{card.icon}</div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{card.value}</div>
              <div className="flex items-center gap-1 mt-2">
                {card.growthArrow && <span className="text-green-500 font-bold">↑</span>}
                <span className={`${card.growthColor} font-semibold`}>{card.growth}</span>
                <span className="text-gray-400 text-xs ml-1">{card.growthDesc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const TeacherPerformanceAndROISection = () => {
    const [tab, setTab] = React.useState('subject');
    // Mock data
    const performanceStats = [
      { label: 'Mathematics', value: '+24%' },
      { label: 'Languages', value: '+19%' },
      { label: 'Sciences', value: '+16%' },
      { label: 'Humanities', value: '+14%' }
    ];
    const roiData = [
      { label: 'Reduced Turnover', value: 420000, max: 500000 },
      { label: 'Student Performance', value: 380000, max: 500000 },
      { label: 'Operational Efficiency', value: 210000, max: 500000 },
      { label: 'Parent Satisfaction', value: 190000, max: 500000 }
    ];
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Teacher Performance Improvement */}
        <div className="col-span-2 bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Teacher Performance Improvement</h2>
            <div className="flex gap-2">
              <button onClick={() => setTab('subject')} className={`px-3 py-1 rounded-full text-sm font-medium ${tab==='subject' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>By Subject</button>
              <button onClick={() => setTab('school')} className={`px-3 py-1 rounded-full text-sm font-medium ${tab==='school' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>By School</button>
              <button onClick={() => setTab('experience')} className={`px-3 py-1 rounded-full text-sm font-medium ${tab==='experience' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>By Experience</button>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl flex flex-col items-center justify-center h-48 mb-6">
            <svg width="48" height="48" fill="none" viewBox="0 0 48 48"><path d="M12 36V24l8 8 8-16 8 12" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="24" cy="24" r="23" stroke="#E5E7EB" strokeWidth="2"/></svg>
            <div className="text-gray-500 mt-4 text-center">Performance improvement chart showing 18% average increase in teacher effectiveness scores after training completion</div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {performanceStats.map(stat => (
              <div key={stat.label}>
                <div className="text-sm text-gray-500">{stat.label}</div>
                <div className="text-green-600 font-bold text-lg">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Training ROI Analysis */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Training ROI Analysis</h2>
          <div className="space-y-4 mb-4">
            {roiData.map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{item.label}</span>
                  <span className="font-semibold text-gray-900">${item.value.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(item.value/item.max)*100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center border-t pt-4 mt-4">
            <div className="text-sm text-gray-500">Total Investment<br/><span className="text-xl font-bold text-gray-900">$375,000</span></div>
            <div className="text-sm text-gray-500 text-right">Total Return<br/><span className="text-xl font-bold text-green-600">$1,200,000</span></div>
          </div>
        </div>
      </div>
    );
  };

  const DashboardDeepAnalyticsSection = () => {
    // TODO: Replace mock data with real data integration here
    const competencies = [
      { label: 'Pedagogical Skills', value: 76, color: 'bg-green-500' },
      { label: 'Digital Literacy', value: 68, color: 'bg-blue-500' },
      { label: 'Student Assessment', value: 82, color: 'bg-purple-500' },
      { label: 'Classroom Management', value: 91, color: 'bg-orange-500' },
      { label: 'Curriculum Design', value: 64, color: 'bg-red-500' }
    ];
    const engagement = [
      { label: 'ILT', value: 84, color: 'bg-blue-100 text-blue-600' },
      { label: 'VILT', value: 76, color: 'bg-purple-100 text-purple-600' },
      { label: 'Self-Paced', value: 62, color: 'bg-yellow-100 text-yellow-600' }
    ];
    const predictive = [
      { title: 'High Attrition Risk', desc: '12 teachers show patterns indicating potential resignation in next 3 months', color: 'bg-blue-50 text-blue-700' },
      { title: 'Leadership Potential', desc: '8 teachers show exceptional leadership qualities and should be considered for Master Trainer program', color: 'bg-green-50 text-green-700' },
      { title: 'Skills Gap Alert', desc: 'Critical gap in advanced technology integration skills across 3 schools', color: 'bg-yellow-50 text-yellow-700' },
      { title: 'Course Recommendation', desc: 'Based on current trends, recommend increasing capacity for "Advanced Assessment Techniques" course by 30%', color: 'bg-purple-50 text-purple-700' }
    ];
    const trainingStats = [
      { label: 'ILT Sessions', value: 186, color: 'text-blue-600' },
      { label: 'VILT Sessions', value: 124, color: 'text-purple-600' },
      { label: 'Self-Paced Modules', value: 342, color: 'text-orange-500' },
      { label: 'Assessments', value: 96, color: 'text-green-600' }
    ];
    const learningPrefs = [
      { label: 'Visual', value: 42, color: 'bg-purple-400' },
      { label: 'Auditory', value: 28, color: 'bg-blue-400' },
      { label: 'Kinesthetic', value: 30, color: 'bg-green-400' }
    ];
    const timePrefs = [
      { label: 'Morning', value: 37, color: 'bg-orange-400' },
      { label: 'Afternoon', value: 25, color: 'bg-blue-400' },
      { label: 'Evening', value: 38, color: 'bg-purple-400' }
    ];
    const engagementPatterns = [
      { day: 'Mon', value: 6 }, { day: 'Tue', value: 7 }, { day: 'Wed', value: 6 }, { day: 'Thu', value: 8 }, { day: 'Fri', value: 5 }, { day: 'Sat', value: 4 }, { day: 'Sun', value: 3 }
    ];
    return (
      <div className="grid grid-cols-1 gap-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Competency Development */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Competency Development</h2>
            <div className="space-y-4">
              {competencies.map(c => (
                <div key={c.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{c.label}</span>
                    <span className="font-semibold text-gray-900">{c.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`${c.color} h-2 rounded-full`} style={{ width: `${c.value}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            <a href="#" className="block mt-4 text-blue-600 hover:underline text-sm font-medium">View detailed competency report →</a>
          </div>
          {/* Teacher Engagement */}
          <div className="bg-white rounded-xl shadow p-6 flex flex-col">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Teacher Engagement</h2>
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 rounded-xl mb-4">
              <svg width="48" height="48" fill="none" viewBox="0 0 48 48"><path d="M24 8a16 16 0 1 1 0 32A16 16 0 0 1 24 8Zm0 0v16l13.856 8.028" stroke="#A78BFA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <div className="text-gray-400 mt-2">Engagement metrics by training format</div>
            </div>
            <div className="flex gap-2 justify-center">
              {engagement.map(e => (
                <div key={e.label} className={`rounded-lg px-6 py-2 font-bold text-lg ${e.color}`}>{e.value}%<div className="text-xs font-medium text-gray-500">{e.label}</div></div>
              ))}
            </div>
          </div>
          {/* Predictive Insights */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Predictive Insights</h2>
              <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-semibold">AI-Powered</span>
            </div>
            <div className="space-y-3">
              {predictive.map((p, i) => (
                <div key={i} className={`rounded-lg px-4 py-3 ${p.color} text-sm font-medium`}>{p.title}<div className="text-xs text-gray-500 mt-1">{p.desc}</div></div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Training Activity */}
          <div className="col-span-2 bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Training Activity</h2>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-600">Weekly</button>
                <button className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-500">Monthly</button>
                <button className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-500">Quarterly</button>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl flex flex-col items-center justify-center h-48 mb-6">
              <svg width="48" height="48" fill="none" viewBox="0 0 48 48"><rect x="8" y="32" width="4" height="8" rx="2" fill="#60A5FA"/><rect x="18" y="24" width="4" height="16" rx="2" fill="#A78BFA"/><rect x="28" y="16" width="4" height="24" rx="2" fill="#F59E42"/><rect x="38" y="20" width="4" height="20" rx="2" fill="#34D399"/></svg>
              <div className="text-gray-500 mt-4 text-center">Weekly training activity showing 248 sessions completed</div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {trainingStats.map(stat => (
                <div key={stat.label}>
                  <div className={`font-bold text-lg ${stat.color}`}>{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Behavioral Analysis */}
          <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Behavioral Analysis</h2>
              <span className="text-xs bg-purple-100 text-purple-600 px-3 py-1 rounded-full font-semibold">AI-Powered</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Learning Preferences */}
              <div>
                <div className="font-semibold text-sm text-gray-700 mb-2">Learning Preferences</div>
                {learningPrefs.map(p => (
                  <div key={p.label} className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>{p.label}</span>
                      <span className="font-semibold text-gray-900">{p.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`${p.color} h-2 rounded-full`} style={{ width: `${p.value}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Time Preferences */}
              <div>
                <div className="font-semibold text-sm text-gray-700 mb-2">Time Preferences</div>
                {timePrefs.map(p => (
                  <div key={p.label} className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>{p.label}</span>
                      <span className="font-semibold text-gray-900">{p.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`${p.color} h-2 rounded-full`} style={{ width: `${p.value}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Engagement Patterns */}
            <div>
              <div className="font-semibold text-sm text-gray-700 mb-2">Engagement Patterns</div>
              <div className="flex gap-2 items-end h-16">
                {engagementPatterns.map(p => (
                  <div key={p.day} className="flex flex-col items-center justify-end flex-1">
                    <div className="w-3 rounded bg-green-400" style={{ height: `${p.value * 10}px` }}></div>
                    <span className="text-xs text-gray-500 mt-1">{p.day}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* AI Recommendation */}
            <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-700 mt-2">
              <span className="font-bold">AI Recommendation</span> Based on behavioral patterns, scheduling more interactive sessions on Tuesdays and Thursdays could increase engagement by 23%
            </div>
          </div>
        </div>
      </div>
    );
  };

  const MasterTrainerAndSuccessionSection = () => {
    // TODO: Replace mock data with real data integration here
    const trainers = [
      {
        name: 'Sarah Al-Otaibi',
        subject: 'Mathematics',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        specialization: 'Advanced Pedagogy',
        progress: 92,
        progressColor: 'bg-green-500',
        certification: 'Level 3',
        certColor: 'bg-green-100 text-green-700',
        status: 'Active Trainer',
        statusColor: 'text-green-600'
      },
      {
        name: 'Mohammed Al-Ghamdi',
        subject: 'Science',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        specialization: 'Digital Learning',
        progress: 78,
        progressColor: 'bg-blue-500',
        certification: 'Level 2',
        certColor: 'bg-blue-100 text-blue-700',
        status: 'In Training',
        statusColor: 'text-blue-600'
      },
      {
        name: 'Fatima Al-Zahrani',
        subject: 'Languages',
        avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
        specialization: 'Assessment Design',
        progress: 65,
        progressColor: 'bg-purple-500',
        certification: 'Level 2',
        certColor: 'bg-purple-100 text-purple-700',
        status: 'In Training',
        statusColor: 'text-purple-600'
      },
      {
        name: 'Khalid Al-Harbi',
        subject: 'Physical Education',
        avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
        specialization: 'Classroom Management',
        progress: 45,
        progressColor: 'bg-orange-500',
        certification: 'Level 1',
        certColor: 'bg-yellow-100 text-yellow-700',
        status: 'Candidate',
        statusColor: 'text-orange-600'
      }
    ];
    const succession = [
      {
        label: 'Academic Coordinators',
        icon: 'users',
        value: 17,
        total: 20,
        color: 'bg-blue-100 text-blue-700',
        bar: 'bg-blue-500',
        desc: '3 positions to be filled in next 6 months',
        tag: 'Leadership',
        tagColor: 'bg-green-100 text-green-700'
      },
      {
        label: 'Department Heads',
        icon: 'users',
        value: 13,
        total: 20,
        color: 'bg-purple-100 text-purple-700',
        bar: 'bg-purple-500',
        desc: '7 positions to be filled in next 12 months',
        tag: '',
        tagColor: ''
      },
      {
        label: 'School Leaders',
        icon: 'users',
        value: 9,
        total: 20,
        color: 'bg-green-100 text-green-700',
        bar: 'bg-green-500',
        desc: '11 positions to be filled in next 18 months',
        tag: '',
        tagColor: ''
      }
    ];
    const candidates = [
      {
        name: 'Sarah Al-Otaibi',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        score: 94,
        status: 'Ready',
        statusColor: 'bg-green-100 text-green-700'
      },
      {
        name: 'Mohammed Al-Ghamdi',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        score: 87,
        status: 'In Development',
        statusColor: 'bg-blue-100 text-blue-700'
      },
      {
        name: 'Fatima Al-Zahrani',
        avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
        score: 82,
        status: 'In Development',
        statusColor: 'bg-blue-100 text-blue-700'
      }
    ];
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Master Trainer Development */}
        <div className="col-span-2 bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Master Trainer Development</h2>
            <a href="#" className="text-blue-600 text-sm font-medium hover:underline">View all trainers →</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="py-2 px-4 text-left font-semibold">TEACHER</th>
                  <th className="py-2 px-4 text-left font-semibold">SPECIALIZATION</th>
                  <th className="py-2 px-4 text-left font-semibold">PROGRESS</th>
                  <th className="py-2 px-4 text-left font-semibold">CERTIFICATION</th>
                  <th className="py-2 px-4 text-left font-semibold">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {trainers.map((t, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover border" />
                      <div>
                        <div className="font-medium text-gray-900">{t.name}</div>
                        <div className="text-xs text-gray-500">{t.subject}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{t.specialization}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className={`${t.progressColor} h-2 rounded-full`} style={{ width: `${t.progress}%` }}></div>
                        </div>
                        <span className="text-xs font-semibold text-gray-700">{t.progress}% Complete</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${t.certColor}`}>{t.certification}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-semibold text-xs ${t.statusColor}`}>{t.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Succession Planning */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Succession Planning</h2>
            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">Leadership</span>
          </div>
          <div className="space-y-3 mb-6">
            {succession.map((s, i) => (
              <div key={i} className={`rounded-lg px-4 py-3 ${s.color} flex items-center gap-4`}> 
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{s.label}</span>
                    {s.tag && <span className={`text-xs px-2 py-0.5 rounded-full ml-2 ${s.tagColor}`}>{s.tag}</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className={`${s.bar} h-2 rounded-full`} style={{ width: `${(s.value/s.total)*100}%` }}></div>
                    </div>
                    <span className="text-xs font-semibold text-gray-700">{s.value}/{s.total}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 mt-4">
            <div className="font-semibold text-xs text-gray-500 mb-2">Top Leadership Candidates</div>
            <div className="space-y-2">
              {candidates.map((c, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img src={c.avatar} alt={c.name} className="w-7 h-7 rounded-full object-cover border" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-xs">{c.name}</div>
                    <div className="text-xs text-gray-500">Leadership Score: {c.score}%</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c.statusColor}`}>{c.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  function EnrollmentsSection() {
    const [activeTab, setActiveTab] = React.useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [courses, setCourses] = useState<Course[]>([]);
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [stats, setStats] = useState({ totalEnrollments: 0, availableTrainers: 0, upcomingSessions: 0, pendingQueries: 0 });

    useEffect(() => {
      let isMounted = true;
      async function fetchData() {
        setLoading(true);
        setError('');
        try {
          // Fetch all courses
          const coursesData = await apiService.getAllCourses();
          if (!isMounted) return;
          setCourses(coursesData);
          // Fetch enrollments for all courses (flattened)
          let allEnrollments: any[] = [];
          for (const course of coursesData) {
            const courseEnrollments = await apiService.getCourseEnrollments(String(course.id));
            // Attach course info to each enrollment
            allEnrollments = allEnrollments.concat(courseEnrollments.map((e: any) => ({ ...e, course })));
          }
          if (!isMounted) return;
          setEnrollments(allEnrollments);
          // Calculate stats
          setStats({
            totalEnrollments: allEnrollments.length,
            availableTrainers: 86, // TODO: fetch real trainers if available
            upcomingSessions: 42, // TODO: fetch real sessions if available
            pendingQueries: 24 // TODO: fetch real pending queries if available
          });
        } catch (err) {
          setError('Failed to load enrollments');
        } finally {
          setLoading(false);
        }
      }
      fetchData();
      return () => { isMounted = false; };
    }, []);

    if (loading) return <div className="flex justify-center items-center min-h-[300px]"><span className="text-gray-500">Loading enrollments...</span></div>;
    if (error) return <div className="text-red-600 p-4">{error}</div>;

    // Stat cards
    const enrollmentsStats = [
      { label: 'Total Enrollments', value: stats.totalEnrollments, icon: BarChart3, change: '+12.4%', changeColor: 'text-green-600', desc: 'vs last quarter' },
      { label: 'Available Trainers', value: stats.availableTrainers, icon: Users, change: '+8.3%', changeColor: 'text-green-600', desc: 'vs last quarter' },
      { label: 'Upcoming Sessions', value: stats.upcomingSessions, icon: Calendar, change: '+5.2%', changeColor: 'text-green-600', desc: 'vs last quarter' },
      { label: 'Pending Queries', value: stats.pendingQueries, icon: HelpCircle, change: '-14.8%', changeColor: 'text-red-600', desc: 'vs last quarter' },
    ];

    // Table data: show first 5 enrollments
    const tableData = enrollments.slice(0, 5);

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Training Enrollments</h1>
          <p className="text-gray-500 text-base mb-6">Manage all enrollment activities for Maarif Teacher Training Academy</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {enrollmentsStats.map((stat, idx) => (
              <div key={stat.label} className="bg-white rounded-xl shadow p-6 border border-gray-100 flex flex-col gap-2">
                <div className="flex items-center gap-3 mb-2">
                  <span className="p-2 rounded-full bg-blue-50"><stat.icon className="w-6 h-6 text-blue-600" /></span>
                  <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                </div>
                <div className="text-sm font-medium text-gray-600">{stat.label}</div>
                <div className="flex items-center gap-1 mt-1">
                  <span className={`${stat.changeColor} font-semibold`}>{stat.change}</span>
                  <span className="text-gray-400 text-xs ml-1">{stat.desc}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {['All Enrollments', 'Pending Approval', 'Confirmed', 'Completed', 'Cancelled'].map((tab, idx) => (
              <button key={tab} onClick={() => setActiveTab(idx)} className={`pb-2 px-2 text-sm font-medium border-b-2 ${activeTab === idx ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-blue-700'}`}>{tab}</button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <input type="text" placeholder="Search by name, ID, course..." className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-80" />
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option>All Facilities</option>
            </select>
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option>All Programs</option>
            </select>
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option>All Formats</option>
            </select>
          </div>
          <div className="bg-white rounded-xl shadow border border-gray-100 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="py-3 px-4 text-left font-semibold"><input type="checkbox" /></th>
                  <th className="py-3 px-4 text-left font-semibold">TEACHER</th>
                  <th className="py-3 px-4 text-left font-semibold">PROGRAM</th>
                  <th className="py-3 px-4 text-left font-semibold">FACILITY</th>
                  <th className="py-3 px-4 text-left font-semibold">TRAINER</th>
                  <th className="py-3 px-4 text-left font-semibold">START DATE</th>
                  <th className="py-3 px-4 text-left font-semibold">STATUS</th>
                  <th className="py-3 px-4 text-left font-semibold">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, idx) => (
                  <tr key={row.userid + '-' + idx} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 px-4"><input type="checkbox" /></td>
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img src={row.profileimageurl || 'https://randomuser.me/api/portraits/lego/1.jpg'} alt={row.fullname} className="w-8 h-8 rounded-full object-cover border" />
                      <div>
                        <div className="font-medium text-gray-900">{row.fullname}</div>
                        <div className="text-xs text-gray-500">ID: {row.userid}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{row.course?.fullname || '-'}</div>
                      <div className="text-xs text-gray-500">{row.course?.type || '-'}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{row.course?.facility || 'Virtual'}</div>
                      <div className="text-xs text-gray-500">{row.course?.facilityDetail || ''}</div>
                    </td>
                    <td className="py-3 px-4 flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">T</span>
                      <div>
                        <div className="font-medium text-gray-900 text-xs">Trainer</div>
                        <div className="text-xs text-gray-500">Role</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{row.course?.startdate ? new Date(row.course.startdate * 1000).toLocaleDateString() : '-'}</div>
                      <div className="text-xs text-gray-500">{row.course?.startdate ? new Date(row.course.startdate * 1000).toLocaleTimeString() : ''}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700`}>Confirmed</span>
                    </td>
                    <td className="py-3 px-4">
                      <a href="#" className="text-blue-600 hover:underline font-medium">View</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-500">
              <span>Showing 1 to {tableData.length} of {enrollments.length} results</span>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100">&lt; Previous</button>
                <button className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100">Next &gt;</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex-shrink-0">
        <div className="p-6">
          <div className="text-xl font-bold text-blue-700 mb-8 flex items-center gap-2">
            <img src="/Riyada.png" alt="Riyada Logo" className="w-10 h-10 object-contain rounded-full bg-white border" />
            Riyada Trainings
          </div>
          <nav className="space-y-2">
            {/* Sidebar items with section dividers */}
            <div className="mb-2">
              <div className="text-sm text-gray-400 uppercase mb-1">Dashboard</div>
              <SidebarItem icon={Home} label="Dashboard" active={activeSection === 'dashboard'} onClick={() => setActiveSection('dashboard')} />
            </div>
            <div className="mb-2">
              <div className="text-sm text-gray-400 uppercase mb-1">Teachers</div>
              <SidebarItem icon={Users} label="Teachers" active={activeSection === 'teachers'} onClick={() => setActiveSection('teachers')} />
              <SidebarItem icon={Users} label="Master Trainers" active={activeSection === 'master-trainers'} onClick={() => setActiveSection('master-trainers')} />
            </div>
            <div className="mb-2">
              <div className="text-sm text-gray-400 uppercase mb-1">Courses & Programs</div>
              <SidebarItem icon={BookOpen} label="Courses & Programs" active={activeSection === 'courses-programs'} onClick={() => setActiveSection('courses-programs')} />
              <SidebarItem icon={Award} label="Certifications" active={activeSection === 'certifications'} onClick={() => setActiveSection('certifications')} />
              <SidebarItem icon={Target} label="Assessments" active={activeSection === 'assessments'} onClick={() => setActiveSection('assessments')} />
              <SidebarItem icon={Building} label="Schools" active={activeSection === 'schools'} onClick={() => setActiveSection('schools')} />
            </div>
            <div className="mb-2">
              <div className="text-sm text-gray-400 uppercase mb-1">Insights</div>
              <SidebarItem icon={BarChart3} label="Analytics" active={activeSection === 'analytics'} onClick={() => setActiveSection('analytics')} />
              <SidebarItem icon={Brain} label="Predictive Models" active={activeSection === 'predictive-models'} onClick={() => setActiveSection('predictive-models')} />
              <SidebarItem icon={TrendingUp} label="ROI Analysis" active={activeSection === 'roi-analysis'} onClick={() => setActiveSection('roi-analysis')} />
              <SidebarItem icon={FileText} label="Reports" active={activeSection === 'reports'} onClick={() => setActiveSection('reports')} />
            </div>
            <div className="mb-2">
              <div className="text-sm text-gray-400 uppercase mb-1">Settings</div>
              <SidebarItem icon={Settings} label="System Settings" active={activeSection === 'system-settings'} onClick={() => setActiveSection('system-settings')} />
              <SidebarItem icon={Users} label="User Management" active={activeSection === 'user-management'} onClick={() => setActiveSection('user-management')} />
            </div>
          </nav>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <DashboardHeader
          user={user}
          onProfile={() => setProfileModalOpen(true)}
          onLogout={handleLogout}
        />
        <main className="flex-1 p-8 bg-gray-50 overflow-y-auto">
          {/* The rest of the dashboard content goes here */}
          {renderSectionContent()}
        </main>
      </div>
      <AdminProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        user={user || {}}
        onSave={(data) => {
          // Merge the updated fields into the user object
          const updatedUser = { ...user, ...data };
          updateUser(updatedUser);
          // Optionally, call your real API here
        }}
      />
    </div>
  );
};

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button
    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-all duration-200 ${active ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
    onClick={onClick}
  >
    <Icon className="w-5 h-5" />
    <span className="text-base">{label}</span>
    {active && <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>}
  </button>
);