import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard, CalendarDays, TrendingUp, Users, Star, BarChart3, MessageSquare, Award, Settings, User, LogOut, Bell, ChevronDown, CheckCircle, Clock, XCircle, Circle, ArrowUpRight, BadgeCheck, Trophy, BookOpen, Folder
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { Course } from '../../types';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import TrainerDashboardDetails from './TrainerDashboardDetails';

// --- Interfaces ---
interface Stat {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  change: string;
  changeColor: string;
}
interface Session {
  date: string;
  title: string;
  time: string;
  location: string;
  enrolled: number;
}
interface ProgressBar {
  label: string;
  value: number;
  color: string;
  count: number;
}
interface Feedback {
  name: string;
  rating: number;
  text: string;
  date: string;
}
interface Certification {
  label: string;
  status: 'done' | 'inprogress' | 'planned';
  date: string;
  percent?: number;
  description?: string;
}
interface Competency {
  label: string;
  value: number;
}
interface Badge {
  label: string;
  icon: React.ElementType;
  date?: string;
  pending?: boolean;
  description?: string;
}

// --- Reusable Components ---
const StatCard: React.FC<{ stat: Stat }> = ({ stat }) => (
  <motion.div
    whileHover={{ y: -4, boxShadow: '0 8px 32px 0 rgba(99,102,241,0.10)' }}
    className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-2 min-w-[150px]"
    tabIndex={0}
    aria-label={stat.label}
  >
    <div className={`w-12 h-12 flex items-center justify-center rounded-xl mb-2 ${stat.color}`}> <stat.icon className="w-6 h-6" /> </div>
    <div className="flex items-center gap-2">
      <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
      <ArrowUpRight className={`w-4 h-4 ${stat.changeColor}`} />
      <span className={`text-xs font-semibold ${stat.changeColor}`}>{stat.change}</span>
    </div>
    <span className="text-gray-500 text-sm">{stat.label}</span>
  </motion.div>
);
const ProgressBar: React.FC<ProgressBar> = ({ label, value, color, count }) => (
  <div className="mb-2">
    <div className="flex justify-between mb-1">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <span className="text-sm font-medium text-gray-700">{count}</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-3">
      <div className={`${color} h-3 rounded-full`} style={{ width: `${value}%` }}></div>
    </div>
  </div>
);
const BadgeCard: React.FC<Badge> = ({ label, icon: Icon, date, pending, description }) => (
  <div className={`flex flex-col items-center p-4 rounded-2xl shadow bg-white min-w-[120px] ${pending ? 'opacity-60' : ''}`}> <Icon className="w-8 h-8 mb-2 text-indigo-500" /> <span className="font-semibold text-gray-800 text-center">{label}</span> {date && <span className="text-xs text-gray-500">{date}</span>} {pending && <span className="text-xs text-gray-400">{description}</span>} </div>
);

// --- Mock Data (from reference dashboard) ---
const mockSchedule = [
  { day: 'MON', date: 5, events: [{ time: '9:00 - 11:00', title: 'Digital Learning Basics', color: 'bg-blue-100 text-blue-800' }] },
  { day: 'TUE', date: 6, events: [{ time: '13:00 - 15:00', title: 'Assessment Design', color: 'bg-purple-100 text-purple-800' }] },
  { day: 'WED', date: 7, events: [] },
  { day: 'THU', date: 8, events: [
    { time: '10:00 - 12:00', title: 'Classroom Management', color: 'bg-green-100 text-green-800' },
    { time: '14:00 - 16:00', title: 'Mentoring Session', color: 'bg-yellow-100 text-yellow-800' }
  ] },
  { day: 'FRI', date: 9, events: [
    { time: '9:00 - 12:00', title: 'Advanced Digital Assessment', color: 'bg-blue-100 text-blue-800' }
  ] },
  { day: 'SAT', date: 10, events: [
    { time: '11:00 - 13:00', title: 'Trainer Development', color: 'bg-red-100 text-red-800' }
  ] },
  { day: 'SUN', date: 11, events: [] },
];
const mockFeedback = [
  { name: 'Mohammed Al-Ghamdi', course: 'Digital Assessment Course', rating: 5.0, text: 'Excellent session! Sarah\'s teaching style made complex assessment techniques very approachable. I can\'t wait to implement these in my classroom.', date: 'May 6, 2025', avatar: '/public/avatar1.png' },
  { name: 'Aisha Al-Sulaiman', course: 'Classroom Management', rating: 4.5, text: 'The strategies shared were practical and immediately applicable. Would appreciate more time for group activities in future sessions.', date: 'May 4, 2025', avatar: '/public/avatar2.png' },
  { name: 'Khalid Al-Harbi', course: 'Digital Learning Basics', rating: 5.0, text: 'As someone who was intimidated by technology, this course was a game-changer. Sarah\'s patient approach helped me gain confidence quickly.', date: 'May 2, 2025', avatar: '/public/avatar3.png' },
];
const mockRoadmap = [
  { label: 'Level 1 Certification', desc: 'Basic Training Methodologies', status: 'done', date: 'August 2023' },
  { label: 'Level 2 Certification', desc: 'Advanced Pedagogical Methods', status: 'done', date: 'March 2024' },
  { label: 'Level 3 Certification', desc: 'Master Trainer Specialization', status: 'inprogress', percent: 75, date: 'Due: July 2025' },
  { label: 'Level 4 Certification', desc: 'Academic Leadership Track', status: 'planned', date: '2026' },
];
const mockCompetencies = [
  { label: 'Training Delivery', value: 95 },
  { label: 'Assessment Design', value: 88 },
  { label: 'Digital Learning', value: 82 },
  { label: 'Curriculum Design', value: 78 },
  { label: 'Mentoring Skills', value: 92 },
  { label: 'Research & Innovation', value: 65 },
];
const mockAchievements = [
  { label: 'Master Trainer', icon: BadgeCheck },
  { label: '5-Star Educator', icon: Star },
  { label: '100+ Trainees', icon: Users },
  { label: 'Digital Expert', icon: BookOpen },
  { label: 'Impact Maker', icon: Trophy },
];

