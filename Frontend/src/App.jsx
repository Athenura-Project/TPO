import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import UserLogin from "./pages/auth/UserLogin";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import FAQPage from "./pages/FAQPage"; 
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Contact from "./pages/Contact";


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#F5F5F5] font-sans antialiased text-[#121212]">
        <Routes>
          {/* Public Route: Landing Page */}
          <Route path="/" element={<LandingPage />} />
          {/* Static Pages Routes */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/faq" element={<FAQPage />} />{" "}
          {/* FAQ Route add kar diya */}
          {/* Auth Routes (Login/Register) - Inhe baad mein setup kar sakte hain */}
          <Route path="/login" element={<UserLogin />} />
          {/* about page */}
          <Route path="/about" element={<About />} />
          {/* contact page */}
          <Route path="/contact" element={<Contact />} />
          {/* Fallback Route (404 Page)*/}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
