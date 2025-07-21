import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Network, School, Users, BookOpen, CalendarCheck, Award, FileText, CheckCircle, Settings, Search, Bell, Plus, ChevronDown, UserCheck, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line, Legend
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
  return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <MainContent />
            </div>
    </div>
  );
};

const Sidebar = () => {
    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, active: true },
        { name: 'Manage Clusters', icon: Network },
        { name: 'Schools Overview', icon: School },
        { name: 'Trainer & Trainee Insights', icon: Users },
        { name: 'Courses Management', icon: BookOpen },
        { name: 'Attendance Monitoring', icon: CalendarCheck },
        { name: 'Competencies', icon: Award },
        { name: 'Reports', icon: FileText },
        { name: 'Approve ILT/VILT Events', icon: CheckCircle },
        { name: 'Settings', icon: Settings },
    ];
    return (
        <aside className="w-64 bg-white shadow-md flex-shrink-0">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-800">Riyada Trainings</h1>
            </div>
            <nav className="mt-6">
                {menuItems.map(item => (
                    <a key={item.name} href="#" className={`flex items-center px-6 py-3 text-gray-600 hover:bg-gray-200 ${item.active ? 'bg-blue-100 text-gray-700' : ''}`}>
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

const MainContent = () => (
    <main className="flex-1 p-6 overflow-y-auto">
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
    </main>
);


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


export default ClusterDashboard;