// --- Main Dashboard ---
export const TrainerDashboard: React.FC = () => {
  // ALL HOOKS AT THE TOP
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    if (user && user.id) {
      setLoading(true);
      setError(null);
      apiService.getUserCourses(user.id)
        .then(setCourses)
        .catch((err) => setError(err.message || 'Failed to fetch courses'))
        .finally(() => setLoading(false));
    }
  }, [user && user.id]);

  // --- Derived Data from Real Courses ---
  const activeSessions = useMemo(() => courses.filter(c => typeof c.progress === 'number' && c.progress < 100).length, [courses]);
  const totalTrainees = useMemo(() => courses.reduce((sum, c) => sum + (c.enrollmentCount || 0), 0) || 0, [courses]);
  const avgRating = useMemo(() => {
    const ratings = courses.map(c => c.rating).filter(Boolean) as number[];
    if (!ratings.length) return 0;
    return (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
  }, [courses]);
  const completionRate = useMemo(() => {
    if (!courses.length) return 0;
    const completed = courses.filter(c => typeof c.progress === 'number' && c.progress === 100).length;
    return Math.round((completed / courses.length) * 100);
  }, [courses]);

  // --- Fallback to mock data if real data is missing ---
  const statsToShow = [
    {
      label: 'Active Sessions',
      value: activeSessions || 8,
      icon: CalendarDays,
      color: 'bg-indigo-100 text-indigo-600',
      change: '',
      changeColor: 'text-green-600'
    },
    {
      label: 'Total Trainees',
      value: totalTrainees || 124,
      icon: Users,
      color: 'bg-green-100 text-green-600',
      change: '',
      changeColor: 'text-green-600'
    },
    {
      label: 'Avg Rating',
      value: avgRating !== '0' ? avgRating : '4.8',
      icon: Star,
      color: 'bg-yellow-100 text-yellow-500',
      change: '',
      changeColor: 'text-green-600'
    },
    {
      label: 'Completion Rate',
      value: completionRate ? `${completionRate}%` : '92%',
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-600',
      change: '',
      changeColor: 'text-green-600'
    }
  ];

  const now = Date.now() / 1000;
  const realUpcomingSessions = courses.filter(c => c.startdate && c.startdate > now)
    .map(c => ({
      date: c.startdate ? new Date(c.startdate * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '',
      title: c.fullname,
      time: c.startdate && c.enddate ? `${new Date(c.startdate * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}–${new Date(c.enddate * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : '',
      location: c.format || '',
      enrolled: c.enrollmentCount || 0
    }));
  const upcomingSessionsToShow = realUpcomingSessions.length ? realUpcomingSessions : [
    { date: 'May 9', title: 'Advanced Digital Assessment', time: '9:00 - 12:00', location: 'Room 204', enrolled: 28 },
    { date: 'May 11', title: 'Trainer Development Workshop', time: '11:00 - 13:00', location: 'Virtual', enrolled: 12 },
    { date: 'May 13', title: 'Curriculum Design Masterclass', time: '10:00 - 14:00', location: 'Room 102', enrolled: 18 },
    { date: 'May 15', title: 'Student Engagement Strategies', time: '13:00 - 15:00', location: 'Room 305', enrolled: 24 },
  ];

  const completed = courses.filter(c => typeof c.progress === 'number' && c.progress === 100).length;
  const inProgress = courses.filter(c => typeof c.progress === 'number' && c.progress > 0 && c.progress < 100).length;
  const notStarted = courses.filter(c => typeof c.progress !== 'number' || c.progress === 0).length;
  const atRisk = courses.filter(c => typeof c.progress === 'number' && c.progress > 0 && c.progress < 30).length;
  const progressBarsToShow = courses.length ? [
    { label: 'Completed', value: Math.round((completed / courses.length) * 100), color: 'bg-green-500', count: completed },
    { label: 'In Progress', value: Math.round((inProgress / courses.length) * 100), color: 'bg-yellow-400', count: inProgress },
    { label: 'At Risk', value: Math.round((atRisk / courses.length) * 100), color: 'bg-red-500', count: atRisk },
    { label: 'Not Started', value: Math.round((notStarted / courses.length) * 100), color: 'bg-gray-400', count: notStarted },
  ] : [
    { label: 'Completed', value: 64, color: 'bg-green-500', count: 18 },
    { label: 'In Progress', value: 25, color: 'bg-yellow-400', count: 7 },
    { label: 'At Risk', value: 7, color: 'bg-red-500', count: 2 },
    { label: 'Not Started', value: 4, color: 'bg-gray-400', count: 1 },
  ];

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, route: '' },
    { label: 'My Schedule', icon: CalendarDays, route: 'schedule' },
    { label: 'My Courses', icon: BookOpen, route: 'courses' },
    { label: 'My Trainees', icon: Users, route: 'trainees' },
    { label: 'Assessments', icon: BarChart3, route: 'assessments' },
    { label: 'Feedback', icon: MessageSquare, route: 'feedback' },
    { label: 'Certifications', icon: Award, route: 'certifications' },
    { label: 'My Roadmap', icon: TrendingUp, route: 'roadmap' },
    { label: 'My Learning', icon: BookOpen, route: 'learning' },
    { label: 'Achievements', icon: Trophy, route: 'achievements' },
    { label: 'Teaching Materials', icon: Folder, route: 'materials' },
    { label: 'Trainer Community', icon: Users, route: 'community' },
    { label: 'Settings', icon: Settings, route: 'settings' },
  ];
  const today = useMemo(() => new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), []);

  // Only after ALL hooks:
  if (authLoading || !user) {
    return <div className="flex justify-center items-center min-h-screen text-lg">{t('Loading...')}</div>;
  }
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-lg">{t('Loading...')}</div>;
  }
  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-600 text-lg">{error}</div>;
  }

  // --- Sidebar Navigation ---
  const handleNav = (route: string) => {
    navigate(route);
  };

  // Add a handler for logout (replace with your actual logout logic)
  const handleLogout = () => {
    // TODO: Replace with your logout logic
    window.location.href = '/login';
  };

  // --- Main Content ---
  const isDashboardRoot = location.pathname === '/dashboard' || location.pathname === '/dashboard/';
  return (
    <div className="flex min-h-screen min-w-screen w-full h-full bg-[#f9fafb] font-sans">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col justify-between w-20 lg:w-64 bg-white text-gray-800 py-8 px-2 lg:px-6 rounded-tr-2xl rounded-br-2xl shadow-lg h-full border-r border-gray-200">
        <nav className="flex flex-col gap-2">
          {navItems.map((item, i) => {
            const fullRoute = `/dashboard${item.route ? '/' + item.route : ''}`;
            // Active if current path starts with the route (for subpages)
            const isActive = location.pathname === fullRoute || (item.route === '' && (location.pathname === '/dashboard' || location.pathname === '/dashboard/'));
            return (
              <button
                key={item.label}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400
                  ${isActive ? 'bg-indigo-50 text-indigo-600 font-semibold shadow' : 'hover:bg-gray-100 hover:text-indigo-500 text-gray-800'}`}
                onClick={() => navigate(fullRoute)}
              >
                <item.icon className={`w-6 h-6 ${isActive ? 'text-indigo-500' : 'text-gray-400 group-hover:text-indigo-500'}`} />
                <span className="hidden lg:inline text-base font-medium">{t(item.label)}</span>
              </button>
            );
          })}
        </nav>
        <div className="flex flex-col items-center gap-2 mt-8">
          <img src={user.profileimageurl || '/public/logo-BYbhmxQK-removebg-preview.png'} alt={user.fullname || 'User'} className="w-12 h-12 rounded-full border-2 border-indigo-400 object-cover" />
          <span className="hidden lg:block font-semibold">{user.fullname || user.firstname || user.username || 'Trainer'}</span>
          <button className="flex items-center gap-2 mt-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-200"><LogOut className="w-4 h-4" /> {t('Logout')}</button>
        </div>
      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 w-full h-full">
        {/* Top Bar */}
        <header className="flex items-center justify-between bg-white px-4 py-4 shadow rounded-bl-2xl w-full">
          <div className="text-lg md:text-2xl font-bold text-gray-900">{t('Welcome')}, {user.fullname || user.firstname || user.username || ''}</div>
          <div className="flex items-center gap-4">
            <span className="text-gray-500 text-sm hidden md:inline">{today}</span>
            <button className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"><Bell className="w-6 h-6 text-gray-500" /></button>
            <div className="relative">
              <button
                className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                onClick={() => setProfileDropdownOpen((open) => !open)}
              >
                <img src={user.profileimageurl || '/public/logo-BYbhmxQK-removebg-preview.png'} alt={user.fullname || 'User'} className="w-8 h-8 rounded-full object-cover" />
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
              {/* Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg z-50 border border-gray-100">
                  <button
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-800 rounded-t-xl"
                    onClick={() => { navigate('/dashboard/account-settings'); setProfileDropdownOpen(false); }}
                  >
                    Account Settings
                  </button>
                  <button
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 text-red-600 rounded-b-xl"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        {isDashboardRoot ? (
          // Redesigned Dashboard Section (matches provided screenshot)
          <>
            <section className="px-4 py-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Trainer Dashboard</h2>
                <div className="text-gray-500 mb-6">Welcome back, {user.firstname || user.fullname || user.username || 'Trainer'}! Here's an overview of your training activities</div>
                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {statsToShow.map((stat, i) => (
                    <div key={stat.label} className="bg-white rounded-2xl shadow p-6 flex flex-col min-w-[180px]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-500 font-medium">{stat.label}</span>
                        <span className={`p-2 rounded-full ${stat.color}`}>{React.createElement(stat.icon, { className: 'w-5 h-5' })}</span>
                      </div>
                      <div className="text-2xl font-bold mb-1">{stat.value}</div>
                      {stat.change && (
                        <div className="flex items-center text-xs text-green-600">
                          <ArrowUpRight className="w-4 h-4 mr-1" />{stat.change} <span className="ml-1 text-gray-400">vs last month</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {/* Main Grid: Schedule & Upcoming Sessions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Schedule Card */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-2xl shadow p-6 mb-6 h-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg">Your Schedule</h3>
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1 rounded bg-gray-100 text-gray-700 text-sm">Week</button>
                        <button className="px-3 py-1 rounded text-gray-400 text-sm">Month</button>
                        <button className="px-3 py-1 rounded text-gray-400 text-sm">List</button>
                        <span className="ml-4 text-gray-500 text-sm">Today</span>
                      </div>
                    </div>
                    {/* Week Calendar */}
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="text-gray-500">
                            {mockSchedule.map((day) => (
                              <th key={day.day} className="py-2 px-2 font-medium text-center">{day.day}<br /><span className="font-normal">{day.date}</span></th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            {mockSchedule.map((day) => (
                              <td key={day.day} className="align-top px-2 py-2 min-w-[120px]">
                                {day.events.map((event, idx) => (
                                  <div key={idx} className={`mb-2 p-2 rounded-lg text-xs font-medium ${event.color}`}>{event.time}<br />{event.title}</div>
                                ))}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                {/* Upcoming Sessions Card */}
                <div>
                  <div className="bg-white rounded-2xl shadow p-6 mb-6">
                    <h3 className="font-bold text-lg mb-4">Upcoming Sessions</h3>
                    <ul>
                      {upcomingSessionsToShow.map((s, i) => (
                        <li key={s.title + i} className="mb-4 border-l-4 pl-3" style={{ borderColor: ['#3b82f6', '#ef4444', '#10b981', '#f59e42'][i % 4] }}>
                          <div className="font-semibold text-gray-900">{s.title}</div>
                          <div className="flex items-center text-xs text-gray-500 gap-2 mb-1">
                            <CalendarDays className="w-4 h-4" /> {s.date} &bull; {s.time} &bull; {s.location}
                          </div>
                          <div className="text-xs text-gray-500 mb-1">{s.enrolled} trainees enrolled</div>
                          <a href="#" className="text-indigo-600 text-xs font-medium hover:underline">View details</a>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-2 text-indigo-700 text-sm font-medium cursor-pointer hover:underline">View full schedule &rarr;</div>
                  </div>
                </div>
              </div>
            </section>
            {/* New: Dashboard Details Section */}
            <TrainerDashboardDetails />
          </>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
};
// --- End of TrainerDashboard ---