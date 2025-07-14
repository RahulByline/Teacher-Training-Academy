// src/services/apiService.ts
import axios from 'axios';
import { Course, School } from '../types';

const API_URL = import.meta.env.VITE_MOODLE_API_URL;

export async function getAllCourses(): Promise<Course[]> {
  try {
    const params = new URLSearchParams();
    params.append('wstoken', '4a2ba2d6742afc7d13ce4cf486ba7633'); // <-- Replace with your real token
    params.append('wsfunction', 'core_course_get_courses');
    params.append('moodlewsrestformat', 'json');
    // No options[ids] to fetch all courses

    const { data } = await axios.post(API_URL, params);

    // Moodle error responses are objects with 'exception' field
    if (data && typeof data === 'object' && 'exception' in data) {
      throw new Error(
        `Moodle API Error: ${data.errorcode || ''} - ${data.message || 'Unknown error'}`
      );
    }

    // FIX: Use data.courses
    if (!data || !Array.isArray(data.courses)) {
      throw new Error('Invalid response format from Moodle API');
    }

    return data.courses.map((course: any) => ({
      id: course.id,
      fullname: course.fullname,
      shortname: course.shortname,
      summary: course.summary,
      visible: course.visible,
      categoryid: course.categoryid,
      categoryname: course.categoryname,
      startdate: course.startdate,
      enddate: course.enddate,
      // add other fields as needed
    }));
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch courses');
  }
}

// Fetch all companies (schools) from Iomad
export const getAllCompanies = async () => {
  const url = 'https://iomad.bylinelms.com/webservice/rest/server.php';
  const params = new URLSearchParams();
  params.append('wstoken', '4a2ba2d6742afc7d13ce4cf486ba7633');
  params.append('wsfunction', 'block_iomad_company_admin_get_companies');
  params.append('moodlewsrestformat', 'json');
  params.append('criteria[0][key]', 'name');
  params.append('criteria[0][value]', '');

  const response = await axios.post(url, params);
  return response.data.companies || [];
};

export async function getAllSchools() {
  const response = await axios.post(API_URL, new URLSearchParams({
    wstoken: '4a2ba2d6742afc7d13ce4cf486ba7633', // Replace with your real token
    wsfunction: 'block_iomad_company_admin_get_companies',
    moodlewsrestformat: 'json'
  }));

  if (!response || !response.data) {
    throw new Error('Network error while fetching schools');
  }

  // Usually: { companies: [...] }
  return response.data.companies || [];
}

/**
 * Create a new school/company in Iomad/Moodle
 * @param schoolData - Object with school/company fields (name, shortname, country, city, etc.)
 * @returns The created company object from the API
 */
