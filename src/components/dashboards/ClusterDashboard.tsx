import React, { useState, useEffect } from 'react';
import {
    LayoutGrid, Briefcase, Users, BookOpen, CalendarCheck2, Star, FileText, Headset, Settings, LogOut, Bell, Search, ChevronDown, MapPin, School, UserCheck, GraduationCap, TrendingUp, Target, Download, RefreshCw, BarChart2, ArrowLeft, Camera, X, Eye, Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line, Legend, LabelList
} from 'recharts';


// Mock Data for Charts
const participationData = [
    { name: 'School A', 'Participation Rate': 85 },
    { name: 'School B', 'Participation Rate': 92 },
    { name: 'School C', 'Participation Rate': 78 },
    { name: 'School D', 'Participation Rate': 88 },
    { name: 'School E', 'Participation Rate': 95 },
    { name: 'School F', 'Participation Rate': 80 },
];

const competencyData = [
    { name: 'Completed', value: 60, color: '#10b981' },
    { name: 'In Progress', value: 25, color: '#f59e0b' },
    { name: 'Not Started', value: 15, color: '#ef4444' },
];

const engagementData = [
    { name: 'Jan', 'Engagement Score': 75 }, { name: 'Feb', 'Engagement Score': 78 },
    { name: 'Mar', 'Engagement Score': 82 }, { name: 'Apr', 'Engagement Score': 80 },
    { name: 'May', 'Engagement Score': 85 }, { name: 'Jun', 'Engagement Score': 88 },
];

const predictiveData = [
    { name: 'Q1', 'Predicted Growth': 5 }, { name: 'Q2', 'Predicted Growth': 10 },
    { name: 'Q3', 'Predicted Growth': 15 }, { name: 'Q4', 'Predicted Growth': 20 },
];

const certificationData = [
    { name: '2021', Certifications: 150 }, { name: '2022', Certifications: 250 },
    { name: '2023', Certifications: 400 }, { name: '2024', Certifications: 600 },
];


const ClusterDashboard = () => {
    const [activeSection, setActiveSection] = useState('Dashboard');

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <MainContent activeSection={activeSection} />
            </div>
        </div>
    );
};

interface SidebarProps {
    activeSection: string;
    setActiveSection: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
    const menuItems = [
        { name: 'Dashboard', icon: LayoutGrid },
        { name: 'Manage Clusters', icon: Briefcase },
        { name: 'Schools Overview', icon: School },
        { name: 'Trainer & Trainee Insights', icon: Users },
        { name: 'Courses Management', icon: BookOpen },
        { name: 'Attendance Monitoring', icon: CalendarCheck2 },
        { name: 'Competencies', icon: GraduationCap },
        { name: 'Reports', icon: FileText },
        { name: 'Approve ILT/VILT Events', icon: Star },
        { name: 'Settings', icon: Settings },
    ];
    return (
        <aside className="w-64 bg-white shadow-md flex-shrink-0">
            <div className="p-6 flex items-center gap-3">
                <img src="/logo/Riyada.png" alt="Riyada Trainings Logo" className="w-10 h-10" />
                <h1 className="text-xl font-bold text-gray-800">Riyada Trainings</h1>
            </div>
            <nav className="mt-6">
                {menuItems.map(item => (
                    <a key={item.name} href="#" onClick={() => setActiveSection(item.name)} className={`flex items-center px-6 py-3 text-gray-600 hover:bg-gray-200 ${activeSection === item.name ? 'bg-blue-100 text-gray-700' : ''}`}>
                        <item.icon className="w-5 h-5" />
                        <span className="mx-4 font-medium">{item.name}</span>
                    </a>
                ))}
            </nav>
        </aside>
    );
};

