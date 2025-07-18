import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard, CalendarDays, TrendingUp, Users, Star, BarChart3, MessageSquare, Award, Settings, User, LogOut, Bell, ChevronDown, CheckCircle, Clock, XCircle, Circle, ArrowUpRight, BadgeCheck, Trophy, BookOpen, Folder, MapPin
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { Course } from '../../types';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { usersService } from '../../services/usersService';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, addDays, isSameDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';

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

// Add type for event
interface ScheduleEvent {
  dayKey: string;
  time: string;
  title: string;
  color: string;
  location: string;
  enrolled: number;
  type: 'session' | 'activity' | 'overdue' | 'assignment';
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

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { 'en-US': enUS },
});

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
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [weekItems, setWeekItems] = useState<any[]>([]);
  const [weekLoading, setWeekLoading] = useState(false);
  const [monthItems, setMonthItems] = useState<any[]>([]);
  const [monthLoading, setMonthLoading] = useState(false);

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

  useEffect(() => {
    async function fetchCalendar() {
      if (!user || !user.id) return;
      setCalendarLoading(true);
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1; // JS months are 0-based, API expects 1-based
      try {
        const events = await usersService.getTrainerMonthlyCalendar({ userId: user.id, year, month });
        // Map to react-big-calendar event format
        const mapped = events.map((event: any) => ({
          id: event.id,
          title: event.name,
          start: new Date(event.timestart * 1000),
          end: event.timeduration ? new Date((event.timestart + event.timeduration) * 1000) : new Date(event.timestart * 1000),
          location: event.location,
          description: event.description,
        }));
        setCalendarEvents(mapped);
      } catch (e) {
        setCalendarEvents([]);
      } finally {
        setCalendarLoading(false);
      }
    }
    fetchCalendar();
  }, [user]);

  useEffect(() => {
    async function fetchWeekItems() {
      if (!user || !user.id) return;
      setWeekLoading(true);
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const weekStartDate = startOfWeek(now, { weekStartsOn: 1 });
      const weekStart = Math.floor(weekStartDate.getTime() / 1000);
      const weekEnd = Math.floor(addDays(weekStartDate, 7).getTime() / 1000);
      try {
        const items = await usersService.getTrainerWeekActivitiesAndEvents({ userId: user.id, year, month, weekStart, weekEnd });
        setWeekItems(items);
      } catch (e) {
        setWeekItems([]);
      } finally {
        setWeekLoading(false);
      }
    }
    fetchWeekItems();
  }, [user]);

  useEffect(() => {
    async function fetchMonthItems() {
      if (!user || !user.id) return;
      setMonthLoading(true);
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const monthStartDate = new Date(year, now.getMonth(), 1);
      const monthEndDate = new Date(year, now.getMonth() + 1, 1);
      const monthStart = Math.floor(monthStartDate.getTime() / 1000);
      const monthEnd = Math.floor(monthEndDate.getTime() / 1000);
      try {
        const items = await usersService.getTrainerWeekActivitiesAndEvents({ userId: user.id, year, month, weekStart: monthStart, weekEnd: monthEnd });
        setMonthItems(items);
      } catch (e) {
        setMonthItems([]);
      } finally {
        setMonthLoading(false);
      }
    }
    fetchMonthItems();
  }, [user]);

  // Group items by day
  const weekStartDate = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStartDate, i));
  const itemsByDay: { [key: string]: any[] } = {};
  weekItems.forEach(item => {
    const dayKey = format(new Date(item.timestart * 1000), 'yyyy-MM-dd');
    if (itemsByDay[dayKey]) itemsByDay[dayKey].push(item);
  });

  // Group items by day for the month
  const monthStartDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const daysInMonth = new Date(monthStartDate.getFullYear(), monthStartDate.getMonth() + 1, 0).getDate();
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => addDays(monthStartDate, i));
  const itemsByMonthDay: { [key: string]: any[] } = {};
  monthItems.forEach(item => {
    const dayKey = format(new Date(item.timestart * 1000), 'yyyy-MM-dd');
    if (itemsByMonthDay[dayKey]) itemsByMonthDay[dayKey].push(item);
  });

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
          <img
            src={user.profileimageurl || '/public/logo-BYbhmxQK-removebg-preview.png'}
            alt={user.fullname || 'User'}
            className="w-12 h-12 rounded-full border-2 border-indigo-400 object-cover cursor-pointer"
            onClick={() => navigate(`/dashboard/settings/${user.id}`)}
          />
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
              <button className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                <img src={user.profileimageurl || '/public/logo-BYbhmxQK-removebg-preview.png'} alt={user.fullname || 'User'} className="w-8 h-8 rounded-full object-cover" />
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
              {/* Dropdown could go here */}
            </div>
          </div>
        </header>
        {isDashboardRoot ? (
          // Overview Section
          <section className="px-4 py-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{t('Overview')} <span className="text-gray-400 font-normal">(May 2025)</span></h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statsToShow.map((stat, i) => <StatCard key={stat.label} stat={stat} />)}
              </div>
            </div>
            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="space-y-6 lg:col-span-2">
                {/* This Week's Schedule */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <h3 className="text-lg font-bold mb-4 text-gray-900">{t("Your Schedule")}</h3>
                  {loading ? (
                    <div className="text-center text-gray-500 py-8">Loading...</div>
                  ) : error ? (
                    <div className="text-center text-red-500 py-8">{error}</div>
                  ) : (
                    <ol className="relative border-l-2 border-indigo-100 ml-4">
                      {(() => {
                        // Build a week array (Monday-Sunday)
                        const weekStart = new Date();
                        weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7)); // Monday
                        const weekDays = Array.from({ length: 7 }, (_, i) => {
                          const d = new Date(weekStart);
                          d.setDate(weekStart.getDate() + i);
                          return d;
                        });
                        // Map real courses to session events by day
                        const sessionEvents: ScheduleEvent[] = courses
                          .filter(c => !!c.startdate && !!c.enddate)
                          .map(c => {
                            const start = new Date((c.startdate ?? 0) * 1000);
                            const end = new Date((c.enddate ?? 0) * 1000);
                            return {
                              dayKey: start.toLocaleDateString('en-CA'),
                              time: `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                              title: c.fullname,
                              color: 'bg-blue-100 text-blue-800',
                              location: c.format || 'TBD',
                              enrolled: c.enrollmentCount || 0,
                              type: 'session' as const,
                            };
                          });
                        // Fetch activities/assignments for the week (already in weekItems)
                        const activityEvents: ScheduleEvent[] = weekItems.map(item => {
                          const start = new Date(item.timestart * 1000);
                          const end = item.timeduration ? new Date((item.timestart + item.timeduration) * 1000) : start;
                          let type: ScheduleEvent['type'] = 'activity';
                          if (item.eventtype === 'overdue') type = 'overdue';
                          if (item.eventtype === 'assignment') type = 'assignment';
                          return {
                            dayKey: start.toLocaleDateString('en-CA'),
                            time: `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}${item.timeduration ? ' - ' + end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}`,
                            title: item.name || item.title,
                            color: '', // will be set by typeColor
                            location: item.location || 'TBD',
                            enrolled: 0,
                            type,
                          };
                        });
                        // Merge all events
                        const allEvents: ScheduleEvent[] = [...sessionEvents, ...activityEvents];
                        // Group by day
                        const eventsByDay: { [key: string]: ScheduleEvent[] } = {};
                        weekDays.forEach(day => {
                          const key = day.toLocaleDateString('en-CA');
                          eventsByDay[key] = [];
                        });
                        allEvents.forEach(ev => {
                          if (eventsByDay[ev.dayKey]) eventsByDay[ev.dayKey].push(ev);
                        });
                        const typeColor = {
                          session: 'bg-blue-100 text-blue-800',
                          activity: 'bg-green-100 text-green-800',
                          overdue: 'bg-yellow-100 text-yellow-800',
                          assignment: 'bg-purple-100 text-purple-800',
                        };
                        return weekDays.map((day, idx) => {
                          const dayKey = day.toLocaleDateString('en-CA');
                          const label = day.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
                          const dateNum = day.getDate();
                          const events = eventsByDay[dayKey] || [];
                          return (
                            <li key={dayKey} className="mb-6 ml-6 relative">
                              <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-indigo-50 rounded-full ring-4 ring-white border border-indigo-100">
                                <CalendarDays className="w-4 h-4 text-indigo-400" />
                              </span>
                              <span className="text-gray-800 font-medium">{label}</span>
                              <span className="text-gray-500 text-sm ml-2">{dateNum}</span>
                              <div className="mt-2">
                                {events.length === 0 && (
                                  <div className="h-8 text-xs text-gray-400">No events</div>
                                )}
                                {events.map((event, eIndex) => (
                                  <div
                                    key={eIndex}
                                    className={`rounded-lg px-4 py-2 text-sm font-medium mb-2 flex items-center gap-4 shadow-sm ${typeColor[event.type as keyof typeof typeColor]}`}
                                  >
                                    <span>{event.time} - {event.title}</span>
                                    {event.location && (
                                      <span className="flex items-center gap-1 text-xs text-gray-600 ml-4"><MapPin className="w-4 h-4" />{event.location}</span>
                                    )}
                                    {typeof event.enrolled === 'number' && event.enrolled > 0 && (
                                      <span className="flex items-center gap-1 text-xs text-gray-600 ml-4"><Users className="w-4 h-4" />{event.enrolled} enrolled</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </li>
                          );
                        });
                      })()}
                    </ol>
                  )}
                </div>
                {/* Upcoming Sessions */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <h3 className="text-lg font-bold mb-4 text-gray-900">{t('Upcoming Sessions')}</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="text-gray-500 text-left">
                          <th className="py-2 pr-4">{t('Date')}</th>
                          <th className="py-2 pr-4">{t('Session')}</th>
                          <th className="py-2 pr-4">{t('Time')}</th>
                          <th className="py-2 pr-4">{t('Location')}</th>
                          <th className="py-2">{t('Enrolled')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {upcomingSessionsToShow.map((s, i) => (
                          <tr key={s.title} className="border-b last:border-0">
                            <td className="py-2 pr-4 font-medium text-gray-800">{s.date}</td>
                            <td className="py-2 pr-4">{s.title}</td>
                            <td className="py-2 pr-4">{s.time}</td>
                            <td className="py-2 pr-4">{s.location}</td>
                            <td className="py-2">{s.enrolled}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* Trainee Progress */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <h3 className="text-lg font-bold mb-4 text-gray-900">{t('Trainee Progress')}</h3>
                  <div className="space-y-3">
                    {progressBarsToShow.map((bar) => <ProgressBar key={bar.label} {...bar} />)}
                  </div>
                </div>
                {/* Feedback Section */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <h3 className="text-lg font-bold mb-4 text-gray-900">{t('Feedback')}</h3>
                  <ul className="divide-y divide-gray-100">
                    {mockFeedback.map((fb, i) => (
                      <li key={fb.name} className="py-3 flex flex-col md:flex-row md:items-center md:gap-4">
                        <img src={fb.avatar} alt={fb.name} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <span className="font-semibold text-gray-800">{fb.name}</span>
                          <span className="flex items-center gap-1 text-yellow-500 font-medium ml-2"><Star className="w-4 h-4" />{fb.rating.toFixed(1)}</span>
                          <span className="text-gray-500 text-sm ml-2">{fb.text}</span>
                          <span className="text-gray-400 text-xs ml-auto">{fb.date}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 text-sm text-gray-700">Overall Rating: <span className="font-bold">4.8</span> from 124 reviews</div>
                </div>
              </div>
              {/* Right Column */}
              <div className="space-y-6">
                {/* Certification Roadmap */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <h3 className="text-lg font-bold mb-4 text-gray-900">{t('Certification Roadmap')}</h3>
                  <ol className="relative border-l-2 border-green-200 ml-4">
                    {mockRoadmap.map((c, i) => (
                      <li key={c.label} className="mb-6 ml-6 flex items-center gap-2">
                        <span className={`absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full ring-4 ring-white ${c.status === 'done' ? 'bg-green-500' : c.status === 'inprogress' ? 'bg-yellow-400' : 'bg-gray-300'}`}>{c.status === 'done' ? <CheckCircle className="w-4 h-4 text-white" /> : c.status === 'inprogress' ? <Clock className="w-4 h-4 text-white" /> : <Circle className="w-4 h-4 text-white" />}</span>
                        <span className="font-medium text-gray-800">{c.label}</span>
                        <span className="text-xs text-gray-500">{c.desc}</span>
                        {c.status === 'inprogress' && <span className="ml-2 text-xs text-yellow-600">{c.percent}% done</span>}
                        {c.status === 'planned' && <span className="ml-2 text-xs text-gray-400">Planned</span>}
                        <span className="text-xs text-gray-500">{c.date}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                {/* Competency Scores */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <h3 className="text-lg font-bold mb-4 text-gray-900">{t('Competency Scores')}</h3>
                  <div className="space-y-3">
                    {mockCompetencies.map((c, i) => (
                      <div key={c.label} className="mb-2">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{c.label}</span>
                          <span className="text-sm font-medium text-gray-700">{c.value}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div className={`h-3 rounded-full ${c.value >= 90 ? 'bg-green-500' : c.value >= 80 ? 'bg-yellow-400' : 'bg-red-400'}`} style={{ width: `${c.value}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* No real competency data available from courses; leave as a placeholder for future integration */}
                  {/* {lowCompetency && (
                    <div className="mt-4 bg-indigo-50 border-l-4 border-indigo-400 p-3 rounded-xl text-indigo-700 text-sm">
                      {t('Suggest')} <b>Education Research Methods</b> {t('course')} (June 5) {t('for scores <70%')}
                    </div>
                  )} */}
                </div>
                {/* Achievements */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <h3 className="text-lg font-bold mb-4 text-gray-900">{t('Achievements')}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {mockAchievements.map((badge, i) => (
                      <BadgeCard key={badge.label} {...badge} />
                    ))}
                  </div>
                  <div className="mt-4 text-sm text-gray-700">Next: <b>Curriculum Design Specialist</b> (pending 2 courses)</div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
};
// --- End of TrainerDashboard ---