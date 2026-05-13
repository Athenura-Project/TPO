import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getAdminDashboardSummary } from '../../api/adminApi';

// Importing our newly created Layout Components
import AdminSidebar from '../../components/admin/Sidebar'; // Adjust path if needed
import AdminHeader from '../../components/admin/Header';   // Adjust path if needed

const AdminDashboard = () => {
  const navigate = useNavigate();
  // Global states for Dashboard Layout
  const [activeTab, setActiveTab] = useState('Overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await getAdminDashboardSummary();
        setSummary(data);
      } catch (err) {
        const message = err.message || 'Failed to load dashboard summary';
        setError(message);
        if (message.toLowerCase().includes('session') || message.toLowerCase().includes('token') || message.toLowerCase().includes('authorized')) {
          setTimeout(() => {
            navigate('/');
          }, 1200);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, [navigate]);

  // 🚀 FEATURE 1: Export Report Logic (Generates and downloads a CSV file)
  const handleExportReport = () => {
    if (!summary) return; // Prevent export if data isn't loaded

    // Create CSV content based on current dashboard data
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Category,Metric,Value\n";
    
    // Overview Stats
    csvContent += `Overview,Total Interns,${summary.overview?.totalInterns || 0}\n`;
    csvContent += `Overview,Total TPOs,${summary.overview?.totalTPOs || 0}\n`;
    csvContent += `Overview,Converted TPOs,${summary.overview?.convertedTPOs || 0}\n`;
    csvContent += `Overview,Conversion Rate,${summary.overview?.conversionRate || 0}%\n`;

    // Status Breakdown
    if (summary.statusBreakdown) {
      Object.entries(summary.statusBreakdown).forEach(([status, count]) => {
        csvContent += `Status Breakdown,${status},${count}\n`;
      });
    }

    // Trigger Download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    // Filename will be like Dashboard_Report_2023-10-27.csv
    link.setAttribute("download", `Dashboard_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 🚀 FEATURE 2: Add New Lead Logic (Navigates to TPO page)
  const handleAddNewLead = () => {
    setActiveTab('TPOs'); // Update sidebar state
    navigate('/admin/tpo'); // Redirect to TPO management page where leads are added
  };

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

  const overview = summary?.overview;
  const statusBreakdown = summary?.statusBreakdown || {};

  const stats = [
    { title: "Total Interns", value: overview?.totalInterns ?? 0, increment: "Live", color: "from-[#224D59] to-[#1A3A43]", text: "text-white" },
    { title: "Total TPOs", value: overview?.totalTPOs ?? 0, increment: "Live", color: "bg-white", text: "text-[#224D59]" },
    { title: "Converted TPOs", value: overview?.convertedTPOs ?? 0, increment: "Live", color: "bg-white", text: "text-[#224D59]" },
    { title: "TPO Conversion", value: `${overview?.conversionRate ?? 0}%`, increment: "Live", color: "bg-[#B8CC34]", text: "text-[#224D59]" }
  ];

  const recentInterns = (summary?.recentInterns || []).map((intern) => ({
    log: `${intern?.name || 'Intern'} joined`,
    time: intern?.createdAt ? new Date(intern.createdAt).toLocaleDateString() : 'N/A',
    status: 'bg-[#B8CC34]',
  }));

  const recentTpos = (summary?.recentTPOs || []).map((tpo) => ({
    log: `${tpo?.companyName || 'TPO'} (${tpo?.status || 'Unknown'})`,
    time: tpo?.createdAt ? new Date(tpo.createdAt).toLocaleDateString() : 'N/A',
    status: 'bg-[#224D59]',
  }));

  const activityItems = [...recentInterns, ...recentTpos].slice(0, 6);

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
                {/* Export Report Button connected to function */}
                <button 
                  onClick={handleExportReport}
                  disabled={isLoading || !summary}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-white border border-[#224D59]/10 text-[#224D59] font-bold text-sm hover:bg-[#F5F7F2] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Export Report
                </button>
                {/* Add New Lead Button connected to function */}
                <button 
                  onClick={handleAddNewLead}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#224D59] text-white font-bold text-sm hover:bg-[#1A3A43] shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  + Add New Lead
                </button>
              </div>
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

            {/* Stats Grid */}
            {!isLoading && (
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
            )}

            {/* Main Charts & Lists Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Performance Update (Weekly Dual-Bar Chart) */}
              <motion.div variants={itemVariants} className="lg:col-span-2 bg-white/80 backdrop-blur-xl border border-[#224D59]/10 rounded-3xl p-6 shadow-sm flex flex-col min-h-[350px] relative overflow-hidden">
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#B8CC34]/5 rounded-full blur-2xl"></div>
                
                <div className="flex justify-between items-center mb-8 relative z-10">
                  <div>
                    <h3 className="text-lg font-extrabold text-[#224D59]">Performance Update</h3>
                    <p className="text-xs font-medium text-[#384022]/60 mt-1">Weekly comparison of TPOs added vs converted.</p>
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
                
                {/* Animated Dual Bar Chart */}
                <div className="flex-1 flex items-stretch justify-between gap-2 sm:gap-4 pt-4 border-b border-[#224D59]/5 pb-2 relative z-10 h-64 px-2">
                  {(() => {
                    const weeklyData = summary?.weeklyData;
                    const labels = weeklyData?.labels || ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                    const addedData = weeklyData?.added || new Array(7).fill(0);
                    const convertedData = weeklyData?.converted || new Array(7).fill(0);
                    const maxVal = Math.max(...addedData, ...convertedData, 1);

                    return labels.map((day, i) => {
                      const addedVal = addedData[i];
                      const convertedVal = convertedData[i];
                      const addedHeight = (addedVal / maxVal) * 100;
                      const convertedHeight = (convertedVal / maxVal) * 100;

                      return (
                        <div key={i} className="flex-1 flex flex-col items-center group min-w-[30px]">
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
                          <span className="mt-4 text-[10px] font-black text-[#224D59]/40 uppercase">{day}</span>
                        </div>
                      );
                    });
                  })()}
                </div>
              </motion.div>


              {/* Recent Activity List */}
              <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-xl border border-[#224D59]/10 rounded-3xl p-6 shadow-sm flex flex-col">
                <h3 className="text-lg font-extrabold text-[#224D59] mb-6">Recent Activity</h3>
                <div className="space-y-5 flex-1">
                  {(activityItems.length ? activityItems : [{ log: "No recent activity found", time: "-", status: "bg-gray-300" }]).map((item, i) => (
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
                  {`Status: Active ${statusBreakdown.Active ?? 0} | Converted ${statusBreakdown.Converted ?? 0}`}
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