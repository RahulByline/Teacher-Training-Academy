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
      const params = new URLSearchParams();
      params.append('wsfunction', 'block_iomad_company_admin_create_companies');
      
      const companyData = {
        name: schoolData.name,
        shortname: schoolData.shortname,
        country: schoolData.country,
        city: schoolData.city,
        address: schoolData.address,
        region: schoolData.region,
        postcode: schoolData.postcode,
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
      };

      Object.entries(companyData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          let keyName = key;
          params.append(`companies[0][${keyName}]`, String(value));
        }
      });

      const response = await api.post('', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
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
      const params = new URLSearchParams();
      params.append('wsfunction', 'block_iomad_company_admin_update_companies');

      const companyData: any = { id: schoolId, ...schoolData };
      
      const apiData = {
        id: companyData.id,
        name: companyData.name,
        shortname: companyData.shortname,
        country: companyData.country,
        city: companyData.city,
        address: companyData.address,
        region: companyData.region,
        postcode: companyData.postcode,
        suspended: companyData.status === 'inactive' ? 1 : 0,
        ecommerce: companyData.ecommerce,
        parentid: companyData.parentId,
        customcss: companyData.customCss,
        theme: companyData.theme,
        hostname: companyData.hostname,
        maxusers: companyData.maxUsers,
        maincolor: companyData.mainColor,
        headingcolor: companyData.headingColor,
        linkcolor: companyData.linkColor,
        custom1: companyData.custom1,
        custom2: companyData.custom2,
        custom3: companyData.custom3
      };

      Object.entries(apiData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          let keyName = key;
          params.append(`companies[0][${keyName}]`, String(value));
        }
      });
      
      const response = await api.post('', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
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
      const params = new URLSearchParams();
      params.append('wsfunction', 'block_iomad_company_admin_delete_companies');
      params.append('companyids[0]', String(schoolId));
      
      const response = await api.post('', params);

      return response.data && response.data[0] && response.data[0].success;
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
      const params = new URLSearchParams();
      params.append('wsfunction', 'block_iomad_company_admin_create_departments');
      params.append('departments[0][companyid]', String(schoolId));
      params.append('departments[0][name]', departmentData.name);
      params.append('departments[0][shortname]', departmentData.shortname);
      params.append('departments[0][parent]', departmentData.parent || '0');

      const response = await api.post('', params);

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
      return response.data?.courses || [];
    } catch (error) {
      console.error(`Error fetching courses for school ${schoolId}:`, error);
      return [];
    }
  },

  /**
   * Import schools from CSV data
   */
  async importSchools(csvData: string): Promise<any> {
    try {
      const params = new URLSearchParams();
      params.append('wsfunction', 'tool_iomad_import_import_companies');
      params.append('importdata', csvData);
      
      const response = await api.post('', params);

      return response.data;
    } catch (error) {
      console.error('Error importing schools:', error);
      throw new Error('Failed to import schools');
    }
  },

  /**
   * Get email templates for a school
   */
  async getEmailTemplates(schoolId?: number): Promise<any[]> {
    try {
      const response = await api.get('', {
        params: {
          wsfunction: 'block_iomad_company_admin_get_email_templates',
          companyid: schoolId,
        },
      });

      return response.data?.templates || [];
    } catch (error) {
      console.error('Error fetching email templates:', error);
      return [];
    }
  },

  /**
   * Update an email template
   */
  async updateEmailTemplate(templateId: number, templateData: any): Promise<any> {
    try {
      const params = new URLSearchParams();
      params.append('wsfunction', 'block_iomad_company_admin_update_email_templates');
      params.append('templates[0][id]', String(templateId));
      params.append('templates[0][subject]', templateData.subject);
      params.append('templates[0][body]', templateData.body);

      const response = await api.post('', params);

      return response.data;
    } catch (error) {
      console.error('Error updating email template:', error);
      throw new Error('Failed to update email template');
    }
  }
};