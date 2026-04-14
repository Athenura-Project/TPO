import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import UserLogin from "./pages/auth/UserLogin";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import FAQPage from "./pages/FAQPage"; 
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Contact from "./pages/Contact";

// Admin dashboard
import AdminDashboard from "./pages/Adminpage/Dashboard";
import AdminInternManagement from "./pages/Adminpage/InternManagement";
import AdminTpo from "./pages/Adminpage/Tpo";
import AdminAllocation from "./pages/Adminpage/Allocation";
import AdminAnalytics from "./pages/Adminpage/Analytics";
import AdminBulk from "./pages/Adminpage/BulkImportPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#F5F5F5] font-sans antialiased text-[#121212]">
        <Routes>
          {/* Public Route: Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Static Pages Routes */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/faq" element={<FAQPage />} />
          
          {/* Auth Routes (Login/Register) */}
          <Route path="/login" element={<UserLogin />} />
          
          {/* Main Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* 🚀 Admin Dashboard Route */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/intern" element={<AdminInternManagement />} />
           <Route path="/admin/tpo" element={<AdminTpo />} />
           <Route path="/admin/allocation" element={<AdminAllocation />} />
           <Route path="/admin/analytics" element={<AdminAnalytics />} />
           <Route path="/admin/bulk/import" element={<AdminBulk />} />


           {/*  */}
          {/* Fallback Route (404 Page) - Ye hamesha last mein hona chahiye */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;