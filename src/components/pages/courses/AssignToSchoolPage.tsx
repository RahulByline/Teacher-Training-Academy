import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building,
  CheckCircle,
  PlusCircle,
  Search,
  BookOpen,
  XCircle,
  AlertTriangle,
  Loader2, // A nice spinner icon from lucide-react
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { coursesService } from '../../../services/coursesService';
import { schoolsService } from '../../../services/schoolsService';

// --- Helper Components (Self-contained for easy copy-paste) ---

const Skeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-1/3 mb-4"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-2">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
            </div>
        ))}
      </div>
      <div className="space-y-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
         {[...Array(2)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 dark:bg-gray-900/50 rounded-lg"></div>
        ))}
      </div>
    </div>
  </div>
);

const Alert = ({ message, type }: { message: string; type: 'success' | 'error' }) => {
  const isSuccess = type === 'success';
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg text-sm ${
        isSuccess
          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      }`}
    >
      {isSuccess ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
      <span>{message}</span>
    </div>
  );
};


// --- Main Component ---

export const AssignToSchoolPage: React.FC = () => {
  const navigate = useNavigate();
  
  // --- State Management ---
  const [schools, setSchools] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [licenseCounts, setLicenseCounts] = useState<{ [courseId: string]: string }>({});
  const [loading, setLoading] = useState(false); // For final submission
  const [assignmentLoading, setAssignmentLoading] = useState(false); // For fetching school's data
  const [message, setMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // --- Data Fetching and Logic ---

  useEffect(() => {
    // Initial fetch for all schools and all available courses
    schoolsService.getAllSchools().then(setSchools);
    coursesService.getAllCourses().then(setCourses);
  }, []);

  // When a school is selected, fetch its already-assigned courses and licenses
  useEffect(() => {
    if (!selectedSchool) {
      setSelectedCourses([]);
      setLicenseCounts({});
      return;
    }

    const fetchAndSetAssignedData = async () => {
      setAssignmentLoading(true);
      setMessage(null);
      try {
        const assignedCoursesList = await coursesService.getCompanyCourses(Number(selectedSchool));
        const assignedCourseIds = assignedCoursesList.map((c: any) => c.id.toString());
        
        const newLicenseCounts: { [courseId: string]: string } = {};
        for (const course of assignedCoursesList) {
          try {
            const licenseData = await coursesService.getCourseLicenseInfo(Number(selectedSchool), Number(course.id));
            if (licenseData?.licenses?.length > 0) {
              const licenseForCourse = licenseData.licenses.find(
                (lic: any) => lic.name?.includes(`course ${course.id} in school ${selectedSchool}`)
              );
              if (licenseForCourse && typeof licenseForCourse.allocation === 'number') {
                newLicenseCounts[course.id.toString()] = String(licenseForCourse.allocation);
              }
            }
          } catch (e) {
            console.warn(`Could not fetch license for course ${course.id}`, e);
          }
        }
        
        setSelectedCourses(assignedCourseIds);
        setLicenseCounts(newLicenseCounts);

      } catch (e) {
        console.error("Error fetching assigned course data:", e);
        setMessage("Could not load assigned course data for this school.");
        setSelectedCourses([]);
        setLicenseCounts({});
      }
      setAssignmentLoading(false);
    };

    fetchAndSetAssignedData();
  }, [selectedSchool]);

  // Main submission handler
  const handleAssign = async () => {
    setMessage(null);
    if (!selectedSchool || selectedCourses.length === 0) {
      setMessage('Please select a school and assign at least one course.');
      return;
    }
    for (const courseId of selectedCourses) {
      if (!licenseCounts[courseId] || isNaN(Number(licenseCounts[courseId])) || Number(licenseCounts[courseId]) < 1) {
        const courseName = courses.find(c => c.id.toString() === courseId)?.fullname || `Course ID ${courseId}`;
        setMessage(`Please enter a valid, positive license count for "${courseName}".`);
        return;
      }
    }

    setLoading(true);
    try {
      await coursesService.assignCoursesToSchool(Number(selectedSchool), selectedCourses.map(Number));
      for (const courseId of selectedCourses) {
        await coursesService.createCourseLicense(Number(selectedSchool), Number(courseId), Number(licenseCounts[courseId]));
      }
      setMessage('Courses and licenses assigned/updated successfully!');
    } catch (err) {
      setMessage('An error occurred during assignment. Please try again.');
      console.error(err);
    }
    setLoading(false);
  };
  
  // --- UI-specific Handlers ---

  const handleAddCourse = (courseId: string) => {
    setSelectedCourses(prev => [...prev, courseId]);
  };

  const handleRemoveCourse = (courseId: string) => {
    setSelectedCourses(prev => prev.filter(id => id !== courseId));
    setLicenseCounts(prev => {
      const newCounts = { ...prev };
      delete newCounts[courseId];
      return newCounts;
    });
  };

  // Memoized list of available courses for the left panel
  const availableCourses = useMemo(() => {
    return courses
      .filter(c => !selectedCourses.includes(c.id.toString()))
      .filter(c => c.fullname.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [courses, selectedCourses, searchTerm]);


  // --- Render ---

  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/courses-categories')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Assign to School</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Assign courses to schools and manage license counts.
            </p>
          </div>
        </div>
      </div>

      {/* MAIN ASSIGNMENT CARD */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
              <Building className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Step 1: Select a School
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Choose the school you want to manage course assignments for.
              </p>
            </div>
          </div>
          <select
            id="school-select"
            className="mt-4 w-full max-w-md px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedSchool}
            onChange={e => {
              setSelectedSchool(e.target.value);
            }}
          >
            <option value="">-- Select a School --</option>
            {schools.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* DYNAMIC CONTENT AREA */}
        <div className="p-6">
          {!selectedSchool ? (
            <div className="text-center py-10">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Select a school to begin</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Course assignments will appear here once a school is chosen.
              </p>
            </div>
          ) : assignmentLoading ? (
            <Skeleton />
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Step 2: Assign Courses & Licenses
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Add courses from the available list and set the number of licenses for each.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* LEFT PANEL: AVAILABLE COURSES */}
                <div className="space-y-4 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">Available Courses</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search courses..."
                      className="w-full pl-9 pr-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 h-72 overflow-y-auto pr-2">
                    {availableCourses.length > 0 ? (
                      availableCourses.map(course => (
                        <div key={course.id} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50">
                          <span className="text-sm font-medium truncate">{course.fullname}</span>
                          <Button variant="ghost" size="sm" onClick={() => handleAddCourse(course.id)}>
                            <PlusCircle className="w-4 h-4 mr-1" /> Add
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-center text-gray-500 py-4">No more courses to add.</p>
                    )}
                  </div>
                </div>

                {/* RIGHT PANEL: ASSIGNED COURSES */}
                <div className="space-y-4 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                   <h3 className="font-semibold text-gray-800 dark:text-gray-200">Assigned Courses</h3>
                   <div className="space-y-3 h-72 overflow-y-auto pr-2">
                    {selectedCourses.length > 0 ? (
                        selectedCourses.map(courseId => {
                            const course = courses.find(c => c.id.toString() === courseId);
                            if (!course) return null;
                            return (
                                <div key={courseId} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold text-sm truncate">{course.fullname}</p>
                                        <Button variant="ghost" className="w-6 h-6 text-gray-400 hover:text-red-500" onClick={() => handleRemoveCourse(courseId)}>
                                            <XCircle className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <label htmlFor={`license-${courseId}`} className="text-sm text-gray-600 dark:text-gray-300">Licenses:</label>
                                        <input
                                            id={`license-${courseId}`}
                                            type="number"
                                            min={1}
                                            className="w-24 px-2 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                                            placeholder="e.g., 50"
                                            value={licenseCounts[courseId] || ''}
                                            onChange={e => setLicenseCounts({ ...licenseCounts, [courseId]: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center text-sm text-gray-500 py-10">
                            <p>No courses assigned yet.</p>
                            <p>Add courses from the list on the left.</p>
                        </div>
                    )}
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER: ACTIONS AND MESSAGES */}
        {selectedSchool && !assignmentLoading && (
            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div>
                    {message && (
                        <Alert
                            message={message}
                            type={message.toLowerCase().includes('success') ? 'success' : 'error'}
                        />
                    )}
                </div>
                <Button
                    onClick={handleAssign}
                    disabled={loading || assignmentLoading || !selectedSchool || selectedCourses.length === 0}
                    size="lg"
                >
                    {loading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                    {loading ? 'Processing...' : 'Save Assignments'}
                </Button>
            </div>
        )}
      </div>
    </div>
  );
};