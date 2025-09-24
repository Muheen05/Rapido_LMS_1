import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';
import LeaderboardView from './views/LeaderboardView';
import NewAuditView from './views/NewAuditView';
import SkillUpView from './views/SkillUpView';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AuthProvider>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { agent } = useAuth();
    if (!agent) {
        return <Navigate to="/" replace />;
    }
    return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { agent } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {agent && <Navbar />}
      <main className="flex-grow container mx-auto p-6 md:p-10">
        <Routes>
          <Route path="/" element={agent ? <Navigate to="/dashboard" /> : <LoginView />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardView /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardView /></ProtectedRoute>} />
          <Route path="/skill-up" element={<ProtectedRoute><SkillUpView /></ProtectedRoute>} />
          <Route path="/new-audit" element={<ProtectedRoute><NewAuditView /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
};

export default App;