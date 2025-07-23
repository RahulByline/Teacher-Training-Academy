import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import {
  BookOpen, TrendingUp, Award, Calendar, Clock, Target, Star, Users, Trophy, ChevronRight, Play, BarChart3, MessageSquare, Folder, Settings, User, LogOut, Bell, ChevronDown, Menu, X, User as UserIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Outlet, useNavigate, useLocation, NavLink, Routes, Route, Link } from 'react-router-dom';
import { Course } from '../../types';
 
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
  const { user, logout } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [mentors, setMentors] = useState<any[]>([]);
  const [competency, setCompetency] = useState<any[]>([]);
  const [learningPath, setLearningPath] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [schoolLogo, setSchoolLogo] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [openSub, setOpenSub] = useState<string | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const notifRef = useRef<HTMLButtonElement | null>(null);
  const notifDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (notifOpen) {
      apiService.getUserNotifications(user?.id || '').then(setNotifications);
    }
  }, [notifOpen, user?.id]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notifDropdownRef.current &&
        !notifDropdownRef.current.contains(event.target as Node) &&
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setNotifOpen(false);
      }
    }
    if (notifOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notifOpen]);
 
  const handleSidebarClick = (item: any) => {
    if (item.sub) {
      setOpenSub(openSub === item.label ? null : item.label);
    } else {
      setOpenSub(null);
      navigate(`/teacher-dashboard/${item.route}`);
      setMobileMenuOpen(false); // Close mobile menu when navigating
    }
  };

  // Handle logout with redirection to access section
  const handleLogout = () => {
    logout();
    navigate('/#access');
  };

  // Handle profile click
  const handleProfileClick = () => {
    navigate('/teacher-dashboard/settings/profile');
    setMobileMenuOpen(false); // Close mobile menu when navigating
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
 
  useEffect(() => {
    async function fetchAllData() {
      if (!user?.id) {
        console.log('No user ID available, skipping data fetch');
        return;
      }
      
      console.log('Fetching data for user:', user.id);
      setLoading(true);
      try {
        // Fetch all data in parallel
        const [
          userCourses,
          userAchievements,
          userEvents,
          availableMentors,
          userCompetency,
          userLearningPath,
          userRecentActivity
        ] = await Promise.all([
          apiService.getUserCourses(user.id),
          apiService.getUserAchievements(user.id),
          apiService.getUserEvents(user.id),
          apiService.getAvailableMentors(user.id),
          apiService.getUserCompetency(user.id),
          apiService.getUserLearningPath(user.id),
          apiService.getUserRecentActivity(user.id)
        ]);
        
        console.log('Data fetched successfully:', {
          courses: userCourses.length,
          achievements: userAchievements.length,
          events: userEvents.length,
          mentors: availableMentors.length,
          competency: userCompetency.length,
          learningPath: userLearningPath.length,
          recentActivity: userRecentActivity.length
        });
        
        setCourses(userCourses);
        setAchievements(userAchievements);
        setEvents(userEvents);
        setMentors(availableMentors);
        setCompetency(userCompetency);
        setLearningPath(userLearningPath);
        setRecentActivity(userRecentActivity);
      } catch (e) {
        console.error('Error fetching dashboard data:', e);
        // Set empty arrays as fallback
        setCourses([]);
        setAchievements([]);
        setEvents([]);
        setMentors([]);
        setCompetency([]);
        setLearningPath([]);
        setRecentActivity([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchAllData();
  }, [user?.id]); // Changed from [user && user.id] to [user?.id]
 
  // --- Stats from real data ---
  const completed = courses.filter((c: any) => c.progress === 100).length;
  const inProgress = courses.filter((c: any) => c.progress && c.progress > 0 && c.progress < 100).length;
  const total = courses.length;
  const unlockedAchievements = achievements.filter((a: any) => a.unlocked).length;
  const totalAchievements = achievements.length;
  
  const stats = [
    { title: 'Total Courses', value: total, icon: BookOpen, color: 'bg-indigo-100 text-indigo-600' },
    { title: 'Completed Courses', value: completed, icon: Award, color: 'bg-green-100 text-green-600' },
    { title: 'In Progress', value: inProgress, icon: TrendingUp, color: 'bg-blue-100 text-blue-600' },
    { title: 'Achievements', value: `${unlockedAchievements}/${totalAchievements}`, icon: Trophy, color: 'bg-yellow-100 text-yellow-600' },
  ];
 
  // --- Learning Path from real data ---
  const learningPathData = learningPath.map((course) => ({
    label: course.title,
    progress: course.progress || 0,
    description: course.description,
    type: course.type,
    duration: course.duration,
    level: course.level
  }));
 
  // --- Recommendations from real data ---
  const recommendations = learningPath.filter((c: any) => (c.progress || 0) < 100);
 
  // --- Recent Activity from real data ---
  const recentActivityData = recentActivity.map((activity) => ({
    type: activity.type,
    text: activity.text,
    date: activity.date,
    points: activity.points,
    courseId: activity.courseId
  }));
 
  useEffect(() => {
    async function fetchSchoolLogo() {
      if (user && user.company) {
        try {
          const logoUrl = await apiService.getCompanyLogoUrl(user.company);
          setSchoolLogo(logoUrl);
        } catch (e) {
          setSchoolLogo(null);
        }
      }
    }
    fetchSchoolLogo();
  }, [user?.company]);
 
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-lg">{t('Loading...')}</div>;
  }
 
  // Main component render
  return (
    <div className="full-screen-dashboard flex w-screen h-screen bg-[#f9fafb] font-sans overflow-hidden">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`fixed md:relative inset-y-0 left-0 z-50 transform ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition-transform duration-300 ease-in-out md:flex flex-col justify-between w-64 bg-white text-gray-800 py-8 px-6 shadow-lg h-full border-r border-gray-200 flex-shrink-0`}>
        {/* Mobile Close Button */}
        <button
          className="md:hidden absolute top-4 right-4 p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
          onClick={() => setMobileMenuOpen(false)}
        >
          <X className="w-6 h-6" />
        </button>
        
        <nav className="flex flex-col gap-2 mt-8 md:mt-0">
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
                <span className="text-base font-medium">{item.label}</span>
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
                      onClick={() => setMobileMenuOpen(false)}
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
          {user?.profileimageurl ? (
            <img
              src={user.profileimageurl}
              alt={user.fullname || 'User'}
              className="w-12 h-12 rounded-full border-2 border-indigo-400 object-cover cursor-pointer hover:border-indigo-600 transition-colors"
              onClick={handleProfileClick}
              title="Click to view profile"
              onError={e => { (e.currentTarget as HTMLImageElement).src = '/logo/Riyada.png'; }}
            />
          ) : (
            <div
              className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-indigo-400 bg-gray-100 cursor-pointer hover:border-indigo-600 transition-colors"
              onClick={handleProfileClick}
              title="Click to view profile"
            >
              <UserIcon className="w-7 h-7 text-gray-400" />
            </div>
          )}
          <span className="font-semibold text-center">{user?.fullname || user?.firstname || user?.username || 'Teacher'}</span>
          <button 
            className="flex items-center gap-2 mt-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-200 transition-colors" 
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between bg-white px-4 py-4 shadow rounded-bl-2xl w-full flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={toggleMobileMenu}
            >
              <Menu className="w-6 h-6" />
            </button>
            {schoolLogo && (
              <img
                src={schoolLogo}
                alt="School Logo"
                className="h-auto w-13 object-contain"
              />
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-500 text-sm hidden md:inline">Q2 2025 (Apr-Jun)</span>
            <div className="relative">
              <button
                ref={notifRef}
                className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                onClick={() => setNotifOpen((open) => !open)}
              >
                <Bell className="w-6 h-6 text-gray-500" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              {notifOpen && (
                <div ref={notifDropdownRef} className="absolute right-0 mt-2 w-96 max-w-xs bg-white border rounded-xl shadow-lg z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b font-semibold text-blue-900 flex items-center justify-between">
                    <span>Notifications</span>
                    <span className="text-blue-500"><Bell className="w-4 h-4 inline" /></span>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-gray-500 text-center">No notifications</div>
                    ) : (
                      notifications.map((notif, idx) => (
                        <div key={idx} className="flex items-start gap-2 px-4 py-3 hover:bg-blue-50 transition cursor-pointer">
                          <span className="mt-1"><Bell className="w-4 h-4 text-blue-500" /></span>
                          <div className="flex-1">
                            <div className="font-medium text-sm text-gray-900">{notif.title}</div>
                            <div className="text-xs text-gray-600 mb-1">{notif.desc}</div>
                            <div className="text-xs text-gray-400">{notif.date}</div>
                          </div>
                          <a
                            href="/teacher-dashboard/settings/notifications"
                            className="text-xs text-blue-600 font-medium ml-2 mt-1 hover:underline"
                            onClick={e => { e.stopPropagation(); navigate('/teacher-dashboard/settings/notifications'); setNotifOpen(false); }}
                          >View full notification</a>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="border-t px-4 py-2 text-center bg-gray-50">
                    <button
                      className="text-blue-600 font-semibold text-sm hover:underline"
                      onClick={() => { navigate('/teacher-dashboard/settings/notifications'); setNotifOpen(false); }}
                    >See all</button>
                  </div>
                </div>
              )}
            </div>
            <div className="relative">
              <button 
                className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                onClick={handleProfileClick}
              >
                {user?.profileimageurl ? (
                  <img src={user.profileimageurl} alt={user.fullname || 'User'} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <UserIcon className="w-8 h-8 rounded-full object-cover" />
                )}
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <button 
              className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-200 transition-colors" 
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </header>
        
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
    
export default TeacherDashboard;