import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from '../../components/admin/Sidebar'; 
import AdminHeader from '../../components/admin/Header';   
import { getAdminAnalytics } from '../../api/adminApi';

const AnalyticsPage = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await getAdminAnalytics();
        setAnalytics(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch analytics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // ==========================================
  // 🚀 MOCK ANALYTICS DATA
  // ==========================================
  const summaryStats = [
    { title: "Total Interns", value: analytics?.totalInterns ?? 0, trend: "Live", color: "bg-white", text: "text-[#224D59]" },
    { title: "Converted TPOs", value: analytics?.convertedTPOs ?? 0, trend: `${analytics?.conversionRate ?? 0}% Conversion`, color: "bg-gradient-to-br from-[#224D59] to-[#1A3A43]", text: "text-white", badge: "bg-white/20 text-white" },
    { title: "Total TPOs", value: analytics?.totalTPOs ?? 0, trend: "Live", color: "bg-white", text: "text-[#224D59]" },
    { title: "Conversion Rate", value: `${analytics?.conversionRate ?? 0}%`, trend: "Live", color: "bg-gradient-to-br from-[#B8CC34] to-[#8FA622]", text: "text-[#224D59]", badge: "bg-black/10 text-[#224D59]" }
  ];

  const branchStats = [
    { name: "Computer Science (CSE)", percentage: 88, placed: 320, total: 363 },
    { name: "Information Tech. (IT)", percentage: 82, placed: 210, total: 256 },
    { name: "Electronics (ECE)", percentage: 65, placed: 180, total: 276 },
    { name: "Mechanical (ME)", percentage: 45, placed: 90, total: 200 },
    { name: "Civil Engineering (CE)", percentage: 38, placed: 42, total: 110 },
  ];

  const topRecruiters = [
    { company: "Google India", hires: 24, avgPackage: "24 LPA" },
    { company: "Microsoft", hires: 18, avgPackage: "22 LPA" },
    { company: "Amazon", hires: 15, avgPackage: "20 LPA" },
    { company: "TCS Digital", hires: 85, avgPackage: "7.5 LPA" },
    { company: "Accenture", hires: 112, avgPackage: "6.5 LPA" },
  ];

  // Placement Timeline Data (Mock)
  const timelineData = [40, 55, 30, 85, 110, 95, 130, 160, 140, 190, 210, 180];
  const maxTimelineValue = Math.max(...timelineData);

  // Animations
  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } };


  // ==========================================
  // 🚀 DOWNLOAD CSV REPORT LOGIC
  // ==========================================
  const downloadReport = () => {
    setIsDownloading(true);

    // Simulate network delay for a better UX
    setTimeout(() => {
      // 1. Create CSV content
      let csvContent = "data:text/csv;charset=utf-8,";
      
      // Add Branch Stats
      csvContent += "Branch Performance\n";
      csvContent += "Branch Name,Placement Percentage,Students Placed,Total Students\n";
      branchStats.forEach(row => {
        csvContent += `"${row.name}",${row.percentage}%,${row.placed},${row.total}\n`;
      });
      
      csvContent += "\n"; // Empty row for separation
      
      // Add Top Recruiters
      csvContent += "Top Recruiters\n";
      csvContent += "Company Name,Total Hires,Average Package\n";
      topRecruiters.forEach(row => {
        csvContent += `"${row.company}",${row.hires},"${row.avgPackage}"\n`;
      });

      // 2. Create a Blob and Download Link
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Athenura_Placement_Report_${new Date().toISOString().split('T')[0]}.csv`);
      
      // 3. Trigger download
      document.body.appendChild(link); // Required for FF
      link.click();
      document.body.removeChild(link); 

      setIsDownloading(false);
    }, 1000); // 1 second fake delay
  };


  return (
    <div className="flex h-screen bg-[#F5F7F2] font-sans overflow-hidden selection:bg-[#B8CC34] selection:text-[#224D59]">
      
      {/* 🚀 SIDEBAR */}
      <div className="flex-none h-full z-40 transition-all duration-300 hidden lg:block">
        <AdminSidebar />
      </div>

      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileSidebarOpen(false)} className="fixed inset-0 bg-[#224D59]/60 backdrop-blur-sm z-40 lg:hidden" />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed inset-y-0 left-0 z-50 lg:hidden shadow-2xl">
              <AdminSidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 🚀 MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#B8CC34]/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
        <AdminHeader toggleSidebar={() => setIsMobileSidebarOpen(true)} activeTab="Analytics & Reports" />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 relative z-10 custom-scrollbar pb-32">
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-7xl mx-auto space-y-6">
            
            {/* Page Header */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
              <div>
                <h2 className="text-2xl font-extrabold text-[#224D59]">Dashboard Overview</h2>
                <p className="text-[#384022]/70 font-medium text-sm mt-1">Track placement metrics and institute performance.</p>
              </div>
              <button 
                onClick={downloadReport}
                disabled={isDownloading}
                className="px-5 py-2.5 rounded-xl bg-white border border-[#224D59]/10 text-[#224D59] font-bold text-sm hover:bg-[#F5F7F2] shadow-sm transition-colors flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isDownloading ? (
                  <span className="w-4 h-4 mr-2 border-2 border-[#224D59]/30 border-t-[#224D59] rounded-full animate-spin"></span>
                ) : (
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                )}
                {isDownloading ? "Generating..." : "Download Full Report"}
              </button>
            </motion.div>

            {error && (
              <motion.div variants={itemVariants} className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </motion.div>
            )}

            {isLoading && (
              <motion.div variants={itemVariants} className="flex justify-center py-10">
                <div className="w-10 h-10 border-4 border-[#B8CC34]/30 border-t-[#B8CC34] rounded-full animate-spin"></div>
              </motion.div>
            )}

            {/* 🚀 TOP SUMMARY CARDS */}
            {!isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {summaryStats.map((stat, index) => (
                <motion.div 
                  key={index} 
                  variants={itemVariants} 
                  className={`p-6 rounded-3xl shadow-[0_10px_30px_rgba(34,77,89,0.05)] border border-[#224D59]/5 ${stat.color}`}
                >
                  <h3 className={`text-sm font-bold mb-2 opacity-80 ${stat.text}`}>{stat.title}</h3>
                  <div className={`text-3xl md:text-4xl font-black mb-3 ${stat.text}`}>{stat.value}</div>
                  <div className={`text-[11px] font-bold px-2.5 py-1 inline-block rounded-md tracking-wide uppercase ${stat.badge || 'bg-[#F5F7F2] text-[#224D59]'}`}>
                    {stat.trend}
                  </div>
                </motion.div>
              ))}
            </div>
            )}

            {/* 🚀 CHARTS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 pt-4">
              
              {/* Placement Timeline (CSS Bar Chart) */}
              <motion.div variants={itemVariants} className="lg:col-span-2 bg-white/80 backdrop-blur-xl border border-[#224D59]/10 rounded-3xl p-5 sm:p-7 shadow-sm flex flex-col min-h-[350px] relative overflow-hidden">
                {/* Decorative background circle */}
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#B8CC34]/5 rounded-full blur-2xl"></div>
                
                <div className="flex justify-between items-center mb-8 relative z-10">
                  <div>
                    <h3 className="text-lg font-extrabold text-[#224D59]">Placement Timeline</h3>
                    <p className="text-xs font-medium text-[#384022]/60 mt-1">Number of offers per month (2025-2026)</p>
                  </div>
                  <select className="bg-[#F5F7F2] border border-[#224D59]/10 text-[#224D59] text-xs font-bold rounded-lg px-3 py-1.5 outline-none cursor-pointer">
                    <option>This Year</option>
                    <option>Last Year</option>
                  </select>
                </div>
                
                {/* Animated Bar Chart */}
                <div className="flex-1 flex items-end justify-between space-x-1 sm:space-x-3 pt-4 border-b border-[#224D59]/5 pb-2 relative z-10">
                  {timelineData.map((val, i) => (
                    <div key={i} className="w-full flex flex-col items-center group h-full justify-end relative">
                      {/* Tooltip on Hover */}
                      <div className="absolute -top-8 bg-[#224D59] text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        {val} Offers
                      </div>
                      <motion.div 
                        initial={{ height: 0 }} 
                        animate={{ height: `${(val / maxTimelineValue) * 100}%` }} 
                        transition={{ duration: 1.5, delay: i * 0.05, ease: "easeOut" }}
                        className="w-full rounded-t-sm sm:rounded-t-md transition-all duration-300 bg-gradient-to-t from-[#224D59]/80 to-[#224D59] group-hover:from-[#B8CC34] group-hover:to-[#B8CC34] opacity-80 group-hover:opacity-100"
                      ></motion.div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-3 text-[9px] sm:text-[10px] font-bold text-[#384022]/50 px-1 uppercase tracking-widest relative z-10">
                  <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                </div>
              </motion.div>

              {/* Top Recruiters List */}
              <motion.div variants={itemVariants} className="bg-[#224D59] border border-[#224D59]/10 rounded-3xl p-5 sm:p-7 shadow-lg flex flex-col text-white relative overflow-hidden">
                {/* Decorative element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#B8CC34]/20 rounded-bl-full pointer-events-none"></div>

                <h3 className="text-lg font-extrabold mb-1 relative z-10">Top Recruiters</h3>
                <p className="text-xs text-white/60 font-medium mb-6 relative z-10">Companies with most hires this season</p>
                
                <div className="space-y-4 flex-1 relative z-10">
                  {topRecruiters.map((comp, i) => (
                    <div key={i} className="flex items-center justify-between group">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-[#B8CC34] text-xs mr-3">
                          {i + 1}
                        </div>
                        <div>
                          <p className="text-sm font-bold group-hover:text-[#B8CC34] transition-colors">{comp.company}</p>
                          <p className="text-[10px] font-medium text-white/50 mt-0.5">Avg: {comp.avgPackage}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-white">{comp.hires}</span>
                        <span className="text-[10px] text-white/50 ml-1 block">Hires</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

            </div>

            {/* 🚀 BRANCH WISE PERFORMANCE */}
            <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-xl border border-[#224D59]/10 rounded-3xl p-5 sm:p-7 shadow-sm mt-6">
              <h3 className="text-lg font-extrabold text-[#224D59] mb-1">Branch-wise Performance</h3>
              <p className="text-xs font-medium text-[#384022]/60 mb-6">Placement percentage across different departments</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {branchStats.map((branch, i) => (
                  <div key={i} className="w-full">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm font-bold text-[#224D59]">{branch.name}</span>
                      <div className="text-right">
                        <span className="text-sm font-black text-[#B8CC34]">{branch.percentage}%</span>
                        <span className="text-[10px] text-[#384022]/50 ml-2">({branch.placed}/{branch.total})</span>
                      </div>
                    </div>
                    {/* Progress Bar Track */}
                    <div className="w-full h-2.5 bg-[#F5F7F2] rounded-full overflow-hidden border border-[#224D59]/5">
                      {/* Animated Fill */}
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${branch.percentage}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className={`h-full rounded-full ${branch.percentage > 75 ? 'bg-[#B8CC34]' : branch.percentage > 50 ? 'bg-[#224D59]' : 'bg-orange-400'}`}
                      ></motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsPage;
