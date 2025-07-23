// src/services/apiService.ts
import axios from 'axios';
import { Course, School } from '../types';
import api from '../config/axiosConfig'; // Correctly import the 'api' instance from its source

const API_URL = import.meta.env.VITE_MOODLE_API_URL || 'https://iomad.bylinelms.com/webservice/rest/server.php';

export async function getAllCourses(): Promise<Course[]> {
  try {
    const params = new URLSearchParams();
    params.append('wstoken', '4a2ba2d6742afc7d13ce4cf486ba7633'); // <-- Replace with your real token
    params.append('wsfunction', 'core_course_get_courses_by_field');
    params.append('field', '');
    params.append('value', '');
    params.append('moodlewsrestformat', 'json');

    const { data } = await axios.post(API_URL, params);

    // Moodle error responses are objects with 'exception' field
    if (data && typeof data === 'object' && 'exception' in data) {
      throw new Error(
        `Moodle API Error: ${data.errorcode || ''} - ${data.message || 'Unknown error'}`
      );
    }

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
      courseimage: course.courseimage || (course.overviewfiles && course.overviewfiles[0]?.fileurl),
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

/**
 * Create a module (resource/activity) in a course using core_course_create_modules
 * @param moduleData - Object with courseid, modname, name, description, and other fields depending on type
 */
export async function createCourseModule(moduleData: any): Promise<any> {
  const url = API_URL;
  const params = new URLSearchParams();
  params.append('wstoken', '4a2ba2d6742afc7d13ce4cf486ba7633');
  params.append('wsfunction', 'core_course_create_modules');
  params.append('moodlewsrestformat', 'json');

  // Required fields
  params.append('modules[0][course]', String(moduleData.courseid));
  params.append('modules[0][modulename]', moduleData.modname);
  params.append('modules[0][name]', moduleData.name);
  if (moduleData.description) params.append('modules[0][description]', moduleData.description);

  // File resource
  if (moduleData.modname === 'resource' && moduleData.files && moduleData.files.length > 0) {
    // Attach uploaded file(s) by itemid
    params.append('modules[0][contents][0][type]', 'file');
    params.append('modules[0][contents][0][filename]', moduleData.files[0].filename);
    params.append('modules[0][contents][0][filepath]', moduleData.files[0].filepath);
    params.append('modules[0][contents][0][fileitemid]', String(moduleData.files[0].itemid));
  }

  // Page resource
  if (moduleData.modname === 'page' && moduleData.pagecontent) {
    params.append('modules[0][page][content]', moduleData.pagecontent);
  }

  // URL resource
  if (moduleData.modname === 'url' && moduleData.externalurl) {
    params.append('modules[0][externalurl]', moduleData.externalurl);
  }

  try {
    const response = await axios.post(url, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create course module');
  }
}

/**
 * Get all course contents (sections and modules) for a course
 */
export const getCourseContents = async (courseId: string) => {
    // 1. Get base structure from Moodle
    const baseContentsResponse = await axios.post(API_URL, new URLSearchParams({
        wstoken: '4a2ba2d6742afc7d13ce4cf486ba7633', // Replace with your real token
        wsfunction: 'core_course_get_contents',
        courseid: courseId,
        moodlewsrestformat: 'json'
    }));

    if (!Array.isArray(baseContentsResponse.data)) {
        return [];
    }

    // 2. Fetch rich content for specific module types in parallel
    const enrichedSections = await Promise.all(
        baseContentsResponse.data.map(async (section: any) => {
            if (!section.modules) {
                return section; // Return section as is if it has no modules
            }
            
            const enrichedModules = await Promise.all(
                section.modules.map(async (module: any) => {
                    // If it's a page, fetch its HTML content using a more reliable function
                    if (module.modname === 'page') {
                        try {
                            const pageData = await api.get('', { params: {
                                wsfunction: 'mod_page_view_page',
                                pageid: String(module.instance) // 'instance' is the ID of the page module itself
                            }});
                            // The content is directly in the response for this function
                            if (pageData.data && pageData.data.page) {
                                module.pagecontent = pageData.data.page.content;
                            }
                        } catch (e) {
                            console.warn(`Could not fetch content for page ${module.id}`, e);
                        }
                    }
                    
                    // For labels, the description IS the content. Let's sanitize and make it consistent.
                    if (module.modname === 'label' && module.description) {
                        module.renderedContent = module.description;
                    }

                    // For assignments, the description is the intro
                    if (module.modname === 'assign' && module.description) {
                        module.renderedContent = module.description;
                    }
                    
                    // For files and URLs, extract the primary URL for easy access
                    if ((module.modname === 'resource' || module.modname === 'url') && module.contents?.length > 0) {
                        module.mainUrl = module.contents[0].fileurl;
                        module.fileName = module.contents[0].filename;
                    }

                    return module;
                })
            );
            section.modules = enrichedModules;
            return section;
        })
    );

    return enrichedSections;
}; 