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

// Enhanced role detection based on username patterns and user data
const detectUserRole = (username: string, userData?: any): UserRole => {
  const lowerUsername = username.toLowerCase();
  
  // Check for admin patterns
  if (lowerUsername.includes('admin') || lowerUsername.includes('super') || lowerUsername.includes('system')) {
    return 'admin';
  }
  
  // Check for trainer patterns
  if (lowerUsername.includes('trainer') || lowerUsername.includes('instructor') || lowerUsername.includes('facilitator')) {
    return 'trainer';
  }
  
  // Check for principal/manager patterns
  if (lowerUsername.includes('principal') || lowerUsername.includes('head') || lowerUsername.includes('manager') || lowerUsername.includes('director')) {
    return 'principal';
  }
  
  // Check for cluster lead patterns
  if (lowerUsername.includes('cluster') || lowerUsername.includes('lead') || lowerUsername.includes('coordinator')) {
    return 'cluster_lead';
  }
  
  // Default to teacher for educational contexts
  return 'teacher';
};

export const apiService = {
  async authenticateUser(username: string, password: string): Promise<User | null> {
    try {
      const response = await api.get('', {
        params: {
          wsfunction: 'core_user_get_users_by_field',
          field: 'username',
          values: [username],
        },
      });

      if (response.data && response.data.length > 0) {
        const userData = response.data[0];
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
      console.error('Error authenticating user:', error);
      throw new Error('Failed to authenticate user');
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
      const response = await api.post('', {
        wsfunction: 'core_course_create_courses',
        courses: [courseData]
      });

      if (response.data && response.data.length > 0) {
        const newCourse = response.data[0];
        return {
          id: newCourse.id.toString(),
          fullname: courseData.fullname,
          shortname: courseData.shortname,
          summary: courseData.summary,
          categoryid: courseData.categoryid || courseData.category,
          categoryname: courseData.categoryname,
          format: courseData.format,
          visible: courseData.visible,
          type: 'Self-paced',
          tags: []
        };
      }
      return null;
    } catch (error) {
      console.error('Error creating course:', error);
      throw new Error('Failed to create course');
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