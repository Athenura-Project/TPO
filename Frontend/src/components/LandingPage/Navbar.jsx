import React, { useState, useEffect } from 'react';

const Navbar = () => {
  // State to manage mobile menu visibility
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // State to manage navbar scroll effect
  const [scrolled, setScrolled] = useState(false);

  // Toggle function for the mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Add a scroll listener to enhance the glassy effect when scrolling down
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    /* Navbar container with Glassy Effect.
      Using background color with opacity (/70 or /80) and backdrop-blur for the glassmorphism.
      The transition-all makes the shadow appear smoothly when scrolling.
    */
    <nav 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ease-in-out ${
        scrolled 
          ? 'bg-[#F3EFEF]/80 backdrop-blur-lg border-b border-[#E2DFDF]/60 shadow-sm' 
          : 'bg-[#F3EFEF]/50 backdrop-blur-sm border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Brand Logo / Name with subtle scale animation on hover */}
          <div className="flex-shrink-0 flex items-center">
            <a 
              href="/" 
              className="text-2xl font-extrabold text-[#111111] tracking-wide transform transition-transform duration-300 hover:scale-105"
            >
              Athenura
            </a>
          </div>

          {/* Desktop Navigation Links with slide-up hover animations */}
          <div className="hidden md:flex space-x-8 items-center">
            <a 
              href="#features" 
              className="text-[#333333] hover:text-[#111111] px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E2DFDF]/50"
            >
              Features
            </a>
            <a 
              href="#about" 
              className="text-[#333333] hover:text-[#111111] px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E2DFDF]/50"
            >
              About
            </a>
            <a 
              href="#contact" 
              className="text-[#333333] hover:text-[#111111] px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E2DFDF]/50"
            >
              Contact
            </a>
          </div>

          {/* Desktop Authentication Buttons with scale and color transition animations */}
          <div className="hidden md:flex items-center space-x-4">
            <a 
              href="/login" 
              className="text-[#333333] hover:text-[#111111] font-medium text-sm transition-all duration-300 hover:scale-105"
            >
              Login
            </a>
            <a 
              href="/register" 
              className="bg-[#333333] hover:bg-[#111111] text-[#F3EFEF] px-5 py-2 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-md"
            >
              Register
            </a>
          </div>

          {/* Mobile Menu Button with spin animation */}
          <div className="flex md:hidden items-center">
            <button 
              onClick={toggleMobileMenu}
              type="button" 
              className="inline-flex items-center justify-center p-2 rounded-md text-[#333333] hover:text-[#111111] hover:bg-[#E2DFDF]/60 focus:outline-none transition-colors duration-200"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <div className="relative w-6 h-6">
                {/* Animated Hamburger / Close Icons */}
                <svg 
                  className={`absolute top-0 left-0 w-6 h-6 transition-all duration-300 transform ${
                    isMobileMenuOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'
                  }`} 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg 
                  className={`absolute top-0 left-0 w-6 h-6 transition-all duration-300 transform ${
                    isMobileMenuOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'
                  }`} 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu with smooth height and opacity transitions */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-[#F3EFEF]/90 backdrop-blur-md ${
          isMobileMenuOpen ? 'max-h-96 opacity-100 border-t border-[#E2DFDF]/50' : 'max-h-0 opacity-0'
        }`} 
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a href="#features" className="block text-[#333333] hover:bg-[#E2DFDF]/80 hover:text-[#111111] px-3 py-2 rounded-md text-base font-medium transition-colors duration-200">
            Features
          </a>
          <a href="#about" className="block text-[#333333] hover:bg-[#E2DFDF]/80 hover:text-[#111111] px-3 py-2 rounded-md text-base font-medium transition-colors duration-200">
            About
          </a>
          <a href="#contact" className="block text-[#333333] hover:bg-[#E2DFDF]/80 hover:text-[#111111] px-3 py-2 rounded-md text-base font-medium transition-colors duration-200">
            Contact
          </a>
        </div>
        <div className="pt-4 pb-4 border-t border-[#E2DFDF]/50">
          <div className="px-4 flex flex-col space-y-3">
            <a href="/login" className="text-center text-[#333333] hover:bg-[#E2DFDF]/80 hover:text-[#111111] px-3 py-2 rounded-md text-base font-medium transition-colors duration-200">
              Login
            </a>
            <a href="/register" className="text-center text-[#F3EFEF] bg-[#333333] hover:bg-[#111111] px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 shadow-sm">
              Register
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;