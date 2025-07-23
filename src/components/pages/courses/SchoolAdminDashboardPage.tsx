import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, BookOpen, Home, Database, UserCog, MessageCircle, Award, BarChart2, CalendarCheck, CheckCircle, FileText, Users2, Plus, Bell, ChevronDown, UserPlus, Cog, Users as UsersIcon, Building2, Upload, Download, ThumbsUp, ArrowRightCircle, ArrowDownCircle, ArrowUpCircle, Clock, Eye, Edit, Trash2, X, Mail, Gavel, UserCheck, List, CheckSquare, Loader2 } from 'lucide-react';
import { Button } from '../../ui/Button';
import { AssignCourseToUsers } from './AssignCourseToUsers';
import { coursesService } from '../../../services/coursesService';
import { apiService } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { usersService } from '../../../services/usersService';
import { schoolsService } from '../../../services/schoolsService';

// Sidebar config for flat list
const sidebarItems = [
  { key: 'dashboard', label: 'Dashboard', icon: Home },
  { key: 'manageSchool', label: 'Manage School Data', icon: Database },
  { key: 'users', label: 'Users Management', icon: Users },
  { key: 'courses', label: 'Courses Management', icon: BookOpen },
  { key: 'community', label: 'Community & Collaboration', icon: MessageCircle },
  { key: 'licenses', label: 'Licenses', icon: Award },
  { key: 'competencies', label: 'Competencies', icon: CheckCircle },
  { key: 'reports', label: 'Reports', icon: FileText },
  { key: 'attendance', label: 'Attendance', icon: CalendarCheck },
  { key: 'approveTraining', label: 'Approve Training Events', icon: Users2 },
];

// Placeholder components for each section
const SectionPlaceholder = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-full w-full">
    <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
    <p className="text-gray-500">Content for {title} will appear here.</p>
  </div>
);

// New Navbar component (inside main content, after sidebar)
const MainNavbar = ({ adminName, schoolName, setActiveSection }: { adminName: string, schoolName: string, setActiveSection: (section: string) => void }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [adminDetails, setAdminDetails] = useState<any>(null);
  const [schoolLogo, setSchoolLogo] = useState<string | null>(null);

  useEffect(() => {
    // Fetch school logo using apiService.getCompanyLogoUrl
    const fetchSchoolLogo = async () => {
      if (user?.company) {
        const logoUrl = await apiService.getCompanyLogoUrl(user.company);
        setSchoolLogo(logoUrl || null);
      } else {
        setSchoolLogo(null);
      }
    };
    fetchSchoolLogo();
  }, [user]);

  const handleAccountSettings = async () => {
    if (user?.id) {
      const details = await usersService.getUserById(user.id);
      setAdminDetails(details);
      setAccountModalOpen(true);
      setDropdownOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  return (
    <nav className="w-full flex items-center justify-between py-4 px-8 bg-white border-b mb-6" style={{ minHeight: '64px' }}>
      {/* Left: + icon and Riyada Trainings */}
      <div className="flex items-center gap-3">
        {schoolLogo ? (
            <img src={schoolLogo} alt="School Logo" className="h-12 w-auto object-cover border" />
          ) : (
          <span className="h-9 w-9 flex items-center justify-center">
          <Plus className="w-6 h-6 text-blue-500" />
        </span>
        )}
        
        {/* <span className="text-xl font-bold text-gray-900">{schoolName || 'School Dashboard'}</span> */}
      </div>
      {/* Center: Search bar */}
      <div className="flex-1 flex justify-center">
        <input
          type="text"
          placeholder="Search courses, teachers, or resou..."
          className="w-96 px-4 py-2 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
          style={{ maxWidth: '350px' }}
        />
      </div>
      {/* Right: Bell, New Report, Avatar, Admin User */}
      <div className="flex items-center gap-4 relative">
        <div className="relative">
          <Bell className="w-6 h-6 text-blue-500" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">3</span>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2"
          onClick={() => setActiveSection('reports')}
        >
          <Plus className="w-5 h-5" /> Reports
        </button>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setDropdownOpen((v) => !v)}>
          {schoolLogo ? (
            <img src={schoolLogo} alt="School Logo" className="h-8 w-8 rounded-full object-cover border" />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold border">{user?.fullname ? user.fullname[0] : '?'}</div>
          )}
          <span className="font-medium text-gray-800 flex items-center gap-1">{user?.fullname || adminName} <ChevronDown className="w-4 h-4 ml-1" /></span>
        </div>
        {dropdownOpen && (
          <div className="absolute right-0 top-12 bg-white border rounded shadow-lg w-48 z-50">
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={handleAccountSettings}>Account Settings</button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={handleLogout}>Logout</button>
          </div>
        )}
        {/* Account Settings Modal */}
        {accountModalOpen && adminDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setAccountModalOpen(false)}>&times;</button>
              <h2 className="text-xl font-bold mb-4">Account Settings</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input type="text" value={adminDetails.fullname || ''} readOnly className="w-full border rounded px-3 py-2 bg-gray-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" value={adminDetails.email || ''} readOnly className="w-full border rounded px-3 py-2 bg-gray-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <input type="text" value={adminDetails.username || ''} readOnly className="w-full border rounded px-3 py-2 bg-gray-100" />
                </div>
                {/* Add more fields as needed */}
              </form>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

type QuarterKey = 'Q2 2025 (Apr-Jun)' | 'Q1 2025 (Jan-Mar)';

const dashboardDataByQuarter: Record<QuarterKey, {
  teachers: number;
  teachersGrowth: string;
  teachersGrowthColor: string;
  completion: string;
  completionGrowth: string;
  completionGrowthColor: string;
  trainers: number;
  trainersGrowth: string;
  trainersGrowthColor: string;
  roi: string;
  roiGrowth: string;
  roiGrowthColor: string;
}> = {
  'Q2 2025 (Apr-Jun)': {
    teachers: 0,
    teachersGrowth: '0',
    teachersGrowthColor: 'text-green-600',
    completion: '0',
    completionGrowth: '0',
    completionGrowthColor: 'text-green-600',
    trainers: 0,
    trainersGrowth: '0',
    trainersGrowthColor: 'text-green-600',
    roi: '0',
    roiGrowth: '',
    roiGrowthColor: 'text-green-600',
  },
  'Q1 2025 (Jan-Mar)': {
    teachers: 1153,
    teachersGrowth: '+6.1%',
    teachersGrowthColor: 'text-green-600',
    completion: '74.1%',
    completionGrowth: '+4.2%',
    completionGrowthColor: 'text-green-600',
    trainers: 77,
    trainersGrowth: '+9.8%',
    trainersGrowthColor: 'text-green-600',
    roi: '2.8x',
    roiGrowth: '+0.3x',
    roiGrowthColor: 'text-green-600',
  },
};

const DashboardTopCards = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTeachers: 0,
    enrolledTeachers: 0,
    courses: 0,
    licenses: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.company) return;

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const companyId = Number(user.company);
        const companyCourses = await coursesService.getCompanyCourses(companyId);

        // From all courses, get all enrollments and find unique teachers
        const enrollmentPromises = companyCourses.map((course: any) => 
          apiService.getCourseEnrollments(course.id)
        );
        const allEnrollments = (await Promise.all(enrollmentPromises)).flat();

        const teachers = new Map<string, any>();
        allEnrollments.forEach((enrollment: any) => {
          if (enrollment.roles?.some((role: any) => role.shortname === 'editingteacher' || role.shortname === 'teacher')) {
            teachers.set(enrollment.id, enrollment);
          }
        });

        const totalTeachersCount = teachers.size;
        
        // Of those teachers, count how many are enrolled in at least one course
        // (This is implicitly the same as the total teacher count with this new logic)
        const enrolledTeachersCount = totalTeachersCount;

        setStats({
          totalTeachers: totalTeachersCount,
          enrolledTeachers: enrolledTeachersCount,
          courses: companyCourses.length,
          licenses: 500, // Placeholder for licenses
        });

      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
        <div className="w-full bg-white rounded-2xl shadow p-6 flex justify-center items-center h-48 mb-6">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span className="ml-4 text-gray-500">Loading dashboard metrics...</span>
        </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl shadow p-6 flex flex-col gap-2 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Management Dashboard</h1>
          <p className="text-gray-500">Analytics for {user?.schoolName || 'your school'}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
        {/* Total Teachers */}
        <div className="bg-white rounded-xl border p-6 flex flex-col gap-2 items-start shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-gray-500 text-sm font-medium">Total Teachers</span>
            <span className="bg-blue-50 rounded-full p-2 ml-2"><Users className="w-5 h-5 text-blue-600" /></span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalTeachers}</div>
          <div className="mt-1 flex items-center gap-1">
            <span className="text-gray-400 text-sm font-normal">Teachers in your school</span>
          </div>
        </div>
        {/* Enrolled Teachers */}
        <div className="bg-white rounded-xl border p-6 flex flex-col gap-2 items-start shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-gray-500 text-sm font-medium">Enrolled Teachers</span>
            <span className="bg-green-50 rounded-full p-2 ml-2"><CheckCircle className="w-5 h-5 text-green-600" /></span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.enrolledTeachers}</div>
           <div className="mt-1 flex items-center gap-1">
            <span className="text-gray-400 text-sm font-normal">Teachers in at least one course</span>
          </div>
        </div>
        {/* Total Courses */}
        <div className="bg-white rounded-xl border p-6 flex flex-col gap-2 items-start shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-gray-500 text-sm font-medium">Total Courses</span>
            <span className="bg-purple-50 rounded-full p-2 ml-2"><BookOpen className="w-5 h-5 text-purple-600" /></span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.courses}</div>
           <div className="mt-1 flex items-center gap-1">
            <span className="text-gray-400 text-sm font-normal">Courses available to school</span>
          </div>
        </div>
        {/* Licenses Assigned */}
        <div className="bg-white rounded-xl border p-6 flex flex-col gap-2 items-start shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-gray-500 text-sm font-medium">Licenses Assigned</span>
            <span className="bg-yellow-50 rounded-full p-2 ml-2"><Award className="w-5 h-5 text-yellow-600" /></span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.licenses}</div>
          <div className="mt-1 flex items-center gap-1">
            <span className="text-gray-400 text-sm font-normal">Total licenses for school</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Section (pixel-perfect replica)
