import React, { useState, useEffect } from 'react';
import { CalendarDays, CheckCircle, Circle, Star, Users, BookOpen, Award, Flame, PlusCircle, Info, Trophy } from 'lucide-react';

// Mock data for demonstration (replace with real API calls)
const courses = [
  { id: 1, name: 'Digital Assessment Course' },
  { id: 2, name: 'Classroom Management' },
  { id: 3, name: 'Digital Learning Basics' },
];
const progressSummary = [
  { label: 'Completed', value: 18, percent: 84, color: 'bg-green-50 text-green-700', border: 'border-green-100' },
  { label: 'In Progress', value: 7, percent: 25, color: 'bg-blue-50 text-blue-700', border: 'border-blue-100' },
  { label: 'At Risk', value: 2, percent: 7, color: 'bg-yellow-50 text-yellow-700', border: 'border-yellow-100' },
  { label: 'Not Started', value: 1, percent: 4, color: 'bg-red-50 text-red-700', border: 'border-red-100' },
];
const feedback = [
  { name: 'Mohammed Al-Ghamdi', course: 'Digital Assessment Course', rating: 5.0, text: 'Excellent session! Sarah\'s teaching style made complex assessment techniques very approachable. I can\'t wait to implement these in my classroom.', date: 'May 6, 2025', avatar: '/public/avatar1.png' },
  { name: 'Aisha Al-Sulaiman', course: 'Classroom Management', rating: 4.5, text: 'The strategies shared were practical and immediately applicable. Would appreciate more time for group activities in future sessions.', date: 'May 4, 2025', avatar: '/public/avatar2.png' },
  { name: 'Khalid Al-Harbi', course: 'Digital Learning Basics', rating: 5.0, text: 'As someone who was intimidated by technology, this course was a game-changer. Sarah\'s patient approach helped me gain confidence quickly.', date: 'May 2, 2025', avatar: '/public/avatar3.png' },
];
const roadmap = [
  { label: 'Level 1 Certification', desc: 'Basic Training Methodologies', status: 'done', date: 'August 2023' },
  { label: 'Level 2 Certification', desc: 'Advanced Pedagogical Methods', status: 'done', date: 'March 2024' },
  { label: 'Level 3 Certification', desc: 'Master Trainer Specialization', status: 'inprogress', percent: 75, date: 'Due: July 2025' },
  { label: 'Level 4 Certification', desc: 'Academic Leadership Track', status: 'planned', date: '2026' },
];
const competencies = [
  { label: 'Training Delivery', value: 95, color: 'bg-green-500' },
  { label: 'Assessment Design', value: 88, color: 'bg-blue-500' },
  { label: 'Digital Learning', value: 82, color: 'bg-purple-500' },
  { label: 'Curriculum Design', value: 78, color: 'bg-yellow-500' },
  { label: 'Mentoring Skills', value: 92, color: 'bg-green-400' },
  { label: 'Research & Innovation', value: 65, color: 'bg-red-400' },
];
const achievements = [
  { label: 'Master Trainer', icon: Trophy },
  { label: 'S-Star Educator', icon: Star },
  { label: '100+ Trainees', icon: Users },
  { label: 'Digital Expert', icon: BookOpen },
  { label: 'Impact Maker', icon: Flame },
];

