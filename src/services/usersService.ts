import axios from 'axios';
import { User } from '../types';
import { contextApi } from '../config/axiosConfig';
 
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
 
export const usersService = {
  /**
   * Fetch all users from IOMAD
   */
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
          username: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          lastaccess: user.lastaccess,
          role: this.determineUserRole(user),
          department: user.department,
          company: user.institution,
          fullname: user.fullname || `${user.firstname} ${user.lastname}`,
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users from IOMAD');
    }
  },
 
  /**
   * Create a new user
   */
  async createUser(userData: any): Promise<any> {
    try {
      const params = new URLSearchParams();
      params.append('wsfunction', 'core_user_create_users');
      // Only include supported fields
      const user = {
        createpassword: userData.createpassword ?? 0,
        username: userData.username,
        auth: userData.auth || 'manual',
        password: userData.password,
        firstname: userData.firstname,
        lastname: userData.lastname,
        email: userData.email,
        maildisplay: userData.maildisplay ?? 2,
        city: userData.city || '',
        country: userData.country || '',
        timezone: userData.timezone || '99',
        description: userData.description || '',
        firstnamephonetic: userData.firstnamephonetic || '',
        lastnamephonetic: userData.lastnamephonetic || '',
        middlename: userData.middlename || '',
        alternatename: userData.alternatename || '',
        interests: userData.interests || '',
        idnumber: userData.idnumber || '',
        institution: userData.institution || '',
        department: userData.department || '',
        phone1: userData.phone1 || '',
        phone2: userData.phone2 || '',
        address: userData.address || '',
        lang: userData.lang || 'en',
        calendartype: userData.calendartype || '',
        theme: userData.theme || '',
        mailformat: userData.mailformat ?? 1,
        // customfields and preferences can be added if needed
      };
      Object.entries(user).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(`users[0][${key}]`, String(value));
        }
      });
      const response = await api.post('', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  },
 
  /**
   * Update an existing user
   */
  async updateUser(userId: string, userData: any): Promise<User> {
    try {
      const response = await api.post('', {
        wsfunction: 'core_user_update_users',
        users: [{
          id: userId,
          ...userData
        }]
      });
 
      // Fetch the updated user
      const updatedUser = await this.getUserById(userId);
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
  },
 
  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<User> {
    try {
      const response = await api.get('', {
        params: {
          wsfunction: 'core_user_get_users_by_field',
          field: 'id',
          values: [userId]
        },
      });
 
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        const user = response.data[0];
        return {
          id: user.id.toString(),
          username: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          lastaccess: user.lastaccess,
          role: this.determineUserRole(user),
          department: user.department,
          company: user.institution,
          fullname: user.fullname || `${user.firstname} ${user.lastname}`,
        };
      }
      throw new Error('User not found');
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new Error('Failed to fetch user');
    }
  },
 
  /**
   * Delete a user
   */
  async deleteUser(userId: string): Promise<boolean> {
    try {
      const response = await api.post('', {
        wsfunction: 'core_user_delete_users',
        userids: [userId]
      });
 
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user');
    }
  },
 
  /**
   * Suspend a user
   */
  async suspendUser(userId: string): Promise<boolean> {
    try {
      const response = await api.post('', {
        wsfunction: 'core_user_update_users',
        users: [{
          id: userId,
          suspended: 1
        }]
      });
 
      return true;
    } catch (error) {
      console.error('Error suspending user:', error);
      throw new Error('Failed to suspend user');
    }
  },
 
  /**
   * Activate a user
   */
  async activateUser(userId: string): Promise<boolean> {
    try {
      const response = await api.post('', {
        wsfunction: 'core_user_update_users',
        users: [{
          id: userId,
          suspended: 0
        }]
      });
 
      return true;
    } catch (error) {
      console.error('Error activating user:', error);
      throw new Error('Failed to activate user');
    }
  },
 
  /**
   * Bulk user action (suspend, activate, delete)
   */
  async bulkUserAction(userIds: string[], action: 'suspend' | 'activate' | 'delete'): Promise<boolean> {
    try {
      if (action === 'delete') {
        await api.post('', {
          wsfunction: 'core_user_delete_users',
          userids: userIds
        });
      } else {
        const users = userIds.map(id => ({
          id,
          suspended: action === 'suspend' ? 1 : 0
        }));
       
        await api.post('', {
          wsfunction: 'core_user_update_users',
          users
        });
      }
 
      return true;
    } catch (error) {
      console.error(`Error performing bulk ${action}:`, error);
      throw new Error(`Failed to ${action} users`);
    }
  },
 
  /**
   * Export users
   */
  async exportUsers(options: any = {}): Promise<boolean> {
    try {
      // In a real implementation, this would call an API endpoint
      // For now, we'll simulate a download
     
      const format = options.format || 'csv';
      const fields = options.fields || ['username', 'firstname', 'lastname', 'email'];
      const filters = options.filters || {};
     
      // Create a mock CSV content
      let content = fields.join(',') + '\n';
     
      // Add some mock data rows
      content += 'johndoe,John,Doe,john.doe@example.com\n';
      content += 'janesmith,Jane,Smith,jane.smith@example.com\n';
     
      // Create a blob and download it
      const blob = new Blob([content], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users_export.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
     
      return true;
    } catch (error) {
      console.error('Error exporting users:', error);
      throw new Error('Failed to export users');
    }
  },
 
  /**
   * Upload users from CSV
   */
  async uploadUsers(file: File): Promise<any> {
    try {
      // In a real implementation, this would upload the file to an API endpoint
      // For now, we'll simulate processing
     
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
     
      // Return mock results
      return {
        success: 15,
        warnings: 3,
        errors: 2,
        details: [
          { type: 'success', message: 'User john.doe successfully created' },
          { type: 'success', message: 'User jane.smith successfully created' },
          { type: 'warning', message: 'User mike.jones created but could not be assigned to department', line: 3 },
          { type: 'error', message: 'Invalid email format for user', line: 5 }
        ]
      };
    } catch (error) {
      console.error('Error uploading users:', error);
      throw new Error('Failed to upload users');
    }
  },
 
  /**
   * Download user template
   */
  async downloadUserTemplate(): Promise<boolean> {
    try {
      // Create a mock CSV template
      const fields = ['username', 'password', 'firstname', 'lastname', 'email', 'role', 'school', 'department', 'country', 'city'];
      const content = fields.join(',') + '\n' +
                     'johndoe,Password123!,John,Doe,john.doe@example.com,student,School A,Science,US,New York\n' +
                     'janesmith,Password456!,Jane,Smith,jane.smith@example.com,teacher,School B,Math,UK,London';
     
      // Create a blob and download it
      const blob = new Blob([content], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'user_upload_template.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
     
      return true;
    } catch (error) {
      console.error('Error downloading template:', error);
      throw new Error('Failed to download template');
    }
  },
 
  /**
   * Download upload results
   */
  async downloadUploadResults(results: any): Promise<boolean> {
    try {
      // Create a mock CSV with results
      let content = 'Status,Message,Line\n';
     
      results.details.forEach((detail: any) => {
        content += `${detail.type},${detail.message},${detail.line || ''}\n`;
      });
     
      // Create a blob and download it
      const blob = new Blob([content], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'upload_results.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
     
      return true;
    } catch (error) {
      console.error('Error downloading results:', error);
      throw new Error('Failed to download results');
    }
  },
 
  /**
   * Get departments
   */
  async getDepartments(): Promise<any[]> {
    try {
      // In a real implementation, this would call an API endpoint
      // For now, we'll return mock data
      return [
        { id: '1', name: 'Science', description: 'Science Department' },
        { id: '2', name: 'Math', description: 'Mathematics Department' },
        { id: '3', name: 'English', description: 'English Department' },
        { id: '4', name: 'History', description: 'History Department' }
      ];
    } catch (error) {
      console.error('Error fetching departments:', error);
      return [];
    }
  },
 
  /**
   * Get departments with users
   */
  async getDepartmentsWithUsers(): Promise<any[]> {
    try {
      // In a real implementation, this would call an API endpoint
      // For now, we'll return mock data
      return [
        {
          id: '1',
          name: 'Science',
          description: 'Science Department',
          parentId: null,
          managerId: '101',
          userCount: 3,
          users: [
            { id: '101', firstname: 'John', lastname: 'Doe', email: 'john.doe@example.com', role: 'manager', isManager: true },
            { id: '102', firstname: 'Jane', lastname: 'Smith', email: 'jane.smith@example.com', role: 'teacher', isManager: false },
            { id: '103', firstname: 'Mike', lastname: 'Johnson', email: 'mike.johnson@example.com', role: 'teacher', isManager: false }
          ],
          children: [
            {
              id: '5',
              name: 'Biology',
              description: 'Biology Sub-Department',
              parentId: '1',
              userCount: 2,
              users: [
                { id: '104', firstname: 'Sarah', lastname: 'Williams', email: 'sarah.williams@example.com', role: 'teacher', isManager: false },
                { id: '105', firstname: 'David', lastname: 'Brown', email: 'david.brown@example.com', role: 'teacher', isManager: false }
              ],
              children: []
            }
          ]
        },
        {
          id: '2',
          name: 'Math',
          description: 'Mathematics Department',
          parentId: null,
          managerId: '201',
          userCount: 2,
          users: [
            { id: '201', firstname: 'Robert', lastname: 'Davis', email: 'robert.davis@example.com', role: 'manager', isManager: true },
            { id: '202', firstname: 'Emily', lastname: 'Wilson', email: 'emily.wilson@example.com', role: 'teacher', isManager: false }
          ],
          children: []
        },
        {
          id: '3',
          name: 'English',
          description: 'English Department',
          parentId: null,
          userCount: 2,
          users: [
            { id: '301', firstname: 'James', lastname: 'Taylor', email: 'james.taylor@example.com', role: 'teacher', isManager: false },
            { id: '302', firstname: 'Emma', lastname: 'Martin', email: 'emma.martin@example.com', role: 'teacher', isManager: false }
          ],
          children: []
        }
      ];
    } catch (error) {
      console.error('Error fetching departments with users:', error);
      return [];
    }
  },
 
  /**
   * Assign department manager
   */
  async assignDepartmentManager(departmentId: string, userId: string): Promise<boolean> {
    try {
      // In a real implementation, this would call an API endpoint
      // For now, we'll simulate success
      return true;
    } catch (error) {
      console.error('Error assigning department manager:', error);
      throw new Error('Failed to assign department manager');
    }
  },
 
  /**
   * Remove user from department
   */
  async removeUserFromDepartment(departmentId: string, userId: string): Promise<boolean> {
    try {
      // In a real implementation, this would call an API endpoint
      // For now, we'll simulate success
      return true;
    } catch (error) {
      console.error('Error removing user from department:', error);
      throw new Error('Failed to remove user from department');
    }
  },
 
  /**
   * Assign users to school/company using Iomad API
   */
  async assignUsersToSchool(users: Array<{
    userid: number;
    companyid: number;
    departmentid?: number;
    managertype?: number;
    educator?: number;
  }>): Promise<boolean> {
    try {
      const params = new URLSearchParams();
      params.append('wsfunction', 'block_iomad_company_admin_assign_users');
      // Build the users array in the required format
      users.forEach((user, idx) => {
        params.append(`users[${idx}][userid]`, String(user.userid));
        params.append(`users[${idx}][companyid]`, String(user.companyid));
        params.append(`users[${idx}][departmentid]`, String(user.departmentid ?? 0));
        params.append(`users[${idx}][managertype]`, String(user.managertype ?? 0));
        params.append(`users[${idx}][educator]`, String(user.educator ?? 0));
      });
      const response = await api.post('', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      // If no exception, consider it success
      if (response.data && !response.data.exception) {
        return true;
      }
      throw new Error(response.data?.message || 'Failed to assign users to school');
    } catch (error) {
      console.error('Error assigning users to school:', error);
      throw new Error('Failed to assign users to school');
    }
  },
 
  /**
   * Get training events
   */
  async getTrainingEvents(): Promise<any[]> {
    try {
      // In a real implementation, this would call an API endpoint
      // For now, we'll return mock data
      return [
        {
          id: '1',
          title: 'Advanced Teaching Methods',
          description: 'Workshop on modern teaching methodologies and classroom management',
          startDate: '2024-01-15T10:00:00',
          endDate: '2024-01-15T16:00:00',
          location: 'Main Campus, Room 101',
          capacity: 30,
          attendees: 25,
          status: 'pending',
          requestedBy: 'John Doe',
          requestDate: '2024-01-05T09:30:00'
        },
        {
          id: '2',
          title: 'Digital Learning Tools',
          description: 'Introduction to digital tools for enhanced learning experiences',
          startDate: '2024-01-20T09:00:00',
          endDate: '2024-01-20T15:00:00',
          location: 'Technology Center',
          capacity: 25,
          attendees: 20,
          status: 'approved',
          requestedBy: 'Jane Smith',
          requestDate: '2024-01-02T14:15:00'
        },
        {
          id: '3',
          title: 'Assessment Strategies',
          description: 'Effective assessment techniques for diverse learning environments',
          startDate: '2024-01-25T13:00:00',
          endDate: '2024-01-25T17:00:00',
          location: 'Virtual Classroom A',
          capacity: 40,
          attendees: 15,
          status: 'pending',
          requestedBy: 'Mike Johnson',
          requestDate: '2024-01-10T11:45:00'
        },
        {
          id: '4',
          title: 'Inclusive Education Practices',
          description: 'Strategies for creating inclusive learning environments',
          startDate: '2024-02-05T10:00:00',
          endDate: '2024-02-05T15:00:00',
          location: 'Conference Hall',
          capacity: 35,
          attendees: 30,
          status: 'rejected',
          requestedBy: 'Sarah Williams',
          requestDate: '2024-01-08T16:20:00'
        },
        {
          id: '5',
          title: 'STEM Education Workshop',
          description: 'Hands-on activities for teaching STEM subjects',
          startDate: '2024-02-10T09:30:00',
          endDate: '2024-02-10T16:30:00',
          location: 'Science Lab',
          capacity: 20,
          attendees: 18,
          status: 'pending',
          requestedBy: 'David Brown',
          requestDate: '2024-01-12T10:10:00'
        }
      ];
    } catch (error) {
      console.error('Error fetching training events:', error);
      return [];
    }
  },
 
  /**
   * Get pending training events
   */
  async getPendingTrainingEvents(): Promise<any[]> {
    try {
      const events = await this.getTrainingEvents();
      return events.filter(event => event.status === 'pending');
    } catch (error) {
      console.error('Error fetching pending training events:', error);
      return [];
    }
  },
 
  /**
   * Approve training event
   */
  async approveTrainingEvent(eventId: string): Promise<boolean> {
    try {
      // In a real implementation, this would call an API endpoint
      // For now, we'll simulate success
      return true;
    } catch (error) {
      console.error('Error approving training event:', error);
      throw new Error('Failed to approve training event');
    }
  },
 
  /**
   * Reject training event
   */
  async rejectTrainingEvent(eventId: string): Promise<boolean> {
    try {
      // In a real implementation, this would call an API endpoint
      // For now, we'll simulate success
      return true;
    } catch (error) {
      console.error('Error rejecting training event:', error);
      throw new Error('Failed to reject training event');
    }
  },
 
  /**
   * Get user roles
   */
  async getUserRoles(): Promise<string[]> {
    try {
      // In a real implementation, this would call an API endpoint
      // For now, we'll return mock data
      return ['student', 'teacher', 'editingteacher', 'manager', 'coursecreator', 'admin'];
    } catch (error) {
      console.error('Error fetching user roles:', error);
      return [];
    }
  },
 
  /**
   * Helper method to determine user role from user data
   */
  determineUserRole(userData: any): import('../types').UserRole | undefined {
    // In a real implementation, this would use role data from the API
    // For now, we'll use a simple heuristic
    if (userData.username?.includes('admin')) {
      return 'admin';
    } else if (userData.username?.includes('teacher')) {
      return 'teacher';
    } else if (userData.username?.includes('trainer')) {
      return 'trainer';
    } else if (userData.username?.includes('principal')) {
      return 'principal';
    } else if (userData.username?.includes('cluster_lead')) {
      return 'cluster_lead';
    } else {
      return undefined;
    }
  },
 
  /**
   * Assign a role to a user at system context using the custom web service
   */
  async assignRoleViaWebService({ userid, roleid }: { userid: number, roleid: number }): Promise<any> {
    try {
      const params = new URLSearchParams();
      params.append('wstoken', import.meta.env.VITE_ROLE_ASSIGNER_TOKEN || '');
      params.append('wsfunction', 'local_roleassigner_assign_role');
      params.append('moodlewsrestformat', 'json');
      params.append('userid', String(userid));
      params.append('roleid', String(roleid));
      params.append('contextid', '1');
      const response = await contextApi.post('/webservice/rest/server.php', params);
      return response.data;
    } catch (error) {
      console.error('Error assigning role via web service:', error);
      throw new Error('Failed to assign role via web service');
    }
  },
 
  /**
   * Assign a role to a user in a company context (stub for now)
   */
  async assignRoleToUser({ userid, role, companyid }: { userid: number, role: string, companyid: number }): Promise<boolean> {
    // TODO: Implement this using the correct Iomad/Moodle API for role assignment in company context
    // This may require enrol_manual_enrol_users for courses, or a custom API for company roles
    console.log('Assigning role', role, 'to user', userid, 'in company', companyid);
    return true;
  },
 
  /**
   * Fetch monthly calendar events for a trainer (user)
   */
  async getTrainerMonthlyCalendar({ userId, year, month }: { userId: string, year: number, month: number }) {
    const params = new URLSearchParams();
    params.append('wstoken', '4a2ba2d6742afc7d13ce4cf486ba7633');
    params.append('wsfunction', 'core_calendar_get_calendar_monthly_view');
    params.append('moodlewsrestformat', 'json');
    params.append('year', String(year));
    params.append('month', String(month));
    params.append('courseid', '1');
    params.append('includenavigation', '1');
    // Optionally, add userId as a custom param if your Moodle setup supports it
    // params.append('userid', userId);
    try {
      const response = await fetch('https://iomad.bylinelms.com/webservice/rest/server.php', {
        method: 'POST',
        body: params,
      });
      const data = await response.json();
      // Flatten all events from all days in all weeks
      const events: any[] = [];
      if (data.weeks && Array.isArray(data.weeks)) {
        data.weeks.forEach((week: any) => {
          if (week.days && Array.isArray(week.days)) {
            week.days.forEach((day: any) => {
              if (day.events && Array.isArray(day.events)) {
                day.events.forEach((event: any) => {
                  events.push({
                    id: event.id,
                    name: event.name,
                    description: event.description,
                    location: event.location,
                    timestart: event.timestart,
                    timeduration: event.timeduration,
                    eventtype: event.eventtype,
                    timesort: event.timesort,
                    visible: event.visible,
                    formattedtime: event.formattedtime,
                    formattedlocation: event.formattedlocation,
                    course: event.course,
                    category: event.category,
                    icon: event.icon,
                    url: event.url,
                  });
                });
              }
            });
          }
        });
      }
      return events;
    } catch (error) {
      console.error('Error fetching trainer monthly calendar:', error);
      return [];
    }
  },
 
  /**
   * Fetch all activities and events for a trainer for the current week
   */
  async getTrainerWeekActivitiesAndEvents({ userId, year, month, weekStart, weekEnd }: { userId: string, year: number, month: number, weekStart: number, weekEnd: number }) {
    // 1. Fetch all calendar events for the month
    const calendarEvents = await this.getTrainerMonthlyCalendar({ userId, year, month });
    // 2. Fetch all action activities for the week
    const params = new URLSearchParams();
    params.append('wstoken', '4a2ba2d6742afc7d13ce4cf486ba7633');
    params.append('wsfunction', 'core_calendar_get_action_events_by_timesort');
    params.append('moodlewsrestformat', 'json');
    params.append('timesortfrom', String(weekStart));
    params.append('timesortto', String(weekEnd));
    params.append('limitnum', '100');
    params.append('userid', userId);
    let activities = [];
    try {
      const response = await fetch('https://iomad.bylinelms.com/webservice/rest/server.php', {
        method: 'POST',
        body: params,
      });
      const data = await response.json();
      activities = (data.events || []).map((event: any) => ({
        id: event.id,
        name: event.name,
        description: event.description,
        location: event.location,
        timestart: event.timestart,
        timeduration: event.timeduration,
        eventtype: event.eventtype,
        timesort: event.timesort,
        visible: event.visible,
        formattedtime: event.formattedtime,
        formattedlocation: event.formattedlocation,
        type: 'activity',
      }));
    } catch (error) {
      console.error('Error fetching trainer week activities:', error);
    }
    // 3. Filter calendar events for the week
    const weekEvents = calendarEvents.filter((event: any) => event.timestart >= weekStart && event.timestart < weekEnd)
      .map((event: any) => ({ ...event, type: 'event' }));
    // 4. Merge and sort by timestart
    const all = [...weekEvents, ...activities].sort((a, b) => a.timestart - b.timestart);
    console.log('Merged week activities and events:', all);
    return all;
  },
};