const DashboardSection = () => (
  <div className="w-full flex flex-col gap-6">
    <DashboardTopCards />
    {/* Second Row: Teacher Performance & ROI Analysis */}
    <div className="w-full flex flex-col lg:flex-row gap-6">
      {/* Teacher Performance Improvement */}
      <div className="flex-1 bg-white rounded-xl shadow p-6 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-semibold text-gray-900">Teacher Performance Improvement</span>
          <div className="flex gap-2">
            <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs font-medium">By Subject</button>
            {/* <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs font-medium">By </button> */}
            <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs font-medium">By Experience</button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center h-40 bg-gray-50 rounded mb-4">
          <div className="text-blue-200 text-5xl mb-2"><svg width="48" height="48" fill="none"><path d="M12 32c4-8 20-8 24 0" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round"/></svg></div>
          <div className="text-gray-400 text-center">Performance improvement chart showing 18% average increase in teacher effectiveness scores after training completion</div>
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <div>Mathematics <span className="text-green-600 font-semibold">+24%</span></div>
          <div>Languages <span className="text-green-600 font-semibold">+19%</span></div>
          <div>Sciences <span className="text-green-600 font-semibold">+16%</span></div>
          <div>Humanities <span className="text-green-600 font-semibold">+14%</span></div>
        </div>
      </div>
      
      
    </div>
    {/* Third Row: 3 Cards - Updated to match image */}
    <div className="w-full flex flex-col md:flex-row gap-6">
      {/* Competency Development */}
      <div className="flex-1 bg-white rounded-2xl shadow p-6 flex flex-col min-w-[320px]">
        <span className="text-lg font-semibold text-gray-900 mb-4 block">Competency Development</span>
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1"><span>Pedagogical Skills</span><span className="font-semibold">76%</span></div>
          <div className="h-2 rounded bg-gray-200 mb-2"><div className="h-2 rounded bg-green-500" style={{width:'76%'}}></div></div>
        </div>
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1"><span>Digital Literacy</span><span className="font-semibold">68%</span></div>
          <div className="h-2 rounded bg-gray-200 mb-2"><div className="h-2 rounded bg-blue-500" style={{width:'68%'}}></div></div>
        </div>
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1"><span>Student Assessment</span><span className="font-semibold">82%</span></div>
          <div className="h-2 rounded bg-gray-200 mb-2"><div className="h-2 rounded bg-purple-500" style={{width:'82%'}}></div></div>
        </div>
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1"><span>Classroom Management</span><span className="font-semibold">91%</span></div>
          <div className="h-2 rounded bg-gray-200 mb-2"><div className="h-2 rounded bg-orange-500" style={{width:'91%'}}></div></div>
        </div>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1"><span>Curriculum Design</span><span className="font-semibold">64%</span></div>
          <div className="h-2 rounded bg-gray-200 mb-2"><div className="h-2 rounded bg-red-500" style={{width:'64%'}}></div></div>
        </div>
        <a href="#" className="text-blue-600 text-sm font-medium hover:underline mt-2">View detailed competency report &rarr;</a>
      </div>
      {/* Teacher Engagement */}
      <div className="flex-1 bg-white rounded-2xl shadow p-6 flex flex-col min-w-[320px]">
        <span className="text-lg font-semibold text-gray-900 mb-4 block">Teacher Engagement</span>
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center w-full h-40 bg-gray-50 rounded mb-4">
            <svg width="48" height="48" fill="none" className="mb-2"><circle cx="24" cy="24" r="20" stroke="#A78BFA" strokeWidth="2" fill="none" opacity="0.2" /><path d="M24 12v12l8 4" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" /></svg>
            <div className="text-gray-400 text-center">Engagement metrics by training format</div>
          </div>
        </div>
        <div className="flex gap-3 mt-2 justify-center">
          <div className="bg-blue-50 text-blue-700 rounded-lg px-4 py-2 text-center min-w-[70px]">
            <div className="text-xl font-bold">84%</div>
            <div className="text-xs font-semibold mt-1">ILT</div>
          </div>
          <div className="bg-purple-50 text-purple-700 rounded-lg px-4 py-2 text-center min-w-[70px]">
            <div className="text-xl font-bold">76%</div>
            <div className="text-xs font-semibold mt-1">VILT</div>
          </div>
          <div className="bg-yellow-50 text-yellow-700 rounded-lg px-4 py-2 text-center min-w-[70px]">
            <div className="text-xl font-bold">62%</div>
            <div className="text-xs font-semibold mt-1">Self-Paced</div>
          </div>
        </div>
      </div>
      {/* Predictive Insights */}
      <div className="flex-1 bg-white rounded-2xl shadow p-6 flex flex-col min-w-[320px]">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-semibold text-gray-900">Predictive Insights</span>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs font-medium">AI-Powered</span>
        </div>
        <div className="flex flex-col gap-3">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-blue-700 font-semibold text-sm mb-1">High Attrition Risk</div>
            <div className="text-xs text-gray-700">12 teachers show patterns indicating potential resignation in next 3 months</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-green-700 font-semibold text-sm mb-1">Leadership Potential</div>
            <div className="text-xs text-gray-700">8 teachers show exceptional leadership qualities and should be considered for Master Trainer program</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3">
            <div className="text-yellow-700 font-semibold text-sm mb-1">Skills Gap Alert</div>
            <div className="text-xs text-gray-700">Critical gap in advanced technology integration skills across 3 schools</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="text-purple-700 font-semibold text-sm mb-1">Course Recommendation</div>
            <div className="text-xs text-gray-700">Based on current trends, recommend increasing capacity for "Advanced Assessment Techniques" course by 30%</div>
          </div>
        </div>
      </div>
    </div>
    <TrainingActivitySection />
    <ScheduleSection />
    <MyCoursesSection />
  </div>
);

