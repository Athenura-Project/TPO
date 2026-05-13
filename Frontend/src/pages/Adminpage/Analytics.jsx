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
        console.log("ANALYTICS DATA:", data);
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

  const branchStats = analytics?.branchStats || [];


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
      
      // Section: Summary Stats
      csvContent += "Summary Statistics\n";
      csvContent += `Total Interns,${analytics?.totalInterns || 0}\n`;
      csvContent += `Total TPOs,${analytics?.totalTPOs || 0}\n`;
      csvContent += `Converted TPOs,${analytics?.convertedTPOs || 0}\n`;
      csvContent += `Conversion Rate,${analytics?.conversionRate || 0}%\n\n`;

      // Section: Branch Stats
      csvContent += "Branch-wise Performance\n";
      csvContent += "Branch Name,Placement Percentage,Students Placed,Total Students\n";
      branchStats.forEach(row => {
        csvContent += `"${row.name}",${row.percentage}%,${row.placed},${row.total}\n`;
      });
      csvContent += "\n";

      // Section: Monthly Performance (Performance Update)
      csvContent += "Monthly Performance Update (Last 12 Months)\n";
      csvContent += "Month,TPOs Added,TPOs Converted\n";
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      months.forEach((month, i) => {
        const added = analytics?.timelineData?.added?.[i] || 0;
        const converted = analytics?.timelineData?.converted?.[i] || 0;
        csvContent += `${month},${added},${converted}\n`;
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



            {/* 🚀 PERFORMANCE UPDATE (Dual-Bar Chart) */}
            <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-xl border border-[#224D59]/10 rounded-3xl p-5 sm:p-7 shadow-sm flex flex-col min-h-[400px] relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#B8CC34]/5 rounded-full blur-2xl"></div>
              
              <div className="flex justify-between items-center mb-8 relative z-10">
                <div>
                  <h3 className="text-lg font-extrabold text-[#224D59]">Performance Update</h3>
                  <p className="text-xs font-medium text-[#384022]/60 mt-1">Monthly comparison of TPOs added vs converted leads.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#224D59]"></div>
                    <span className="text-[10px] font-bold text-[#224D59]">Added</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#B8CC34]"></div>
                    <span className="text-[10px] font-bold text-[#224D59]">Converted</span>
                  </div>
                </div>
              </div>
              
              {/* Performance Bars */}
              <div className="flex-1 flex items-stretch justify-between gap-1 sm:gap-2 pt-10 border-b border-[#224D59]/10 pb-2 relative z-10 h-64 px-2">
                {(() => {
                  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                  const addedData = analytics?.timelineData?.added || new Array(12).fill(0);
                  const convertedData = analytics?.timelineData?.converted || new Array(12).fill(0);
                  const maxVal = Math.max(...addedData, ...convertedData, 1);

                  return months.map((month, i) => {
                    const addedVal = addedData[i];
                    const convertedVal = convertedData[i];
                    const addedHeight = (addedVal / maxVal) * 100;
                    const convertedHeight = (convertedVal / maxVal) * 100;
                    
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center group min-w-[20px]">
                        <div className="flex-1 w-full flex items-end justify-center gap-1">
                          {/* Added Bar */}
                          <div className="relative flex-1 h-full flex flex-col justify-end group/added">
                            {addedVal > 0 && (
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#224D59] text-white text-[9px] font-bold px-2 py-1 rounded shadow-lg z-30 whitespace-nowrap opacity-0 group-hover/added:opacity-100 transition-opacity">
                                {addedVal} Added
                              </div>
                            )}
                            <motion.div 
                              initial={{ height: 0 }}
                              animate={{ height: `${addedHeight}%` }}
                              className="w-full bg-[#224D59] rounded-t-sm min-h-[2px]"
                            />
                          </div>

                          {/* Converted Bar */}
                          <div className="relative flex-1 h-full flex flex-col justify-end group/converted">
                            {convertedVal > 0 && (
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#B8CC34] text-[#224D59] text-[9px] font-bold px-2 py-1 rounded shadow-lg z-30 whitespace-nowrap opacity-0 group-hover/converted:opacity-100 transition-opacity">
                                {convertedVal} Conv.
                              </div>
                            )}
                            <motion.div 
                              initial={{ height: 0 }}
                              animate={{ height: `${convertedHeight}%` }}
                              className="w-full bg-[#B8CC34] rounded-t-sm min-h-[2px]"
                            />
                          </div>
                        </div>
                        <span className="mt-4 text-[9px] font-black text-[#224D59]/40 uppercase">{month}</span>
                      </div>
                    );
                  });
                })()}
              </div>

            </motion.div>

          </motion.div>

        </div>
      </main>
    </div>
  );
};

export default AnalyticsPage;
