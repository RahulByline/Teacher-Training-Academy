import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import {
  BookOpen, TrendingUp, Award, Calendar, Clock, Target, Star, Users, Trophy, ChevronRight, Play, BarChart3, MessageSquare, Folder, Settings, User, LogOut, Bell, ChevronDown
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Outlet, useNavigate, useLocation, NavLink, Routes, Route } from 'react-router-dom';
import { Course } from '../../types';
 
// --- Mock Data: Use until real API is available ---
// Competency Map
const mockCompetency = [
  { label: 'Pedagogy', value: 82 },
  { label: 'Assessment', value: 76 },
  { label: 'Technology', value: 54 },
  { label: 'Management', value: 88 },
  { label: 'Content', value: 79 },
];
// Leaderboard
const mockLeaderboard = [
  { name: 'Mohammed Al-Saleh', points: 2560, rank: 1 },
  { name: 'Fatima Al-Zahrani', points: 2340, rank: 2 },
  { name: 'Khalid Al-Harbi', points: 2290, rank: 3 },
  { name: 'You', points: 1240, rank: 28 },
];
// Achievements
const mockAchievements = [
  { label: 'Fast Learner', icon: Trophy },
  { label: 'Consistent', icon: Star },
  { label: 'Team Player', icon: Users },
  { label: 'Excellence', icon: Award },
  { label: 'Master', icon: BookOpen },
  { label: 'Innovator', icon: TrendingUp },
];
// Events
const mockEvents = [
  { title: 'Assessment Submission', date: 'Tomorrow', desc: 'Submit your final assessment for "Inquiry-Based Learning"' },
  { title: 'Live Workshop', date: 'May 15', desc: 'Virtual Lab Techniques with Dr. Ahmed Al-Farsi' },
  { title: 'Peer Collaboration', date: 'May 18', desc: 'Group project submission: "Developing Inquiry-Based Lab Activities"' },
  { title: 'Certification Exam', date: 'May 25', desc: 'Level 2 Science Pedagogy Specialist certification examination' },
];
// Mentors
const mockMentors = [
  { name: 'Sarah', status: 'Online' },
  { name: 'Mohammed', status: 'Online' },
  { name: 'Khalid', status: 'In 2h' },
  { name: 'Fatima', status: 'Tomorrow' },
];
 
const sidebarItems = [
  { label: 'My Dashboard', icon: BarChart3, route: 'dashboard' },
  { label: 'My Learning', icon: BookOpen, route: 'my-learning' },
  { label: 'Learning Paths', icon: TrendingUp, route: 'learning-paths' },
  { label: 'Certifications', icon: Award, route: 'certifications' },
  { label: 'Assessments', icon: Calendar, route: 'assessments' },
  { label: 'Competency Map', icon: BarChart3, route: 'competency-map' },
  { label: 'Achievements', icon: Trophy, route: 'achievements' },
  { label: 'Community', icon: Users, route: 'community', sub: [
    { label: 'Peer Network', route: 'community/peer-network' },
    { label: 'Leaderboards', route: 'community/leaderboards' },
    { label: 'Discussion Forums', route: 'community/discussion-forums' },
    { label: 'Resource Library', route: 'community/resource-library' },
  ]},
  { label: 'Settings', icon: Settings, route: 'settings', sub: [
    { label: 'Profile', route: 'settings/profile' },
    { label: 'Notifications', route: 'settings/notifications' },
  ]},
];
 