const ScheduleSection = () => (
  <div className="w-full flex flex-col md:flex-row gap-6 mt-6">
    {/* Your Schedule */}
    <div className="flex-[2] bg-white rounded-2xl shadow p-6 flex flex-col min-w-[600px]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg font-semibold text-gray-900">Calendar</span>
        <div className="flex gap-2">
          <button className="text-gray-400 hover:text-blue-600"><svg width="20" height="20" fill="none"><path d="M13 16l-4-4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
          <span className="font-medium text-gray-700">May 5 - 11, 2025</span>
          <button className="text-gray-400 hover:text-blue-600"><svg width="20" height="20" fill="none"><path d="M7 16l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
          <button className="ml-4 text-blue-600 text-sm font-medium hover:underline">Today</button>
        </div>
        <div className="flex gap-2 ml-4">
          <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs font-medium">Week</button>
          <button className="bg-gray-100 text-gray-500 px-3 py-1 rounded text-xs font-medium">Month</button>
          <button className="bg-gray-100 text-gray-500 px-3 py-1 rounded text-xs font-medium">List</button>
        </div>
      </div>
      {/* Calendar grid */}
      <div className="w-full mt-4">
        <div className="grid grid-cols-7 border-b text-center text-xs text-gray-500">
          <div className="py-2">MON<br/><span className="font-semibold text-lg text-gray-700">5</span></div>
          <div className="py-2">TUE<br/><span className="font-semibold text-lg text-gray-700">6</span></div>
          <div className="py-2">WED<br/><span className="font-semibold text-lg text-gray-700">7</span></div>
          <div className="py-2">THU<br/><span className="font-semibold text-lg text-gray-700">8</span></div>
          <div className="py-2"><span className="border border-blue-500 rounded px-2">FRI</span><br/><span className="font-semibold text-lg text-blue-600">9</span></div>
          <div className="py-2">SAT<br/><span className="font-semibold text-lg text-gray-700">10</span></div>
          <div className="py-2">SUN<br/><span className="font-semibold text-lg text-gray-700">11</span></div>
        </div>
        <div className="grid grid-cols-7 h-32 text-xs align-top">
          {/* Monday */}
          <div className="p-2">
            <div className="bg-blue-100 border-l-4 border-blue-400 rounded p-2 mb-2">
              <div className="font-semibold text-blue-700">9:00 - 11:00</div>
              <div className="text-blue-700">Digital Learning Basics</div>
            </div>
          </div>
          {/* Tuesday */}
          <div className="p-2">
            <div className="bg-purple-100 border-l-4 border-purple-400 rounded p-2 mb-2">
              <div className="font-semibold text-purple-700">13:00 - 15:00</div>
              <div className="text-purple-700">Assessment Design</div>
            </div>
          </div>
          {/* Wednesday */}
          <div className="p-2"></div>
          {/* Thursday */}
          <div className="p-2">
            <div className="bg-green-100 border-l-4 border-green-400 rounded p-2 mb-2">
              <div className="font-semibold text-green-700">10:00 - 12:00</div>
              <div className="text-green-700">Classroom Management</div>
            </div>
            <div className="bg-yellow-100 border-l-4 border-yellow-400 rounded p-2">
              <div className="font-semibold text-yellow-700">14:00 - 16:00</div>
              <div className="text-yellow-700">Mentoring Session</div>
            </div>
          </div>
          {/* Friday */}
          <div className="p-2">
            <div className="bg-blue-100 border-l-4 border-blue-500 rounded p-2 mb-2">
              <div className="font-semibold text-blue-700">9:00 - 12:00</div>
              <div className="text-blue-700">Advanced Digital Assessment</div>
            </div>
          </div>
          {/* Saturday */}
          <div className="p-2">
            <div className="bg-red-100 border-l-4 border-red-400 rounded p-2 mb-2">
              <div className="font-semibold text-red-700">11:00 - 13:00</div>
              <div className="text-red-700">Trainer Development</div>
            </div>
          </div>
          {/* Sunday */}
          <div className="p-2"></div>
        </div>
      </div>
      <div className="mt-4 text-right">
        <a href="#" className="text-blue-600 text-sm font-medium hover:underline">View full schedule &rarr;</a>
      </div>
    </div>
    {/* Upcoming Sessions */}
    <div className="flex-1 bg-white rounded-2xl shadow p-6 flex flex-col min-w-[350px]">
      <span className="text-lg font-semibold text-gray-900 mb-4 block">Upcoming Sessions</span>
      <div className="flex flex-col gap-4 flex-1">
        {/* Session 1 */}
        <div className="flex gap-3 items-start">
          <div className="w-1.5 h-10 rounded bg-blue-500 mt-1"></div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900">Advanced Digital Assessment</div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
              <span>May 9, 2025</span>
              <span>&bull;</span>
              <span>9:00 - 12:00</span>
              <span>&bull;</span>
              <span>Room 204</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
              <span>👥 28 trainees enrolled</span>
            </div>
            <a href="#" className="text-blue-600 text-xs font-medium hover:underline mt-1 inline-block">View details</a>
          </div>
        </div>
        {/* Session 2 */}
        <div className="flex gap-3 items-start">
          <div className="w-1.5 h-10 rounded bg-red-500 mt-1"></div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900">Trainer Development Workshop</div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
              <span>May 11, 2025</span>
              <span>&bull;</span>
              <span>11:00 - 13:00</span>
              <span>&bull;</span>
              <span>Virtual</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
              <span>👥 12 trainees enrolled</span>
            </div>
            <a href="#" className="text-blue-600 text-xs font-medium hover:underline mt-1 inline-block">View details</a>
          </div>
        </div>
        {/* Session 3 */}
        <div className="flex gap-3 items-start">
          <div className="w-1.5 h-10 rounded bg-purple-500 mt-1"></div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900">Curriculum Design Masterclass</div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
              <span>May 13, 2025</span>
              <span>&bull;</span>
              <span>10:00 - 14:00</span>
              <span>&bull;</span>
              <span>Room 102</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
              <span>👥 18 trainees enrolled</span>
            </div>
            <a href="#" className="text-blue-600 text-xs font-medium hover:underline mt-1 inline-block">View details</a>
          </div>
        </div>
        {/* Session 4 */}
        <div className="flex gap-3 items-start">
          <div className="w-1.5 h-10 rounded bg-green-500 mt-1"></div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900">Student Engagement Strategies</div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
              <span>May 15, 2025</span>
              <span>&bull;</span>
              <span>13:00 - 15:00</span>
              <span>&bull;</span>
              <span>Room 305</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
              <span>👥 24 trainees enrolled</span>
            </div>
            <a href="#" className="text-blue-600 text-xs font-medium hover:underline mt-1 inline-block">View details</a>
          </div>
        </div>
      </div>
      <div className="mt-6 text-right">
        <a href="#" className="text-blue-600 text-sm font-medium hover:underline">View full schedule &rarr;</a>
      </div>
    </div>
  </div>
);

const TrainingActivitySection = () => (
  <div className="w-full flex flex-col md:flex-row gap-6 mt-6">
    {/* Training Activity */}
    <div className="flex-1 bg-white rounded-2xl shadow p-6 flex flex-col min-w-[400px]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg font-semibold text-gray-900">Training Activity</span>
        <div className="flex gap-2">
          <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs font-medium">Weekly</button>
          <button className="bg-gray-100 text-gray-500 px-3 py-1 rounded text-xs font-medium">Monthly</button>
          <button className="bg-gray-100 text-gray-500 px-3 py-1 rounded text-xs font-medium">Quarterly</button>
        </div>
      </div>
      <div className="bg-gray-50 rounded-xl flex flex-col items-center justify-center h-40 mb-4">
        <svg width="40" height="40" className="mb-2 mt-4" viewBox="0 0 40 40" fill="none"><rect x="8" y="28" width="4" height="8" rx="2" fill="#3B82F6"/><rect x="16" y="20" width="4" height="16" rx="2" fill="#A78BFA"/><rect x="24" y="24" width="4" height="12" rx="2" fill="#F59E42"/><rect x="32" y="18" width="4" height="18" rx="2" fill="#22C55E"/></svg>
        <div className="text-gray-400 text-center">Weekly training activity showing 248 sessions completed</div>
      </div>
      <div className="flex justify-around mt-2">
        <div className="flex flex-col items-center">
          <span className="text-blue-600 font-bold text-xl">186</span>
          <span className="text-xs text-gray-500 mt-1">ILT Sessions</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-purple-600 font-bold text-xl">124</span>
          <span className="text-xs text-gray-500 mt-1">VILT Sessions</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-orange-500 font-bold text-xl">342</span>
          <span className="text-xs text-gray-500 mt-1">Self-Paced Modules</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-green-600 font-bold text-xl">96</span>
          <span className="text-xs text-gray-500 mt-1">Assessments</span>
        </div>
      </div>
    </div>
    {/* Behavioral Analysis */}
    <div className="flex-1 bg-white rounded-2xl shadow p-6 flex flex-col min-w-[400px]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg font-semibold text-gray-900">Behavioral Analysis</span>
        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded text-xs font-medium">AI-Powered</span>
      </div>
      <div className="flex gap-8 mb-2">
        {/* Learning Preferences */}
        <div className="flex-1">
          <div className="text-xs font-semibold text-gray-500 mb-1">Learning Preferences</div>
          <div className="flex items-center mb-1"><span className="w-20 text-xs">Visual</span><div className="flex-1 mx-2 h-2 rounded bg-gray-200"><div className="h-2 rounded bg-purple-400" style={{width:'42%'}}></div></div><span className="text-xs font-semibold text-gray-700">42%</span></div>
          <div className="flex items-center mb-1"><span className="w-20 text-xs">Auditory</span><div className="flex-1 mx-2 h-2 rounded bg-gray-200"><div className="h-2 rounded bg-blue-400" style={{width:'28%'}}></div></div><span className="text-xs font-semibold text-gray-700">28%</span></div>
          <div className="flex items-center"><span className="w-20 text-xs">Kinesthetic</span><div className="flex-1 mx-2 h-2 rounded bg-gray-200"><div className="h-2 rounded bg-green-400" style={{width:'30%'}}></div></div><span className="text-xs font-semibold text-gray-700">30%</span></div>
        </div>
        {/* Time Preferences */}
        <div className="flex-1">
          <div className="text-xs font-semibold text-gray-500 mb-1">Time Preferences</div>
          <div className="flex items-center mb-1"><span className="w-20 text-xs">Morning</span><div className="flex-1 mx-2 h-2 rounded bg-gray-200"><div className="h-2 rounded bg-orange-400" style={{width:'37%'}}></div></div><span className="text-xs font-semibold text-gray-700">37%</span></div>
          <div className="flex items-center mb-1"><span className="w-20 text-xs">Afternoon</span><div className="flex-1 mx-2 h-2 rounded bg-gray-200"><div className="h-2 rounded bg-gray-400" style={{width:'25%'}}></div></div><span className="text-xs font-semibold text-gray-700">25%</span></div>
          <div className="flex items-center"><span className="w-20 text-xs">Evening</span><div className="flex-1 mx-2 h-2 rounded bg-gray-200"><div className="h-2 rounded bg-purple-400" style={{width:'38%'}}></div></div><span className="text-xs font-semibold text-gray-700">38%</span></div>
        </div>
      </div>
      {/* Engagement Patterns */}
      <div className="mb-2">
        <div className="text-xs font-semibold text-gray-500 mb-1">Engagement Patterns</div>
        <div className="flex items-end gap-3 h-20">
          <div className="flex flex-col items-center justify-end h-full"><div className="w-2 rounded bg-green-400" style={{height:'60%'}}></div><span className="text-xs text-gray-500 mt-1">Mon</span></div>
          <div className="flex flex-col items-center justify-end h-full"><div className="w-2 rounded bg-green-400" style={{height:'80%'}}></div><span className="text-xs text-gray-500 mt-1">Tue</span></div>
          <div className="flex flex-col items-center justify-end h-full"><div className="w-2 rounded bg-green-400" style={{height:'50%'}}></div><span className="text-xs text-gray-500 mt-1">Wed</span></div>
          <div className="flex flex-col items-center justify-end h-full"><div className="w-2 rounded bg-green-400" style={{height:'100%'}}></div><span className="text-xs text-gray-500 mt-1">Thu</span></div>
          <div className="flex flex-col items-center justify-end h-full"><div className="w-2 rounded bg-green-400" style={{height:'70%'}}></div><span className="text-xs text-gray-500 mt-1">Fri</span></div>
          <div className="flex flex-col items-center justify-end h-full"><div className="w-2 rounded bg-green-400" style={{height:'40%'}}></div><span className="text-xs text-gray-500 mt-1">Sat</span></div>
          <div className="flex flex-col items-center justify-end h-full"><div className="w-2 rounded bg-green-400" style={{height:'30%'}}></div><span className="text-xs text-gray-500 mt-1">Sun</span></div>
        </div>
      </div>
      {/* AI Recommendation */}
      <div className="bg-blue-50 rounded-lg p-3 mt-2">
        <span className="text-blue-700 font-semibold text-xs">AI Recommendation </span>
        <span className="text-xs text-gray-700">Based on behavioral patterns, scheduling more interactive sessions on Tuesdays and Thursdays could increase engagement by 23%</span>
      </div>
    </div>
  </div>
);

