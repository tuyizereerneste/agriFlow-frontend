import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Farmers from './pages/Farmers';
import Settings from './pages/Settings';
import MainLayout from './components/layout/MainLayout';

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
          <Route path="/settings" element={<Settings />} />
          
          {/* Placeholder routes for future implementation */}
          <Route path="/data-collection" element={<ComingSoon title="Data Collection" />} />
          <Route path="/analytics" element={<ComingSoon title="Analytics" />} />
          <Route path="/training" element={<ComingSoon title="Training & Support" />} />
          <Route path="/market" element={<ComingSoon title="Market Connections" />} />
          <Route path="/partners" element={<ComingSoon title="Partners" />} />
          <Route path="/calendar" element={<ComingSoon title="Calendar" />} />
          <Route path="/help" element={<ComingSoon title="Help" />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/login" replace />} />
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