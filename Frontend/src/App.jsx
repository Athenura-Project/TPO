import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import UserLogin from './pages/auth/UserLogin';

// Note: Baad mein jab Admin aur Intern dashboards ban jayenge, 
// unhe yahan import karke routes mein add kar dena. 

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#F5F5F5] font-sans antialiased text-[#121212]">
        <Routes>
          {/* Public Route: Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth Routes (Login/Register) - Inhe baad mein setup kar sakte hain */}
          <Route path="/login" element={<UserLogin />} />

          {/* Fallback Route: Redirect to Home if path doesn't exist */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;