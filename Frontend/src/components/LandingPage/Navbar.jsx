import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
    { label: "FAQ", path: "/faq" },
  ];

  return (
    /* Light Theme Wrapper */
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
            {/* Image Brand Logo - Exact as you wanted */}
            <div className="flex-shrink-0 flex items-center">
              <a
                href="/"
                className="transform transition-transform duration-300 hover:scale-105"
              >
                <img
                  src="/Logo.png"
                  alt="Athenura Logo"
                  className="h-8 sm:h-10 w-auto object-contain"
                />
              </a>
            </div>

            {/* Desktop Navigation Links with subtle blue animated underlines */}
            <div className="hidden md:flex space-x-10 items-center">
              {navLinks.map((item) => {
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    className="relative group font-semibold text-sm transition-colors duration-300"
                    style={{ color: isActive ? "#224D59" : undefined }}
                  >
                    <span
                      className={
                        isActive
                          ? "text-[#224D59]"
                          : "text-[#384022]/70 group-hover:text-[#224D59] transition-colors duration-300"
                      }
                    >
                      {item.label}
                    </span>
                    <span
                      className={`absolute -bottom-1 left-0 w-full h-[2px] bg-[#224D59] transition-transform duration-300 ease-out origin-left ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                    />
                  </Link>
                );
              })}
            </div>

            {/* Desktop Authentication Buttons - Light Theme styles */}
            <div className="hidden md:flex items-center space-x-6">
              <a
                href="/login"
                className="text-gray-600 hover:text-blue-600 font-bold text-sm transition-colors duration-300"
              >
                Login
              </a>
              <a
                href="/register"
                className="relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold text-white transition-all duration-300 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-[0_4px_15px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.4)] hover:-translate-y-0.5"
              >
                Register
              </a>
            </div>

            {/* Mobile Menu Button - Dark icons for light theme */}
            <div className="flex md:hidden items-center">
              <button
                onClick={toggleMobileMenu}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50 focus:outline-none transition-all duration-300"
              >
                <span className="sr-only">Open main menu</span>
                <div className="relative w-6 h-6">
                  <svg
                    className={`absolute top-0 left-0 w-6 h-6 transition-transform duration-300 ${
                      isMobileMenuOpen
                        ? "rotate-90 opacity-0 scale-50"
                        : "rotate-0 opacity-100 scale-100"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  <svg
                    className={`absolute top-0 left-0 w-6 h-6 transition-transform duration-300 ${
                      isMobileMenuOpen
                        ? "rotate-0 opacity-100 scale-100 text-blue-600"
                        : "-rotate-90 opacity-0 scale-50"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Floating Mobile Dropdown Menu - Light Frost */}
        <div
          className={`absolute top-full left-0 w-full mt-3 rounded-2xl overflow-hidden transition-all duration-300 ease-in-out origin-top border border-gray-200 shadow-[0_20px_40px_rgb(0,0,0,0.1)] bg-white/95 backdrop-blur-2xl ${
            isMobileMenuOpen
              ? "scale-y-100 opacity-100 visible"
              : "scale-y-0 opacity-0 invisible"
          }`}
        >
          <div className="px-4 py-6 space-y-2">
            {["Features", "About", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="block px-4 py-3 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50 text-base font-bold transition-all duration-200"
              >
                {item}
              </a>
            ))}

            <div className="pt-4 mt-2 border-t border-gray-100 flex flex-col space-y-3 px-4">
              <a
                href="/login"
                className="w-full text-center px-4 py-3 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50 text-base font-bold transition-colors duration-200"
              >
                Login
              </a>
              <a
                href="/register"
                className="w-full text-center px-4 py-3 rounded-xl text-white font-bold bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 shadow-md"
              >
                Register
              </a>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
