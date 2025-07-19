import axios from 'axios';
import { User, Course, UserRole } from '../types';

const API_BASE_URL = 'https://iomad.bylinelms.com/webservice/rest/server.php';
const API_TOKEN = '4a2ba2d6742afc7d13ce4cf486ba7633';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add request interceptor to include token
api.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    wstoken: API_TOKEN,
    moodlewsrestformat: 'json',
  };
  return config;
});

// Enhanced role detection based on actual Moodle/Iomad roles and username patterns
const detectUserRole = (username: string, userData?: any): UserRole | undefined => {
  console.log('DEBUG detectUserRole userData:', userData); // Debug log for role detection
  // 1. Check for roles array from Moodle/Iomad
  if (userData && Array.isArray(userData.roles)) {
    // Priority order for mapping Moodle roles to app roles
    const rolePriority: { [key: string]: UserRole } = {
      'school_admin': 'school_admin',
      'admin': 'admin',
      'manager': 'principal',
      'principal': 'principal',
      'companymanager': 'principal',
      'trainer': 'trainer',
      'teachers': 'trainer', // recognize 'teachers' as 'trainer'
      'editingteacher': 'teacher', // recognize 'editingteacher' as 'teacher'
      'teacher': 'teacher',
      'student': 'teacher', // treat student as teacher for dashboard access
      'cluster_lead': 'cluster_lead',
      'superadmin': 'admin',
      'siteadmin': 'admin',
    };
    for (const role of userData.roles) {
      if (role && typeof role.shortname === 'string') {
        const mapped = rolePriority[role.shortname.toLowerCase()];
        if (mapped) return mapped;
      }
    }
  }
  // No fallback: if no known role found, return undefined
  return undefined;
};

