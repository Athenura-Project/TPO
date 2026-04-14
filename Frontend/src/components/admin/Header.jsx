import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminHeader = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  return (
    <header className="h-20 bg-white/80 backdrop-blur-2xl border-b border-[#224D59]/10 flex items-center justify-between px-4 sm:px-6 lg:px-10 sticky top-0 z-30 w-full transition-all duration-300">
      
      {/* Left Side: Mobile Menu & Home Button */}
      <div className="flex items-center">
        {/* Hamburger Menu (Visible only on mobile/tablet) */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden mr-2 sm:mr-4 p-2 sm:p-2.5 rounded-xl bg-white border border-[#224D59]/10 text-[#224D59] hover:bg-[#F5F7F2] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B8CC34]/50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        
        {/* Premium Home Button - RESPONSIVE: Icon only on Mobile, Icon+Text on sm and up */}
        <button 
          onClick={() => navigate('/')}
          title="Back to Home"
          className="flex items-center justify-center p-2 sm:px-4 sm:py-2 rounded-lg text-[#224D59] hover:bg-[#F5F7F2] hover:text-[#668824] transition-all duration-300 group font-bold text-sm"
        >
          <svg className="w-5 h-5 transition-transform group-hover:-translate-y-0.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
          {/* Text is hidden on small screens, block on sm and above */}
          <span className="hidden sm:block">Back to Home</span>
        </button>
      </div>

      {/* Right Side: Search, Notifications, Profile */}
      <div className="flex items-center space-x-2 sm:space-x-5">
        
        {/* Expanded Search Bar (Hidden on mobile) */}
        <div className="hidden md:flex items-center bg-[#F5F7F2] border border-[#224D59]/5 rounded-full px-4 py-2.5 shadow-inner focus-within:bg-white focus-within:border-[#B8CC34] focus-within:ring-4 focus-within:ring-[#B8CC34]/10 transition-all duration-300 group w-64 lg:w-80">
          <svg className="w-4 h-4 text-[#224D59]/40 group-focus-within:text-[#B8CC34] mr-2.5 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input
            type="text"
            placeholder="Search interns, companies..."
            className="bg-transparent border-none outline-none text-sm text-[#224D59] font-medium placeholder-[#224D59]/40 w-full"
          />
        </div>

        {/* Mobile Search Icon (Visible only on mobile) */}
        <button className="md:hidden p-2 sm:p-2.5 rounded-full text-[#224D59]/60 hover:bg-[#F5F7F2] hover:text-[#224D59] transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </button>

        {/* Notification Bell with Ping */}
        <button className="relative p-2 sm:p-2.5 rounded-full text-[#224D59]/60 hover:bg-[#F5F7F2] hover:text-[#224D59] transition-colors group">
          {/* Active Notification Badge */}
          <span className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white group-hover:border-[#F5F7F2] transition-colors z-10"></span>
          <span className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2.5 w-2 h-2 bg-red-500 rounded-full animate-ping opacity-75"></span>
          
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
        </button>

        {/* User Profile Dropdown Trigger */}
        <div className="flex items-center pl-2 sm:pl-4 border-l border-[#224D59]/10 cursor-pointer group">
          {/* User Avatar */}
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#224D59] to-[#1A3A43] border-2 border-white shadow-md flex items-center justify-center font-bold text-[#B8CC34] text-xs sm:text-sm group-hover:shadow-lg transition-shadow">
            AK
          </div>
          
          {/* User Info (Hidden on smaller screens to save space) */}
          <div className="ml-3 hidden lg:block text-left">
            <div className="text-sm font-bold text-[#224D59] leading-tight group-hover:text-[#668824] transition-colors">Admin User</div>
            <div className="text-[11px] font-bold tracking-wider uppercase text-[#384022]/50 mt-0.5">Super Admin</div>
          </div>
          
          {/* Dropdown Chevron */}
          <svg className="w-4 h-4 ml-2 text-[#224D59]/40 hidden lg:block group-hover:text-[#224D59] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>

      </div>
    </header>
  );
};

export default AdminHeader;