const Header = () => {
    const { user, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        // The AuthProvider should handle redirecting to the login page
    };
    
    return (
    <header className="flex items-center justify-between p-6 bg-white border-b flex-shrink-0">
        <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="w-5 h-5 text-gray-400" />
            </span>
            <input type="text" className="w-full py-2 pl-10 pr-4 text-gray-700 bg-gray-100 border rounded-md focus:outline-none focus:bg-white focus:border-blue-500" placeholder="Search for schools, teachers, courses" />
        </div>
        <div className="flex items-center space-x-4">
            <button className="relative">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="flex items-center px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                <Plus className="w-5 h-5 mr-2" />
                Reports
            </button>
            <div className="relative">
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2">
                    <img className="w-10 h-10 rounded-full" src={user?.profileimageurl || "https://i.pravatar.cc/150?u=a042581f4e29026704d"} alt="Admin avatar" />
                    <span className="text-gray-700">{user?.firstname || 'Cluster Admin'}</span>
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>
                {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                        <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                    </div>
                )}
            </div>
        </div>
    </header>
)};

interface MainContentProps {
    activeSection: string;
}

const MainContent: React.FC<MainContentProps> = ({ activeSection }) => {
    const renderSection = () => {
        switch (activeSection) {
            case 'Dashboard':
                return <DashboardContent />;
            case 'Schools Overview':
                return <SchoolsOverviewSection />;
            case 'Trainer & Trainee Insights':
                return <TrainerInsightsSection />;
            case 'Courses Management':
                return <CoursesManagementSection />;
            case 'Attendance Monitoring':
                return <AttendanceMonitoringSection />;
            case 'Competencies':
                return <CompetencyDevelopmentSection />;
            case 'Reports':
                return <ReportsCenterSection />;
            case 'Settings':
                return <AccountSettingsSection />;
            default:
                return <PlaceholderSection title={activeSection} />;
        }
    };

    return (
        <main className="flex-1 p-6 overflow-y-auto">
            {renderSection()}
        </main>
    );
};

