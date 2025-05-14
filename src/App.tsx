import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Farmers from './pages/Farmers';
import Settings from './pages/Settings';
import MainLayout from './components/layout/MainLayout';
import AddFarmerForm from './components/farmers/AddFarmerForm';
import FarmerDetails from './pages/FarmerDetails';
import ProjectsPage from './pages/ProjectsPage';
import CreateProjectForm from './components/projects/createProjectForm';
import ProjectDetails from './pages/ProjectDetails';
import ProjectFarmerDetails from './components/projects/ProjectFarmerDetails';

import { AddFarmerModal } from './components/ProjectEnrollment/AddFarmerModal';
import CompanyManagement from './components/companyDashboard/CompanyManagement';
import VolunteerManagement from './components/VolunteerDashboard/VolunteerManagement';

import CompanyDashboardLayout from "./components/layout/CompanyDashboardLayout";
import CompanyProjectDetails from "./components/company/ProjectDetails";
import Analytics from "./components/company/Analytics";
import Reports from "./pages/Reports";
import Notifications from "./components/company/Notifications";
import CompanyOverview from './components/company/Overview';
import CompanyActivities from './components/company/CompanyActivities';
import CompanyReports from './components/company/CompanyReports';
import CompanyAnalytics from './components/company/CompanyAnalytics';
import CompanyProfile from './components/company/CompanyProfile';
import AttendanceReports from './pages/AttendanceReport';
import AdminAnalytics from './pages/AdminAnalytics';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="/" element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/farmers" element={<Farmers />} />
          <Route path='/projects' element={<ProjectsPage />} />
          <Route path="/settings" element={<Settings />} />
          
          <Route path='/create-farmer-form' element={<AddFarmerForm />} />
          <Route path="/farmer-details/:id" element={<FarmerDetails />} />
          <Route path='/create-project-form' element={<CreateProjectForm onSuccess={function (): void {
            throw new Error('Function not implemented.');
          } } />} />
          <Route path="/project-details/:id" element={<ProjectDetails />} />
          <Route path="/projects/:projectId/farmer-enrollment" element={<AddFarmerModal projectId={''} projectTitle={''} onClose={() => { }} onSuccess={() => { }} />} />
          <Route path="/project/:projectId/farmer/:farmerId" element={<ProjectFarmerDetails />} />
        
          {/* Companion routes */}
          <Route path="/companies" element={<CompanyManagement />} />

          {/* Volunteer routes */}
          <Route path="/volunteer-management" element={<VolunteerManagement />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/attendance-report" element={<AttendanceReports />} />
          <Route path="/analytics" element={<AdminAnalytics />} />


          <Route path="/data-collection" element={<ComingSoon title="Data Collection" />} />
          <Route path="/analytics" element={<ComingSoon title="Analytics" />} />
          <Route path="/training" element={<ComingSoon title="Training & Support" />} />
          <Route path="/market" element={<ComingSoon title="Market Connections" />} />
          <Route path="/partners" element={<ComingSoon title="Partners" />} />
          <Route path="/calendar" element={<ComingSoon title="Calendar" />} />
          <Route path="/help" element={<ComingSoon title="Help" />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/login" replace />} />
        {/* Company Dashboard */}
        <Route path="/company" element={<CompanyDashboardLayout />}>
          <Route path="overview" element={<CompanyOverview />} />
          <Route path="activities" element={<CompanyActivities />} />
          <Route path="analytics" element={<CompanyAnalytics />} />
          <Route path="company-reports" element={<CompanyReports />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="company-profile" element={<CompanyProfile />} />
        </Route>
      </Routes>
    </Router>
  );
}

// Temporary component for routes that are not yet implemented
const ComingSoon: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="text-center py-12">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h1>
      <p className="text-gray-500 dark:text-gray-400">This feature is coming soon!</p>
    </div>
  );
};

export default App;