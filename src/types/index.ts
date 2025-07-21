export interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  fullname: string;
  username?: string;
  profileimageurl?: string;
  lastaccess?: number;
  role?: UserRole;
  company?: string;
  department?: string;
  phone?: string;
  country?: string;
}
 
export interface Course {
  id: string | number;
  fullname: string;
  shortname: string;
  summary: string;
  categoryid: number;
  categoryname?: string;
  visible: number;
  courseimage?: string;
  format?: string;
  startdate?: number;
  enddate?: number;
  type?: 'ILT' | 'VILT' | 'Self-paced';
  tags?: string[];
  enrollmentCount?: number;
  rating?: number;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  duration?: string;
  progress?: number;
  instructor?: string;
}
 
export interface Category {
  id: number;
  name: string;
  parent: number;
  // Add more fields as needed from Moodle API
}
 
export interface School {
  id: number;
  name: string;
  shortname?: string;
  code?: string;
  address?: string;
  city?: string;
  region?: string;
  postcode?: string;
  country?: string;
  maildisplay?: number;
  mailformat?: number;
  maildigest?: number;
  autosubscribe?: number;
  trackforums?: number;
  htmleditor?: number;
  screenreader?: number;
  timezone?: string;
  lang?: string;
  suspended?: number;
  ecommerce?: number;
  parentId?: number;
  customCss?: string;
  validTo?: string;
  suspendafter?: number;
  companyterminated?: number;
  theme?: string;
  hostname?: string;
  maxUsers?: number;
  mainColor?: string;
  headingColor?: string;
  linkColor?: string;
  custom1?: string;
  custom2?: string;
  custom3?: string;
  status?: string;
  logo?: string; // Added for UI display
  description?: string; // Added for UI display
}
 
export interface ApiResponse<T> {
  data: T;
  error?: string;
}
 
export type UserRole = 'teacher' | 'trainer' | 'principal' | 'cluster_admin' | 'admin' | 'school_admin';
 
export interface DashboardStats {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  upcomingSessions: number;
  achievements: number;
  totalUsers?: number;
  activeUsers?: number;
  completionRate?: number;
  totalEnrollments?: number;
  certificatesIssued?: number;
}
 
export interface Session {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'ILT' | 'VILT';
  trainer: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  attendees?: number;
  capacity?: number;
  location?: string;
  description?: string;
}
 
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedDate: string;
  category: string;
  points?: number;
  level?: string;
}
 
export interface Assessment {
  id: string;
  title: string;
  description: string;
  type: 'competency' | 'knowledge' | 'skill';
  questions: AssessmentQuestion[];
  duration?: number;
  passingScore?: number;
}
 
export interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'essay' | 'rating';
  options?: string[];
  correctAnswer?: string | number;
  points?: number;
}
 
export interface LearningPath {
  id: string;
  title: string;
  description: string;
  courses: Course[];
  estimatedDuration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  prerequisites?: string[];
  outcomes?: string[];
}
 
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
  read: boolean;
  actionUrl?: string;
}
 
export interface Report {
  id: string;
  title: string;
  type: 'user' | 'course' | 'school' | 'system';
  data: any;
  generatedAt: number;
  format: 'pdf' | 'excel' | 'csv';
}
 
export interface Competency {
  id: string;
  name: string;
  description: string;
  category: string;
  level: number;
  skills: string[];
  assessmentCriteria: string[];
}