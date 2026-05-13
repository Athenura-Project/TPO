import React, { useState, useEffect, useRef } from 'react';
import {  AnimatePresence,motion } from 'framer-motion';
import AdminSidebar from '../../components/admin/Sidebar'; 
import AdminHeader from '../../components/admin/Header';   

import { getAdminInterns, assignAdminTPO, getTPOs } from '../../api/adminApi';

// Remove the mock API service and use real APIs

// ==========================================
// 🚀 MAIN COMPONENT
// ==========================================
const AllocationsPage = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data States
  const [tpos, setTpos] = useState([]);
  const [interns, setInterns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Allocation States
  const [selectedInterns, setSelectedInterns] = useState([]);

  const [selectedCompany, setSelectedCompany] = useState({
    id: "",
    name: ""
  });// ✅ FIXED: Proper object structure
  const [isAssigning, setIsAssigning] = useState(false);

  // Autocomplete UI States
  const [showSuggestions, setShowSuggestions] = useState(false);


  const wrapperRef = useRef(null);




  const fetchInterns = async () => {

    setIsLoading(true);
  
    try {
  
      const response = await getAdminInterns();
  
      if (response?.success) {
        const mappedInterns = response.interns.map(
          (intern) => ({
            ...intern,
            id: intern._id,
          })
        );
        setInterns(mappedInterns);
      }
  
    } catch (error) {
  
      console.error("Failed to fetch interns", error);
  
    } finally {
  
      setIsLoading(false);
  
    }
  };
  
  const fetchTPOs = async () => {
  
    try {
  
      const response = await getTPOs();
  
      console.log("FULL API RESPONSE:", response);
  
      if (response?.success) {
        setTpos(response.tpos || []);
      }
  
    } catch (error) {
  
      console.error("Failed to fetch TPOs", error);
  
    }
  };
  
  useEffect(() => {
  
    fetchInterns();
    fetchTPOs();
  
    const handleClickOutside = (event) => {
  
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };
  
    
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  
  // ==========================================
  // 🔍 FILTERS & DERIVED DATA
  // ==========================================
  const filteredInterns = interns.filter(intern =>
    (intern.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (intern.studentId || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (intern.branch || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    ((intern.tpoIds || []).some(tpo => tpo.instituteName?.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const uniqueCompanies = tpos.map(tpo => ({
    id: tpo.id || tpo._id,
    name: tpo.instituteName
  }));
  
  const filteredSuggestions = uniqueCompanies.filter(comp =>
    comp.name.toLowerCase().includes(selectedCompany.name.toLowerCase())
  );
  

  // ==========================================
  // 🚀 SELECT ALL
  // ==========================================
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedInterns(
        filteredInterns.map((i) =>
          String(i.id)
        )
      );
    } else {
      setSelectedInterns([]);
    }
  };
  


    // Click outside to close suggestions
  //   const handleClickOutside = (event) => {
  //     if (
  //       wrapperRef.current &&
  //       !wrapperRef.current.contains(
  //         event.target
  //       )
  //     ) {
  //       setShowSuggestions(false);
  //     }
  //   };

  //   document.addEventListener(
  //     "mousedown",
  //     handleClickOutside
  //   );

  //   return () => {
  //     document.removeEventListener(
  //       "mousedown",
  //       handleClickOutside
  //     );
  //   };
  // }, []);

  const handleSelectOne = (id) => {
    const idStr = String(id); // ✅ FIXED: Convert to string for consistent comparison
    const selectedStr = selectedInterns.map(i => String(i));

    if (selectedStr.includes(idStr)) {
      setSelectedInterns(selectedInterns.filter(internId => String(internId) !== idStr));
    } else {
      setSelectedInterns([...selectedInterns, id]);
    }
  };

  // Bulk Assign Action
  const handleBulkAssign = async () => {
     // ✅ FIX: Validate selectedCompany is an object with id
     if (!selectedCompany?.id) {
      alert("❌ Please select a valid institute first!");
      return;
    }
    if (selectedInterns.length === 0) {
      alert("❌ Please select at least one intern to assign!");
      return;
    }

    setIsAssigning(true);
   


    try {
      const payload = {
        internIds: selectedInterns.map(String), // ✅ Ensure all IDs are strings
        tpoId: selectedCompany.id
      };
  
      console.log("🔥 FINAL PAYLOAD:", payload);
  
      const response = await assignAdminTPO(payload);
  
      console.log("✅ RESPONSE:", response);
  
      if (response?.success) {
        alert("✅ Interns assigned successfully!");
        setSelectedInterns([]);
        
        setSelectedCompany({
          id: "",
          name: "",
        });

        fetchInterns();
      } else {
        alert("❌ Assignment failed");
      }
  
    } catch (err) {
      console.error(err);
      alert("❌ Server error while assigning");
    } finally {
      setIsAssigning(false);
    }
  };

  // Animations
  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } };

  // Status Styling
  const getStatusColor = (status) => {
    return status === 'Assigned' 
      ? 'bg-green-100 text-green-700 border-green-200' 
      : 'bg-orange-100 text-orange-700 border-orange-200';
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
        
        <AdminHeader toggleSidebar={() => setIsMobileSidebarOpen(true)} activeTab="Allocations" />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 relative z-10 custom-scrollbar pb-32">
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-7xl mx-auto space-y-6">
            
            {/* Page Header */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-[#224D59]">Intern Allocations</h2>
                <p className="text-[#384022]/70 font-medium text-sm mt-1">Assign selected students to specific companies/institutes.</p>
              </div>
              
              <div className="relative w-full sm:w-72">
                <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#224D59]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <input 
                  type="text" 
                  placeholder="Search interns or branch..." 
                  className="w-full bg-white border border-[#224D59]/10 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[#B8CC34] focus:ring-2 focus:ring-[#B8CC34]/20 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </motion.div>

            {/* Smart Bulk Action Bar */}
            <AnimatePresence>
              {selectedInterns.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: -20, height: 0 }} 
                  animate={{ opacity: 1, y: 0, height: 'auto' }} 
                  exit={{ opacity: 0, y: -20, height: 0 }}
                  className="bg-gradient-to-r from-[#224D59] to-[#1A3A43] rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/20 relative z-30"
                >
                  <div className="flex items-center text-[#B8CC34] font-bold">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-3">
                      {selectedInterns.length}
                    </div>
                    <span>Interns Selected</span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto relative" ref={wrapperRef}>
                    
                    {/* 🚀 CUSTOM AUTOCOMPLETE INPUT */}
                    <div className="relative w-full sm:w-64">
                      <input 
                        type="text"
                        value={selectedCompany.name} // Support both object and string states
                        onChange={(e) => {
                          setSelectedCompany({
                            id: "",
                            name: e.target.value
                          });
                          setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder="Type Institute Name..."
                        className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#B8CC34] focus:bg-white/20 transition-all"
                      />
                      
                      {/* Dropdown Suggestions Panel */}
                      <AnimatePresence>
                      {showSuggestions && selectedCompany.name && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 max-h-48 overflow-y-auto"
                          >
                            {filteredSuggestions.length > 0 ? (
                              filteredSuggestions.map((comp, idx) => (
                                <div 
                                  key={idx}
                                  onClick={() => {
                                    setSelectedCompany({
                                      id: comp.id,
                                      name: comp.name
                                    });
                                  
                                    setShowSuggestions(false);
                                  }}
                                  className="px-4 py-3 text-sm text-[#224D59] font-medium hover:bg-[#F5F7F2] cursor-pointer border-b border-gray-50 last:border-0"
                                >
                                {comp.name}
                                </div>
                              ))
                            ) : (
                              <div className="px-4 py-3 text-sm text-gray-500 italic flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                Type to add as new institute
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    <button 
                      onClick={handleBulkAssign}
                      disabled={isAssigning}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#B8CC34] text-[#224D59] font-extrabold text-sm hover:shadow-[0_0_15px_rgba(184,204,52,0.4)] transition-all flex items-center justify-center disabled:opacity-70 whitespace-nowrap"
                    >
                      {isAssigning ? (
                        <span className="w-5 h-5 border-2 border-[#224D59]/30 border-t-[#224D59] rounded-full animate-spin"></span>
                      ) : (
                        "Assign Interns"
                      )}
                    </button>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* API Loading State */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                 <div className="w-12 h-12 border-4 border-[#B8CC34]/30 border-t-[#B8CC34] rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <motion.div variants={itemVariants} className="hidden md:block bg-white/80 backdrop-blur-xl border border-[#224D59]/10 rounded-3xl shadow-sm overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#224D59]/5 border-b border-[#224D59]/10">
                        <th className="py-4 px-6 w-12">
                          <input 
                            type="checkbox" 
                            onChange={handleSelectAll}
                            checked={
                              filteredInterns.length > 0 &&
                              selectedInterns.length === filteredInterns.length
                            }
                            className="w-4 h-4 accent-[#B8CC34] rounded cursor-pointer"
                          />
                        </th>
                        <th className="py-4 px-4 text-xs font-extrabold text-[#224D59] uppercase tracking-wider">Intern Details</th>
                        <th className="py-4 px-6 text-xs font-extrabold text-[#224D59] uppercase tracking-wider">Branch</th>
                        <th className="py-4 px-6 text-xs font-extrabold text-[#224D59] uppercase tracking-wider">Status</th>
                        <th className="py-4 px-6 text-xs font-extrabold text-[#224D59] uppercase tracking-wider">Current Assignment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#224D59]/5">
                      {filteredInterns.map((intern) => (
                        <tr 
                          key={intern.id} 
                          className={`transition-colors group ${selectedInterns.includes(intern.id) ? 'bg-[#B8CC34]/10' : 'hover:bg-[#F5F7F2]/50'}`}
                        >
                          <td className="py-4 px-6">
                            <input 
                              type="checkbox" 
                              checked={selectedInterns.includes(String(intern.id))} // ✅ FIXED: Ensure ID is treated as string
                              onChange={() => handleSelectOne(String(intern.id))} // ✅ FIXED: Ensure ID is treated as string
                              className="w-4 h-4 accent-[#B8CC34] rounded cursor-pointer"
                            />
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <div className="w-9 h-9 rounded-full bg-[#B8CC34]/20 text-[#224D59] font-bold flex items-center justify-center mr-3">
                                {(intern.name || "?").charAt(0)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-bold text-[#224D59]">{intern.name}</p>
                                  <span className="text-[10px] font-black bg-[#224D59]/5 text-[#224D59]/40 px-1.5 py-0.5 rounded-md border border-[#224D59]/10">
                                    {intern.studentId || "N/A"}
                                  </span>
                                </div>
                                <p className="text-xs font-medium text-[#384022]/60">{intern.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-sm font-medium text-[#384022]/80">{intern.branch}</td>
                          <td className="py-4 px-6">
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border uppercase tracking-wider ${getStatusColor(intern.status)}`}>
                              {intern.status}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex flex-col gap-1">
                              {intern.tpoIds && intern.tpoIds.length > 0 ? (
                                intern.tpoIds.map((tpo, idx) => (
                                  <div key={idx} className="flex items-center text-xs font-bold text-[#224D59]">
                                    <svg className="w-3 h-3 text-[#B8CC34] mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                                    {tpo.instituteName}
                                  </div>
                                ))
                              ) : (
                                <span className="text-sm font-bold text-gray-400">-</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                  <div className="flex items-center justify-between bg-white/50 p-3 rounded-xl border border-[#224D59]/10">
                    <span className="text-xs font-bold text-[#224D59] uppercase tracking-wider">Select All Interns</span>
                    <input 
                      type="checkbox" 
                      onChange={handleSelectAll}
                      checked={selectedInterns.length === filteredInterns.length && filteredInterns.length > 0}
                      className="w-5 h-5 accent-[#B8CC34] rounded cursor-pointer"
                    />
                  </div>

                  {filteredInterns.map((intern) => (
                    <motion.div 
                      key={intern.id} 
                      variants={itemVariants} 
                      onClick={() => handleSelectOne(String(intern.id))}
                      className={`backdrop-blur-xl border rounded-2xl p-4 shadow-sm relative cursor-pointer transition-colors ${selectedInterns.includes(intern.id) ? 'bg-[#B8CC34]/10 border-[#B8CC34]' : 'bg-white/80 border-[#224D59]/10'}`}
                    >
                      <div className="absolute top-4 right-4">
                        <input 
                          type="checkbox" 
                          checked={selectedInterns.includes(String(intern.id))} // ✅ FIXED: Ensure ID is treated as string
                          onChange={() => handleSelectOne(String(intern.id))} // ✅ FIXED: Ensure ID is treated as string   
                          readOnly
                          className="w-5 h-5 accent-[#B8CC34] rounded cursor-pointer pointer-events-none"
                        />
                      </div>

                      <div className="flex items-center mb-3 pr-8">
                        <div className="w-10 h-10 rounded-full bg-[#B8CC34]/20 text-[#224D59] font-bold flex items-center justify-center mr-3 flex-shrink-0">
                          {(intern.name || "?").charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-[#224D59]">{intern.name}</p>
                            <span className="text-[10px] font-black bg-[#224D59]/5 text-[#224D59]/40 px-1.5 py-0.5 rounded-md border border-[#224D59]/10">
                              {intern.studentId || "N/A"}
                            </span>
                          </div>
                          <p className="text-[11px] font-medium text-[#384022]/60">{intern.email}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 bg-[#F5F7F2] p-2.5 rounded-xl border border-[#224D59]/5">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-[#384022]/50">Status</p>
                          <span className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${getStatusColor(intern.status)}`}>
                            {intern.status}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] uppercase font-bold text-[#384022]/50">Assignments</p>
                          <p className={`text-xs font-bold mt-0.5 truncate ${(!intern.tpoIds || intern.tpoIds.length === 0) ? 'text-gray-400' : 'text-[#224D59]'}`}>
                            {intern.tpoIds && intern.tpoIds.length > 0 ? intern.tpoIds.map(t => t.instituteName).join(", ") : "-"}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AllocationsPage;