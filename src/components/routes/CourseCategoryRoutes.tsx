import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { DashboardLayout } from '../layout/DashboardLayout';
import { ManageCoursesCategories } from '../dashboards/admin/ManageCoursesCategories';
import { UserEnrolmentsPage } from '../pages/courses/UserEnrolmentsPage';
import { IomadSettingsPage } from '../pages/courses/IomadSettingsPage';
import { AssignToSchoolPage } from '../pages/courses/AssignToSchoolPage';
import { SchoolGroupsPage } from '../pages/courses/SchoolGroupsPage';
import { AssignCourseGroupsPage } from '../pages/courses/AssignCourseGroupsPage';
import { TeachingLocationsPage } from '../pages/courses/TeachingLocationsPage';
import { LearningPathsPage } from '../pages/courses/LearningPathsPage';
import ManageCoursesContent from '../pages/courses/ManageCoursesContent';
import ManageCourseContentPage from '../pages/courses/ManageCourseContentPage';
import AddCategoryPage from '../../pages/AddCategoryPage';

export const CourseCategoryRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="" element={<DashboardLayout><Outlet /></DashboardLayout>}>
        <Route index element={<ManageCoursesCategories onSectionChange={() => {}} />} />
        <Route path="user-enrolments" element={<UserEnrolmentsPage />} />
        <Route path="iomad-settings" element={<IomadSettingsPage />} />
        <Route path="assign-to-school" element={<AssignToSchoolPage />} />
        <Route path="school-groups" element={<SchoolGroupsPage />} />
        <Route path="assign-course-groups" element={<AssignCourseGroupsPage />} />
        <Route path="teaching-locations" element={<TeachingLocationsPage />} />
        <Route path="learning-paths" element={<LearningPathsPage />} />
        <Route path="manage-content" element={<ManageCoursesContent />} />
        <Route path="manage-content/:courseId" element={<ManageCourseContentPage />} />
        <Route path="add-category" element={<AddCategoryPage />} />
        <Route path="*" element={<Navigate to="/courses-categories" replace />} />
      </Route>
    </Routes>
  );
};