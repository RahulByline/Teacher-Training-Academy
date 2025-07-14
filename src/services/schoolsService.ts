import axios from 'axios';
import { School } from '../types';

const IOMAD_BASE_URL = import.meta.env.VITE_IOMAD_BASE_URL || 'https://iomad.bylinelms.com/webservice/rest/server.php';
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

export const schoolsService = {
  /**
   * Fetch all schools/companies from IOMAD
   */
  async getAllSchools(): Promise<School[]> {
    try {
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
        companies = [response.data];
      }

      return companies.map((company: any) => ({
        id: company.id,
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
        status: company.suspended ? 'inactive' : 'active',
        region: company.region,
        postcode: company.postcode,
        theme: company.theme,
        hostname: company.hostname,
        maxUsers: company.maxusers,
        validTo: company.validto,
        suspended: company.suspended,
        ecommerce: company.ecommerce,
        parentId: company.parentid,
        customCss: company.customcss,
        mainColor: company.maincolor,
        headingColor: company.headingcolor,
        linkColor: company.linkcolor,
        custom1: company.custom1,
        custom2: company.custom2,
        custom3: company.custom3
      }));
    } catch (error) {
      console.error('Error fetching schools:', error);
      throw new Error('Failed to fetch schools from IOMAD');
    }
  },

  /**
   * Create a new school/company in IOMAD
   */
  async createSchool(schoolData: Partial<School>): Promise<School> {
    try {
      const response = await api.post('', {
        wsfunction: 'block_iomad_company_admin_create_companies',
        companies: [{
          name: schoolData.name,
          shortname: schoolData.shortname,
          country: schoolData.country,
          city: schoolData.city,
          address: schoolData.address,
          region: schoolData.region,
          postcode: schoolData.postcode,
          phone1: schoolData.phone,
          email: schoolData.email,
          url: schoolData.website,
          suspended: schoolData.status === 'inactive' ? 1 : 0,
          ecommerce: schoolData.ecommerce || 0,
          parentid: schoolData.parentId || 0,
          customcss: schoolData.customCss || '',
          theme: schoolData.theme || '',
          hostname: schoolData.hostname || '',
          maxusers: schoolData.maxUsers || 0,
          maincolor: schoolData.mainColor || '',
          headingcolor: schoolData.headingColor || '',
          linkcolor: schoolData.linkColor || '',
          custom1: schoolData.custom1 || '',
          custom2: schoolData.custom2 || '',
          custom3: schoolData.custom3 || ''
        }]
      });

      if (response.data && response.data.length > 0) {
        const newSchool = response.data[0];
        return {
          id: newSchool.id,
          name: newSchool.name,
          shortname: newSchool.shortname,
          description: '',
          status: 'active'
        };
      }
      throw new Error('Invalid response from IOMAD API');
    } catch (error) {
      console.error('Error creating school:', error);
      throw new Error('Failed to create school');
    }
  },

  /**
   * Update an existing school/company
   */
  async updateSchool(schoolId: number, schoolData: Partial<School>): Promise<School> {
    try {
      const response = await api.post('', {
        wsfunction: 'block_iomad_company_admin_update_companies',
        companies: [{
          id: schoolId,
          name: schoolData.name,
          shortname: schoolData.shortname,
          country: schoolData.country,
          city: schoolData.city,
          address: schoolData.address,
          region: schoolData.region,
          postcode: schoolData.postcode,
          phone1: schoolData.phone,
          email: schoolData.email,
          url: schoolData.website,
          suspended: schoolData.status === 'inactive' ? 1 : 0,
          ecommerce: schoolData.ecommerce || 0,
          parentid: schoolData.parentId || 0,
          customcss: schoolData.customCss || '',
          theme: schoolData.theme || '',
          hostname: schoolData.hostname || '',
          maxusers: schoolData.maxUsers || 0,
          maincolor: schoolData.mainColor || '',
          headingcolor: schoolData.headingColor || '',
          linkcolor: schoolData.linkColor || '',
          custom1: schoolData.custom1 || '',
          custom2: schoolData.custom2 || '',
          custom3: schoolData.custom3 || ''
        }]
      });

      if (response.data && response.data.length > 0) {
        const updatedSchool = response.data[0];
        return {
          id: updatedSchool.id,
          name: updatedSchool.name,
          shortname: updatedSchool.shortname,
          description: '',
          status: updatedSchool.suspended ? 'inactive' : 'active'
        };
      }
      throw new Error('Invalid response from IOMAD API');
    } catch (error) {
      console.error('Error updating school:', error);
      throw new Error('Failed to update school');
    }
  },

  /**
   * Delete a school/company
   */
  async deleteSchool(schoolId: number): Promise<boolean> {
    try {
      const response = await api.post('', {
        wsfunction: 'block_iomad_company_admin_delete_companies',
        companyids: [schoolId]
      });

      return response.data && response.data.success;
    } catch (error) {
      console.error('Error deleting school:', error);
      throw new Error('Failed to delete school');
    }
  },

  /**
   * Get school departments
   */
  async getSchoolDepartments(schoolId: number): Promise<any[]> {
    try {
      const response = await api.get('', {
        params: {
          wsfunction: 'block_iomad_company_admin_get_departments',
          companyid: schoolId,
        },
      });

      return response.data || [];
    } catch (error) {
      console.error('Error fetching departments:', error);
      return [];
    }
  },

  /**
   * Create department for a school
   */
  async createDepartment(schoolId: number, departmentData: any): Promise<any> {
    try {
      const response = await api.post('', {
        wsfunction: 'block_iomad_company_admin_create_departments',
        departments: [{
          companyid: schoolId,
          name: departmentData.name,
          shortname: departmentData.shortname,
          parent: departmentData.parent || 0
        }]
      });

      return response.data && response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      console.error('Error creating department:', error);
      throw new Error('Failed to create department');
    }
  },

  /**
   * Get school users
   */
  async getSchoolUsers(schoolId: number): Promise<any[]> {
    try {
      const response = await api.get('', {
        params: {
          wsfunction: 'block_iomad_company_admin_get_company_users',
          companyid: schoolId,
        },
      });

      return response.data || [];
    } catch (error) {
      console.error('Error fetching school users:', error);
      return [];
    }
  },

  /**
   * Get school courses
   */
  async getSchoolCourses(schoolId: number): Promise<any[]> {
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
   * Import schools from CSV data
   */
  async importSchools(csvData: string): Promise<any> {
    try {
      // This would typically involve parsing CSV and creating multiple schools
      // For now, return a mock response
      return {
        success: true,
        imported: 0,
        errors: []
      };
    } catch (error) {
      console.error('Error importing schools:', error);
      throw new Error('Failed to import schools');
    }
  },

  /**
   * Get email templates for schools
   */
  async getEmailTemplates(schoolId?: number): Promise<any[]> {
    try {
      // Mock implementation - IOMAD may have specific endpoints for email templates
      return [
        {
          id: 1,
          name: 'Welcome Email',
          subject: 'Welcome to {schoolname}',
          body: 'Welcome to our learning platform...',
          type: 'welcome'
        },
        {
          id: 2,
          name: 'Course Enrollment',
          subject: 'You have been enrolled in {coursename}',
          body: 'You have been successfully enrolled...',
          type: 'enrollment'
        }
      ];
    } catch (error) {
      console.error('Error fetching email templates:', error);
      return [];
    }
  },

  /**
   * Update email template
   */
  async updateEmailTemplate(templateId: number, templateData: any): Promise<any> {
    try {
      // Mock implementation
      return {
        id: templateId,
        ...templateData,
        updated: true
      };
    } catch (error) {
      console.error('Error updating email template:', error);
      throw new Error('Failed to update email template');
    }
  }
};