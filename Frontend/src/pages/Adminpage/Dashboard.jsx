import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Importing our newly created Layout Components
import AdminSidebar from '../../components/admin/Sidebar'; // Adjust path if needed
import AdminHeader from '../../components/admin/Header';   // Adjust path if needed

const AdminDashboard = () => {
  // Global states for Dashboard Layout
  const [activeTab, setActiveTab] = useState('Overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Content Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  // Mock Data for Stats
  const stats = [
    { title: "Total Students", value: "1,248", increment: "+12%", color: "from-[#224D59] to-[#1A3A43]", text: "text-white" },
    { title: "Active Interns", value: "24", increment: "+4 new", color: "bg-white", text: "text-[#224D59]" },
    { title: "Pending Leads", value: "142", increment: "-15% (Good)", color: "bg-white", text: "text-[#224D59]" },
    { title: "TPO Conversion", value: "84.2%", increment: "+2.4%", color: "bg-[#B8CC34]", text: "text-[#224D59]" }
  ];

  return (
    <div className="flex h-screen bg-[#F5F7F2] font-sans overflow-hidden selection:bg-[#B8CC34] selection:text-[#224D59]">
      
      {/* 🚀 RESPONSIVE SIDEBAR WRAPPER */}
      {/* Desktop: Static Sidebar */}
      <div className="hidden lg:block h-full z-40">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Mobile: Animated Overlay Sidebar */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            {/* Dark Overlay (Click to close) */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-[#224D59]/60 backdrop-blur-sm z-40 lg:hidden"
            />
            {/* Sidebar Sliding in from left */}
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%", transition: { type: "tween", duration: 0.3 } }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden shadow-2xl"
            >
              <AdminSidebar activeTab={activeTab} setActiveTab={(tab) => {
                setActiveTab(tab);
                setIsMobileSidebarOpen(false); // Close sidebar on mobile after selection
              }} />
            </motion.div>
          </>
        )}
      </AnimatePresence>


      {/* 🚀 MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Ambient Background Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#B8CC34]/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#224D59]/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

        {/* 🚀 HEADER IMPORTED HERE */}
        <AdminHeader 
          activeTab={activeTab} 
          toggleSidebar={() => setIsMobileSidebarOpen(true)} 
        />

        {/* Scrollable Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 relative z-10 scroll-smooth custom-scrollbar">
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-7xl mx-auto space-y-8">
            
            {/* Top Action Bar */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <p className="text-[#384022]/70 font-medium">Here's what's happening with your placements today.</p>
              <div className="flex space-x-3 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-white border border-[#224D59]/10 text-[#224D59] font-bold text-sm hover:bg-[#F5F7F2] transition-colors shadow-sm">
                  Export Report
                </button>
                <button className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#224D59] text-white font-bold text-sm hover:bg-[#1A3A43] shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                  + Add New Lead
                </button>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {stats.map((stat, index) => (
                <motion.div 
                  key={index} 
                  variants={itemVariants} 
                  className={`p-6 rounded-3xl shadow-[0_10px_30px_rgba(34,77,89,0.05)] border border-[#224D59]/5 ${stat.color} ${stat.color.includes('bg-white') ? '' : 'bg-gradient-to-br'}`}
                >
                  <h3 className={`text-sm font-bold mb-3 opacity-80 ${stat.text}`}>{stat.title}</h3>
                  <div className={`text-3xl md:text-4xl font-black mb-2 ${stat.text}`}>{stat.value}</div>
                  <div className={`text-xs font-bold px-2 py-1 inline-block rounded-md ${stat.color.includes('white') ? 'bg-[#F5F7F2] text-[#668824]' : 'bg-black/20 text-white'}`}>
                    {stat.increment}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Main Charts & Lists Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Bar Chart Mockup (Consistent with Hero Section) */}
              <motion.div variants={itemVariants} className="lg:col-span-2 bg-white/80 backdrop-blur-xl border border-[#224D59]/10 rounded-3xl p-6 shadow-sm flex flex-col min-h-[350px]">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-lg font-extrabold text-[#224D59]">Weekly Outreach Volume</h3>
                  <select className="bg-[#F5F7F2] border border-[#224D59]/10 text-[#224D59] text-xs font-bold rounded-lg px-3 py-1.5 outline-none cursor-pointer">
                    <option>Last 7 Days</option>
                    <option>This Month</option>
                  </select>
                </div>
                
                {/* Animated Bars */}
                <div className="flex-1 flex items-end justify-between space-x-2 sm:space-x-6 pt-4 border-b border-[#224D59]/5 pb-2">
                  {[40, 70, 45, 90, 60, 85, 30].map((height, i) => (
                    <div key={i} className="w-full flex flex-col items-center group h-full justify-end">
                      <motion.div 
                        initial={{ height: 0 }} 
                        animate={{ height: `${height}%` }} 
                        transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                        className={`w-full rounded-t-xl transition-all duration-300 group-hover:opacity-100 ${i === 3 ? 'bg-[#224D59] shadow-lg' : 'bg-gradient-to-t from-[#668824] to-[#B8CC34] opacity-70'}`}
                      ></motion.div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-3 text-[10px] sm:text-xs font-bold text-[#384022]/50 px-1 sm:px-2">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
              </motion.div>

              {/* Recent Activity List */}
              <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-xl border border-[#224D59]/10 rounded-3xl p-6 shadow-sm flex flex-col">
                <h3 className="text-lg font-extrabold text-[#224D59] mb-6">Recent Activity</h3>
                <div className="space-y-5 flex-1">
                  {[
                    { log: "Rahul added Google to targets", time: "10 mins ago", status: "bg-[#B8CC34]" },
                    { log: "Priya converted Microsoft lead", time: "1 hour ago", status: "bg-green-500" },
                    { log: "Bulk student data imported", time: "3 hours ago", status: "bg-[#224D59]" },
                    { log: "Follow-up reminder sent", time: "Yesterday", status: "bg-orange-400" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start">
                      <div className={`w-2.5 h-2.5 rounded-full mt-1.5 mr-3 flex-shrink-0 ${item.status}`}></div>
                      <div>
                        <p className="text-sm font-bold text-[#224D59]">{item.log}</p>
                        <p className="text-xs font-medium text-[#384022]/50 mt-0.5">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-6 py-3 rounded-xl bg-[#F5F7F2] text-[#224D59] font-bold text-sm hover:bg-[#E8EFE9] transition-colors">
                  View All Logs
                </button>
              </motion.div>

            </div>

          </motion.div>
        </div>
      </main>

    </div>
  );
};

export default AdminDashboard;