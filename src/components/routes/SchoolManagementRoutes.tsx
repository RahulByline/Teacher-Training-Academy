import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../layout/DashboardLayout';
import { ManageSchools } from '../dashboards/admin/ManageSchools';
import { CreateSchoolPage } from '../pages/schools/CreateSchoolPage';
import { EditSchoolPage } from '../pages/schools/EditSchoolPage';
import { AdvancedSchoolSettings } from '../pages/schools/AdvancedSchoolSettings';
import { ManageSchoolsPage } from '../pages/schools/ManageSchoolsPage';
import { ManageDepartments } from '../pages/schools/ManageDepartments';
import { OptionalProfiles } from '../pages/schools/OptionalProfiles';
import { RestrictCapabilities } from '../pages/schools/RestrictCapabilities';
import { ImportSchools } from '../pages/schools/ImportSchools';
import { EmailTemplates } from '../pages/schools/EmailTemplates';

export const SchoolManagementRoutes: React.FC = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<ManageSchools />} />
        <Route path="create" element={<CreateSchoolPage />} />
        <Route path="edit/:id?" element={<EditSchoolPage />} />
        <Route path="view/:id" element={<EditSchoolPage />} />
        <Route path="advanced" element={<AdvancedSchoolSettings />} />
        <Route path="manage" element={<ManageSchoolsPage />} />
        <Route path="departments" element={<ManageDepartments />} />
        <Route path="profiles" element={<OptionalProfiles />} />
        <Route path="capabilities" element={<RestrictCapabilities />} />
        <Route path="import" element={<ImportSchools />} />
        <Route path="templates" element={<EmailTemplates />} />
        <Route path="*" element={<Navigate to="/add-school" replace />} />
      </Routes>
    </DashboardLayout>
  );
};