const DashboardContent = () => (
    <>
        <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Management Dashboard</h2>
            <p className="text-gray-600">Comprehensive analytics of Cluster-Level Teacher Training</p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <InfoCard title="Total Schools in Cluster" value="25" Icon={School} iconColor="text-blue-600" bgColor="bg-blue-100" />
            <InfoCard title="Total Active Teachers" value="1,250" Icon={Users} iconColor="text-green-600" bgColor="bg-green-100" />
            <InfoCard title="Total Trainers" value="50" Icon={UserCheck} iconColor="text-yellow-600" bgColor="bg-yellow-100" />
            <InfoCard title="Total Courses" value="75" Icon={BookOpen} iconColor="text-purple-600" bgColor="bg-purple-100" />
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 gap-6 mt-8 lg:grid-cols-3">
            <div className="col-span-1 p-6 bg-white rounded-lg shadow-md lg:col-span-2">
                <ChartHeader title="School-wise Training Participation" />
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={participationData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Participation Rate" fill="rgba(59, 130, 246, 0.5)" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-800">Teacher Performance Improvement</h3>
                <div className="mt-4 space-y-4">
                    <PerformanceBar subject="Math" percentage={24} color="bg-blue-600" />
                    <PerformanceBar subject="Languages" percentage={19} color="bg-green-600" />
                    <PerformanceBar subject="Sciences" percentage={16} color="bg-yellow-500" />
                    <PerformanceBar subject="Humanities" percentage={14} color="bg-red-500" />
                </div>
            </div>
        </div>

        {/* Additional Cards */}
        <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-4">
            <ChartCard title="Competency Development" description="Track the growth of teacher competencies.">
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie data={competencyData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                            {competencyData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </ChartCard>
            <ChartCard title="Teacher Engagement" description="Measure teacher participation and satisfaction.">
                 <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={engagementData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="Engagement Score" stroke="#10b981" />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>
            <ChartCard title="Predictive Insights" description="Forecast future training needs and outcomes.">
                 <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={predictiveData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="Predicted Growth" stroke="#6366f1" strokeDasharray="5 5" />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>
            <ChartCard title="Certification Trends" description="Analyze the trends in teacher certifications.">
                 <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={certificationData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="Certifications" stroke="#ec4899" />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>
        </div>

        {/* Regional School Map */}
        <div className="p-6 mt-8 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-800">Regional School Map</h3>
            <div className="mt-4 h-[450px]">
                <RegionalInfographicMap />
            </div>
        </div>
    </>
);

const SchoolsOverviewSection = () => {
    const schoolsData = [
        { name: 'Al-Rowad International School', teachers: 85, trained: 95, principal: 'Dr. Evelyn Reed' },
        { name: 'Manarat Al-Riyadh School', teachers: 110, trained: 88, principal: 'Mr. David Chen' },
        { name: 'Najd National School', teachers: 92, trained: 76, principal: 'Ms. Sarah Jenkins' },
        { name: 'Al-Faris International School', teachers: 78, trained: 98, principal: 'Mr. Robert Frost' },
    ];

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Schools Overview</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b text-sm text-gray-500">
                            <th className="py-3 px-4 font-medium">SCHOOL NAME</th>
                            <th className="py-3 px-4 font-medium"># TEACHERS</th>
                            <th className="py-3 px-4 font-medium">% TRAINED</th>
                            <th className="py-3 px-4 font-medium">PRINCIPAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schoolsData.map((school, index) => (
                            <tr key={index} className="border-b">
                                <td className="py-4 px-4">{school.name}</td>
                                <td className="py-4 px-4">{school.teachers}</td>
                                <td className="py-4 px-4">
                                    <div className="w-3/4 bg-gray-200 rounded-full h-4">
                                        <div 
                                            className={`h-4 rounded-full text-white text-xs flex items-center justify-center ${school.trained > 80 ? 'bg-green-500' : 'bg-yellow-500'}`}
                                            style={{ width: `${school.trained}%` }}
                                        >
                                            {school.trained}%
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-4">{school.principal}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const TrainerInsightsSection = () => {
    const topTrainers = [
        { name: 'Abdullah Al-Qahtani', avgRating: '4.9/5.0', tag: 'Top 5%', tagColor: 'bg-green-100 text-green-700', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
        { name: 'Noura Al-Mutairi', avgRating: '4.8/5.0', tag: 'Top 10%', tagColor: 'bg-green-100 text-green-700', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
        { name: 'Khaled Al-Ghamdi', avgRating: '4.7/5.0', tag: 'Consistent', tagColor: 'bg-blue-100 text-blue-700', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
    ];

    const feedbackData = [
        { course: 'Pedagogy', score: 4.8, color: '#3b82f6' },
        { course: 'Digital Tools', score: 4.5, color: '#10b981' },
        { course: 'Management', score: 4.2, color: '#f59e0b' },
        { course: 'AI Intro', score: 4.7, color: '#8b5cf6' },
    ];
    
    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Trainer Insights</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Trainers by Rating */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Trainers by Rating</h3>
                    <div className="space-y-4">
                        {topTrainers.map(trainer => (
                            <div key={trainer.name} className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <img src={trainer.avatar} alt={trainer.name} className="w-12 h-12 rounded-full mr-4" />
                                    <div>
                                        <div className="font-semibold">{trainer.name}</div>
                                        <div className="text-sm text-gray-500">{trainer.avgRating}</div>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 text-xs font-semibold rounded-full ${trainer.tagColor}`}>
                                    {trainer.tag}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Feedback Scores by Course */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Feedback Scores by Course</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={feedbackData} layout="vertical" margin={{ left: 10, right: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" domain={[0, 5]} ticks={[0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0]} />
                            <YAxis type="category" dataKey="course" width={80} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="score" name="Avg. Feedback Score">
                                {feedbackData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

const CoursesManagementSection = () => {
    const coursesData = [
        { title: 'Advanced Pedagogy', type: 'VILT', enrolled: 150, status: 'Active' },
        { title: 'Digital Tools for Educators', type: 'Self-Paced', enrolled: 320, status: 'Active' },
        { title: 'Classroom Management 101', type: 'ILT', enrolled: 75, status: 'Upcoming' },
        { title: 'Intro to AI in Education', type: 'VILT', enrolled: 95, status: 'Archived' },
    ];

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-700';
            case 'Upcoming': return 'bg-yellow-100 text-yellow-700';
            case 'Archived': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Courses Management</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b text-sm text-gray-500">
                            <th className="py-3 px-4 font-medium">COURSE TITLE</th>
                            <th className="py-3 px-4 font-medium">TYPE</th>
                            <th className="py-3 px-4 font-medium">ENROLLED</th>
                            <th className="py-3 px-4 font-medium">STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coursesData.map((course, index) => (
                            <tr key={index} className="border-b">
                                <td className="py-4 px-4 font-semibold text-gray-700">{course.title}</td>
                                <td className="py-4 px-4">{course.type}</td>
                                <td className="py-4 px-4">{course.enrolled}</td>
                                <td className="py-4 px-4">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusClass(course.status)}`}>
                                        {course.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const CompetencyDevelopmentSection = () => {
    const competencies = [
        { name: 'Digital Literacy', proficiency: 75, color: '#34D399' },
        { name: 'Pedagogical Skills', proficiency: 60, color: '#60A5FA' },
        { name: 'Classroom Management', proficiency: 45, color: '#FBBF24' },
    ];

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Competency Development</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {competencies.map((comp, index) => (
                    <motion.div
                        key={index}
                        className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 h-12 flex items-center">{comp.name}</h3>
                        <div className="w-48 h-48">
                            <RadialChart proficiency={comp.proficiency} color={comp.color} />
                        </div>
                        <p className="text-sm text-gray-500 mt-4">Cluster-wide proficiency</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

interface RadialChartProps {
    proficiency: number;
    color: string;
}

const RadialChart: React.FC<RadialChartProps> = ({ proficiency, color }) => {
    const data = [
        { name: 'achieved', value: proficiency },
        { name: 'remaining', value: 100 - proficiency }
    ];

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    dataKey="value"
                    innerRadius={60}
                    outerRadius={75}
                    startAngle={90}
                    endAngle={450}
                    paddingAngle={0}
                    cornerRadius={10}
                    stroke="none"
                >
                    <Cell key="achieved" fill={color} />
                    <Cell key="remaining" fill="#f3f4f6" />
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
}

const AttendanceMonitoringSection = () => {
    const attendanceData = [
        { session: 'Advanced Pedagogy - Week 3', date: 'July 15, 2025', type: 'VILT', attendance: 98, present: 147, total: 150 },
        { session: 'Classroom Management Workshop', date: 'July 12, 2025', type: 'ILT', attendance: 95, present: 71, total: 75 },
        { session: 'Advanced Pedagogy - Week 2', date: 'July 8, 2025', type: 'VILT', attendance: 88, present: 132, total: 150 },
    ];

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Attendance Monitoring</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b text-sm text-gray-500">
                            <th className="py-3 px-4 font-medium">SESSION / COURSE</th>
                            <th className="py-3 px-4 font-medium">DATE</th>
                            <th className="py-3 px-4 font-medium">TYPE</th>
                            <th className="py-3 px-4 font-medium">ATTENDANCE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendanceData.map((item, index) => (
                            <tr key={index} className="border-b">
                                <td className="py-4 px-4 font-semibold text-gray-700">{item.session}</td>
                                <td className="py-4 px-4">{item.date}</td>
                                <td className="py-4 px-4">{item.type}</td>
                                <td className={`py-4 px-4 font-semibold ${item.attendance >= 90 ? 'text-green-600' : 'text-red-600'}`}>
                                    {item.attendance}% ({item.present}/{item.total})
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


// Helper Components
interface InfoCardProps {
    title: string;
    value: string;
    Icon: React.ElementType;
    iconColor: string;
    bgColor: string;
}
const InfoCard: React.FC<InfoCardProps> = ({ title, value, Icon, iconColor, bgColor }) => (
    <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-600">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
            <div className={`p-3 rounded-full ${bgColor}`}>
                <Icon className={`w-6 h-6 ${iconColor}`} />
            </div>
        </div>
    </div>
);

interface ChartHeaderProps {
    title: string;
}
const ChartHeader: React.FC<ChartHeaderProps> = ({ title }) => (
    <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-800">{title}</h3>
        <div className="relative">
            <select className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md">
                <option>Quarterly</option>
                <option>Monthly</option>
                <option>Yearly</option>
            </select>
        </div>
    </div>
);

interface PerformanceBarProps {
    subject: string;
    percentage: number;
    color: string;
}
const PerformanceBar: React.FC<PerformanceBarProps> = ({ subject, percentage, color }) => (
    <div>
        <div className="flex justify-between">
            <p className="text-sm font-medium text-gray-600">{subject}</p>
            <p className="text-sm font-medium text-green-500">+{percentage}%</p>
        </div>
        <div className="w-full mt-1 bg-gray-200 rounded-full">
            <div className={`h-2 rounded-full ${color}`} style={{ width: `${percentage}%` }}></div>
        </div>
    </div>
);

interface ChartCardProps {
    title: string;
    description: string;
    children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, description, children }) => (
    <div className="p-6 bg-white rounded-lg shadow-md">
        <h3 className="font-medium text-gray-800">{title}</h3>
        <p className="mt-2 text-sm text-gray-600">{description}</p>
        <div className="mt-4">{children}</div>
    </div>
);

const PlaceholderSection = ({ title }: { title: string }) => (
    <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-gray-400">Welcome to {title}</h2>
    </div>
);

const geoUrl = "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

// Define interfaces for our data structures
interface School {
    id: number;
    name: string;
    city: string;
    country: string;
    coordinates: [number, number];
    image: string;
}

// Mock school data - in a real app, this would come from your API
const mockSchools: School[] = [
    { id: 1, name: "Riyada International School", city: "Riyadh", country: "Saudi Arabia", coordinates: [46.7219, 24.6877], image: "https://via.placeholder.com/400x200.png?text=Riyada+International" },
    { id: 2, name: "Jeddah Knowledge School", city: "Jeddah", country: "Saudi Arabia", coordinates: [39.2176, 21.5433], image: "https://via.placeholder.com/400x200.png?text=Jeddah+Knowledge" },
    { id: 3, name: "Dubai Modern Education", city: "Dubai", country: "United Arab Emirates", coordinates: [55.2708, 25.2048], image: "https://via.placeholder.com/400x200.png?text=Dubai+Modern" },
    { id: 4, name: "Cairo American College", city: "Cairo", country: "Egypt", coordinates: [31.2357, 30.0444], image: "https://via.placeholder.com/400x200.png?text=Cairo+American" }
];

const RegionalInfographicMap = () => {
    const { user } = useAuth();
    const [schools, setSchools] = useState<School[]>([]);
    const [highlightedCountry, setHighlightedCountry] = useState<string | null>(null);
    const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

    useEffect(() => {
        // Fetch schools and set highlighted country based on user
        // Using mock data for now
        setSchools(mockSchools);
        if(user && user.country) {
            setHighlightedCountry(user.country);
        } else {
            // Fallback for demo
            setHighlightedCountry("Saudi Arabia");
        }
    }, [user]);

    return (
        <div className="relative">
            <ComposableMap projectionConfig={{ scale: 180 }}>
                <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                        geographies.map((geo: any) => (
                            <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                style={{
                                    default: { fill: "#E9EAEA", outline: "none" },
                                    hover: { fill: "#D6D6DA", outline: "none" },
                                    pressed: { fill: "#D6D6DA", outline: "none" },
                                }}
                                fill={geo.properties.NAME === highlightedCountry ? "#a0c4ff" : "#E9EAEA"}
                            />
                        ))
                    }
                </Geographies>
                {schools.map(({ id, name, coordinates, country }) => (
                     highlightedCountry === country && (
                        <Marker key={id} coordinates={coordinates}>
                            <motion.g
                                onClick={() => setSelectedSchool(mockSchools.find(s => s.id === id) || null)}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                                whileHover={{ scale: 1.5 }}
                                style={{ cursor: 'pointer' }}
                                transform="translate(0, -14)"
                            >
                                <path
                                    d="M-7 0a7 7 0 1 1 14 0c0 3.866-7 14-7 14s-7-10.134-7-14z"
                                    fill="#3b82f6"
                                    stroke="#fff"
                                    strokeWidth={1.5}
                                />
                                <circle cx="0" cy="0" r="3" fill="white" />
                            </motion.g>
                        </Marker>
                     )
                ))}
            </ComposableMap>
            {selectedSchool && <SchoolModal school={selectedSchool} onClose={() => setSelectedSchool(null)} />}
        </div>
    );
};

interface SchoolModalProps {
    school: School;
    onClose: () => void;
}
const SchoolModal: React.FC<SchoolModalProps> = ({ school, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div 
            className="bg-white rounded-lg shadow-2xl max-w-lg w-full"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
        >
            <div className="p-6">
                <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="font-bold text-xl">{school.name}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="mt-4">
                    <img src={school.image} alt={school.name} className="w-full h-auto rounded-md mb-4"/>
                    <p className="text-gray-600"><strong>City:</strong> {school.city}</p>
                    <p className="text-gray-600"><strong>Country:</strong> {school.country}</p>
                </div>
            </div>
        </motion.div>
    </div>
);

const AccountSettingsSection = () => {
    const { user } = useAuth();
    
    const [profile, setProfile] = useState({
        firstName: user?.firstname || '',
        lastName: user?.lastname || '',
        email: user?.email || '',
        phone: user?.phone || '+966 50 123 4567',
        school: user?.schoolName || 'Riyada Trainigs',
        role: user?.rolename || 'Cluster Admin',
        bio: 'Cluster Admin',
        interests: ['STEM Education', 'Project-Based Learning', 'Educational Technology'],
        learningPreferences: ['Instructor-Led Training (ILT)', 'Virtual Instructor-Led Training (VILT)', 'Self-Paced Learning'],
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setProfile(prev => {
            const newPrefs = checked
                ? [...prev.learningPreferences, name]
                : prev.learningPreferences.filter(pref => pref !== name);
            return { ...prev, learningPreferences: newPrefs };
        });
    };
    
    const removeInterest = (interestToRemove: string) => {
        setProfile(prev => ({
            ...prev,
            interests: prev.interests.filter(interest => interest !== interestToRemove)
        }));
    };

    const competencies = [
        { name: 'Classroom Management', level: 'Advanced', value: 90, color: 'bg-green-500' },
        { name: 'Digital Learning', level: 'Intermediate', value: 75, color: 'bg-blue-500' },
        { name: 'Assessment Design', level: 'Beginner', value: 40, color: 'bg-yellow-500' },
    ];

    const tabs = ['Profile Information', 'Password & Security', 'Notifications', 'Language & Region', 'Linked Accounts'];

    return (
        <div>
            <button className="flex items-center text-blue-600 font-semibold mb-4">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
            </button>
            <h2 className="text-3xl font-bold text-gray-800">Account Settings</h2>
            <p className="text-gray-500 mb-6">Manage your profile and preferences</p>

            <div className="border-b mb-6">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map(tab => (
                        <a
                            key={tab}
                            href="#"
                            className={`py-4 px-1 inline-flex items-center gap-2 text-sm whitespace-nowrap ${
                                tab === 'Profile Information'
                                    ? 'text-blue-600 border-b-2 border-blue-600 font-semibold'
                                    : 'text-gray-500 hover:text-blue-600'
                            }`}
                        >
                            {tab}
                        </a>
                    ))}
                </nav>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-1">
                        <div className="flex flex-col items-center">
                             <div className="relative">
                                <img src={user?.profileimageurl || "https://randomuser.me/api/portraits/women/44.jpg"} alt="Profile" className="w-32 h-32 rounded-full object-cover" />
                                <button className="absolute bottom-1 right-1 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700">
                                    <Camera className="w-4 h-4" />
                                </button>
                            </div>
                            <h3 className="text-xl font-bold mt-4">{profile.firstName} {profile.lastName}</h3>
                            <p className="text-gray-600">{profile.role}</p>
                            <p className="text-gray-500 text-sm">{profile.school}</p>
                        </div>

                        <div className="mt-8">
                            <h4 className="font-semibold text-gray-800 mb-4">Teaching Competencies</h4>
                            <div className="space-y-4">
                                {competencies.map(c => (
                                    <div key={c.name}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium">{c.name}</span>
                                            <span className="text-gray-500">{c.level}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className={`${c.color} h-2 rounded-full`} style={{ width: `${c.value}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    {/* Right Column */}
                    <div className="lg:col-span-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">First Name</label>
                                <input type="text" name="firstName" value={profile.firstName} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                <input type="text" name="lastName" value={profile.lastName} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                        </div>
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input type="email" name="email" value={profile.email} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                            <p className="text-xs text-gray-500 mt-1">This email is used for notifications and login</p>
                        </div>
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input type="tel" name="phone" value={profile.phone} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">School</label>
                                <select name="school" value={profile.school} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                    <option>Maarif Al Riyadh School</option>
                                    <option>Jeddah International School</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Role</label>
                                 <select name="role" value={profile.role} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" disabled>
                                    <option>Cluster Admin</option>
                                    <option>Teacher</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700">Professional Bio</label>
                            <textarea name="bio" value={profile.bio} onChange={handleInputChange} rows={4} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
                        </div>
                        
                        <div className="mt-8">
                            <h4 className="font-semibold text-gray-800">Professional Interests</h4>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {profile.interests.map(interest => (
                                    <span key={interest} className="flex items-center bg-blue-100 text-blue-800 text-sm font-medium pl-3 pr-2 py-1 rounded-full">
                                        {interest}
                                        <button onClick={() => removeInterest(interest)} className="ml-2 text-blue-600 hover:text-blue-800">
                                            <X className="w-3 h-3"/>
                                        </button>
                                    </span>
                                ))}
                            </div>
                             <button className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700">+ Add Interest</button>
                        </div>

                        <div className="mt-8">
                             <h4 className="font-semibold text-gray-800">Learning Preferences</h4>
                             <div className="mt-3 space-y-2">
                                {['Instructor-Led Training (ILT)', 'Virtual Instructor-Led Training (VILT)', 'Self-Paced Learning'].map(pref => (
                                    <label key={pref} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name={pref}
                                            checked={profile.learningPreferences.includes(pref)}
                                            onChange={handleCheckboxChange}
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">{pref}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                         <div className="mt-8 pt-6 border-t flex justify-end gap-3">
                            <button className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                            <button className="py-2 px-4 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">Save Changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ReportsCenterSection = () => {
    const reports = [
        {
            icon: BarChart2,
            title: 'Q2 Training Completion Report',
            description: 'Summary of all training activities from April-June.',
            iconColor: 'text-blue-500',
            bgColor: 'bg-blue-100'
        },
        {
            icon: RefreshCw,
            title: 'Annual ROI Analysis',
            description: 'Return on investment based on performance data.',
            iconColor: 'text-green-500',
            bgColor: 'bg-green-100'
        },
        {
            icon: FileText,
            title: 'Full Attendance Records (CSV)',
            description: 'Raw attendance data for all sessions this year.',
            iconColor: 'text-yellow-500',
            bgColor: 'bg-yellow-100'
        },
    ];

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Reports Center</h2>
            <div className="space-y-4">
                {reports.map((report, index) => (
                    <motion.div
                        key={index}
                        className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <div className="flex items-center">
                            <div className={`p-3 rounded-lg ${report.bgColor}`}>
                                <report.icon className={`w-6 h-6 ${report.iconColor}`} />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-md font-semibold text-gray-800">{report.title}</h3>
                                <p className="text-sm text-gray-500">{report.description}</p>
                            </div>
                        </div>
                        <button className="flex items-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                            <Download className="w-5 h-5 mr-2" />
                            Download
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

interface ReportCardProps {
    report: {
        id: number;
        title: string;
        date: string;
        type: string;
        status: string;
        downloadLink: string;
        previewLink: string;
        icon: React.ElementType;
        iconColor: string;
        bgColor: string;
    };
}

const ReportCard: React.FC<ReportCardProps> = ({ report }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">{report.title}</h3>
            <div className={`p-2 rounded-full ${report.bgColor}`}>
                <report.icon className={`w-6 h-6 ${report.iconColor}`} />
            </div>
        </div>
        <p className="text-sm text-gray-600 mb-4">{report.type} Report</p>
        <p className="text-sm text-gray-500 mb-4">Date: {report.date}</p>
        <p className="text-sm text-gray-500 mb-4">Status: <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            report.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
        }`}>{report.status}</span></p>
        <div className="mt-4 flex items-center text-sm text-gray-600">
            <Download className="w-4 h-4 mr-2" />
            <a href={report.downloadLink} className="hover:underline">Download</a>
        </div>
        <div className="mt-2 flex items-center text-sm text-gray-600">
            <Eye className="w-4 h-4 mr-2" />
            <a href={report.previewLink} className="hover:underline">Preview</a>
        </div>
    </div>
);


export default ClusterDashboard;
