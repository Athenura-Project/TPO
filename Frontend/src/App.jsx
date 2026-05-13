// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// // Public pages
// import LandingPage from "./pages/LandingPage";
// import UserLogin from "./pages/auth/UserLogin";
// import PrivacyPolicy from "./pages/PrivacyPolicy";
// import FAQPage from "./pages/FAQPage";
// import NotFound from "./pages/NotFound";
// import About from "./pages/About";
// import Contact from "./pages/Contact";

// // Intern
// import InternDashboard from "./pages/internPage";

// // Admin pages
// import AdminDashboard from "./pages/Adminpage/Dashboard";
// import AdminInternManagement from "./pages/Adminpage/InternManagement";
// import AdminTpo from "./pages/Adminpage/Tpo";
// import AdminAllocation from "./pages/Adminpage/Allocation";
// import AdminAnalytics from "./pages/Adminpage/Analytics";
// import AdminBulk from "./pages/Adminpage/BulkImportPage";

// import ProtectedRoute from "./components/ProtectedRoute";
// import RoleRedirect from "./components/RoleRedirect";
// import ScrollToTop from "./components/ScrollToTop";
// import PublicRoute from "./components/PublicRoute";

// function App() {
//   return (
//     <Router>
//       <div className="min-h-screen bg-[#F5F5F5] font-sans antialiased text-[#121212]">
//         <ScrollToTop />
//         <Routes>
//           {/* Public */}
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/login" element={<LandingPage openLogin={true} />} />
//           <Route
//             path="/admin/login"
//             element={
//               <PublicRoute>
//                 <UserLogin />
//               </PublicRoute>
//             }
//           />
//           <Route path="/privacy-policy" element={<PrivacyPolicy />} />
//           <Route path="/faq" element={<FAQPage />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/contact" element={<Contact />} />

//           {/* Role redirect helper */}
//           <Route path="/dashboard" element={<RoleRedirect />} />

//           {/* Intern */}
//           <Route
//   path="/intern/dashboard"
//   element={
//     <ProtectedRoute>
//       <InternDashboard />
//     </ProtectedRoute>
//   }
// />

//           {/* Admin */}
//           <Route
//   path="/admin/login"
//   element={
//     <PublicRoute>
//       <UserLogin />
//     </PublicRoute>
//   }
// />
// <Route
//   path="/admin/dashboard"
//   element={
//     <ProtectedRoute>
//       <AdminDashboard />
//     </ProtectedRoute>
//   }
// />

//           <Route path="/admin/intern" element={<AdminInternManagement />} />
//           <Route path="/admin/interns" element={<AdminInternManagement />} />
//           <Route path="/admin/tpo" element={<AdminTpo />} />
//           <Route path="/admin/allocation" element={<AdminAllocation />} />
//           <Route path="/admin/analytics" element={<AdminAnalytics />} />
//           <Route path="/admin/bulk/import" element={<AdminBulk />} />
//           <Route path="/admin/bulk" element={<AdminBulk />} />

//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;



import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Public pages
import LandingPage from "./pages/LandingPage";
import UserLogin from "./pages/auth/UserLogin";
import LegalPrivacy from "./pages/LegalPrivacy";
import LegalTerms from "./pages/LegalTerms";
import FAQPage from "./pages/FAQPage";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Contact from "./pages/Contact";

// Intern
import InternDashboard from "./pages/internPage";

// Admin pages
import AdminDashboard from "./pages/Adminpage/Dashboard";
import AdminInternManagement from "./pages/Adminpage/InternManagement";
import AdminTpo from "./pages/Adminpage/Tpo";
import AdminAllocation from "./pages/Adminpage/Allocation";
import AdminAnalytics from "./pages/Adminpage/Analytics";
import AdminBulk from "./pages/Adminpage/BulkImportPage";

// Route guards
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRedirect from "./components/RoleRedirect";
import ScrollToTop from "./components/ScrollToTop";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#F5F5F5] font-sans antialiased text-[#121212]">
        <ScrollToTop />

        <Routes>
          {/* ================= PUBLIC ================= */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LandingPage openLogin={true} />} />
          <Route
            path="/admin/login"
            element={
              <PublicRoute>
                <UserLogin />
              </PublicRoute>
            }
          />
          <Route path="/privacy-policy" element={<LegalPrivacy />} />
          <Route path="/terms-of-service" element={<LegalTerms />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* ================= ROLE REDIRECT ================= */}
          <Route path="/dashboard" element={<RoleRedirect />} />

          {/* ================= INTERN ================= */}
          <Route
            path="/intern/dashboard"
            element={
              <ProtectedRoute>
                <InternDashboard />
              </ProtectedRoute>
            }
          />

          {/* ================= ADMIN ================= */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/intern"
            element={
              <ProtectedRoute>
                <AdminInternManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/interns"
            element={
              <ProtectedRoute>
                <AdminInternManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/tpo"
            element={
              <ProtectedRoute>
                <AdminTpo />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/allocation"
            element={
              <ProtectedRoute>
                <AdminAllocation />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute>
                <AdminAnalytics />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/bulk/import"
            element={
              <ProtectedRoute>
                <AdminBulk />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/bulk"
            element={
              <ProtectedRoute>
                <AdminBulk />
              </ProtectedRoute>
            }
          />

          {/* ================= 404 ================= */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;