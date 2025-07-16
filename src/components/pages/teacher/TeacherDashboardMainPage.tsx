import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { apiService } from '../../../services/api';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Trophy, Star, Users, Award, BookOpen, TrendingUp, CheckCircle, MessageCircle, Award as AwardIcon, Video, Calendar, Clock, Globe2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Course } from '../../../types';

const mockCompetency = [
  { subject: 'Pedagogy', value: 82, color: '#6366f1' },
  { subject: 'Assessment', value: 76, color: '#22c55e' },
  { subject: 'Technology', value: 54, color: '#ef4444' },
  { subject: 'Management', value: 88, color: '#a21caf' },
  { subject: 'Content', value: 79, color: '#f59e42' },
];
const mockLeaderboard = [
  { name: 'Mohammed Al-Saleh', points: 2560, rank: 1, avatar: 'https://randomuser.me/api/portraits/men/32.jpg', leader: true },
  { name: 'Fatima Al-Zahrani', points: 2340, rank: 2, avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { name: 'Khalid Al-Harbi', points: 2290, rank: 3, avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
  { name: 'You', points: 1240, rank: 28, avatar: 'https://randomuser.me/api/portraits/men/99.jpg', you: true, change: '+14' },
];
const mockAchievements = [
  { label: 'Fast Learner', icon: '🎓', unlocked: true },
  { label: 'Consistent', icon: '📈', unlocked: true },
  { label: 'Team Player', icon: '👥', unlocked: true },
  { label: 'Excellence', icon: '⭐', unlocked: true },
  { label: 'Master', icon: '🏆', unlocked: false },
  { label: 'Innovator', icon: '💡', unlocked: false },
];
const unlockedCount = 4;
const nextAchievement = {
  label: 'Mentor',
  desc: 'Help 3 more colleagues to unlock (7/10 completed)',
  progress: 0.7,
};
const mockEvents = [
  { title: 'Assessment Submission', date: 'Tomorrow', desc: 'Submit your final assessment for "Inquiry-Based Learning"', color: 'bg-red-50', icon: <Calendar className="w-5 h-5 text-red-500" />, dateColor: 'text-red-500' },
  { title: 'Live Workshop', date: 'May 15', desc: 'Virtual Lab Techniques with Dr. Ahmed Al-Farsi', color: 'bg-blue-50', icon: <Video className="w-5 h-5 text-blue-500" />, dateColor: 'text-blue-500' },
  { title: 'Peer Collaboration', date: 'May 18', desc: 'Group project submission: "Developing Inquiry-Based Lab Activities"', color: 'bg-purple-50', icon: <Users className="w-5 h-5 text-purple-500" />, dateColor: 'text-purple-500' },
  { title: 'Certification Exam', date: 'May 25', desc: 'Level 2 Science Pedagogy Specialist certification examination', color: 'bg-green-50', icon: <AwardIcon className="w-5 h-5 text-green-500" />, dateColor: 'text-green-500' },
];
const mockMentors = [
  { name: 'Sarah', status: 'Online', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', statusColor: 'text-green-500' },
  { name: 'Mohammed', status: 'Online', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', statusColor: 'text-green-500' },
  { name: 'Khalid', status: 'In 2h', avatar: 'https://randomuser.me/api/portraits/men/45.jpg', statusColor: 'text-yellow-500' },
  { name: 'Fatima', status: 'Tomorrow', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', statusColor: 'text-gray-400' },
];
const mockActivity = [
  { icon: <CheckCircle className="w-6 h-6 text-green-400" />, title: 'Completed "Assessment Strategies" module', date: 'Yesterday at 3:45 PM', points: 120 },
  { icon: <MessageCircle className="w-6 h-6 text-blue-400" />, title: 'Participated in discussion "Engaging Disinterested Students"', date: 'Yesterday at 1:20 PM', points: 45 },
  { icon: <AwardIcon className="w-6 h-6 text-purple-400" />, title: 'Earned "Digital Learning Specialist" certification', date: 'May 2, 2025', points: 350 },
  { icon: <Video className="w-6 h-6 text-yellow-400" />, title: 'Attended webinar "Next-Gen Science Standards"', date: 'Apr 28, 2025', points: 75 },
];

const TeacherDashboardMainPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [learningPath, setLearningPath] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [growthOpportunities, setGrowthOpportunities] = useState<any[]>([]);
  const [trainingSessions, setTrainingSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [userCourses, lp, recs, growth, sessions] = await Promise.all([
          apiService.getUserCourses(user.id),
          apiService.getLearningPath(user.id),
          apiService.getRecommendations(user.id),
          apiService.getGrowthOpportunities(user.id),
          apiService.getTrainingSessions(user.id)
        ]);
        setCourses(userCourses);
        setLearningPath(lp);
        setRecommendations(recs);
        setGrowthOpportunities(growth);
        setTrainingSessions(sessions);
      } catch (e) {
        // handle error
      } finally {
        setLoading(false);
      }
    }
    if (user?.id) fetchData();
  }, [user?.id]);

  // Example real data calculations (replace with your actual logic as needed)
  const competencyScore = courses.length
    ? Math.round(courses.reduce((acc, c) => acc + (c.progress || 0), 0) / courses.length)
    : 0;
  const learningHours = courses.reduce((acc, c) => acc + (c.learningHours || 0), 0);
  const certifications = courses.filter((c) => c.isCertified).length;
  const totalCertifications = courses.length;
  const communityRank = user?.communityRank || 0;

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-lg">{t('Loading...')}</div>;
  }

  return (
    <div className="px-4 py-6">
      {/* Top Row: Real Data Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Competency Score */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col justify-between min-w-[220px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 font-medium">Competency Score</span>
            <span className="bg-blue-100 p-2 rounded-full"><Globe2 className="w-5 h-5 text-blue-500" /></span>
          </div>
          <div className="text-2xl font-bold mb-1">{competencyScore}/100</div>
        </div>
        {/* Learning Hours */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col justify-between min-w-[220px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 font-medium">Learning Hours</span>
            <span className="bg-green-100 p-2 rounded-full"><Clock className="w-5 h-5 text-green-500" /></span>
          </div>
          <div className="text-2xl font-bold mb-1">{learningHours}</div>
        </div>
        {/* Certifications */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col justify-between min-w-[220px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 font-medium">Certifications</span>
            <span className="bg-purple-100 p-2 rounded-full"><AwardIcon className="w-5 h-5 text-purple-500" /></span>
          </div>
          <div className="text-2xl font-bold mb-1">{certifications}/{totalCertifications}</div>
        </div>
        {/* Community Rank */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col justify-between min-w-[220px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 font-medium">Community Rank</span>
            <span className="bg-yellow-100 p-2 rounded-full"><Trophy className="w-5 h-5 text-yellow-500" /></span>
          </div>
          <div className="text-2xl font-bold mb-1">#{communityRank}</div>
        </div>
      </div>

      {/* Learning Path Section (Modern UI) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col">
          <h2 className="font-bold text-xl mb-4">Your Learning Path: {learningPath?.title}</h2>
          {/* Render your real learning path UI here using learningPath data */}
          {/* Example: stepper, modules, progress bars, etc. */}
          {/* ... */}
        </div>
        <div className="flex flex-col gap-6">
          {/* AI Recommendations */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="font-bold text-xl mb-2">AI Recommendations</h2>
            {/* Render your real recommendations here */}
            {/* ... */}
          </div>
          {/* Growth Opportunities */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="font-bold text-xl mb-2">Competency Growth Opportunities</h2>
            {/* Render your real growth opportunities here */}
            {/* ... */}
          </div>
          {/* Training Sessions */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="font-bold text-xl mb-2">Upcoming Training Sessions</h2>
            {/* Render your real training sessions here */}
            {/* ... */}
          </div>
        </div>
      </div>

      {/* Top Row: Real Data Cards (Activity, Events, Mentors) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col">
          <h2 className="font-bold text-xl mb-4">Recent Activity</h2>
          <ul>
            {mockActivity.map((a, i) => (
              <li key={a.title + i} className="flex items-center gap-3 py-3 border-b last:border-b-0">
                <span>{a.icon}</span>
                <div className="flex-1">
                  <span className="font-semibold text-gray-900 block">{a.title}</span>
                  <span className="text-xs text-gray-500">{a.date} • Earned {a.points} points</span>
                </div>
              </li>
            ))}
          </ul>
          <a href="#" className="mt-4 text-indigo-600 text-sm font-medium hover:underline">View all activity →</a>
        </div>
        {/* Upcoming Deadlines & Events + Mentors */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col">
          <h2 className="font-bold text-xl mb-4">Upcoming Deadlines & Events</h2>
          <ul className="mb-4">
            {mockEvents.map((event, i) => (
              <li key={event.title + i} className={`flex items-center gap-3 p-3 mb-2 rounded-xl ${event.color}`} style={{minHeight: '60px'}}>
                <span>{event.icon}</span>
                <div className="flex-1">
                  <span className="font-semibold text-gray-900 block">{event.title}</span>
                  <span className="text-xs text-gray-500 block">{event.desc}</span>
                </div>
                <span className={`text-xs font-semibold ${event.dateColor}`}>{event.date}</span>
              </li>
            ))}
          </ul>
          <h3 className="font-semibold text-md mb-2 mt-4">Master Trainers Available for Mentoring</h3>
          <div className="flex gap-4">
            {mockMentors.map((mentor) => (
              <div key={mentor.name} className="flex flex-col items-center">
                <span className="w-10 h-10 rounded-full border-2 border-indigo-400 overflow-hidden mb-1">
                  <img src={mentor.avatar} alt={mentor.name} className="w-10 h-10 object-cover" />
                </span>
                <span className="text-xs font-semibold text-gray-800">{mentor.name}</span>
                <span className={`text-xs ${mentor.statusColor}`}>{mentor.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modern Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Competency Map Card */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
          <h2 className="font-bold text-xl mb-2">Competency Map</h2>
          <div className="w-full flex justify-center" style={{height: 220}}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={mockCompetency}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Competency" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-2 mt-4">
            {mockCompetency.map((c) => (
              <div key={c.subject} className="flex flex-col items-center">
                <span className="text-xs font-semibold" style={{color: c.color}}>{c.subject}</span>
                <span className="text-xs" style={{color: c.color}}>{c.value}%</span>
              </div>
            ))}
          </div>
          <a href="#" className="mt-4 text-indigo-600 text-sm font-medium hover:underline">View detailed competency map →</a>
        </div>
        {/* Leaderboard Card */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col">
          <h2 className="font-bold text-xl mb-2">Leaderboard</h2>
          <span className="text-gray-500 text-sm mb-2">Science Teachers Community <a href="#" className="text-indigo-500 ml-2 text-xs">Change</a></span>
          <div className="flex-1">
            {mockLeaderboard.map((entry) => (
              <div key={entry.name} className={`flex items-center gap-3 p-2 rounded-lg mb-2 ${entry.rank === 1 ? 'bg-yellow-50' : entry.you ? 'bg-blue-50' : ''}`}> 
                <span className={`w-8 h-8 rounded-full overflow-hidden border-2 ${entry.rank === 1 ? 'border-yellow-400' : entry.rank === 2 ? 'border-gray-400' : entry.rank === 3 ? 'border-orange-400' : 'border-blue-200'}`}>
                  <img src={entry.avatar} alt={entry.name} className="w-8 h-8 object-cover" />
                </span>
                <span className="font-semibold text-gray-800 flex-1">{entry.name}</span>
                <span className="text-xs text-gray-500">{entry.points} points</span>
                {entry.leader && <span className="ml-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded font-bold">Leader</span>}
                {entry.you && <span className="ml-2 text-xs text-green-600">↑{entry.change}</span>}
                <span className="ml-2 text-xs text-gray-400">{entry.rank}</span>
              </div>
            ))}
          </div>
          <a href="#" className="mt-2 text-indigo-600 text-sm font-medium hover:underline">View full leaderboard →</a>
        </div>
        {/* Achievements Card */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-xl">Achievements</h2>
            <span className="text-gray-400 text-sm">{unlockedCount}/30 Unlocked</span>
          </div>
          <div className="flex flex-wrap gap-4 mb-4">
            {mockAchievements.map((ach) => (
              <div key={ach.label} className={`flex flex-col items-center p-2 rounded-xl min-w-[80px] ${ach.unlocked ? 'bg-blue-50' : 'bg-gray-100 opacity-60'}`}>
                <span className="text-2xl mb-1">{ach.icon}</span>
                <span className="font-semibold text-gray-800 text-center text-xs">{ach.label}</span>
              </div>
            ))}
          </div>
          <div className="bg-blue-50 rounded-xl p-3 flex flex-col items-start">
            <span className="font-semibold text-blue-800 flex items-center mb-1"><Trophy className="w-4 h-4 mr-1 inline" /> Next Achievement: {nextAchievement.label}</span>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${nextAchievement.progress * 100}%` }}></div>
            </div>
            <span className="text-xs text-gray-700">Help 3 more colleagues to unlock (7/10 completed)</span>
          </div>
        </div>
      </div>

      {/* Real Data Dashboard Sections (restored) */}
      {/* Stats Grid, Learning Path, Recommendations, Recent Activity, etc. can go here if you want to keep them below */}
    </div>
  );
};

export default TeacherDashboardMainPage; 