export const TeacherDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [openSub, setOpenSub] = useState<string | null>(null);
 
  const handleSidebarClick = (item: any) => {
    if (item.sub) {
      setOpenSub(openSub === item.label ? null : item.label);
    } else {
      setOpenSub(null);
      navigate(`/teacher-dashboard/${item.route}`);
    }
  };
 
  useEffect(() => {
    async function fetchCourses() {
      if (user && user.id) {
        setLoading(true);
        try {
          const userCourses = await apiService.getUserCourses(user.id);
          setCourses(userCourses);
        } catch (e) {
          setCourses([]);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchCourses();
  }, [user && user.id]);
 
  // --- Stats from real data ---
  const completed = courses.filter((c: any) => c.progress === 100).length;
  const inProgress = courses.filter((c: any) => c.progress && c.progress > 0 && c.progress < 100).length;
  const total = courses.length;
  const stats = [
    { title: 'Total Courses', value: total, icon: BookOpen, color: 'bg-indigo-100 text-indigo-600' },
    { title: 'Completed Courses', value: completed, icon: Award, color: 'bg-green-100 text-green-600' },
    { title: 'In Progress', value: inProgress, icon: TrendingUp, color: 'bg-blue-100 text-blue-600' },
    // Add more stats here if you have real data (e.g., certifications, hours)
  ];
 
  // --- Learning Path from real data ---
  const learningPath = courses.map((course) => ({
    label: course.fullname,
    progress: course.progress || 0,
  }));
 
  // --- Recommendations from real data ---
  // Example: recommend courses not completed
  const recommendations = courses.filter((c: any) => (c.progress || 0) < 100);
 
  // --- Recent Activity from real data ---
  // Example: recently completed courses
  const recentActivity = courses
    .filter((c) => c.progress === 100)
    .map((c) => ({
      type: 'Completed',
      text: c.fullname,
      date: c.enddate ? new Date(c.enddate * 1000).toLocaleDateString() : '',
      points: 100, // Placeholder, replace with real points if available
    }));
 
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-lg">{t('Loading...')}</div>;
  }
 
  return (
    <div className="flex min-h-screen min-w-screen w-full h-full bg-[#f9fafb] font-sans">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col justify-between w-20 lg:w-64 bg-white text-gray-800 py-8 px-2 lg:px-6 rounded-tr-2xl rounded-br-2xl shadow-lg h-full border-r border-gray-200">
        <nav className="flex flex-col gap-2">
          {sidebarItems.map((item) => (
            <div key={item.label}>
              <button
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full text-left ${
                  (location.pathname === `/teacher-dashboard/${item.route}` || (item.route === '' && location.pathname === '/teacher-dashboard'))
                    ? 'bg-indigo-50 text-indigo-600 font-semibold shadow'
                    : 'hover:bg-gray-100 hover:text-indigo-500 text-gray-800'
                }`}
                onClick={() => handleSidebarClick(item)}
              >
                <item.icon className={`w-6 h-6 ${
                  (location.pathname === `/teacher-dashboard/${item.route}` || (item.route === '' && location.pathname === '/teacher-dashboard'))
                    ? 'text-indigo-500' : 'text-gray-400 group-hover:text-indigo-500'}`} />
                <span className="hidden lg:inline text-base font-medium">{item.label}</span>
                {item.sub && (
                  <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${openSub === item.label ? 'rotate-180' : ''}`} />
                )}
              </button>
              {item.sub && openSub === item.label && (
                <div className="ml-8 flex flex-col gap-1 mt-1">
                  {item.sub.map((subItem: any) => (
                    <NavLink
                      key={subItem.label}
                      to={`/teacher-dashboard/${subItem.route}`}
                      className={({ isActive }) =>
                        `block px-3 py-2 rounded-lg text-sm transition-colors ${
                          isActive ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-gray-100 text-gray-700'
                        }`
                      }
                    >
                      {subItem.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="flex flex-col items-center gap-2 mt-8">
          <img src={user?.profileimageurl || '/public/logo-BYbhmxQK-removebg-preview.png'} alt={user?.fullname || 'User'} className="w-12 h-12 rounded-full border-2 border-indigo-400 object-cover" />
          <span className="hidden lg:block font-semibold">{user?.fullname || user?.firstname || user?.username || 'Teacher'}</span>
          <button className="flex items-center gap-2 mt-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-200"><LogOut className="w-4 h-4" /> Logout</button>
        </div>
      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 w-full h-full">
        {/* Top Bar */}
        <header className="flex items-center justify-between bg-white px-4 py-4 shadow rounded-bl-2xl w-full">
          <div className="text-lg md:text-2xl font-bold text-gray-900">Welcome, {user?.fullname || user?.firstname || user?.username || ''}</div>
          <div className="flex items-center gap-4">
            <span className="text-gray-500 text-sm hidden md:inline">Q2 2025 (Apr-Jun)</span>
            <button className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"><Bell className="w-6 h-6 text-gray-500" /></button>
            <div className="relative">
              <button className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                <img src={user?.profileimageurl || '/public/logo-BYbhmxQK-removebg-preview.png'} alt={user?.fullname || 'User'} className="w-8 h-8 rounded-full object-cover" />
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        </header>
        {/* Routed Page Content */}
        <Outlet />
      </div>
    </div>
  );
};