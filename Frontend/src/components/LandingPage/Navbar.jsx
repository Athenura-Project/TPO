import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogIn, LogOut } from "lucide-react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loggingOut, setLoggingOut] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => {
      // ✅ Clear ALL user data from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      localStorage.removeItem("name");
      localStorage.removeItem("email");
      localStorage.removeItem("userId");
      setToken(null);
      setLoggingOut(false);
      navigate("/");
    }, 600);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Re-sync token on every route change
  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, [location.pathname]);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
    { label: "FAQ", path: "/faq" },
    { label: "Dashboard", path: "/dashboard" },
  ];

  return (
    <>
      <style>{`
        /* ══════════════════════════════════════
           LOGIN BUTTON — teal gradient + shimmer
        ══════════════════════════════════════ */
        .btn-login {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 22px;
          font-size: 13px;
          font-weight: 700;
          color: #fff;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          overflow: hidden;
          background: linear-gradient(135deg, #224D59 0%, #0d9488 100%);
          box-shadow: 0 4px 14px rgba(13,148,136,0.35), inset 0 1px 0 rgba(255,255,255,0.15);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          text-decoration: none;
          letter-spacing: 0.02em;
        }
        .btn-login::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #1A3A43 0%, #0a7a70 100%);
          opacity: 0;
          transition: opacity 0.25s ease;
          border-radius: inherit;
        }
        .btn-login:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(13,148,136,0.5), inset 0 1px 0 rgba(255,255,255,0.2);
        }
        .btn-login:hover::before { opacity: 1; }
        .btn-login:active { transform: scale(0.97); }
        .btn-login > * { position: relative; z-index: 1; }
        /* shimmer sweep */
        .btn-login::after {
          content: '';
          position: absolute;
          top: 0; left: -75%;
          width: 50%; height: 100%;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,0.25), transparent);
          transform: skewX(-20deg);
          transition: left 0.55s ease;
          z-index: 2;
        }
        .btn-login:hover::after { left: 145%; }

        /* ══════════════════════════════════════
           LOGOUT BUTTON — red ghost → fills red
        ══════════════════════════════════════ */
        .btn-logout {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 22px;
          font-size: 13px;
          font-weight: 700;
          color: #dc2626;
          border-radius: 999px;
          border: 1.5px solid rgba(220,38,38,0.4);
          cursor: pointer;
          overflow: hidden;
          background: rgba(254,226,226,0.55);
          box-shadow: 0 2px 10px rgba(220,38,38,0.1);
          transition: color 0.25s ease, background 0.25s ease, border-color 0.25s ease,
                      transform 0.2s ease, box-shadow 0.25s ease;
          letter-spacing: 0.02em;
          backdrop-filter: blur(4px);
        }
        .btn-logout:hover {
          color: #fff;
          background: linear-gradient(135deg, #f87171 0%, #dc2626 100%);
          border-color: transparent;
          transform: translateY(-2px);
          box-shadow: 0 10px 26px rgba(220,38,38,0.42);
        }
        .btn-logout:active { transform: scale(0.97); }
        /* icon spin on logout */
        .btn-logout.logging-out .logout-icon {
          animation: spin-out 0.6s ease forwards;
        }
        @keyframes spin-out {
          0%   { transform: rotate(0deg)   scale(1);   opacity: 1; }
          60%  { transform: rotate(180deg) scale(0.7); opacity: 0.5; }
          100% { transform: rotate(360deg) scale(0);   opacity: 0; }
        }

        /* ══════════════════════════════════════
           MOBILE VARIANTS
        ══════════════════════════════════════ */
        .btn-login-mobile {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 13px 16px;
          font-size: 15px;
          font-weight: 700;
          color: #fff;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          background: linear-gradient(135deg, #224D59 0%, #0d9488 100%);
          box-shadow: 0 4px 16px rgba(13,148,136,0.3);
          transition: transform 0.2s, box-shadow 0.2s;
          text-decoration: none;
        }
        .btn-login-mobile:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 22px rgba(13,148,136,0.4);
        }
        .btn-logout-mobile {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 13px 16px;
          font-size: 15px;
          font-weight: 700;
          color: #dc2626;
          border-radius: 14px;
          border: 1.5px solid rgba(220,38,38,0.3);
          cursor: pointer;
          background: rgba(254,226,226,0.6);
          transition: all 0.22s ease;
        }
        .btn-logout-mobile:hover {
          color: #fff;
          background: linear-gradient(135deg, #f87171, #dc2626);
          border-color: transparent;
          box-shadow: 0 6px 18px rgba(220,38,38,0.38);
        }
      `}</style>

      <div className="fixed top-0 left-0 w-full z-50 flex justify-center pointer-events-none pt-4 sm:pt-6">
        <nav
          className={`relative pointer-events-auto transition-all duration-500 ease-out bg-white ${
            scrolled
              ? "w-[95%] max-w-7xl rounded-full backdrop-blur-xl border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
              : "w-[90%] max-w-6xl rounded-full backdrop-blur-md border border-gray-100 shadow-sm"
          }`}
        >
          <div className="px-5 sm:px-8 py-3">
            <div className="flex justify-between items-center h-12">

              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <a href="/" className="transform transition-transform duration-300 hover:scale-105">
                  <img src="/Logo.png" alt="Athenura Logo" className="h-8 sm:h-10 w-auto object-contain" />
                </a>
              </div>

              {/* Desktop Nav Links */}
              <div className="hidden md:flex space-x-10 items-center">
                {navLinks.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.label}
                      to={item.path}
                      className="relative group font-semibold text-sm transition-colors duration-300"
                    >
                      <span className={isActive ? "text-[#224D59]" : "text-[#384022]/70 group-hover:text-[#224D59] transition-colors duration-300"}>
                        {item.label}
                      </span>
                      <span className={`absolute -bottom-1 left-0 w-full h-[2px] bg-[#224D59] transition-transform duration-300 ease-out origin-left ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
                    </Link>
                  );
                })}
              </div>

              {/* Desktop Auth Button */}
              <div className="hidden md:flex items-center">
                {token ? (
                  // ✅ LOGGED IN → red ghost button that fills on hover
                  <button
                    onClick={handleLogout}
                    className={`btn-logout ${loggingOut ? "logging-out" : ""}`}
                  >
                    <LogOut size={14} strokeWidth={2.5} className="logout-icon" />
                    <span>{loggingOut ? "Signing out…" : "Logout"}</span>
                  </button>
                ) : (
                  // ✅ NOT LOGGED IN → teal gradient + shimmer login button
                  <a href="/login" className="btn-login">
                    <LogIn size={14} strokeWidth={2.5} />
                    <span>Login</span>
                  </a>
                )}
              </div>

              {/* Mobile Hamburger */}
              <div className="flex md:hidden items-center">
                <button
                  onClick={toggleMobileMenu}
                  type="button"
                  className="inline-flex items-center justify-center p-2 rounded-full text-gray-600 hover:text-[#224D59] hover:bg-[#224D59]/10 focus:outline-none transition-all duration-300"
                >
                  <span className="sr-only">Open main menu</span>
                  <div className="relative w-6 h-6">
                    <svg className={`absolute top-0 left-0 w-6 h-6 transition-transform duration-300 ${isMobileMenuOpen ? "rotate-90 opacity-0 scale-50" : "rotate-0 opacity-100 scale-100"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <svg className={`absolute top-0 left-0 w-6 h-6 transition-transform duration-300 ${isMobileMenuOpen ? "rotate-0 opacity-100 scale-100 text-[#224D59]" : "-rotate-90 opacity-0 scale-50"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Dropdown */}
          <div className={`absolute top-full left-0 w-full mt-3 rounded-2xl overflow-hidden transition-all duration-300 ease-in-out origin-top border border-gray-200 shadow-[0_20px_40px_rgb(0,0,0,0.1)] bg-white/95 backdrop-blur-2xl ${isMobileMenuOpen ? "scale-y-100 opacity-100 visible" : "scale-y-0 opacity-0 invisible"}`}>
            <div className="px-4 py-6 space-y-2">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl text-gray-700 hover:text-[#224D59] hover:bg-[#224D59]/5 text-base font-bold transition-all duration-200"
                >
                  {item.label}
                </Link>
              ))}

              <div className="pt-4 mt-2 border-t border-gray-100 px-4">
                {token ? (
                  <button onClick={handleLogout} className="btn-logout-mobile">
                    <LogOut size={16} strokeWidth={2.5} />
                    {loggingOut ? "Signing out…" : "Logout"}
                  </button>
                ) : (
                  <a href="/login" className="btn-login-mobile">
                    <LogIn size={16} strokeWidth={2.5} />
                    Login
                  </a>
                )}
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;