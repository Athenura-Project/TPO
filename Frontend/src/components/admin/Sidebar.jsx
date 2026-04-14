import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate(); // 🚀 Ye bohot zaroori hai redirect ke liye

  // 🚀 Logout Function: Storage clear karega aur login pe bhej dega
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
  };

  const menuItems = [
    {
      id: 'Dashboard',
      name: 'Overview',
      path: '/admin/dashboard',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    },
    {
      id: 'Interns',
      name: 'Intern Management',
      path: '/admin/intern',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    },
    {
      id: 'TPOs',
      name: 'TPO Database',
      path: '/admin/tpo',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    },
    {
      id: 'Assignments',
      name: 'Allocations',
      path: '/admin/allocation',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    },
    {
      id: 'Analytics & Reports',
      name: 'Analytics & Reports',
      path: '/admin/analytics',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    }
  ];

  return (
    <aside className="w-72 bg-[#224D59] text-[#F5F7F2] h-screen flex flex-col shadow-2xl relative z-20 overflow-hidden">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-[-10%] right-[-20%] w-64 h-64 bg-[#B8CC34]/10 rounded-full blur-[80px] pointer-events-none"></div>

      {/* Brand Header */}
      <div className="p-6 lg:p-8 flex items-center border-b border-white/10 relative z-10">
        <div className="mr-3 flex-shrink-0">
          <img 
            src="/Logo.png" 
            alt="Athenura Logo" 
            className="h-12 w-auto object-contain brightness-0 invert" 
          />
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto relative z-10 custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 text-sm font-bold group ${
                isActive 
                  ? 'bg-[#B8CC34] text-[#224D59] shadow-[0_5px_15px_rgba(184,204,52,0.2)]' 
                  : 'text-white/70 hover:bg-white/5 hover:text-white hover:scale-[1.02]'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 mr-3 transition-colors duration-300 ${isActive ? 'text-[#224D59]' : 'text-white/40 group-hover:text-white/80'}`}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                    {item.icon}
                  </svg>
                </div>
                {item.name}
              </div>
            </Link>
          );
        })}

        <div className="mt-8 mb-4 px-4 text-xs font-bold text-white/40 uppercase tracking-widest text-left">Data Actions</div>
        
        {/* 🚀 Bulk Import Link Added Here */}
        <Link 
          to="/admin/bulk/import"
          className="w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 text-sm font-bold border border-dashed border-white/20 text-white/80 hover:bg-white/5 hover:border-[#B8CC34]/50 hover:text-[#B8CC34] group"
        >
          <div className="w-5 h-5 mr-3 text-white/40 group-hover:text-[#B8CC34] transition-colors text-left">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <span className="flex-1 text-left">Bulk Import (CSV/XLSX)</span>
        </Link>
      </nav>

      {/* 🚀 Bottom Profile Section with Functional Logout */}
      <div className="p-4 border-t border-white/10 bg-black/10 relative z-10">
        <div className="flex items-center justify-between p-3 rounded-xl">
          <div className="flex items-center">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" 
              alt="Admin" 
              className="w-10 h-10 rounded-lg bg-white/10"
            />
            <div className="ml-3 text-left">
              <p className="text-sm font-bold text-white leading-none">Super Admin</p>
              <p className="text-[10px] text-white/50 font-medium mt-1">admin@athenura.com</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            title="Logout"
            className="p-2 rounded-xl hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-all duration-300 group"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
      
    </aside>
  );
};

export default AdminSidebar;