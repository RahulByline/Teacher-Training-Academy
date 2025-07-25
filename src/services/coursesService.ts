import axios from 'axios';
import { Course } from '../types';

const IOMAD_BASE_URL = import.meta.env.VITE_IOMAD_URL || 'https://iomad.bylinelms.com/webservice/rest/server.php';
const IOMAD_TOKEN = import.meta.env.VITE_IOMAD_TOKEN || '4a2ba2d6742afc7d13ce4cf486ba7633';

const api = axios.create({
  baseURL: IOMAD_BASE_URL,
  timeout: 10000,
});

// Add request interceptor to include token
api.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    wstoken: IOMAD_TOKEN,
    moodlewsrestformat: 'json',
  };
  return config;
});

export const coursesService = {
  /**
   * Fetch all courses from IOMAD
   */
  async getAllCourses(): Promise<Course[]> {
    try {
      const response = await api.get('', {
        params: {
          wsfunction: 'core_course_get_courses_by_field',
          field: '',
          value: '',
        },
      });

      if (response.data && Array.isArray(response.data.courses)) {
        return response.data.courses
          .filter((course: any) => course.visible !== 0)
          .map((course: any) => ({
            id: course.id.toString(),
            fullname: course.fullname,
            shortname: course.shortname,
            summary: course.summary || '',
            categoryid: course.categoryid || course.category,
            courseimage: course.courseimage || course.overviewfiles?.[0]?.fileurl,
            categoryname: course.categoryname || 'General',
            format: course.format || 'topics',
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
      throw new Error('Failed to fetch courses from IOMAD');
    }
  },

  /**
   * Fetch all course categories from IOMAD
   */
  async getAllCategories(): Promise<any[]> {
    try {
      const response = await api.get('', {
        params: {
          wsfunction: 'core_course_get_categories',
        },
      });

      if (response.data && Array.isArray(response.data)) {
        return response.data.filter((category: any) => category.visible !== 0);
      }
      return [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories from IOMAD');
    }
  },

  /**
   * Create a new course category
   */
  async createCategory(categoryData: any): Promise<any> {
    try {
      const response = await api.post('', {
        wsfunction: 'core_course_create_categories',
        categories: [categoryData]
      });

      return response.data && response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      console.error('Error creating category:', error);
      throw new Error('Failed to create category');
    }
  },

  /**
   * Get course enrollments
   */
  async getCourseEnrollments(courseId: string): Promise<any[]> {
    try {
      const response = await api.get('', {
        params: {
          wsfunction: 'core_enrol_get_enrolled_users',
          courseid: courseId,
        },
      });

      return response.data || [];
    } catch (error) {
      console.error('Error fetching course enrollments:', error);
      return [];
    }
  },

  /**
   * Enroll user in course
   */
  async enrollUser(courseId: string, userId: string, roleId: number = 5): Promise<boolean> {
    try {
      const response = await api.post('', {
        wsfunction: 'enrol_manual_enrol_users',
        enrolments: [{
          courseid: courseId,
          userid: userId,
          roleid: roleId
        }]
      });

      return response.data && !response.data.exception;
    } catch (error) {
      console.error('Error enrolling user:', error);
      throw new Error('Failed to enroll user');
    }
  },

  /**
   * Get course settings
   */
  async getCourseSettings(courseId: string): Promise<any> {
    try {
      const response = await api.get('', {
        params: {
          wsfunction: 'core_course_get_courses',
          options: {
            ids: [courseId]
          }
        },
      });

      return response.data && response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      console.error('Error fetching course settings:', error);
      return null;
    }
  },

  /**
   * Update course settings
   */
  async updateCourseSettings(courseId: string, settings: any): Promise<boolean> {
    try {
      const response = await api.post('', {
        wsfunction: 'core_course_update_courses',
        courses: [{
          id: courseId,
          ...settings
        }]
      });

      return response.data && !response.data.exception;
    } catch (error) {
      console.error('Error updating course settings:', error);
      throw new Error('Failed to update course settings');
    }
  },

  /**
   * Get school courses (IOMAD specific)
   */
  async getSchoolCourses(schoolId: string): Promise<any[]> {
    try {
      const response = await api.get('', {
        params: {
          wsfunction: 'block_iomad_company_admin_get_company_courses',
          companyid: schoolId,
        },
      });

      return response.data || [];
    } catch (error) {
      console.error('Error fetching school courses:', error);
      return [];
    }
  },

  /**
   * Assign course to school
   */
  async assignCourseToSchool(courseId: string, schoolId: string): Promise<boolean> {
    try {
      const response = await api.post('', {
        wsfunction: 'block_iomad_company_admin_assign_courses',
        companyid: schoolId,
        courseids: [courseId]
      });

      return response.data && !response.data.exception;
    } catch (error) {
      console.error('Error assigning course to school:', error);
      throw new Error('Failed to assign course to school');
    }
  },

  /**
   * Assign course(s) to a school
   */
  async assignCoursesToSchool(schoolId: number, courseIds: number[]): Promise<any> {
    const params = new URLSearchParams();
    params.append('wstoken', IOMAD_TOKEN);
    params.append('wsfunction', 'block_iomad_company_admin_assign_courses');
    params.append('moodlewsrestformat', 'json');
    courseIds.forEach((id, idx) => {
      params.append(`courses[${idx}][courseid]`, String(id));
      params.append(`courses[${idx}][companyid]`, String(schoolId));
      params.append(`courses[${idx}][departmentid]`, '0');
      params.append(`courses[${idx}][owned]`, '0');
      params.append(`courses[${idx}][licensed]`, '1');
    });
    const response = await axios.post(IOMAD_BASE_URL, params);
    return response.data;
  },

  /**
   * Create/set licenses for a course in a school
   */
  async createCourseLicense(schoolId: number, courseId: number, licenseCount: number): Promise<any> {
    const params = new URLSearchParams();
    params.append('wstoken', IOMAD_TOKEN);
    params.append('wsfunction', 'block_iomad_company_admin_create_licenses');
    params.append('moodlewsrestformat', 'json');
    // Required fields
    params.append('licenses[0][name]', `License for course ${courseId} in school ${schoolId}`);
    params.append('licenses[0][allocation]', String(licenseCount));
    params.append('licenses[0][validlength]', '0'); // 0 = unlimited days
    params.append('licenses[0][startdate]', '0'); // 0 = no start date
    params.append('licenses[0][expirydate]', '0'); // 0 = no expiry
    params.append('licenses[0][used]', '0');
    params.append('licenses[0][companyid]', String(schoolId));
    params.append('licenses[0][parentid]', '0');
    params.append('licenses[0][type]', '0'); // 0 = standard
    params.append('licenses[0][program]', '0');
    params.append('licenses[0][reference]', '');
    params.append('licenses[0][instant]', '0');
    params.append('licenses[0][clearonexpire]', '0');
    params.append('licenses[0][cutoffdate]', '0');
    params.append('licenses[0][courses][0][courseid]', String(courseId));
    const response = await axios.post(IOMAD_BASE_URL, params);
    return response.data;
  },

// Get license info for a course in a school
async getCourseLicenseInfo(companyId: number, courseId: number): Promise<any> {
  const params = new URLSearchParams();
  params.append('wstoken', IOMAD_TOKEN);
  params.append('wsfunction', 'block_iomad_company_admin_get_license_info');
  params.append('moodlewsrestformat', 'json');
  params.append('criteria[0][key]', 'companyid');
  params.append('criteria[0][value]', String(companyId));
  params.append('criteria[1][key]', 'courseid');
  params.append('criteria[1][value]', String(courseId));
  const response = await axios.post(IOMAD_BASE_URL, params);
  return response.data;
},

  /**
   * Get learning paths (mock implementation)
   */
  async getLearningPaths(): Promise<any[]> {
    try {
      // Mock implementation - IOMAD may have specific endpoints for learning paths
      return [
        {
          id: 1,
          name: 'Teacher Development Path',
          description: 'Complete teacher training program',
          courses: ['101', '102', '103'],
          duration: '12 weeks'
        },
        {
          id: 2,
          name: 'Leadership Training Path',
          description: 'Educational leadership development',
          courses: ['201', '202', '203'],
          duration: '8 weeks'
        }
      ];
    } catch (error) {
      console.error('Error fetching learning paths:', error);
      return [];
    }
  },

  /**
   * Create learning path
   */
  async createLearningPath(pathData: any): Promise<any> {
    try {
      // Mock implementation
      return {
        id: Date.now(),
        ...pathData,
        created: true
      };
    } catch (error) {
      console.error('Error creating learning path:', error);
      throw new Error('Failed to create learning path');
    }
  },

  /**
   * Get teaching locations
   */
  async getTeachingLocations(): Promise<any[]> {
    try {
      // Mock implementation - IOMAD may have specific endpoints for locations
      return [
        {
          id: 1,
          name: 'Main Campus',
          address: '123 Education St',
          type: 'physical',
          capacity: 500
        },
        {
          id: 2,
          name: 'Virtual Classroom A',
          platform: 'Zoom',
          type: 'virtual',
          capacity: 100
        }
      ];
    } catch (error) {
      console.error('Error fetching teaching locations:', error);
      return [];
    }
  },

  /**
   * Create teaching location
   */
  async createTeachingLocation(locationData: any): Promise<any> {
    try {
      // Mock implementation
      return {
        id: Date.now(),
        ...locationData,
        created: true
      };
    } catch (error) {
      console.error('Error creating teaching location:', error);
      throw new Error('Failed to create teaching location');
    }
  },

  // Get all courses assigned to a company (school)
async getCompanyCourses(companyId: number): Promise<any[]> {
  const params = new URLSearchParams();
  params.append('wstoken', IOMAD_TOKEN);
  params.append('wsfunction', 'block_iomad_company_admin_get_company_courses');
  params.append('moodlewsrestformat', 'json');
  params.append('criteria[0][companyid]', String(companyId));
  params.append('criteria[0][shared]', '0');
  const response = await axios.post(IOMAD_BASE_URL, params);
  if (response.data && Array.isArray(response.data.companies) && response.data.companies.length > 0) {
    return response.data.companies[0].courses || [];
  }
  if (response.data && Array.isArray(response.data.courses)) {
    return response.data.courses;
  }
  return [];
},

  // Enroll a user in a course
  async enrollUserInCourse(courseId: string, userId: string, roleId: number = 5): Promise<boolean> {
    try {
      const params = new URLSearchParams();
      params.append('wstoken', IOMAD_TOKEN);
      params.append('wsfunction', 'enrol_manual_enrol_users');
      params.append('moodlewsrestformat', 'json');
      params.append('enrolments[0][courseid]', courseId.toString());
      params.append('enrolments[0][userid]', userId.toString());
      params.append('enrolments[0][roleid]', roleId.toString());
      const response = await axios.post(IOMAD_BASE_URL, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      return response.data && !response.data.exception;
    } catch (error) {
      console.error('Error enrolling user in course:', error);
      return false;
    }
  }
};