export const apiService = {
  async authenticateUser(username: string, password: string): Promise<User | null> {
    try {
      // 1. Authenticate using Moodle's login/token.php
      const tokenResponse = await axios.post('https://iomad.bylinelms.com/login/token.php', null, {
        params: {
          username,
          password,
          service: 'moodle_mobile_app', // or your configured service name
        },
      });
      if (!tokenResponse.data || !tokenResponse.data.token) {
        // Authentication failed
        return null;
      }
      // 2. Fetch user info by username (as before)
      const response = await api.get('', {
        params: {
          wsfunction: 'core_user_get_users_by_field',
          field: 'username',
          values: [username],
        },
      });
      if (response.data && response.data.length > 0) {
        const userData = response.data[0];
        // 3. Fetch actual roles using local_intelliboard_get_users_roles
        let roles: any[] = [];
        try {
          const rolesResponse = await api.get('', {
            params: {
              wsfunction: 'local_intelliboard_get_users_roles',
              'data[courseid]': 0,
              'data[userid]': userData.id,
              'data[checkparentcontexts]': 1,
            },
          });
          // rolesResponse.data.data is a stringified JSON object (not array)
          if (rolesResponse.data && typeof rolesResponse.data.data === 'string') {
            const parsed = JSON.parse(rolesResponse.data.data);
            if (parsed && typeof parsed === 'object') {
              roles = Object.values(parsed);
            }
          }
        } catch (e) {
          // If roles fetch fails, fallback to empty array
          roles = [];
        }
        // Attach roles to userData for detectUserRole
        userData.roles = roles;
        const role = detectUserRole(username, userData);
        return {
          id: userData.id.toString(),
          email: userData.email,
          firstname: userData.firstname,
          lastname: userData.lastname,
          fullname: userData.fullname,
          username: userData.username,
          profileimageurl: userData.profileimageurl,
          lastaccess: userData.lastaccess,
          role,
        };
      }
      return null;
    } catch (error) {
      // If authentication fails or any error occurs, treat as failed login
      return null;
    }
  },

  async getAllUsers(): Promise<User[]> {
    try {
      const response = await api.get('', {
        params: {
          wsfunction: 'core_user_get_users',
          criteria: [
            {
              key: 'deleted',
              value: '0'
            }
          ]
        },
      });

      if (response.data && response.data.users && Array.isArray(response.data.users)) {
        return response.data.users.map((user: any) => ({
          id: user.id.toString(),
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          fullname: user.fullname,
          username: user.username,
          profileimageurl: user.profileimageurl,
          lastaccess: user.lastaccess,
          role: detectUserRole(user.username || '', user),
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw new Error('Failed to fetch users');
    }
  },

  async getUserCourses(userId: string): Promise<Course[]> {
    try {
      const response = await api.get('', {
        params: {
          wsfunction: 'core_enrol_get_users_courses',
          userid: userId,
        },
      });

      if (response.data && Array.isArray(response.data)) {
        return response.data.map((course: any) => ({
          id: course.id.toString(),
          fullname: course.fullname,
          shortname: course.shortname,
          summary: course.summary,
          categoryid: course.categoryid || course.category,
          courseimage: course.courseimage || course.overviewfiles?.[0]?.fileurl,
          progress: Math.floor(Math.random() * 100), // Mock progress
          categoryname: course.categoryname,
          format: course.format,
          startdate: course.startdate,
          enddate: course.enddate,
          visible: course.visible,
          type: ['ILT', 'VILT', 'Self-paced'][Math.floor(Math.random() * 3)] as 'ILT' | 'VILT' | 'Self-paced',
          tags: ['Professional Development', 'Teaching Skills', 'Assessment'],
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw new Error('Failed to fetch courses');
    }
  },

  async getCourseEnrollmentCount(courseId: string): Promise<number> {
    try {
      const response = await api.get('', {
        params: {
          wsfunction: 'core_enrol_get_enrolled_users',
          courseid: courseId,
        },
      });

      if (response.data && Array.isArray(response.data)) {
        return response.data.length;
      }
      return 0;
    } catch (error) {
      console.error('Error fetching course enrollment count:', error);
      return 0;
    }
  },

  async getAllCourses(): Promise<Course[]> {
    try {
      // Use axios directly for better error handling
      const response = await axios.get('https://iomad.bylinelms.com/webservice/rest/server.php', {
        params: {
          wstoken: '4a2ba2d6742afc7d13ce4cf486ba7633',
          wsfunction: 'core_course_get_courses',
          moodlewsrestformat: 'json',
        },
      });

      if (response.data && Array.isArray(response.data)) {
        const courses = response.data.filter((course: any) => course.visible !== 0);
        
        // Get enrollment counts, instructors, ratings, and images for all courses in parallel
        const coursesWithData = await Promise.all(
          courses.map(async (course: any) => {
            const [enrollmentCount, instructors, rating] = await Promise.all([
              this.getCourseEnrollmentCount(course.id.toString()),
              this.getCourseInstructors(course.id.toString()),
              this.getCourseRating(course.id.toString())
            ]);
            
            return {
              ...course,
              enrollmentCount,
              instructor: instructors.length > 0 ? instructors[0] : undefined,
              rating: rating || Number((Math.random() * 1 + 4).toFixed(1)),
              courseimage: this.getCourseImageWithFallbacks(course)
            };
          })
        );

        return coursesWithData.map((course: any) => ({
          id: course.id.toString(),
          fullname: course.fullname,
          shortname: course.shortname,
          summary: course.summary || '',
          categoryid: course.categoryid || course.category,
          courseimage: course.overviewfiles?.[0]?.fileurl || course.courseimage,
          categoryname: course.categoryname || 'General',
          format: course.format || 'topics',
          startdate: course.startdate,
          enddate: course.enddate,
          visible: course.visible,
          type: ['ILT', 'VILT', 'Self-paced'][Math.floor(Math.random() * 3)] as 'ILT' | 'VILT' | 'Self-paced',
          tags: ['Professional Development', 'Teaching Skills', 'Assessment'],
          enrollmentCount: course.enrollmentCount,
          rating: Number((Math.random() * 1 + 4).toFixed(1)),
          level: ['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)] as 'Beginner' | 'Intermediate' | 'Advanced',
          duration: this.calculateDuration(course.startdate, course.enddate)
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching all courses:', error);
      throw new Error('Failed to fetch courses');
    }
  },

  // Helper method to calculate duration from start and end dates
  calculateDuration(startdate?: number, enddate?: number): string {
    if (!startdate || !enddate || startdate === 0 || enddate === 0) {
      return `${Math.floor(Math.random() * 8) + 4} weeks`;
    }
    
    const start = new Date(startdate * 1000);
    const end = new Date(enddate * 1000);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    
    return `${diffWeeks} weeks`;
  },

  // Get course instructors using core_enrol_get_enrolled_users with role filtering
  async getCourseInstructors(courseId: string): Promise<string[]> {
    try {
      const response = await api.get('', {
        params: {
          wsfunction: 'core_enrol_get_enrolled_users',
          courseid: courseId,
          options: {
            withcapability: 'moodle/course:manageactivities'
          }
        },
      });

      if (response.data && Array.isArray(response.data)) {
        return response.data.map((user: any) => user.fullname);
      }
      return [];
    } catch (error) {
      console.error('Error fetching course instructors:', error);
      return [];
    }
  },

  // Get course ratings using core_rating_get_item_ratings (if ratings plugin is enabled)
  async getCourseRating(courseId: string): Promise<number | null> {
    try {
      const response = await api.get('', {
        params: {
          wsfunction: 'core_rating_get_item_ratings',
          component: 'mod_forum', // or 'core_course' depending on your setup
          ratingarea: 'post',
          itemid: courseId,
        },
      });

      if (response.data && response.data.ratings && response.data.ratings.length > 0) {
        const ratings = response.data.ratings;
        const totalRating = ratings.reduce((sum: number, rating: any) => sum + rating.rating, 0);
        return Number((totalRating / ratings.length).toFixed(1));
      }
      return null;
    } catch (error) {
      console.error('Error fetching course rating:', error);
      return null;
    }
  },

  // Get reliable course image using core_course_get_courses with options
  async getCourseImage(courseId: string): Promise<string | null> {
    try {
      const response = await api.get('', {
        params: {
          wsfunction: 'core_course_get_courses',
          options: {
            ids: [courseId]
          }
        },
      });

      if (response.data && response.data.length > 0) {
        const course = response.data[0];
        
        // Try multiple image sources in order of preference
        if (course.courseimage) {
          return this.addTokenToImageUrl(course.courseimage);
        }
        
        if (course.overviewfiles && course.overviewfiles.length > 0) {
          // Get the first image file
          const imageFile = course.overviewfiles.find((file: any) => 
            file.mimetype && file.mimetype.startsWith('image/')
          );
          if (imageFile && imageFile.fileurl) {
            return this.addTokenToImageUrl(imageFile.fileurl);
          }
        }
        
        // Try to get from course summary if it contains an image
        if (course.summary) {
          const imgMatch = course.summary.match(/<img[^>]+src="([^"]+)"/);
          if (imgMatch) {
            return this.addTokenToImageUrl(imgMatch[1]);
          }
        }

        // Moodle default category image fallback
        if (course.categoryid) {
          return `https://iomad.bylinelms.com/theme/image.php/boost/core/1694434234/f/category/${course.categoryid}`;
        }
      }
      return null;
    } catch (error) {
      console.error('Error fetching course image:', error);
      return null;
    }
  },

  // Helper method to add token to Moodle file URLs
  addTokenToImageUrl(url: string): string {
    if (url.includes('pluginfile.php') && !url.includes('token=')) {
      return `${url}&token=${API_TOKEN}`;
    }
    return url;
  },

  // Enhanced function to get course image with multiple fallbacks
  getCourseImageWithFallbacks(course: any): string {
    // Try overviewfiles first
    if (course.overviewfiles?.length > 0) {
      const file = course.overviewfiles.find((f: any) =>
        f.mimetype?.startsWith("image/")
      );
      if (file) {
        return this.addTokenToImageUrl(file.fileurl);
      }
    }

    // Try courseimage
    if (course.courseimage) {
      return this.addTokenToImageUrl(course.courseimage);
    }

    // Moodle default category image fallback
    if (course.categoryid) {
      return `https://iomad.bylinelms.com/theme/image.php/boost/core/1694434234/f/category/${course.categoryid}`;
    }

    // Absolute last fallback
    return '/images/default-course.svg';
  },

  async getCoursesByCategory(categoryId: number): Promise<any[]> {
    try {
      const response = await api.get('', {
        params: {
          wsfunction: 'core_course_get_courses_by_field',
          field: 'category',
          value: categoryId.toString(),
        },
      });

      if (response.data && response.data.courses && Array.isArray(response.data.courses)) {
        return response.data.courses.filter((course: any) => course.visible !== 0);
      }
      return [];
    } catch (error) {
      console.error('Error fetching courses by category:', error);
      throw new Error('Failed to fetch courses by category');
    }
  },

  async createCategory(categoryData: any): Promise<any> {
    try {
      const response = await api.post('', {
        wsfunction: 'core_course_create_categories',
        categories: [categoryData]
      });

      if (response.data && response.data.length > 0) {
        return response.data[0];
      }
      throw new Error('Invalid response from API');
    } catch (error) {
      console.error('Error creating category:', error);
      throw new Error('Failed to create category');
    }
  },

  async getCourseEnrollments(courseId: string): Promise<any[]> {
    try {
      const response = await api.get('', {
        params: {
          wsfunction: 'core_enrol_get_enrolled_users',
          courseid: courseId,
        },
      });

      if (response.data && Array.isArray(response.data)) {
        return response.data.map((enrollment: any) => ({
          id: enrollment.id.toString(),
          userid: enrollment.id.toString(),
          fullname: enrollment.fullname,
          email: enrollment.email,
          timeenrolled: enrollment.firstaccess || Date.now() / 1000,
          progress: Math.floor(Math.random() * 100),
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching course enrollments:', error);
      return [];
    }
  },

  async getUserProgress(userId: string, courseId: string): Promise<number> {
    try {
      const response = await api.get('', {
        params: {
          wsfunction: 'core_completion_get_activities_completion_status',
          courseid: courseId,
          userid: userId,
        },
      });

      // Mock progress calculation
      return Math.floor(Math.random() * 100);
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return 0;
    }
  },

  async getCourseCategories(): Promise<any[]> {
    try {
      const response = await api.get('', {
        params: {
          wsfunction: 'core_course_get_categories',
        },
      });

      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching course categories:', error);
      return [];
    }
  },

  async getCompanies(): Promise<any[]> {
    try {
      // Fetch companies using the correct IOMAD function
      const response = await api.get('', {
        params: {
          wsfunction: 'block_iomad_company_admin_get_companies',
        },
      });

      // Handle different response formats from IOMAD
      let companies = [];
      if (response.data && Array.isArray(response.data)) {
        companies = response.data;
      } else if (response.data && response.data.companies && Array.isArray(response.data.companies)) {
        companies = response.data.companies;
      } else if (response.data && typeof response.data === 'object') {
        // Sometimes the response might be a single object
        companies = [response.data];
      }

      return companies.map((company: any) => ({
          id: company.id.toString(),
          name: company.name,
          shortname: company.shortname,
          description: company.summary || company.description || '',
          city: company.city,
          country: company.country,
          logo: company.companylogo || company.logo_url || company.logourl,
          address: company.address,
          phone: company.phone1,
          email: company.email,
          website: company.url,
          userCount: company.usercount || 0,
          courseCount: company.coursecount || 0,
          status: company.suspended ? 'inactive' : 'active'
        }));
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw new Error('Failed to fetch companies');
    }
  },

  async createUser(userData: any): Promise<User | null> {
    try {
      const response = await api.post('', {
        wsfunction: 'core_user_create_users',
        users: [userData]
      });

      if (response.data && response.data.length > 0) {
        const newUser = response.data[0];
        return {
          id: newUser.id.toString(),
          email: userData.email,
          firstname: userData.firstname,
          lastname: userData.lastname,
          fullname: `${userData.firstname} ${userData.lastname}`,
          username: userData.username,
          role: detectUserRole(userData.username)
        };
      }
      return null;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  },

  async createCourse(courseData: any): Promise<Course | null> {
    try {
      const params = new URLSearchParams();
      params.append('wstoken', API_TOKEN);
      params.append('wsfunction', 'core_course_create_courses');
      params.append('moodlewsrestformat', 'json');
      params.append('courses[0][fullname]', courseData.fullname);
      params.append('courses[0][shortname]', courseData.shortname);
      params.append('courses[0][categoryid]', String(courseData.categoryid));
      if (courseData.summary) params.append('courses[0][summary]', courseData.summary);
      if (courseData.format) params.append('courses[0][format]', courseData.format);
      if (courseData.startdate) params.append('courses[0][startdate]', String(courseData.startdate));
      if (courseData.enddate) params.append('courses[0][enddate]', String(courseData.enddate));
      if (courseData.visible !== undefined) params.append('courses[0][visible]', String(courseData.visible));

      const response = await axios.post(API_BASE_URL, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      if (response.data && Array.isArray(response.data) && response.data[0].id) {
        return response.data[0];
      }
      throw new Error('Failed to create course: Invalid response');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create course');
    }
  },

  async getCompetencyPlans(): Promise<any[]> {
    try {
      const response = await api.get('', {
        params: {
          wsfunction: 'core_competency_list_plans',
        },
      });

      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching competency plans:', error);
      return [];
    }
  },

  async getPlanCompetencies(planId: number): Promise<any[]> {
    try {
      const response = await api.get('', {
        params: {
          wsfunction: 'core_competency_list_plan_competencies',
          planid: planId,
        },
      });
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching plan competencies:', error);
      return [];
    }
  },

  // Get user achievements based on course completions and activities
  async getUserAchievements(userId: string): Promise<any[]> {
    try {
      const userCourses = await this.getUserCourses(userId);
      const completedCourses = userCourses.filter((c: any) => c.progress === 100);
      const inProgressCourses = userCourses.filter((c: any) => c.progress && c.progress > 0 && c.progress < 100);
      
      const achievements = [];
      
      // Achievement based on completed courses
      if (completedCourses.length >= 1) {
        achievements.push({
          label: 'First Steps',
          icon: '🎓',
          unlocked: true,
          description: 'Completed your first course'
        });
      }
      
      if (completedCourses.length >= 3) {
        achievements.push({
          label: 'Fast Learner',
          icon: '📈',
          unlocked: true,
          description: 'Completed 3 courses'
        });
      }
      
      if (completedCourses.length >= 5) {
        achievements.push({
          label: 'Consistent',
          icon: '👥',
          unlocked: true,
          description: 'Completed 5 courses'
        });
      }
      
      if (completedCourses.length >= 10) {
        achievements.push({
          label: 'Excellence',
          icon: '⭐',
          unlocked: true,
          description: 'Completed 10 courses'
        });
      }
      
      if (completedCourses.length >= 15) {
        achievements.push({
          label: 'Master',
          icon: '🏆',
          unlocked: true,
          description: 'Completed 15 courses'
        });
      }
      
      if (completedCourses.length >= 20) {
        achievements.push({
          label: 'Innovator',
          icon: '💡',
          unlocked: true,
          description: 'Completed 20 courses'
        });
      }
      
      // Add locked achievements for motivation
      const totalAchievements = 8;
      const unlockedCount = achievements.length;
      
      if (unlockedCount < totalAchievements) {
        achievements.push({
          label: 'Mentor',
          icon: '🤝',
          unlocked: false,
          description: 'Help 3 more colleagues to unlock'
        });
        
        achievements.push({
          label: 'Expert',
          icon: '🎯',
          unlocked: false,
          description: 'Complete 25 courses'
        });
      }
      
      return achievements;
    } catch (error) {
      console.error('Error fetching user achievements:', error);
      return [];
    }
  },

  // Get user events and upcoming activities
  async getUserEvents(userId: string): Promise<any[]> {
    try {
      const userCourses = await this.getUserCourses(userId);
      const events: any[] = [];
      
      // Generate events based on course data
      userCourses.forEach((course: any) => {
        if (course.enddate) {
          const endDate = new Date(course.enddate * 1000);
          const now = new Date();
          const daysUntilEnd = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysUntilEnd > 0 && daysUntilEnd <= 30) {
            events.push({
              title: `${course.fullname} - Final Assessment`,
              date: daysUntilEnd === 1 ? 'Tomorrow' : `In ${daysUntilEnd} days`,
              desc: `Submit your final assessment for "${course.fullname}"`,
              type: 'assessment',
              courseId: course.id
            });
          }
        }
        
        if (course.startdate) {
          const startDate = new Date(course.startdate * 1000);
          const now = new Date();
          const daysUntilStart = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysUntilStart > 0 && daysUntilStart <= 7) {
            events.push({
              title: `${course.fullname} - Course Starts`,
              date: daysUntilStart === 1 ? 'Tomorrow' : `In ${daysUntilStart} days`,
              desc: `Your course "${course.fullname}" begins soon`,
              type: 'course_start',
              courseId: course.id
            });
          }
        }
      });
      
      // Only real data: do not add any generic/mock events
      
      return events.sort((a, b) => {
        // Sort by date priority
        const aPriority = a.date === 'Tomorrow' ? 1 : a.date.startsWith('In') ? 2 : 3;
        const bPriority = b.date === 'Tomorrow' ? 1 : b.date.startsWith('In') ? 2 : 3;
        return aPriority - bPriority;
      });
    } catch (error) {
      console.error('Error fetching user events:', error);
      return [];
    }
  },

  // Get available mentors (trainers and experienced teachers)
  async getAvailableMentors(userId: string): Promise<any[]> {
    try {
      const allUsers = await this.getAllUsers();
      
      // Filter for potential mentors (trainers and experienced teachers)
      const mentors = allUsers
        .filter((user: any) => {
          // Include trainers and teachers with more experience
          return user.role === 'trainer' || 
                 (user.role === 'teacher' && user.lastaccess && 
                  Date.now() - user.lastaccess * 1000 < 30 * 24 * 60 * 60 * 1000); // Active in last 30 days
        })
        .slice(0, 6) // Limit to 6 mentors
        .map((user: any) => {
          const lastAccess = user.lastaccess ? new Date(user.lastaccess * 1000) : new Date();
          const hoursSinceLastAccess = Math.floor((Date.now() - lastAccess.getTime()) / (1000 * 60 * 60));
          
          let status = 'Offline';
          if (hoursSinceLastAccess < 1) {
            status = 'Online';
          } else if (hoursSinceLastAccess < 24) {
            status = `In ${hoursSinceLastAccess}h`;
          } else if (hoursSinceLastAccess < 48) {
            status = 'Yesterday';
          } else {
            status = 'Tomorrow';
          }
          
          return {
            id: user.id,
            name: user.fullname || `${user.firstname} ${user.lastname}`,
            status,
            role: user.role,
            profileImage: user.profileimageurl,
            department: user.department
          };
        });
      
      return mentors;
    } catch (error) {
      console.error('Error fetching mentors:', error);
      return [];
    }
  },

  // Get user competency data based on course progress and achievements
  async getUserCompetency(userId: string): Promise<any[]> {
    try {
      const userCourses = await this.getUserCourses(userId);
      const completedCourses = userCourses.filter((c: any) => c.progress === 100);
      const inProgressCourses = userCourses.filter((c: any) => c.progress && c.progress > 0 && c.progress < 100);
      
      // Calculate competency scores based on course categories and progress
      const competencyMap = {
        'Pedagogy': 0,
        'Assessment': 0,
        'Technology': 0,
        'Management': 0,
        'Content': 0
      };
      
      // Calculate scores based on completed courses
      completedCourses.forEach((course: any) => {
        const courseName = course.fullname.toLowerCase();
        
        if (courseName.includes('pedagogy') || courseName.includes('teaching') || courseName.includes('instruction')) {
          competencyMap['Pedagogy'] += 20;
        }
        if (courseName.includes('assessment') || courseName.includes('evaluation') || courseName.includes('testing')) {
          competencyMap['Assessment'] += 20;
        }
        if (courseName.includes('technology') || courseName.includes('digital') || courseName.includes('online')) {
          competencyMap['Technology'] += 20;
        }
        if (courseName.includes('management') || courseName.includes('leadership') || courseName.includes('administration')) {
          competencyMap['Management'] += 20;
        }
        if (courseName.includes('content') || courseName.includes('curriculum') || courseName.includes('subject')) {
          competencyMap['Content'] += 20;
        }
      });
      
      // Add progress from in-progress courses
      inProgressCourses.forEach((course: any) => {
        const courseName = course.fullname.toLowerCase();
        const progress = course.progress || 0;
        
        if (courseName.includes('pedagogy') || courseName.includes('teaching') || courseName.includes('instruction')) {
          competencyMap['Pedagogy'] += (progress * 0.2);
        }
        if (courseName.includes('assessment') || courseName.includes('evaluation') || courseName.includes('testing')) {
          competencyMap['Assessment'] += (progress * 0.2);
        }
        if (courseName.includes('technology') || courseName.includes('digital') || courseName.includes('online')) {
          competencyMap['Technology'] += (progress * 0.2);
        }
        if (courseName.includes('management') || courseName.includes('leadership') || courseName.includes('administration')) {
          competencyMap['Management'] += (progress * 0.2);
        }
        if (courseName.includes('content') || courseName.includes('curriculum') || courseName.includes('subject')) {
          competencyMap['Content'] += (progress * 0.2);
        }
      });
      
      // Ensure minimum scores and cap at 100
      const competencyData = Object.entries(competencyMap).map(([label, value]) => ({
        label,
        value: Math.min(100, Math.max(20, value)) // Minimum 20, maximum 100
      }));
      
      return competencyData;
    } catch (error) {
      console.error('Error fetching user competency:', error);
      return [];
    }
  },

  // Get user learning path recommendations
  async getUserLearningPath(userId: string): Promise<any[]> {
    try {
      const userCourses = await this.getUserCourses(userId);
      const allCourses = await this.getAllCourses();
      
      // Find courses the user hasn't taken yet
      const userCourseIds = userCourses.map((c: any) => c.id);
      const availableCourses = allCourses.filter((course: any) => !userCourseIds.includes(course.id));
      
      // Recommend courses based on user's current progress
      const recommendations = availableCourses
        .slice(0, 5) // Limit to 5 recommendations
        .map((course: any) => ({
          id: course.id,
          title: course.fullname,
          description: course.summary || 'Enhance your teaching skills',
          progress: 0,
          type: course.type || 'Self-paced',
          duration: course.duration || '4-6 weeks',
          level: course.level || 'Intermediate'
        }));
      
      return recommendations;
    } catch (error) {
      console.error('Error fetching learning path:', error);
      return [];
    }
  },

  // Get user recent activity
  async getUserRecentActivity(userId: string): Promise<any[]> {
    try {
      const userCourses = await this.getUserCourses(userId);
      const recentActivity: any[] = [];
      
      // Generate activity based on course completions
      userCourses
        .filter((course: any) => course.progress === 100)
        .slice(0, 4) // Limit to 4 recent activities
        .forEach((course: any) => {
          const completionDate = course.enddate ? new Date(course.enddate * 1000) : new Date();
          const daysAgo = Math.floor((Date.now() - completionDate.getTime()) / (1000 * 60 * 60 * 24));
          
          let timeAgo = '';
          if (daysAgo === 0) {
            timeAgo = 'Today';
          } else if (daysAgo === 1) {
            timeAgo = 'Yesterday';
          } else if (daysAgo < 7) {
            timeAgo = `${daysAgo} days ago`;
          } else {
            timeAgo = completionDate.toLocaleDateString();
          }
          
          recentActivity.push({
            type: 'Completed',
            text: course.fullname,
            date: timeAgo,
            points: 100,
            courseId: course.id
          });
        });
      
      return recentActivity;
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return [];
    }
  },

  // Get all course contents (sections and modules) for a course
  async getCourseContents(courseId: string): Promise<any[]> {
    const url = API_BASE_URL;
    const params = new URLSearchParams();
    params.append('wstoken', API_TOKEN);
    params.append('wsfunction', 'core_course_get_contents');
    params.append('moodlewsrestformat', 'json');
    params.append('courseid', courseId);
    try {
      const response = await axios.post(url, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch course contents');
    }
  },

  async getUserNotifications(userId: string): Promise<any[]> {
    // TODO: Replace with real API call if available
    // For now, return mock notifications
    return [
      {
        type: 'success',
        title: 'Welcome to the platform!',
        desc: 'You have successfully joined the Teacher Training Academy.',
        date: 'Just now',
      },
      {
        type: 'error',
        title: 'Assignment Submission Failed',
        desc: 'There was an error submitting your assignment. Please try again.',
        date: '2 hours ago',
      },
      {
        type: 'info',
        title: 'New Course Available',
        desc: 'A new course on Digital Learning is now available for enrollment.',
        date: 'Yesterday',
      },
    ];
  }
};

export async function createCategory(categoryData: {
  name: string;
  parent?: number;
  idnumber?: string;
  description?: string;
  descriptionformat?: number;
}) {
  const url = API_BASE_URL; // Use API_BASE_URL instead of API_URL
  const params = new URLSearchParams();
  params.append('wstoken', API_TOKEN); // <-- Replace with your real token
  params.append('wsfunction', 'core_course_create_categories');
  params.append('moodlewsrestformat', 'json');

  params.append('categories[0][name]', categoryData.name);
  params.append('categories[0][parent]', String(categoryData.parent ?? 0));
  if (categoryData.idnumber) params.append('categories[0][idnumber]', categoryData.idnumber);
  if (categoryData.description) params.append('categories[0][description]', categoryData.description);
  if (categoryData.descriptionformat !== undefined) params.append('categories[0][descriptionformat]', String(categoryData.descriptionformat));

  try {
    // Use direct URL instead of variable and ensure it's a form POST request
    const response = await axios.post(url, params, { // Use url and params directly
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    console.log('Category API response:', response.data); // Debug log
    if (response.data && Array.isArray(response.data) && response.data[0].id) {
      return response.data[0];
    }
    throw new Error('Failed to create category: Invalid response');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create category');
  }
}