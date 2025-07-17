import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building } from 'lucide-react';
import { Button } from '../../ui/Button';
import { coursesService } from '../../../services/coursesService';
import { schoolsService } from '../../../services/schoolsService';

export const AssignToSchoolPage: React.FC = () => {
  const navigate = useNavigate();
  const [schools, setSchools] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [licenseCounts, setLicenseCounts] = useState<{ [courseId: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    schoolsService.getAllSchools().then(setSchools);
    coursesService.getAllCourses().then(setCourses);
  }, []);

  const handleAssign = async () => {
    setMessage(null);
    if (!selectedSchool || selectedCourses.length === 0) {
      setMessage('Please select a school and at least one course.');
      return;
    }
    for (const courseId of selectedCourses) {
      if (!licenseCounts[courseId] || isNaN(Number(licenseCounts[courseId])) || Number(licenseCounts[courseId]) < 1) {
        setMessage('Please enter a valid license count for each selected course.');
        return;
      }
    }
    setLoading(true);
    try {
      await coursesService.assignCoursesToSchool(Number(selectedSchool), selectedCourses.map(Number));
      for (const courseId of selectedCourses) {
        await coursesService.createCourseLicense(Number(selectedSchool), Number(courseId), Number(licenseCounts[courseId]));
      }
      setMessage('Courses and licenses assigned successfully!');
    } catch (err) {
      setMessage('Error assigning courses or licenses.');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/courses-categories')}>
            <ArrowLeft className="w-4 h-4" />
            Back to Courses & Categories
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Assign to School
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Assign courses to specific schools and institutions
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Building className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            School Assignment
          </h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Select School</label>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={selectedSchool}
              onChange={e => {
                setSelectedSchool(e.target.value);
                setSelectedCourses([]);
                setLicenseCounts({});
              }}
            >
              <option value="">Select a school</option>
              {schools.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Select Courses</label>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              multiple
              value={selectedCourses}
              onChange={e => setSelectedCourses(Array.from(e.target.selectedOptions, o => o.value))}
              size={Math.min(8, courses.length)}
            >
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.fullname}</option>
              ))}
            </select>
          </div>
          {selectedCourses.map(courseId => (
            <div key={courseId} className="flex items-center gap-2 mt-2">
              <span className="w-48 truncate">{courses.find(c => c.id.toString() === courseId)?.fullname}</span>
              <input
                type="number"
                min={1}
                className="w-32 px-2 py-1 border rounded-lg"
                placeholder="License count"
                value={licenseCounts[courseId] || ''}
                onChange={e => setLicenseCounts({ ...licenseCounts, [courseId]: e.target.value })}
                required
              />
            </div>
          ))}
          <Button
            onClick={handleAssign}
            disabled={loading || !selectedSchool || selectedCourses.length === 0}
            className="mt-4"
          >
            {loading ? 'Assigning...' : 'Assign/Update'}
          </Button>
          {message && <div className="mt-2 text-sm text-red-600 dark:text-red-400">{message}</div>}
        </div>
      </div>
    </div>
  );
};