const TrainerDashboardDetails: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState(courses[0].id);

  // TODO: Replace with real API calls
  // useEffect(() => { ... }, [selectedCourse]);

  return (
    <section className="px-4 pb-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Trainee Progress */}
        <div className="bg-white rounded-2xl shadow p-6 col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Trainee Progress</h3>
            <select
              className="border rounded px-3 py-1 text-sm"
              value={selectedCourse}
              onChange={e => setSelectedCourse(Number(e.target.value))}
            >
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="bg-gray-50 rounded-xl flex flex-col items-center justify-center h-40 mb-6">
            <div className="text-blue-400 mb-2"><Info className="w-10 h-10 mx-auto" /></div>
            <div className="text-gray-500 text-lg font-medium">Progress distribution of 28 trainees in Digital Assessment Course</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-2">
            {progressSummary.map((s, i) => (
              <div key={s.label} className={`rounded-xl p-4 flex flex-col items-center ${s.color} ${s.border}`}>
                <span className="text-2xl font-bold">{s.value}</span>
                <span className="text-xs font-semibold mb-1">{s.label}</span>
                <span className="text-xs text-gray-400">{s.percent}%</span>
              </div>
            ))}
          </div>
          <a href="#" className="mt-2 text-indigo-600 text-sm font-medium hover:underline">View detailed progress report &rarr;</a>
        </div>
        {/* Recent Feedback */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="font-bold text-lg mb-4">Recent Feedback</h3>
          <ul>
            {feedback.map((fb, i) => (
              <li key={fb.name} className="mb-4 flex gap-3">
                <img src={fb.avatar} alt={fb.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <div className="font-semibold text-gray-800">{fb.name} <span className="text-xs text-gray-400">&bull; {fb.course}</span></div>
                  <div className="flex items-center gap-1 text-yellow-500 text-sm font-medium">
                    {Array.from({ length: Math.floor(fb.rating) }).map((_, idx) => <Star key={idx} className="w-4 h-4" />)}
                    <span className="ml-1 text-gray-700">{fb.rating.toFixed(1)}</span>
                  </div>
                  <div className="text-gray-600 text-sm mb-1">"{fb.text}"</div>
                  <div className="text-xs text-gray-400">{fb.date}</div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-1 text-yellow-500 text-lg font-bold">
              <Star className="w-5 h-5" /> 4.8 <span className="text-gray-700 text-base font-normal">(124 reviews)</span>
            </div>
            <a href="#" className="text-indigo-600 text-sm font-medium hover:underline">View all feedback &rarr;</a>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Professional Roadmap */}
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-lg">Professional Roadmap</h3>
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">Level 3 Trainer</span>
          </div>
          <ol className="relative border-l-2 border-blue-100 ml-4 mt-4">
            {roadmap.map((c, i) => (
              <li key={c.label} className="mb-8 ml-6 flex items-start gap-2">
                <span className={`absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full ring-4 ring-white ${c.status === 'done' ? 'bg-green-500' : c.status === 'inprogress' ? 'bg-blue-400' : 'bg-gray-300'}`}>{c.status === 'done' ? <CheckCircle className="w-4 h-4 text-white" /> : c.status === 'inprogress' ? <Info className="w-4 h-4 text-white" /> : <Circle className="w-4 h-4 text-white" />}</span>
                <div>
                  <div className="font-semibold text-gray-800">{c.label}</div>
                  <div className="text-xs text-gray-500 mb-1">{c.desc}</div>
                  {c.status === 'done' && <div className="text-xs text-green-600">Completed: {c.date}</div>}
                  {c.status === 'inprogress' && <div className="text-xs text-blue-600 font-semibold">{c.percent}% <span className="font-normal">In Progress</span> &ndash; <span className="text-gray-500">{c.date}</span></div>}
                  {c.status === 'planned' && <div className="text-xs text-gray-400">Planned: {c.date}</div>}
                </div>
              </li>
            ))}
          </ol>
          <a href="#" className="mt-2 text-indigo-600 text-sm font-medium hover:underline">View detailed roadmap &rarr;</a>
        </div>
        {/* Competency Development */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="font-bold text-lg mb-4">Competency Development</h3>
          <div className="space-y-3 mb-4">
            {competencies.map((c, i) => (
              <div key={c.label} className="mb-2">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{c.label}</span>
                  <span className="text-sm font-medium text-gray-700">{c.value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className={`h-3 rounded-full ${c.color}`} style={{ width: `${c.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-blue-50 rounded-xl p-3 flex items-start gap-2 mt-2">
            <Info className="w-5 h-5 text-blue-400 mt-1" />
            <div>
              <span className="font-semibold text-blue-800">Recommended Focus</span>
              <div className="text-xs text-gray-700">Consider strengthening your Research & Innovation skills through the upcoming "Education Research Methods" course starting June 5.</div>
            </div>
          </div>
        </div>
        {/* Achievements */}
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-lg">Achievements</h3>
            <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">12 Earned</span>
          </div>
          <div className="flex flex-wrap gap-4 mb-4">
            {achievements.map((ach, i) => (
              <div key={ach.label} className="flex flex-col items-center p-2 rounded-xl min-w-[80px] bg-gray-50">
                <ach.icon className="w-8 h-8 mb-1 text-blue-400" />
                <span className="font-semibold text-gray-800 text-center text-xs">{ach.label}</span>
              </div>
            ))}
            <div className="flex flex-col items-center p-2 rounded-xl min-w-[80px] bg-gray-100 opacity-60">
              <PlusCircle className="w-8 h-8 mb-1 text-gray-400" />
              <span className="font-semibold text-gray-800 text-center text-xs">View All</span>
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 flex flex-col items-start mb-2">
            <span className="font-semibold text-blue-800 flex items-center mb-1"><Award className="w-4 h-4 mr-1 inline" /> Latest Achievement</span>
            <span className="text-xs text-gray-700">You’ve earned "Innovation Champion" for your work developing the new Digital Assessment framework.<br />Awarded: April 28, 2025</span>
          </div>
          <div className="bg-yellow-50 rounded-xl p-3 flex flex-col items-start">
            <span className="font-semibold text-yellow-800 flex items-center mb-1"><Info className="w-4 h-4 mr-1 inline" /> Next Achievement Progress</span>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '80%' }}></div>
            </div>
            <span className="text-xs text-gray-700">Curriculum Design Specialist<br />2 more courses to complete</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrainerDashboardDetails; 