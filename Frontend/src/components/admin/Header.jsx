import React, { useEffect, useMemo, useState, useRef } from 'react';
import { getAdminDashboardSummary, getCurrentUser } from '../../api/adminApi';

const AdminHeader = ({ toggleSidebar, onSearch }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('currentUser');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Create a ref to detect clicks outside the notification area
  const notificationRef = useRef(null);

  // 2. Add Event Listener to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Agar notification container ke bahar click hua hai
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
        setShowAllNotifications(false); // Reset the 'view all' state as well
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Cleanup event listener on unmount
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        const [meRes, summaryRes] = await Promise.all([
          getCurrentUser(),
          getAdminDashboardSummary(),
        ]);

        const user = meRes?.user || null;
        if (user) {
          setCurrentUser(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
        }

        const internItems = (summaryRes?.recentInterns || []).map((intern) => ({
          id: `intern-${intern?._id || intern?.email || Math.random()}`,
          text: `${intern?.name || 'Intern'} joined recently`,
          time: intern?.createdAt ? new Date(intern.createdAt).toLocaleString() : 'Now',
          isRead: false, 
        }));

        const tpoItems = (summaryRes?.recentTPOs || []).map((tpo) => ({
          id: `tpo-${tpo?._id || tpo?.companyName || Math.random()}`,
          text: `${tpo?.companyName || 'TPO'} status: ${tpo?.status || 'Updated'}`,
          time: tpo?.createdAt ? new Date(tpo.createdAt).toLocaleString() : 'Now',
          isRead: false, 
        }));

        const combinedNotifications = [...internItems, ...tpoItems];
        setNotifications(combinedNotifications);
        
        if (combinedNotifications.length > 0) {
          setHasUnread(true);
        }

      } catch {
        // Keep UI stable
      }
    };

    fetchHeaderData();
  }, []);

  const initials = useMemo(() => {
    const name = currentUser?.name || 'Admin';
    const parts = name.trim().split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase() || '').join('') || 'AD';
  }, [currentUser]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const toggleNotificationDropdown = () => {
    setShowNotifications((prev) => {
      if (prev) {
        setShowAllNotifications(false);
      }
      return !prev;
    });
    setHasUnread(false); 
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map(n => ({ ...n, isRead: true })));
    setHasUnread(false);
  };

  const displayedNotifications = showAllNotifications 
    ? notifications 
    : notifications.slice(0, 5);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="h-20 bg-white/80 backdrop-blur-2xl border-b border-[#224D59]/10 flex items-center justify-between px-4 sm:px-6 lg:px-10 sticky top-0 z-30 w-full transition-all duration-300">
      
      {/* Left Side: Mobile Menu */}
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="lg:hidden mr-2 sm:mr-4 p-2 sm:p-2.5 rounded-xl bg-white border border-[#224D59]/10 text-[#224D59] hover:bg-[#F5F7F2] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B8CC34]/50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      {/* Right Side: Search, Notifications, Profile */}
      <div className="flex items-center space-x-2 sm:space-x-5">
        
        {/* Expanded Search Bar */}
        {/* <div className="hidden md:flex items-center bg-[#F5F7F2] border border-[#224D59]/5 rounded-full px-4 py-2.5 shadow-inner focus-within:bg-white focus-within:border-[#B8CC34] focus-within:ring-4 focus-within:ring-[#B8CC34]/10 transition-all duration-300 group w-64 lg:w-80">
          <svg className="w-4 h-4 text-[#224D59]/40 group-focus-within:text-[#B8CC34] mr-2.5 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search interns, companies..."
            className="bg-transparent border-none outline-none text-sm text-[#224D59] font-medium placeholder-[#224D59]/40 w-full"
          />
        </div> */}

        {/* Notification Bell - 3. Added ref here */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={toggleNotificationDropdown}
            className="relative p-2 sm:p-2.5 rounded-full text-[#224D59]/60 hover:bg-[#F5F7F2] hover:text-[#224D59] transition-colors group"
          >
            {/* Active Notification Badge */}
            {hasUnread && unreadCount > 0 && (
              <>
                <span className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white group-hover:border-[#F5F7F2] transition-colors z-10"></span>
                <span className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2.5 w-2 h-2 bg-red-500 rounded-full animate-ping opacity-75"></span>
              </>
            )}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute top-14 right-0 sm:-right-4 w-80 max-h-[32rem] flex flex-col rounded-2xl border border-[#224D59]/10 bg-white shadow-2xl z-50 overflow-hidden origin-top-right animate-in fade-in zoom-in-95 duration-200">
              
              {/* Dropdown Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#224D59]/10 bg-white z-10">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-bold text-[#224D59]">Notifications</p>
                  {unreadCount > 0 && (
                    <span className="bg-[#B8CC34]/20 text-[#668824] text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button 
                    onClick={handleMarkAllAsRead}
                    className="text-xs font-medium text-[#224D59]/60 hover:text-[#668824] transition-colors"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto p-2">
                {notifications.length > 0 ? (
                  <div className="space-y-1">
                    {displayedNotifications.map((item) => (
                      <div 
                        key={item.id} 
                        className={`px-3 py-2.5 rounded-xl transition-colors flex items-start space-x-3 cursor-default
                          ${item.isRead ? 'hover:bg-[#F5F7F2]' : 'bg-[#F5F7F2]/60 hover:bg-[#F5F7F2]'}`}
                      >
                        {/* Unread Indicator Dot */}
                        <div className="mt-1.5 flex-shrink-0">
                          <div className={`w-2 h-2 rounded-full ${item.isRead ? 'bg-transparent' : 'bg-[#B8CC34]'}`}></div>
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm ${item.isRead ? 'text-[#224D59]/80' : 'text-[#224D59] font-semibold'}`}>
                            {item.text}
                          </p>
                          <p className="text-[11px] text-[#384022]/60 mt-0.5">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <svg className="w-10 h-10 text-[#224D59]/20 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                    </svg>
                    <p className="text-sm font-medium text-[#224D59]/60">You're all caught up!</p>
                    <p className="text-xs text-[#224D59]/40 mt-1">No new notifications</p>
                  </div>
                )}
              </div>

              {/* Dropdown Footer (View All Button) */}
              {!showAllNotifications && notifications.length > 5 && (
                <div className="p-2 border-t border-[#224D59]/10 bg-white z-10">
                  <button 
                    onClick={() => setShowAllNotifications(true)}
                    className="w-full py-2 text-sm font-semibold text-[#224D59] bg-[#F5F7F2] hover:bg-[#B8CC34]/20 hover:text-[#668824] rounded-xl transition-all duration-200"
                  >
                    View all notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile Dropdown Trigger */}
        <div className="flex items-center pl-2 sm:pl-4 border-l border-[#224D59]/10 cursor-pointer group">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#224D59] to-[#1A3A43] border-2 border-white shadow-md flex items-center justify-center font-bold text-[#B8CC34] text-xs sm:text-sm group-hover:shadow-lg transition-shadow">
            {initials}
          </div>
          <div className="ml-3 hidden lg:block text-left">
            <div className="text-sm font-bold text-[#224D59] leading-tight group-hover:text-[#668824] transition-colors">
              {currentUser?.name || 'Admin'}
            </div>
            <div className="text-[11px] font-bold tracking-wider text-[#384022]/50 mt-0.5">
              {currentUser?.email || 'admin@domain.com'}
            </div>
          </div>
          {/* <svg className="w-4 h-4 ml-2 text-[#224D59]/40 hidden lg:block group-hover:text-[#224D59] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
          </svg> */}
        </div>

      </div>
    </header>
  );
};

export default AdminHeader;