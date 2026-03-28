import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth';
import DashboardChat from './pages/DashboardChat';
import SIPExplorer from './pages/SIPExplorer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Auth mode="login" />} />
        <Route path="/signup" element={<Auth mode="signup" />} />
        <Route path="/demo" element={<Auth mode="demo" />} />
        <Route path="/chat" element={<DashboardChat />} />
        <Route path="/sips" element={<SIPExplorer />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
