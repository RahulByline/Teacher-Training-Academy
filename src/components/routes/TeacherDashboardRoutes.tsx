import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { TeacherDashboard } from '../dashboards/TeacherDashboard';
import CoursesPage from '../pages/CoursesPage';
import LearningPage from '../pages/LearningPage';
import CertificationsPage from '../pages/CertificationsPage';
import AssessmentsPage from '../pages/AssessmentsPage';
import AchievementsPage from '../pages/AchievementsPage';
import CommunityPage from '../pages/CommunityPage';
import TrainerSettingsPage from '../pages/TrainerSettingsPage';
import TeacherDashboardMainPage from '../pages/teacher/TeacherDashboardMainPage';
import TeacherLearningPathsPage from '../pages/teacher/TeacherLearningPathsPage';
import TeacherCompetencyMapPage from '../pages/teacher/TeacherCompetencyMapPage';
import TeacherPeerNetworkPage from '../pages/teacher/TeacherPeerNetworkPage';
import TeacherLeaderboardsPage from '../pages/teacher/TeacherLeaderboardsPage';
import TeacherDiscussionForumsPage from '../pages/teacher/TeacherDiscussionForumsPage';
import TeacherResourceLibraryPage from '../pages/teacher/TeacherResourceLibraryPage';
import TeacherProfilePage from '../pages/teacher/TeacherProfilePage';
import TeacherNotificationsPage from '../pages/teacher/TeacherNotificationsPage';

const TeacherDashboardRoutes: React.FC = () => (
  <Routes>
    <Route path="" element={<TeacherDashboard />}> {/* Dashboard main overview */}
      <Route index element={<TeacherDashboardMainPage />} />
      <Route path="dashboard" element={<TeacherDashboardMainPage />} />
      <Route path="my-learning" element={<LearningPage />} />
      <Route path="courses" element={<CoursesPage />} />
      <Route path="learning-paths" element={<TeacherLearningPathsPage />} />
      <Route path="certifications" element={<CertificationsPage />} />
      <Route path="assessments" element={<AssessmentsPage />} />
      <Route path="competency-map" element={<TeacherCompetencyMapPage />} />
      <Route path="achievements" element={<AchievementsPage />} />
      <Route path="community" element={<CommunityPage />} />
      <Route path="community/peer-network" element={<TeacherPeerNetworkPage />} />
      <Route path="community/leaderboards" element={<TeacherLeaderboardsPage />} />
      <Route path="community/discussion-forums" element={<TeacherDiscussionForumsPage />} />
      <Route path="community/resource-library" element={<TeacherResourceLibraryPage />} />
      <Route path="settings" element={<TrainerSettingsPage />} />
      <Route path="settings/profile" element={<TeacherProfilePage />} />
      <Route path="settings/notifications" element={<TeacherNotificationsPage />} />
      <Route path="*" element={<Navigate to="" replace />} />
    </Route>
  </Routes>
);

export default TeacherDashboardRoutes; 