const MyCoursesSection = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inProgress');

  useEffect(() => {
    const fetchCourses = async () => {
        setLoading(true);
      try {
        if (user?.company) {
          const data = await coursesService.getSchoolCourses(user.company);
          let courseList: any[] = [];
          if (Array.isArray(data)) {
            courseList = data;
          } else if (data && typeof data === 'object' && Array.isArray((data as any).courses)) {
            courseList = (data as any).courses;
          } else {
            courseList = [];
          }
          setCourses(courseList);
          } else {
          setCourses([]);
          }
        } catch (e) {
        setCourses([]);
        } finally {
          setLoading(false);
      }
    };
    fetchCourses();
  }, [user]);

  // No status filtering if not present
  const filteredCourses = courses;

  return (
    <div className="w-full bg-white rounded-2xl shadow p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-lg font-semibold text-gray-900">My courses</span>
        <a href="#" className="font-semibold text-gray-500 hover:underline">Download certificates</a>
      </div>
      <div className="flex gap-2 mb-4">
        <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded font-medium">Sort</button>
        <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded font-medium">Order</button>
        <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded font-medium">Card</button>
      </div>
      <div className="flex gap-4 mb-4 border-b">
        <button onClick={() => setActiveTab('available')} className={`px-2 pb-2 font-medium ${activeTab === 'available' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>Available courses</button>
        <button onClick={() => setActiveTab('inProgress')} className={`px-2 pb-2 font-medium ${activeTab === 'inProgress' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>Courses in progress</button>
        <button onClick={() => setActiveTab('completed')} className={`px-2 pb-2 font-medium ${activeTab === 'completed' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>Completed courses</button>
      </div>
      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading courses...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
          {filteredCourses.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 py-8">No courses found.</div>
          ) : (
            filteredCourses.map((course: any, idx: number) => (
              <div key={course.id || idx} className="bg-white rounded-xl shadow border p-2 flex flex-col hover:shadow-lg transition">
                <img src={course.courseimage || '/public/images/default-course.jpg'} alt={course.fullname || 'Course'} className="rounded-t-xl h-32 w-full object-cover mb-2" />
                <a href={course.link || '#'} className="text-blue-700 font-medium hover:underline px-2 pb-2 pt-1">{course.fullname || 'Untitled Course'}</a>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// User Management Section grid
const UserManagementSection = () => {
  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'create', label: 'Create User' },
    { key: 'edit', label: 'Edit Users' },
    { key: 'department', label: 'Department Users' },
    { key: 'assign', label: 'Assign to School' },
    { key: 'upload', label: 'Upload Users' },
    { key: 'bulk', label: 'Bulk Download' },
    { key: 'training', label: 'Training Events' },
  ];
  const [activeTab, setActiveTab] = useState('overview');

  // Demo stats for Overview
  const stats = [
    { icon: <Users className="w-7 h-7 text-blue-600" />, label: 'Total Users', value: 89, desc: 'All registered users', growth: '+12%', growthColor: 'text-green-600', sub: 'vs last month' },
    { icon: <CheckCircle className="w-7 h-7 text-green-600" />, label: 'Active Users', value: 0, desc: 'Currently active users', growth: '+8%', growthColor: 'text-green-600', sub: 'vs last month' },
    { icon: <Clock className="w-7 h-7 text-orange-500" />, label: 'Pending Approvals', value: 3, desc: 'Training events awaiting approval', growth: '+3', growthColor: 'text-green-600', sub: 'vs last month' },
    { icon: <UserCog className="w-7 h-7 text-purple-600" />, label: 'Department Managers', value: 0, desc: 'Users with manager role', growth: '+2', growthColor: 'text-green-600', sub: 'vs last month' },
    { icon: <Upload className="w-7 h-7 text-teal-600" />, label: 'Recent Uploads', value: 10, desc: 'Users uploaded this month', growth: '+15', growthColor: 'text-green-600', sub: 'vs last month' },
  ];
  const quickActions = [
    { label: 'Create New User', icon: <UserPlus className="w-5 h-5 mr-2" />, color: 'bg-green-600', text: 'Click to access' },
    { label: 'Bulk Upload', icon: <Upload className="w-5 h-5 mr-2" />, color: 'bg-blue-600', text: 'Click to access' },
    { label: 'Export Users', icon: <Download className="w-5 h-5 mr-2" />, color: 'bg-purple-600', text: 'Click to access' },
    { label: 'Approve Events', icon: <CheckCircle className="w-5 h-5 mr-2" />, color: 'bg-orange-500', text: 'Click to access' },
  ];
  const recentActivity = [
    { color: 'bg-green-500', label: 'User created', user: 'John Doe', time: '2 minutes ago' },
    { color: 'bg-blue-500', label: 'Bulk upload completed', user: 'System', time: '15 minutes ago' },
    { color: 'bg-purple-500', label: 'User role updated', user: 'Jane Smith', time: '1 hour ago' },
    { color: 'bg-orange-500', label: 'Training event approved', user: 'Mike Johnson', time: '2 hours ago' },
  ];

  // Approve Training Events state (move hooks to top level)
  const initialEvents = [
    {
      id: 1,
      title: 'Advanced Teaching Methods',
      requestedBy: 'John Doe',
      requestedOn: '1/5/2024',
      desc: 'Workshop on modern teaching methodologies and classroom management',
      date: '1/15/2024',
      time: '10:00 AM - 04:00 PM',
      location: 'Main Campus, Room 101',
      status: 'Pending',
      attendees: '25/30',
    },
    {
      id: 2,
      title: 'Assessment Strategies',
      requestedBy: 'Mike Johnson',
      requestedOn: '1/10/2024',
      desc: 'Effective assessment techniques for diverse learning environments',
      date: '1/25/2024',
      time: '01:00 PM - 05:00 PM',
      location: 'Virtual Classroom A',
      status: 'Pending',
      attendees: '15/40',
    },
    {
      id: 3,
      title: 'STEM Education Workshop',
      requestedBy: 'David Brown',
      requestedOn: '1/12/2024',
      desc: 'Hands-on activities for teaching STEM subjects',
      date: '2/10/2024',
      time: '09:30 AM - 04:30 PM',
      location: 'Science Lab',
      status: 'Pending',
      attendees: '18/20',
    },
  ];
  const [events, setEvents] = useState(initialEvents);
  const [statusFilter, setStatusFilter] = useState('Pending');
  const handleApprove = (id: number) => {
    setEvents(evts => evts.map(e => e.id === id ? { ...e, status: 'Approved' } : e));
  };
  const handleReject = (id: number) => {
    setEvents(evts => evts.map(e => e.id === id ? { ...e, status: 'Rejected' } : e));
  };
  const filteredEvents = events.filter(e => statusFilter === 'All' ? true : e.status === statusFilter);

  // Add these handlers for Quick Actions
  const handleQuickAction = (tabKey: string) => setActiveTab(tabKey);

  return (
    <div className="w-full bg-white rounded-2xl shadow p-8 mt-6">
      <h2 className="text-2xl font-bold mb-1">Users Management</h2>
      <p className="text-gray-500 mb-6">Comprehensive user administration and management tools</p>
      {/* Tabs */}
      <div className="flex flex-row gap-2 border-b mb-6 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`px-4 py-2 font-medium rounded-t ${activeTab === tab.key ? 'bg-white border-b-2 border-blue-600 text-blue-700' : 'text-gray-600 hover:text-blue-600'}`}
            style={{ borderBottom: activeTab === tab.key ? '2px solid #2563eb' : '2px solid transparent' }}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
        <button className="ml-auto px-4 py-2 text-blue-600 border border-blue-100 rounded hover:bg-blue-50">⟳ Refresh</button>
      </div>
      {/* Tab Content */}
      {activeTab === 'overview' && (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow p-6 flex flex-col items-start">
                <div className="mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-700 font-medium mb-1">{stat.label}</div>
                <div className="text-xs text-gray-500 mb-2">{stat.desc}</div>
                <div className="text-xs flex items-center gap-1">
                  <span className={stat.growthColor}>{stat.growth}</span>
                  <span className="text-gray-400">{stat.sub}</span>
                </div>
              </div>
            ))}
          </div>
          {/* Quick Actions */}
          <div className="bg-gray-50 rounded-xl shadow p-6 mb-8">
            <div className="font-semibold text-gray-700 mb-4 flex items-center gap-2"><Cog className="w-5 h-5 mr-1 text-blue-500" /> Quick Actions</div>
            <div className="flex flex-col md:flex-row gap-4">
              <button onClick={() => handleQuickAction('create')} className="flex-1 flex items-center justify-center rounded-lg px-6 py-4 text-white font-semibold text-lg shadow transition bg-green-600 hover:opacity-90">
                <UserPlus className="w-5 h-5 mr-2" /> Create New User
                <span className="block text-xs font-normal ml-2">Click to access</span>
              </button>
              <button onClick={() => handleQuickAction('upload')} className="flex-1 flex items-center justify-center rounded-lg px-6 py-4 text-white font-semibold text-lg shadow transition bg-blue-600 hover:opacity-90">
                <Upload className="w-5 h-5 mr-2" /> Bulk Upload
                <span className="block text-xs font-normal ml-2">Click to access</span>
              </button>
              <button onClick={() => handleQuickAction('bulk')} className="flex-1 flex items-center justify-center rounded-lg px-6 py-4 text-white font-semibold text-lg shadow transition bg-purple-600 hover:opacity-90">
                <Download className="w-5 h-5 mr-2" /> Export Users
                <span className="block text-xs font-normal ml-2">Click to access</span>
              </button>
              <button onClick={() => handleQuickAction('training')} className="flex-1 flex items-center justify-center rounded-lg px-6 py-4 text-white font-semibold text-lg shadow transition bg-orange-500 hover:opacity-90">
                <CheckCircle className="w-5 h-5 mr-2" /> Approve Events
                <span className="block text-xs font-normal ml-2">Click to access</span>
              </button>
            </div>
          </div>
          {/* Recent User Activity */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="font-semibold text-lg mb-4">Recent User Activity</div>
            <div className="divide-y">
              {recentActivity.map((act, idx) => (
                <div key={idx} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-2">
                    <span className={`h-3 w-3 rounded-full ${act.color} inline-block`}></span>
                    <span className="font-medium text-gray-800">{act.label}</span>
                    <span className="text-gray-500 ml-2">{act.user}</span>
                  </div>
                  <span className="text-xs text-gray-400">{act.time}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      {activeTab === 'create' && (
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-green-500 text-white rounded-full p-2"><UserPlus className="w-5 h-5" /></span>
            <div>
              <div className="font-semibold text-lg">Create New User</div>
              <div className="text-gray-500 text-sm">Add a new user to the system</div>
            </div>
          </div>
          {/* Basic Information */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="font-semibold text-gray-700 mb-4">Basic Information</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Username <span className="text-red-500">*</span></label>
                <input className="w-full border rounded px-3 py-2" placeholder="Enter username" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-2">
                  <input className="w-full border rounded px-3 py-2" type="password" placeholder="Enter password" />
                  <button className="text-xs text-blue-600 ml-2">Generate</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">First Name <span className="text-red-500">*</span></label>
                <input className="w-full border rounded px-3 py-2" placeholder="Enter first name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name <span className="text-red-500">*</span></label>
                <input className="w-full border rounded px-3 py-2" placeholder="Enter last name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email <span className="text-red-500">*</span></label>
                <input className="w-full border rounded px-3 py-2" type="email" placeholder="Enter email address" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input className="w-full border rounded px-3 py-2" placeholder="Enter phone number" />
              </div>
            </div>
          </div>
          {/* Location & Organization */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="font-semibold text-gray-700 mb-4">Location & Organization</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Country <span className="text-red-500">*</span></label>
                <select className="w-full border rounded px-3 py-2">
                  <option>Select country</option>
                  <option>USA</option>
                  <option>India</option>
                  <option>UAE</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input className="w-full border rounded px-3 py-2" placeholder="Enter city" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">School (Optional)</label>
                <select className="w-full border rounded px-3 py-2">
                  <option>Select a school (optional)</option>
                  <option>School A</option>
                  <option>School B</option>
                </select>
              </div>
            </div>
          </div>
          {/* Select Role */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="font-semibold text-gray-700 mb-4">Select Role</div>
            <select className="w-full border rounded px-3 py-2">
              <option>Select a role</option>
              <option>Teacher</option>
              <option>Trainer</option>
              <option>School Admin</option>
            </select>
          </div>
          {/* Additional Information */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="font-semibold text-gray-700 mb-4">Additional Information</div>
            <textarea className="w-full border rounded px-3 py-2" rows={3} placeholder="Enter user description or notes" />
          </div>
          {/* Action Buttons */}
          <div className="flex gap-4 mt-4">
            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded flex items-center gap-2"><UserPlus className="w-4 h-4" /> Create User</button>
            <button className="bg-white border border-blue-600 text-blue-600 font-semibold px-6 py-2 rounded flex items-center gap-2">Clear Form</button>
          </div>
        </div>
      )}
      {activeTab === 'edit' && (
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-blue-500 text-white rounded-full p-2"><UserCog className="w-5 h-5" /></span>
            <div>
              <div className="font-semibold text-lg">Edit Users</div>
              <div className="text-gray-500 text-sm">Manage and modify user accounts</div>
            </div>
          </div>
          {/* Controls */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex gap-2 flex-1">
              <input className="border rounded px-3 py-2 w-full md:w-64" placeholder="Search users..." />
              <button className="border px-4 py-2 rounded text-blue-600 border-blue-200 hover:bg-blue-50">Filters</button>
            </div>
            <div className="flex gap-2">
              <button className="border px-4 py-2 rounded text-blue-600 border-blue-200 hover:bg-blue-50">⟳ Refresh</button>
              <button className="border px-4 py-2 rounded text-blue-600 border-blue-200 hover:bg-blue-50">Export</button>
            </div>
          </div>
          {/* User Table */}
          <div className="overflow-x-auto rounded-xl border bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3"><input type="checkbox" /></th>
                  <th className="p-3 text-left">USER</th>
                  <th className="p-3 text-left">EMAIL</th>
                  <th className="p-3 text-left">ROLE</th>
                  <th className="p-3 text-left">LAST ACCESS</th>
                  <th className="p-3 text-left">STATUS</th>
                  <th className="p-3 text-left">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {/* Demo users */}
                {[
                  { name: 'Guest user', username: '@guest', email: 'guest@abc.com', role: 'Student', last: 'Never', status: 'Active', color: 'bg-purple-500', initials: 'G' },
                  { name: 'Admin User', username: '@system_admin', email: 'system_admin@abc.com', role: 'Admin', last: '7/19/2025', status: 'Active', color: 'bg-purple-400', initials: 'AU' },
                  { name: 'Al Faisaliah Islamic School Admin', username: '@alfaisaliahislamic', email: 'alfaisaliahislamic@gmail.com', role: 'Student', last: '7/5/2025', status: 'Active', color: 'bg-purple-400', initials: 'AA' },
                  { name: 'Manarat Al-Khobar Admin', username: '@manarat_al_khobar', email: 'manarat_al_khobar@gmail.com', role: 'Student', last: '7/4/2025', status: 'Active', color: 'bg-purple-400', initials: 'MA' },
                  { name: 'Manarat Al-Riyadha Admin', username: '@manarat_al_riyadha', email: 'manarat_al_riyadha@gmail.com', role: 'Student', last: 'Never', status: 'Active', color: 'bg-purple-400', initials: 'MA' },
                  { name: 'Noor Al-Islam School Admin', username: '@noor_al_islam', email: 'noor_al_islam@gmail.com', role: 'Student', last: '7/19/2025', status: 'Active', color: 'bg-purple-400', initials: 'NA' },
                  { name: 'Manarat Al-madinah school Admin', username: '@manarat_al_madinah', email: 'manarat_al_madinah@gmail.com', role: 'Student', last: '7/2/2025', status: 'Active', color: 'bg-purple-400', initials: 'MA' },
                  { name: 'Saudi International School Admin', username: '@saudi_international', email: 'saudi_international@gmail.com', role: 'Student', last: '7/2/2025', status: 'Active', color: 'bg-purple-400', initials: 'SA' },
                  { name: 'Trainer 3', username: '@trainer', email: 'trainer3@gmail.com', role: 'Student', last: '7/2/2025', status: 'Active', color: 'bg-purple-400', initials: 'T3' },
                  { name: 'Trainer11', username: '@trainer1', email: 'trainer1@gmail.com', role: 'Student', last: '7/18/2025', status: 'Active', color: 'bg-purple-400', initials: 'T1' },
                ].map((user, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="p-3"><input type="checkbox" /></td>
                    <td className="p-3 flex items-center gap-3">
                      <span className={`h-8 w-8 rounded-full flex items-center justify-center text-white font-bold ${user.color}`}>{user.initials}</span>
                      <span>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.username}</div>
                      </span>
                    </td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3"><span className={`px-2 py-1 rounded text-xs font-semibold ${user.role === 'Admin' ? 'bg-blue-100 text-blue-700' : 'bg-blue-50 text-blue-600'}`}>{user.role}</span></td>
                    <td className="p-3">{user.last}</td>
                    <td className="p-3"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">{user.status}</span></td>
                    <td className="p-3 flex gap-2 text-gray-500">
                      <button title="View"><Eye className="w-4 h-4" /></button>
                      <button title="Edit"><Edit className="w-4 h-4" /></button>
                      <button title="Assign"><UsersIcon className="w-4 h-4" /></button>
                      <button title="Delete"><Trash2 className="w-4 h-4 text-red-500" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
            <span>Showing 1 to 10 of 89 users</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 border rounded disabled:opacity-50" disabled>&lt; Previous</button>
              <span>Page 1 of 9</span>
              <button className="px-3 py-1 border rounded">Next &gt;</button>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'department' && (
        <div className="p-8"><b>Department Users</b> page content (demo)</div>
      )}
      {activeTab === 'assign' && (
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-emerald-600 text-white rounded-full p-2"><Building2 className="w-5 h-5" /></span>
            <div>
              <div className="font-semibold text-lg">Assign Users to School</div>
              <div className="text-gray-500 text-sm">Assign users to specific schools and institutions</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Select Users */}
            <div className="bg-white rounded-2xl shadow flex flex-col h-[500px]">
              <div className="rounded-t-2xl px-6 py-4 flex items-center justify-between" style={{background: 'linear-gradient(90deg, #7B61FF 0%, #4FC3F7 100%)'}}>
                <div className="text-white font-semibold text-lg">Select Users</div>
                <div className="flex items-center gap-2 text-white text-sm font-medium"><Users className="w-5 h-5" /> 89 users available</div>
              </div>
              <div className="p-4 border-b">
                <input className="w-full border rounded px-3 py-2" placeholder="Search users..." />
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                {[
                  { name: 'Guest user', email: 'guest@abc.com', role: 'Student', color: 'bg-purple-500', initials: 'G' },
                  { name: 'Admin User', email: 'system_admin@abc.com', role: 'Admin', color: 'bg-purple-400', initials: 'AU' },
                  { name: 'Al Faisaliah Islamic School Admin', email: 'alfaisaliahislamic@gmail.com', role: 'Student', color: 'bg-purple-400', initials: 'AA' },
                  { name: 'Manarat Al-Khobar Admin', email: 'manarat_al_khobar@gmail.com', role: 'Student', color: 'bg-purple-400', initials: 'MA' },
                  { name: 'Manarat Al-Riyadha Admin', email: 'manarat_al_riyadha@gmail.com', role: 'Student', color: 'bg-purple-400', initials: 'MA' },
                ].map((user, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white rounded-lg shadow-sm p-3 mb-3 border hover:shadow-md transition">
                    <div className="flex items-center gap-3">
                      <span className={`h-9 w-9 rounded-full flex items-center justify-center text-white font-bold ${user.color}`}>{user.initials}</span>
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold">{user.role}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Select School */}
            <div className="bg-white rounded-2xl shadow flex flex-col h-[500px]">
              <div className="rounded-t-2xl px-6 py-4 flex items-center justify-between" style={{background: 'linear-gradient(90deg, #17C964 0%, #00BFAE 100%)'}}>
                <div className="text-white font-semibold text-lg">Select School</div>
                <div className="flex items-center gap-2 text-white text-sm font-medium"><Building2 className="w-5 h-5" /> 22 schools available</div>
              </div>
              <div className="p-4 border-b">
                <input className="w-full border rounded px-3 py-2" placeholder="Search schools..." />
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                {[
                  { name: 'Al Faisaliah Islamic School', code: 'faisaliahadmin', city: 'Al Khobar, SA' },
                  { name: 'Noor Al-Islam School', code: 'Noor', city: 'Dammam, SA' },
                  { name: 'Manarat Al-madinah', code: 'Manarat', city: 'madina, SA' },
                  { name: 'Saudi International School', code: 'SaudiInternational', city: 'Dammam city, SA' },
                ].map((school, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white rounded-lg shadow-sm p-3 mb-3 border hover:shadow-md transition">
                    <div className="flex items-center gap-3">
                      <span className="h-9 w-9 rounded-full flex items-center justify-center text-white font-bold bg-emerald-500"><Building2 className="w-5 h-5" /></span>
                      <div>
                        <div className="font-medium text-gray-900">{school.name}</div>
                        <div className="text-xs text-gray-500">{school.code}</div>
                        <div className="text-xs text-gray-400">{school.city}</div>
                      </div>
                    </div>
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold">users</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'upload' && (
        <div className="p-8"><b>Upload Users</b> page content (demo)</div>
      )}
      {activeTab === 'bulk' && (
        <div className="p-8"><b>Bulk Download</b> page content (demo)</div>
      )}
      {activeTab === 'training' && (
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-yellow-400 text-white rounded-full p-2"><CalendarCheck className="w-5 h-5" /></span>
            <div>
              <div className="font-semibold text-lg">Approve Training Events</div>
              <div className="text-gray-500 text-sm">Review and approve training event requests</div>
            </div>
          </div>
          {/* Controls */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex gap-2 flex-1">
              <input className="border rounded px-3 py-2 w-full md:w-64" placeholder="Search events..." />
              <select className="border rounded px-3 py-2" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="All">All</option>
              </select>
            </div>
            <button className="border px-4 py-2 rounded text-blue-600 border-blue-200 hover:bg-blue-50">⟳ Refresh</button>
          </div>
          {/* Event Cards */}
          <div className="flex flex-col gap-6">
            {filteredEvents.length === 0 && (
              <div className="text-center text-gray-400 py-12">No events found.</div>
            )}
            {filteredEvents.map((event, idx) => (
              <div key={event.id} className={`bg-white rounded-xl shadow flex flex-col md:flex-row items-start md:items-center gap-4 p-6 border-l-4 ${event.status === 'Pending' ? 'border-yellow-400' : event.status === 'Approved' ? 'border-green-500' : 'border-red-500'}`}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`bg-yellow-100 text-yellow-600 rounded p-1`}><CalendarCheck className="w-5 h-5" /></span>
                    <span className="font-bold text-lg text-gray-900">{event.title}</span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ml-2 ${event.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : event.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{event.status.toUpperCase()}</span>
                    <span className="ml-2 text-gray-500 text-xs flex items-center gap-1"><Users className="w-4 h-4" /> {event.attendees}</span>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">Requested by: {event.requestedBy} on {event.requestedOn}</div>
                  <div className="mb-2 text-gray-700">{event.desc}</div>
                  <div className="flex flex-wrap gap-6 text-sm text-gray-500 items-center">
                    <div className="flex items-center gap-1"><CalendarCheck className="w-4 h-4" /> {event.date}</div>
                    <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> {event.time}</div>
                    <div className="flex items-center gap-1"><Building2 className="w-4 h-4" /> {event.location}</div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 md:items-end w-full md:w-auto">
                  <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600 mb-2"><Eye className="w-4 h-4" /> View</button>
                  {event.status === 'Pending' && (
                    <div className="flex gap-2">
                      <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded flex items-center gap-2" onClick={() => handleApprove(event.id)}><CheckCircle className="w-4 h-4" /> Approve</button>
                      <button className="bg-white border border-red-500 text-red-500 font-semibold px-4 py-2 rounded flex items-center gap-2" onClick={() => handleReject(event.id)}><X className="w-4 h-4" /> Reject</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const CoursesManagementSection = () => {
  const { user } = useAuth();
  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'bulk', label: 'My Courses' },
    { key: 'create', label: 'User Enrollement ' },
    { key: 'edit', label: 'Manage course settings' },
    { key: 'assign', label: 'Manage groups' },
    { key: 'upload', label: 'Assign Courses To Group' },
  ];
  const [activeTab, setActiveTab] = useState('overview');

  // Demo stats for Overview
  const stats = [
    { icon: <BookOpen className="w-7 h-7 text-blue-600" />, label: 'Total Courses', value: 42, desc: 'All registered courses', growth: '+5%', growthColor: 'text-green-600', sub: 'vs last month' },
    { icon: <CheckCircle className="w-7 h-7 text-green-600" />, label: 'Active Courses', value: 30, desc: 'Currently active courses', growth: '+2%', growthColor: 'text-green-600', sub: 'vs last month' },
    { icon: <Clock className="w-7 h-7 text-orange-500" />, label: 'Pending Approvals', value: 3, desc: 'Courses awaiting approval', growth: '+1', growthColor: 'text-green-600', sub: 'vs last month' },
    { icon: <UserCog className="w-7 h-7 text-purple-600" />, label: 'Department Managers', value: 0, desc: 'Users with manager role', growth: '+2', growthColor: 'text-green-600', sub: 'vs last month' },
    { icon: <Upload className="w-7 h-7 text-teal-600" />, label: 'Recent Uploads', value: 10, desc: 'Courses uploaded this month', growth: '+3', growthColor: 'text-green-600', sub: 'vs last month' },
  ];
  const quickActions = [
    { label: 'User Enrollment', icon: <BookOpen className="w-5 h-5 mr-2" />, color: 'bg-green-600', text: 'Click to access', tab: 'create' },
    { label: 'Assign Courses To Group', icon: <Upload className="w-5 h-5 mr-2" />, color: 'bg-blue-600', text: 'Click to access', tab: 'upload' },
    { label: 'My Courses', icon: <Download className="w-5 h-5 mr-2" />, color: 'bg-purple-600', text: 'Click to access', tab: 'bulk' },
    { label: 'Manage Groups', icon: <CheckCircle className="w-5 h-5 mr-2" />, color: 'bg-orange-500', text: 'Click to access', tab: 'assign' },
  ];
  const recentActivity = [
    { color: 'bg-green-500', label: 'Course created', user: 'Admin', time: '2 minutes ago' },
    { color: 'bg-blue-500', label: 'Bulk upload completed', user: 'System', time: '15 minutes ago' },
    { color: 'bg-purple-500', label: 'Course updated', user: 'Jane Smith', time: '1 hour ago' },
    { color: 'bg-orange-500', label: 'Training event approved', user: 'Mike Johnson', time: '2 hours ago' },
  ];

  // Approve Training Events state (move hooks to top level)
  const initialEvents = [
    {
      id: 1,
      title: 'Advanced Teaching Methods',
      requestedBy: 'John Doe',
      requestedOn: '1/5/2024',
      desc: 'Workshop on modern teaching methodologies and classroom management',
      date: '1/15/2024',
      time: '10:00 AM - 04:00 PM',
      location: 'Main Campus, Room 101',
      status: 'Pending',
      attendees: '25/30',
    },
    {
      id: 2,
      title: 'Assessment Strategies',
      requestedBy: 'Mike Johnson',
      requestedOn: '1/10/2024',
      desc: 'Effective assessment techniques for diverse learning environments',
      date: '1/25/2024',
      time: '01:00 PM - 05:00 PM',
      location: 'Virtual Classroom A',
      status: 'Pending',
      attendees: '15/40',
    },
    {
      id: 3,
      title: 'STEM Education Workshop',
      requestedBy: 'David Brown',
      requestedOn: '1/12/2024',
      desc: 'Hands-on activities for teaching STEM subjects',
      date: '2/10/2024',
      time: '09:30 AM - 04:30 PM',
      location: 'Science Lab',
      status: 'Pending',
      attendees: '18/20',
    },
  ];
  const [events, setEvents] = useState(initialEvents);
  const [statusFilter, setStatusFilter] = useState('Pending');
  const handleApprove = (id: number) => {
    setEvents(evts => evts.map(e => e.id === id ? { ...e, status: 'Approved' } : e));
  };
  const handleReject = (id: number) => {
    setEvents(evts => evts.map(e => e.id === id ? { ...e, status: 'Rejected' } : e));
  };
  const filteredEvents = events.filter(e => statusFilter === 'All' ? true : e.status === statusFilter);
  const handleQuickAction = (tabKey: string) => setActiveTab(tabKey);

  // My Courses state
  const [myCourses, setMyCourses] = useState<any[]>([]);
  const [myCoursesLoading, setMyCoursesLoading] = useState(false);
  useEffect(() => {
    if (activeTab === 'bulk' && user?.company) {
      setMyCoursesLoading(true);
      coursesService.getCompanyCourses(Number(user.company)).then((courses) => {
        setMyCourses(Array.isArray(courses) ? courses : []);
      }).finally(() => setMyCoursesLoading(false));
    }
  }, [activeTab, user]);

  // User Enrollment (inline AssignCourseToUsers logic)
  const [users, setUsers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<{ [courseId: string]: string[] }>({});
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState<{ [key: string]: boolean }>({});
  const [activeCourse, setActiveCourse] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'create' && user?.company) {
      setLoading(true);
      Promise.all([
        usersService.getCompanyUsers(Number(user.company)),
        coursesService.getCompanyCourses(Number(user.company))
      ]).then(async ([users, courses]) => {
        console.log('CoursesManagementSection fetched users:', users);
        console.log('CoursesManagementSection fetched courses:', courses);
        setUsers(users);
        setCourses(courses);
        // Fetch enrollments for each course
        const enrollmentsObj: { [courseId: string]: string[] } = {};
        for (const course of courses) {
          const enrolled = await coursesService.getCourseEnrollments(course.id);
          enrollmentsObj[course.id] = enrolled.map((u: any) => u.id?.toString() || u.userid?.toString());
        }
        setEnrollments(enrollmentsObj);
        if (courses.length > 0) setActiveCourse(courses[0].id);
      }).finally(() => {
        setLoading(false);
        console.log('CoursesManagementSection loading:', false);
      });
    }
  }, [activeTab, user]);

  useEffect(() => {
    console.log('CoursesManagementSection rendered. users:', users, 'courses:', courses, 'loading:', loading);
  }, [users, courses, loading]);

  const handleAssign = async (courseId: string, userId: string) => {
    setAssigning(prev => ({ ...prev, [courseId + '-' + userId]: true }));
    await coursesService.enrollUserInCourse(courseId, userId);
    // Refresh enrollments for this course
    const enrolled = await coursesService.getCourseEnrollments(courseId);
    setEnrollments(prev => ({ ...prev, [courseId]: enrolled.map((u: any) => u.id?.toString() || u.userid?.toString()) }));
    setAssigning(prev => ({ ...prev, [courseId + '-' + userId]: false }));
  };

  const getAssignedUsers = (courseId: string) =>
    users.filter(u => enrollments[courseId]?.includes(u.id));
  const getUnassignedUsers = (courseId: string) =>
    users.filter(u => !enrollments[courseId]?.includes(u.id));

  return (
    <div className="w-full bg-white rounded-2xl shadow p-8 mt-6">
      <h2 className="text-2xl font-bold mb-1">Courses Management</h2>
      <p className="text-gray-500 mb-6">Comprehensive course administration and management tools</p>
      {/* Tabs */}
      <div className="flex flex-row gap-2 border-b mb-6 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`px-4 py-2 font-medium rounded-t ${activeTab === tab.key ? 'bg-white border-b-2 border-blue-600 text-blue-700' : 'text-gray-600 hover:text-blue-600'}`}
            style={{ borderBottom: activeTab === tab.key ? '2px solid #2563eb' : '2px solid transparent' }}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
        <button className="ml-auto px-4 py-2 text-blue-600 border border-blue-100 rounded hover:bg-blue-50">⟳ Refresh</button>
      </div>
      {/* Tab Content */}
      {activeTab === 'overview' && (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow p-6 flex flex-col items-start">
                <div className="mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-700 font-medium mb-1">{stat.label}</div>
                <div className="text-xs text-gray-500 mb-2">{stat.desc}</div>
                <div className="text-xs flex items-center gap-1">
                  <span className={stat.growthColor}>{stat.growth}</span>
                  <span className="text-gray-400">{stat.sub}</span>
                </div>
              </div>
            ))}
          </div>
          {/* Quick Actions */}
          <div className="bg-gray-50 rounded-xl shadow p-6 mb-8">
            <div className="font-semibold text-gray-700 mb-4 flex items-center gap-2"><Cog className="w-5 h-5 mr-1 text-blue-500" /> Quick Actions</div>
            <div className="flex flex-col md:flex-row gap-4">
              {quickActions.map((action, idx) => (
                <button key={idx} onClick={() => setActiveTab(action.tab)} className={`flex-1 flex items-center justify-center rounded-lg px-6 py-4 text-white font-semibold text-lg shadow transition ${action.color} hover:opacity-90`}>
                  {action.icon} {action.label}
                  <span className="block text-xs font-normal ml-2">{action.text}</span>
                </button>
              ))}
            </div>
          </div>
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="font-semibold text-lg mb-4">Recent Course Activity</div>
            <div className="divide-y">
              {recentActivity.map((act, idx) => (
                <div key={idx} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-2">
                    <span className={`h-3 w-3 rounded-full ${act.color} inline-block`}></span>
                    <span className="font-medium text-gray-800">{act.label}</span>
                    <span className="text-gray-500 ml-2">{act.user}</span>
                  </div>
                  <span className="text-xs text-gray-400">{act.time}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      {activeTab === 'create' && user?.company && (
        <AssignCourseToUsers companyId={Number(user.company)} />
      )}
      {activeTab === 'bulk' && (
        <div className="w-full bg-white rounded-2xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold text-gray-900">My Courses</span>
          </div>
          {myCoursesLoading ? (
            <div className="text-center py-8 text-gray-400">Loading courses...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
              {myCourses.length === 0 ? (
                <div className="col-span-full text-center text-gray-400 py-8">No courses found.</div>
              ) : (
                myCourses.map((course: any, idx: number) => (
                  <div key={course.id || idx} className="bg-white rounded-xl shadow border p-2 flex flex-col hover:shadow-lg transition">
                    <img src={course.courseimage || '/public/images/default-course.jpg'} alt={course.fullname || 'Course'} className="rounded-t-xl h-32 w-full object-cover mb-2" />
                    <a href={course.link || '#'} className="text-blue-700 font-medium hover:underline px-2 pb-2 pt-1">{course.fullname || 'Untitled Course'}</a>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
      {/* Keep demo content for other tabs for now */}
      {activeTab === 'edit' && (
        <div className="p-8"><b>Edit Courses</b> page content (demo)</div>
      )}
      {activeTab === 'assign' && (
        <div className="p-8"><b>Assign to School</b> page content (demo)</div>
      )}
      {activeTab === 'upload' && (
        <div className="p-8"><b>Upload Courses</b> page content (demo)</div>
      )}
    </div>
  );
};

const ReportsManagementSection = () => {
  const reports = [
    {
      key: 'attendance',
      label: 'Attendance report by course',
      icon: <Clock className="w-12 h-12 text-orange-500" />,
      heading: 'Attendance Report by Course',
      content: 'Detailed attendance analytics for each course will be displayed here.'
    },
    {
      key: 'completion_course',
      label: 'Completion report by course',
      icon: <CheckSquare className="w-12 h-12 text-green-600" />,
      heading: 'Completion Report by Course',
      content: 'Course completion statistics and analytics will be shown here.'
    },
    {
      key: 'completion_month',
      label: 'Completion report by month',
      icon: <CheckSquare className="w-12 h-12 text-green-600" />,
      heading: 'Completion Report by Month',
      content: 'Monthly completion trends and breakdowns will be shown here.'
    },
    {
      key: 'overview',
      label: 'Completion Overview Report',
      icon: <List className="w-12 h-12 text-blue-600" />,
      heading: 'Completion Overview Report',
      content: 'Overview of all completion metrics and summaries.'
    },
    {
      key: 'email',
      label: 'Outgoing Email Report',
      icon: <Mail className="w-12 h-12 text-cyan-700" />,
      heading: 'Outgoing Email Report',
      content: 'Analytics and logs for outgoing emails.'
    },
    {
      key: 'license',
      label: 'License Allocations Report',
      icon: <Gavel className="w-12 h-12 text-purple-600" />,
      heading: 'License Allocations Report',
      content: 'License allocation details and usage.'
    },
    {
      key: 'user_license',
      label: 'User license allocations report',
      icon: <UserCheck className="w-12 h-12 text-purple-600" />,
      heading: 'User License Allocations Report',
      content: 'User-specific license allocation analytics.'
    },
    {
      key: 'login',
      label: 'User Login Report',
      icon: <UsersIcon className="w-12 h-12 text-blue-600" />,
      heading: 'User Login Report',
      content: 'User login activity and statistics.'
    },
    {
      key: 'users',
      label: 'Users Report',
      icon: <UsersIcon className="w-12 h-12 text-blue-600" />,
      heading: 'Users Report',
      content: 'Comprehensive user analytics and reports.'
    },
  ];
  const [activeReport, setActiveReport] = useState<string | null>(null);
  const active = reports.find(r => r.key === activeReport);
  return (
    <>
      <div className="w-full bg-white rounded-2xl shadow p-8 mt-6">
        <h2 className="text-2xl font-bold mb-1">Reports</h2>
        <p className="text-gray-500 mb-6">Comprehensive reporting and analytics tools</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {reports.map((report, idx) => (
            <button
              key={report.key}
              onClick={() => setActiveReport(report.key)}
              className={`flex flex-col items-start justify-between w-full h-full bg-white rounded-2xl shadow p-6 border transition-all duration-200 ${activeReport === report.key ? 'border-blue-600 ring-2 ring-blue-100' : 'border-gray-100 hover:border-blue-300 hover:shadow-md'} group`}
              style={{ minHeight: 180 }}
            >
              <div className={`mb-4 text-3xl`}>{report.icon}</div>
              <span className="text-base font-semibold text-gray-900 mb-1 text-left group-hover:text-blue-700 transition">{report.label}</span>
              <span className="absolute top-4 right-4 bg-green-400 rounded-full p-1 border-2 border-white">
                <BarChart2 className="w-5 h-5 text-white" />
              </span>
            </button>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {active && (
          <motion.div
            key={active.key}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4 }}
            className="w-full flex flex-col items-center"
          >
            <div className="w-full bg-white rounded-2xl shadow p-8 mt-8 mb-8">
              <h3 className="text-xl font-bold text-blue-800 mb-4 text-center">{active.heading}</h3>
              <div className="bg-gray-50 rounded-xl shadow p-8 w-full max-w-3xl mx-auto text-center text-gray-700">
                {active.content}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const sectionComponents: Record<string, React.ReactNode> = {
  dashboard: <DashboardSection />,
  manageSchool: <SectionPlaceholder title="Manage School Data" />,
  users: <UserManagementSection />,
  courses: <CoursesManagementSection />,
  community: <SectionPlaceholder title="Community & Collaboration" />,
  licenses: <SectionPlaceholder title="Licenses" />,
  competencies: <SectionPlaceholder title="Competencies" />,
  reports: <ReportsManagementSection />,
  attendance: <SectionPlaceholder title="Attendance" />,
  approveTraining: <SectionPlaceholder title="Approve Training Events" />,
};

const SchoolAdminDashboardPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const { user } = useAuth();
  const [schoolName, setSchoolName] = useState('');

  useEffect(() => {
    const fetchSchoolName = async () => {
        if (user?.company) {
            const school = await schoolsService.getSchoolById(Number(user.company));
            if (school) {
                setSchoolName(school.name);
            }
        }
    };
    fetchSchoolName();
  }, [user]);

  const adminName = user?.fullname || 'School Admin';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-72 bg-white shadow-lg flex flex-col py-6 px-4 min-h-screen border-r">
          <div className="flex items-center gap-3 mb-8 px-2">
            <img src="/logo/Riyada.png" alt="Riyada Trainings Logo" className="h-10 w-10 rounded-full object-cover" />
            <span className="text-lg font-bold text-blue-800">Riyada Trainings</span>
          </div>
          <ul className="space-y-1">
            {sidebarItems.map(item => {
              const Icon = item.icon;
              const isActive = activeSection === item.key;
              return (
                <li key={item.key}>
                  <button
                    className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors text-left relative ${isActive ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
                    onClick={() => setActiveSection(item.key)}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                    {isActive && <span className="absolute right-3 top-1/2 -translate-y-1/2 h-2 w-2 bg-blue-500 rounded-full"></span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <MainNavbar adminName={adminName} schoolName={schoolName} setActiveSection={setActiveSection} />
          <main className="flex-1 flex flex-col p-8">
            {sectionComponents[activeSection]}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SchoolAdminDashboardPage; 