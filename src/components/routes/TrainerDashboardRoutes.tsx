import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { TrainerDashboard } from '../dashboards/TrainerDashboard';
import SchedulePage from '../pages/SchedulePage';
import CoursesPage from '../pages/CoursesPage';
import TraineesPage from '../pages/TraineesPage';
import AssessmentsPage from '../pages/AssessmentsPage';
import FeedbackPage from '../pages/FeedbackPage';
import CertificationsPage from '../pages/CertificationsPage';
import RoadmapPage from '../pages/RoadmapPage';
import LearningPage from '../pages/LearningPage';
import AchievementsPage from '../pages/AchievementsPage';
import MaterialsPage from '../pages/MaterialsPage';
import CommunityPage from '../pages/CommunityPage';
import TrainerSettingsPage from '../pages/TrainerSettingsPage';
import AccountSettingsPage from '../dashboards/AccountSettingsPage';

const TrainerDashboardRoutes: React.FC = () => (
  <Routes>
    <Route path="" element={<TrainerDashboard />}> {/* Dashboard main overview */}
      <Route index element={null} />
      <Route path="schedule" element={<SchedulePage />} />
      <Route path="courses" element={<CoursesPage />} />
      <Route path="trainees" element={<TraineesPage />} />
      <Route path="assessments" element={<AssessmentsPage />} />
      <Route path="feedback" element={<FeedbackPage />} />
      <Route path="certifications" element={<CertificationsPage />} />
      <Route path="roadmap" element={<RoadmapPage />} />
      <Route path="learning" element={<LearningPage />} />
      <Route path="achievements" element={<AchievementsPage />} />
      <Route path="materials" element={<MaterialsPage />} />
      <Route path="community" element={<CommunityPage />} />
      <Route path="settings" element={<TrainerSettingsPage />} />
      <Route path="settings/:traineeId" element={<AccountSettingsPage />} />
      <Route path="*" element={<Navigate to="" replace />} />
    </Route>
  </Routes>
);

export default TrainerDashboardRoutes; 