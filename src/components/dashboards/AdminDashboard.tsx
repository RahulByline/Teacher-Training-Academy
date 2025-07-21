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
    { id: 'community', icon: Users, label: 'Community', labelAr: 'المجتمع' },
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
      case 'community':
        return (
          <div className="space-y-8">
            {/* Top Community Section (already implemented) */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Column */}
              <div className="flex-1 min-w-[320px] flex flex-col gap-6">
                {/* Master Trainers Circle */}
                <div className="bg-blue-600 rounded-2xl p-6 text-white relative shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-white bg-opacity-20 rounded-full p-2"><svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M12 17.5l-6-3V7.5l6-3 6 3v7l-6 3z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                    <span className="bg-white bg-opacity-20 text-xs px-2 py-1 rounded-full font-semibold">Featured</span>
                  </div>
                  <div className="text-xl font-bold mb-1">Master Trainers Circle</div>
                  <div className="mb-2">Exclusive space for certified and aspiring Master Trainers to collaborate and share expertise.</div>
                  <div className="flex items-center gap-2 mb-4">
                    <img src="https://randomuser.me/api/portraits/women/44.jpg" className="w-7 h-7 rounded-full border-2 border-white -ml-1" alt="" />
                    <img src="https://randomuser.me/api/portraits/men/32.jpg" className="w-7 h-7 rounded-full border-2 border-white -ml-2" alt="" />
                    <img src="https://randomuser.me/api/portraits/women/65.jpg" className="w-7 h-7 rounded-full border-2 border-white -ml-2" alt="" />
                    <span className="ml-2 text-sm font-semibold">86 members</span>
                  </div>
                  <button className="bg-white text-blue-700 font-semibold rounded-lg px-4 py-2 w-full hover:bg-blue-50 transition">Join Space</button>
                </div>
                {/* Community Spaces */}
                <div className="bg-white rounded-2xl shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="font-bold text-lg">Community Spaces</div>
                    <a href="#" className="text-blue-600 text-sm font-medium hover:underline">View All</a>
                  </div>
                  <div className="space-y-3 mb-4">
                    {[
                      { icon: <span className="bg-purple-100 text-purple-600 p-2 rounded-lg"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /></svg></span>, name: 'Pedagogical Innovations', members: 142, discussions: 38 },
                      { icon: <span className="bg-blue-100 text-blue-600 p-2 rounded-lg"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="2" /></svg></span>, name: 'EdTech Integration', members: 216, discussions: 52 },
                      { icon: <span className="bg-yellow-100 text-yellow-600 p-2 rounded-lg"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="4" y="8" width="16" height="8" rx="4" stroke="currentColor" strokeWidth="2" /></svg></span>, name: 'Assessment Strategies', members: 98, discussions: 27 },
                      { icon: <span className="bg-green-100 text-green-600 p-2 rounded-lg"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="8" stroke="currentColor" strokeWidth="2" /></svg></span>, name: 'Student Engagement', members: 173, discussions: 41 },
                    ].map((space, i) => (
                      <div key={space.name} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
                        {space.icon}
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{space.name}</div>
                          <div className="text-xs text-gray-500">{space.members} members • {space.discussions} discussions</div>
                        </div>
                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">Active</span>
                      </div>
                    ))}
                  </div>
                  <button className="w-full bg-blue-50 text-blue-700 font-semibold rounded-lg px-4 py-2 mt-2 hover:bg-blue-100 transition">Create New Space</button>
                </div>
              </div>
              {/* Center Column */}
              <div className="flex-[2] min-w-[340px] flex flex-col gap-6">
                {/* Post Input */}
                <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-2">
                  <div className="flex items-center gap-3 mb-2">
                    <img src="https://randomuser.me/api/portraits/women/44.jpg" className="w-9 h-9 rounded-full object-cover" alt="" />
                    <input className="flex-1 border rounded-lg px-4 py-2 text-sm" placeholder="Share your thoughts, ideas or questions..." />
                  </div>
                  <div className="flex items-center gap-2 ml-12">
                    <button className="text-gray-500 text-xs flex items-center gap-1"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="2" /></svg> Media</button>
                    <button className="text-gray-500 text-xs flex items-center gap-1"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><rect x="4" y="8" width="16" height="8" rx="4" stroke="currentColor" strokeWidth="2" /></svg> Document</button>
                    <button className="text-gray-500 text-xs flex items-center gap-1"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" /></svg> Link</button>
                    <button className="ml-auto bg-blue-600 text-white px-4 py-1.5 rounded-lg font-semibold text-sm">Post</button>
                  </div>
                </div>
                {/* Sample Post */}
                <div className="bg-white rounded-2xl shadow p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <img src="https://randomuser.me/api/portraits/women/44.jpg" className="w-9 h-9 rounded-full object-cover" alt="" />
                    <div>
                      <div className="font-semibold text-gray-900 flex items-center gap-2">Sarah Al-Otaibi <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">Master Trainer</span></div>
                      <div className="text-xs text-gray-500">Posted in <span className="font-semibold text-blue-700">Pedagogical Innovations</span> • 2 hours ago</div>
                    </div>
                  </div>
                  <div className="font-bold text-lg mb-1">Implementing Differentiated Instruction in Mixed-Ability Classrooms</div>
                  <div className="text-gray-700 mb-3">I've been experimenting with a new approach to differentiated instruction that has shown promising results with my students. Would love to hear if anyone else has tried similar methods or has suggestions to improve this approach.</div>
                  <div className="bg-gray-50 rounded-lg p-3 text-sm mb-3">
                    <div className="font-semibold mb-1">My approach involves three key components:</div>
                    <ul className="list-disc ml-5 text-gray-700">
                      <li>Tiered assignments with common learning objectives but varying complexity</li>
                      <li>Flexible grouping based on formative assessment data</li>
                      <li>Student choice boards that allow for multiple paths to demonstrate mastery</li>
                    </ul>
                  </div>
                  <div className="flex items-center gap-6 text-xs text-gray-500 mb-2">
                    <span>24 Likes</span>
                    <span>8 Comments</span>
                    <button className="ml-auto text-gray-400 hover:text-blue-600">Save</button>
                  </div>
                  {/* Comments */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <img src="https://randomuser.me/api/portraits/men/45.jpg" className="w-7 h-7 rounded-full object-cover" alt="" />
                      <div className="font-semibold text-gray-800 text-xs">Mohammed Al-Ghamdi <span className="text-gray-400 font-normal">1 hour ago</span></div>
                    </div>
                    <div className="text-gray-700 text-sm">This is brilliant, Sarah! I've been struggling with differentiation in my science classes. Could you share more details about how you track progress across the different tiers?</div>
                    <div className="flex items-center gap-2 mt-2">
                      <button className="text-xs text-blue-600 font-medium">Like</button>
                      <button className="text-xs text-blue-600 font-medium">Reply</button>
                    </div>
                  </div>
                  <input className="w-full border rounded-lg px-3 py-2 text-sm mt-2" placeholder="Add a comment..." />
                </div>
              </div>
              {/* Right Column */}
              <div className="w-full lg:w-80 flex flex-col gap-6">
                {/* Community Insights */}
                <div className="bg-white rounded-2xl shadow p-6 mb-2">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-blue-50 rounded-lg p-3 flex flex-col items-center">
                      <div className="text-2xl font-bold text-blue-700">1,248</div>
                      <div className="text-xs text-gray-500">Active Members</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 flex flex-col items-center">
                      <div className="text-2xl font-bold text-green-600">186</div>
                      <div className="text-xs text-gray-500">Discussions This Month</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 flex flex-col items-center">
                      <div className="text-2xl font-bold text-purple-600">14</div>
                      <div className="text-xs text-gray-500">Active Spaces</div>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-3 flex flex-col items-center">
                      <div className="text-2xl font-bold text-yellow-600">92%</div>
                      <div className="text-xs text-gray-500">Engagement Rate</div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="text-xs text-gray-500 mb-1">Top Engagement Times</div>
                    <div className="flex items-end gap-1 h-16">
                      {[
                        { day: 'Mon', value: 6 },
                        { day: 'Tue', value: 8 },
                        { day: 'Wed', value: 5 },
                        { day: 'Thu', value: 10 },
                        { day: 'Fri', value: 4 },
                        { day: 'Sat', value: 3 },
                        { day: 'Sun', value: 4 },
                      ].map((d, i) => (
                        <div key={d.day} className="flex flex-col items-center justify-end flex-1">
                          <div className="w-3 rounded bg-blue-400" style={{ height: `${d.value * 8}px` }}></div>
                          <span className="text-xs text-gray-400 mt-1">{d.day}</span>
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">Peak activity: Thursdays 3-5 PM</div>
                  </div>
                </div>
                {/* Top Contributors */}
                <div className="bg-white rounded-2xl shadow p-6">
                  <div className="font-bold text-md mb-4">Top Contributors</div>
                  <div className="space-y-3">
                    {[
                      { name: 'Sarah Al-Otaibi', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', points: 586 },
                      { name: 'Mohammed Al-Ghamdi', avatar: 'https://randomuser.me/api/portraits/men/45.jpg', points: 542 },
                      { name: 'Fatima Al-Zahrani', avatar: 'https://randomuser.me/api/portraits/women/65.jpg', points: 498 },
                      { name: 'Khalid Al-Harbi', avatar: 'https://randomuser.me/api/portraits/men/46.jpg', points: 423 },
                      { name: 'Noura Al-Qahtani', avatar: 'https://randomuser.me/api/portraits/women/66.jpg', points: 387 },
                    ].map((c, i) => (
                      <div key={c.name} className="flex items-center gap-2">
                        <img src={c.avatar} alt={c.name} className="w-7 h-7 rounded-full object-cover" />
                        <span className="flex-1 text-xs font-semibold text-gray-800">{c.name}</span>
                        <div className="flex-1 h-2 bg-blue-100 rounded-full mr-2 ml-2">
                          <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${(c.points / 600) * 100}%` }}></div>
                        </div>
                        <span className="text-xs text-blue-700 font-bold">{c.points} pts</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* New: Lower Community Section */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Upcoming Events */}
              <div className="flex-1 min-w-[320px] bg-white rounded-2xl shadow p-6">
                <div className="font-bold text-lg mb-4">Upcoming Events</div>
                <div className="space-y-3 mb-4">
                  {[
                    { date: 'MAY 15', title: 'Webinar: Advanced Pedagogical Methods', time: '3:00 PM - 4:30 PM • Virtual', type: 'Webinar', typeColor: 'bg-blue-100 text-blue-700', registered: 248 },
                    { date: 'MAY 22', title: 'Workshop: Collaborative Lesson Design', time: '1:00 PM - 4:00 PM • Riyadh Campus', type: 'Workshop', typeColor: 'bg-green-100 text-green-700', registered: 42 },
                    { date: 'JUN 05', title: 'Panel: Future of Education in Saudi Arabia', time: '5:00 PM - 6:30 PM • Virtual', type: 'Panel', typeColor: 'bg-purple-100 text-purple-700', registered: 126 },
                  ].map((event, i) => (
                    <div key={event.title} className="flex items-center gap-4 bg-gray-50 rounded-xl p-3">
                      <div className="flex flex-col items-center justify-center w-16">
                        <div className="text-lg font-bold text-purple-600">{event.date.split(' ')[0]}</div>
                        <div className="text-xs text-gray-400">{event.date.split(' ')[1]}</div>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-sm mb-1">{event.title}</div>
                        <div className="text-xs text-gray-500 mb-1">{event.time}</div>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mr-2 ${event.typeColor}`}>{event.type}</span>
                        <span className="text-xs text-gray-400">{event.registered} registered</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full flex items-center justify-center gap-2 text-gray-700 text-sm font-semibold py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="4" stroke="#64748b" strokeWidth="2" /><path d="M8 2v4M16 2v4" stroke="#64748b" strokeWidth="2" strokeLinecap="round"/></svg> View All Events</button>
              </div>
              {/* Discussions */}
              <div className="flex-[2] min-w-[340px] flex flex-col gap-6">
                {/* Discussion 1: Resource */}
                <div className="bg-white rounded-2xl shadow p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <img src="https://randomuser.me/api/portraits/women/65.jpg" className="w-9 h-9 rounded-full object-cover" alt="" />
                    <div>
                      <div className="font-semibold text-gray-900 flex items-center gap-2">Fatima Al-Zahrani <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-0.5 rounded-full">Department Head</span></div>
                      <div className="text-xs text-gray-500">Posted in <span className="font-semibold text-blue-700">EdTech Integration</span> • 5 hours ago</div>
                    </div>
                  </div>
                  <div className="font-bold text-md mb-1">Collaborative Resource: AI Tools for Education</div>
                  <div className="text-gray-700 mb-3">I'm creating a collaborative document of AI tools that can benefit our teaching practices. Please add any tools you've found useful and share your experiences!</div>
                  <div className="bg-blue-50 rounded-lg p-3 text-sm mb-3 border border-blue-200">
                    <div className="font-semibold text-blue-700 mb-1">AI Tools for Education - Collaborative Document</div>
                    <div className="text-xs text-gray-700 mb-1">This document contains 15+ AI tools for content creation, assessment, and personalized learning. Click to view or contribute.</div>
                    <div className="text-xs text-gray-400">12 contributors • Last updated: 35 minutes ago</div>
                  </div>
                  <div className="flex items-center gap-6 text-xs text-gray-500 mb-2">
                    <span>37 Likes</span>
                    <span>5 Comments</span>
                    <button className="ml-auto text-gray-400 hover:text-blue-600">Save</button>
                  </div>
                </div>
                {/* Discussion 2: Poll */}
                <div className="bg-white rounded-2xl shadow p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <img src="https://randomuser.me/api/portraits/men/46.jpg" className="w-9 h-9 rounded-full object-cover" alt="" />
                    <div>
                      <div className="font-semibold text-gray-900 flex items-center gap-2">Khalid Al-Harbi <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">Teacher</span></div>
                      <div className="text-xs text-gray-500">Posted in <span className="font-semibold text-blue-700">Assessment Strategies</span> • Yesterday</div>
                    </div>
                  </div>
                  <div className="font-bold text-md mb-1">Poll: Most Effective Formative Assessment Methods</div>
                  <div className="text-gray-700 mb-3">I'm curious about which formative assessment methods you find most effective in your classroom. Please vote and share your experiences!</div>
                  <div className="space-y-2 mb-2">
                    {[
                      { label: 'Digital Exit Tickets', percent: 68 },
                      { label: 'Think-Pair-Share', percent: 42 },
                      { label: 'Student Self-Assessment', percent: 57 },
                      { label: 'Peer Feedback', percent: 34 },
                    ].map((opt, i) => (
                      <div key={opt.label} className="mb-1">
                        <div className="flex justify-between text-xs mb-0.5">
                          <span>{opt.label}</span>
                          <span className="font-semibold text-gray-700">{opt.percent}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div className="h-3 rounded-full bg-blue-500" style={{ width: `${opt.percent}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 mb-2">Total votes: 143 • Poll ends in 2 days</div>
                  <div className="flex items-center gap-6 text-xs text-gray-500 mb-2">
                    <span>19 Likes</span>
                    <span>12 Comments</span>
                    <button className="ml-auto text-gray-400 hover:text-blue-600">Save</button>
                  </div>
                </div>
                <button className="w-full bg-gray-50 text-blue-700 font-semibold rounded-lg px-4 py-2 mt-2 hover:bg-blue-50 transition">Load More Discussions</button>
              </div>
              {/* Resource Library & Collaborative Projects */}
              <div className="w-full lg:w-80 flex flex-col gap-6">
                {/* Resource Library */}
                <div className="bg-white rounded-2xl shadow p-6 mb-2">
                  <div className="flex items-center justify-between mb-4">
                    <div className="font-bold text-md">Resource Library</div>
                    <a href="#" className="text-blue-600 text-xs font-medium hover:underline">View All</a>
                  </div>
                  <div className="space-y-2 mb-3">
                    {[
                      { name: 'Differentiated Instruction Handbook', type: 'PDF', size: '3.2 MB', downloads: 648, color: 'bg-blue-100 text-blue-700' },
                      { name: 'Assessment Tracker Template', type: 'Excel', size: '1.8 MB', downloads: 436, color: 'bg-green-100 text-green-700' },
                      { name: 'EdTech Integration Workshop', type: 'PowerPoint', size: '5.4 MB', downloads: 293, color: 'bg-purple-100 text-purple-700' },
                      { name: 'Classroom Management Guide', type: 'Document', size: '2.1 MB', downloads: 521, color: 'bg-yellow-100 text-yellow-700' },
                    ].map((res, i) => (
                      <div key={res.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition">
                        <span className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold text-xs ${res.color}`}>{res.type}</span>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 text-xs">{res.name}</div>
                          <div className="text-xs text-gray-500">{res.type} • {res.size} • {res.downloads} downloads</div>
                        </div>
                        <button className="text-gray-400 hover:text-blue-600"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 5v14m7-7H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button>
                      </div>
                    ))}
                  </div>
                  <button className="w-full flex items-center justify-center gap-2 text-gray-700 text-sm font-semibold py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 5v14m7-7H5" stroke="#64748b" strokeWidth="2" strokeLinecap="round"/></svg> Share a Resource</button>
                </div>
                {/* Collaborative Projects */}
                <div className="bg-white rounded-2xl shadow p-6">
                  <div className="font-bold text-md mb-4">Collaborative Projects</div>
                  <div className="space-y-3 mb-3">
                    {[
                      { name: 'Curriculum Design Team', desc: 'Collaborative project to redesign the science curriculum for grades 6-8 with an emphasis on project-based learning.', members: 4, color: 'bg-blue-50', active: true },
                      { name: 'Digital Learning Resources', desc: 'Creating a repository of digital learning resources and lesson plans for language arts teachers across all grade levels.', members: 8, color: 'bg-purple-50', active: true },
                    ].map((proj, i) => (
                      <div key={proj.name} className={`rounded-lg p-3 ${proj.color} flex flex-col gap-1`}>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-blue-700 text-xs">{proj.name}</span>
                          <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Active</span>
                        </div>
                        <div className="text-xs text-gray-700 mb-1">{proj.desc}</div>
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {Array.from({ length: proj.members }).map((_, idx) => (
                              <img key={idx} src={`https://randomuser.me/api/portraits/lego/${idx + 1}.jpg`} className="w-6 h-6 rounded-full border-2 border-white" alt="" />
                            ))}
                          </div>
                          <span className="text-xs text-gray-400 ml-2">+{proj.members}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full bg-blue-600 text-white font-semibold rounded-lg px-4 py-2 mt-2 hover:bg-blue-700 transition flex items-center justify-center gap-2"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 5v14m7-7H5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg> Start New Project</button>
                </div>
              </div>
            </div>
          </div>
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
    // --- Mock Data for Demo Layout ---
    const statCards = [
      {
        label: 'Total Enrollments',
        value: '1,248',
        icon: BarChart3,
        color: 'bg-blue-100 text-blue-600',
        change: '+12.4%',
        changeColor: 'text-green-600',
        desc: 'vs last quarter',
      },
      {
        label: 'Available Trainers',
        value: '86',
        icon: Users,
        color: 'bg-green-100 text-green-600',
        change: '+8.3%',
        changeColor: 'text-green-600',
        desc: 'vs last quarter',
      },
      {
        label: 'Upcoming Sessions',
        value: '42',
        icon: Calendar,
        color: 'bg-purple-100 text-purple-600',
        change: '+5.2%',
        changeColor: 'text-green-600',
        desc: 'vs last quarter',
      },
      {
        label: 'Pending Queries',
        value: '24',
        icon: HelpCircle,
        color: 'bg-yellow-100 text-yellow-600',
        change: '-14.8%',
        changeColor: 'text-red-600',
        desc: 'vs last quarter',
      },
    ];
    const tabs = ['All Enrollments', 'Pending Approval', 'Confirmed', 'Completed', 'Cancelled'];
    const [activeTab, setActiveTab] = React.useState(0);
    const [search, setSearch] = React.useState('');
    const [facility, setFacility] = React.useState('All Facilities');
    const [program, setProgram] = React.useState('All Programs');
    const [format, setFormat] = React.useState('All Formats');
    // Table mock data
    const tableData = [
      {
        teacher: { name: 'Sarah Al-Otaibi', id: 'T-2025-0142', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
        program: { name: 'Advanced Pedagogical Methods', format: 'ILT Format', hours: 45 },
        facility: { name: 'Main Campus', room: 'TC-104' },
        trainer: { name: 'Ahmad Al-Faisal', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', role: 'Pedagogy Expert' },
        start: { date: 'May 15, 2025', time: '09:00 - 15:00' },
        status: { label: 'Confirmed', color: 'bg-green-100 text-green-700' },
      },
      {
        teacher: { name: 'Mohammed Al-Ghamdi', id: 'T-2025-0156', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
        program: { name: 'Digital Learning Technologies', format: 'VILT Format', hours: 30 },
        facility: { name: 'Virtual', room: 'Platform: Zoom' },
        trainer: { name: 'Khalid Al-Harbi', avatar: 'https://randomuser.me/api/portraits/men/46.jpg', role: 'EdTech Specialist' },
        start: { date: 'May 10, 2025', time: '13:00 - 16:00' },
        status: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
      },
      {
        teacher: { name: 'Fatima Al-Zahrani', id: 'T-2025-0178', avatar: 'https://randomuser.me/api/portraits/women/65.jpg' },
        program: { name: 'Assessment Design Workshop', format: 'ILT Format', hours: 25 },
        facility: { name: 'East Wing', room: 'Room: EW-201' },
        trainer: { name: 'Noura Al-Qahtani', avatar: 'https://randomuser.me/api/portraits/women/66.jpg', role: 'Assessment Expert' },
        start: { date: 'May 18, 2025', time: '10:00 - 15:00' },
        status: { label: 'Confirmed', color: 'bg-green-100 text-green-700' },
      },
      {
        teacher: { name: 'Abdul Rahman Al-Sulaiman', id: 'T-2025-0185', avatar: 'https://randomuser.me/api/portraits/men/47.jpg' },
        program: { name: 'Classroom Management', format: 'Hybrid Format', hours: 35 },
        facility: { name: 'West Wing', room: 'Room: WW-105' },
        trainer: { name: 'Omar Al-Farsi', avatar: 'https://randomuser.me/api/portraits/men/48.jpg', role: 'Behavioral Expert' },
        start: { date: 'May 22, 2025', time: '09:00 - 14:00' },
        status: { label: 'Waitlisted', color: 'bg-blue-100 text-blue-700' },
      },
      {
        teacher: { name: 'Aisha Al-Dosari', id: 'T-2025-0192', avatar: 'https://randomuser.me/api/portraits/women/67.jpg' },
        program: { name: 'Curriculum Development', format: 'VILT Format', hours: 40 },
        facility: { name: 'Virtual', room: 'Platform: MS Teams' },
        trainer: { name: 'Saad Al-Malki', avatar: 'https://randomuser.me/api/portraits/men/49.jpg', role: 'Curriculum Specialist' },
        start: { date: 'May 25, 2025', time: '14:00 - 17:00' },
        status: { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
      },
    ];
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Training Enrollments</h1>
            <p className="text-gray-500 text-base">Manage all enrollment activities for Maarif Teacher Training Academy</p>
          </div>
          <div className="flex items-center gap-2">
            <select className="border rounded-lg px-3 py-2 text-sm">
              <option>Q2 2025 (Apr-Jun)</option>
            </select>
            <button className="p-2 rounded-lg border hover:bg-gray-100 transition" title="Download">
              <Download className="w-5 h-5 text-gray-500" />
            </button>
            <button className="p-2 rounded-lg border hover:bg-gray-100 transition" title="Filter">
              <Filter className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {statCards.map((stat, idx) => (
            <div key={stat.label} className="bg-white rounded-2xl shadow p-6 flex flex-col min-w-[180px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 font-medium">{stat.label}</span>
                <span className={`p-2 rounded-full ${stat.color}`}>{React.createElement(stat.icon, { className: 'w-5 h-5' })}</span>
              </div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="flex items-center text-xs gap-1">
                <span className={stat.changeColor}>{stat.change}</span>
                <span className="text-gray-400">vs last quarter</span>
              </div>
            </div>
          ))}
        </div>
        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-6 border-b mb-4">
          {tabs.map((tab, idx) => (
            <button
              key={tab}
              onClick={() => setActiveTab(idx)}
              className={`pb-3 px-2 text-sm font-medium border-b-2 ${activeTab === idx ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-blue-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, ID, course..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ minWidth: 280 }}
            />
          </div>
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm" value={facility} onChange={e => setFacility(e.target.value)}>
            <option>All Facilities</option>
          </select>
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm" value={program} onChange={e => setProgram(e.target.value)}>
            <option>All Programs</option>
          </select>
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm" value={format} onChange={e => setFormat(e.target.value)}>
            <option>All Formats</option>
          </select>
        </div>
        {/* Table */}
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
                <tr key={row.teacher.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3 px-4"><input type="checkbox" /></td>
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img src={row.teacher.avatar} alt={row.teacher.name} className="w-8 h-8 rounded-full object-cover border" />
                    <div>
                      <div className="font-medium text-gray-900">{row.teacher.name}</div>
                      <div className="text-xs text-gray-500">ID: {row.teacher.id}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{row.program.name}</div>
                    <div className="text-xs text-gray-500">{row.program.format} • {row.program.hours} Hours</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{row.facility.name}</div>
                    <div className="text-xs text-gray-500">{row.facility.room}</div>
                  </td>
                  <td className="py-3 px-4 flex items-center gap-2">
                    <img src={row.trainer.avatar} alt={row.trainer.name} className="w-8 h-8 rounded-full object-cover border" />
                    <div>
                      <div className="font-medium text-gray-900 text-xs">{row.trainer.name}</div>
                      <div className="text-xs text-gray-500">{row.trainer.role}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{row.start.date}</div>
                    <div className="text-xs text-gray-500">{row.start.time}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${row.status.color}`}>{row.status.label}</span>
                  </td>
                  <td className="py-3 px-4">
                    <a href="#" className="text-blue-600 hover:underline font-medium">View</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-500">
            <span>Showing 1 to 5 of 248 results</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100">&lt; Previous</button>
              <button className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100">Next &gt;</button>
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
            <img src="/logo/Riyada.png" alt="Riyada Logo" className="w-10 h-10 object-contain rounded-full bg-white border" />
            Riyada Trainings
          </div>
          <nav className="space-y-2">
            {/* Sidebar items with section dividers */}
            <div className="mb-2">
              <div className="text-sm text-gray-400 uppercase mb-1">Dashboard</div>
              <SidebarItem icon={Home} label="Dashboard" active={activeSection === 'dashboard'} onClick={() => setActiveSection('dashboard')} />
              <SidebarItem icon={Users} label="Community" active={activeSection === 'community'} onClick={() => setActiveSection('community')} />
              <SidebarItem icon={BarChart3} label="Enrollments" active={activeSection === 'enrollments'} onClick={() => setActiveSection('enrollments')} />
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