export async function createSchool(schoolData: {
  name: string;
  shortname: string;
  country: string;
  city?: string;
  address?: string;
  region?: string;
  postcode?: string;
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
  parentid?: number;
  customcss?: string;
  validto?: string | null;
  suspendafter?: number;
  companyterminated?: number;
  theme?: string;
  hostname?: string;
  maxusers?: number;
  maincolor?: string;
  headingcolor?: string;
  linkcolor?: string;
  custom1?: string | null;
  custom2?: string | null;
  custom3?: string | null;
}) {
  const url = 'https://iomad.bylinelms.com/webservice/rest/server.php';
  const params = new URLSearchParams();
  params.append('wstoken', '4a2ba2d6742afc7d13ce4cf486ba7633');
  params.append('wsfunction', 'block_iomad_company_admin_create_companies');
  params.append('moodlewsrestformat', 'json');

  // Required fields
  params.append('companies[0][name]', schoolData.name);
  params.append('companies[0][shortname]', schoolData.shortname);
  params.append('companies[0][country]', schoolData.country);
  if (schoolData.city) params.append('companies[0][city]', schoolData.city);
  if (schoolData.address) params.append('companies[0][address]', schoolData.address);
  if (schoolData.region) params.append('companies[0][region]', schoolData.region);
  if (schoolData.postcode) params.append('companies[0][postcode]', schoolData.postcode);
  if (schoolData.maildisplay !== undefined) params.append('companies[0][maildisplay]', String(schoolData.maildisplay));
  if (schoolData.mailformat !== undefined) params.append('companies[0][mailformat]', String(schoolData.mailformat));
  if (schoolData.maildigest !== undefined) params.append('companies[0][maildigest]', String(schoolData.maildigest));
  if (schoolData.autosubscribe !== undefined) params.append('companies[0][autosubscribe]', String(schoolData.autosubscribe));
  if (schoolData.trackforums !== undefined) params.append('companies[0][trackforums]', String(schoolData.trackforums));
  if (schoolData.htmleditor !== undefined) params.append('companies[0][htmleditor]', String(schoolData.htmleditor));
  if (schoolData.screenreader !== undefined) params.append('companies[0][screenreader]', String(schoolData.screenreader));
  if (schoolData.timezone) params.append('companies[0][timezone]', schoolData.timezone);
  if (schoolData.lang) params.append('companies[0][lang]', schoolData.lang);
  if (schoolData.suspended !== undefined) params.append('companies[0][suspended]', String(schoolData.suspended));
  if (schoolData.ecommerce !== undefined) params.append('companies[0][ecommerce]', String(schoolData.ecommerce));
  if (schoolData.parentid !== undefined) params.append('companies[0][parentid]', String(schoolData.parentid));
  if (schoolData.customcss) params.append('companies[0][customcss]', schoolData.customcss);
  if (schoolData.validto) params.append('companies[0][validto]', schoolData.validto);
  if (schoolData.suspendafter !== undefined) params.append('companies[0][suspendafter]', String(schoolData.suspendafter));
  if (schoolData.companyterminated !== undefined) params.append('companies[0][companyterminated]', String(schoolData.companyterminated));
  if (schoolData.theme) params.append('companies[0][theme]', schoolData.theme);
  if (schoolData.hostname) params.append('companies[0][hostname]', schoolData.hostname);
  if (schoolData.maxusers !== undefined) params.append('companies[0][maxusers]', String(schoolData.maxusers));
  if (schoolData.maincolor) params.append('companies[0][maincolor]', schoolData.maincolor);
  if (schoolData.headingcolor) params.append('companies[0][headingcolor]', schoolData.headingcolor);
  if (schoolData.linkcolor) params.append('companies[0][linkcolor]', schoolData.linkcolor);
  if (schoolData.custom1) params.append('companies[0][custom1]', schoolData.custom1);
  if (schoolData.custom2) params.append('companies[0][custom2]', schoolData.custom2);
  if (schoolData.custom3) params.append('companies[0][custom3]', schoolData.custom3);

  try {
    const response = await axios.post(url, params);
    if (response.data && Array.isArray(response.data) && response.data[0].id) {
      return response.data[0];
    }
    throw new Error('Failed to create school: Invalid response');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create school');
  }
}

/**
 * Create a new course category in Moodle/Iomad
 * @param categoryData - Object with category fields (name, parent, idnumber, description, descriptionformat)
 * @returns The created category object from the API
 */
export async function createCategory(categoryData: {
  name: string;
  parent?: number;
  idnumber?: string;
  description?: string;
  descriptionformat?: number;
}) {
  const url = API_URL;
  const params = new URLSearchParams();
  params.append('wstoken', '4a2ba2d6742afc7d13ce4cf486ba7633'); // <-- Replace with your real token
  params.append('wsfunction', 'core_course_create_categories');
  params.append('moodlewsrestformat', 'json');

  params.append('categories[0][name]', categoryData.name);
  params.append('categories[0][parent]', String(categoryData.parent ?? 0));
  if (categoryData.idnumber) params.append('categories[0][idnumber]', categoryData.idnumber);
  if (categoryData.description) params.append('categories[0][description]', categoryData.description);
  if (categoryData.descriptionformat !== undefined) params.append('categories[0][descriptionformat]', String(categoryData.descriptionformat));

  try {
    const response = await axios.post(url, params);
    console.log('Category API response:', response.data); // Debug log
    if (response.data && Array.isArray(response.data) && response.data[0].id) {
      return response.data[0];
    }
    throw new Error('Failed to create category: Invalid response');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create category');
  }
} 