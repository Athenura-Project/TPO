import React, { useState, useEffect } from 'react';
import { AnimatePresence , motion} from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // 1. Imported useNavigate
import AdminSidebar from '../../components/admin/Sidebar'; 
import AdminHeader from '../../components/admin/Header';   

import { 
  getAdminTPOs, 
  createAdminTPO, 
  updateAdminTPO, 
  deleteAdminTPO,
  getAdminInterns,
  assignAdminTPO,
  unassignAdminTPO
} from '../../api/adminApi';

// Remove the mock API service as we will use real APIs


// ==========================================
// 🚀 MAIN COMPONENT
// ==========================================
const TPOsPage = () => {
  const navigate = useNavigate(); // 2. Initialized navigate
  
  // Layout States
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data States
  const [tpos, setTpos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal States (Handles both Add and Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [formData, setFormData] = useState({ id: null, instituteName: '', tpoName: '', email: '', status: 'New' });
  
  // Details Modal States
  const [selectedTpoForDetail, setSelectedTpoForDetail] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Assignment Modal States
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [allInterns, setAllInterns] = useState([]);
  const [assignSearchQuery, setAssignSearchQuery] = useState('');
  const [selectedTpoForAssign, setSelectedTpoForAssign] = useState(null);

  // 1. Initial Data Fetch
  const fetchTPOs = async () => {
    setIsLoading(true);
  
    try {
      const response = await getAdminTPOs();
  
      console.log("FULL API RESPONSE:", response);
  
      const tpoList =
        response?.tpos ||
        response?.data?.tpos ||
        response?.data ||
        [];
  
      const safeTpos = tpoList
        .filter(tpo => tpo && (tpo._id || tpo.id))
        .map(tpo => ({
          id: tpo._id || tpo.id,
          instituteName: tpo.instituteName || tpo.companyName || "",
          tpoName: tpo.tpoName || tpo.contactPerson || "",
          email: tpo.email || "",
          status: tpo.status || "New",

         // ✅ ADD THIS
    studentsRegistered: tpo.studentsRegistered || 0,

    // ✅ ADD THIS
    lastActive: tpo.lastActive || "Just now",
    
    // ✅ ADD THIS
    assignedInterns: tpo.assignedInterns || [],
    interactions: tpo.interactions || []
        }));
    
  
      console.log("SAFE TPOS:", safeTpos);
  
      setTpos(safeTpos);
  
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchTPOs();
  }, []);

  const fetchInterns = async () => {
    try {
      const response = await getAdminInterns();
      if (response?.success) {
        setAllInterns(response.interns || []);
      }
    } catch (err) {
      console.error("Failed to fetch interns:", err);
    }
  };

  const handleAssign = async (internId) => {
    if (!selectedTpoForAssign) return;
    try {
      await assignAdminTPO({
        internIds: [internId],
        tpoId: selectedTpoForAssign.id
      });
      // Refresh both lists
      fetchTPOs();
      // Optionally update the selectedTpoForAssign to show latest assigned
      const updatedTpo = tpos.find(t => t.id === selectedTpoForAssign.id);
      if (updatedTpo) setSelectedTpoForAssign(updatedTpo);
    } catch (err) {
      console.error("Assignment failed:", err);
    }
  };

  const handleUnassign = async (internId) => {
    if (!selectedTpoForAssign) return;
    try {
      await unassignAdminTPO({
        internId,
        tpoId: selectedTpoForAssign.id
      });
      fetchTPOs();
      // Update local state to reflect removal
      setSelectedTpoForAssign(prev => ({
        ...prev,
        assignedInterns: prev.assignedInterns.filter(i => i._id !== internId)
      }));
    } catch (err) {
      console.error("Unassignment failed:", err);
    }
  };

  // 2. Open Modal for Add or Edit
  const openModal = (mode, tpo = null) => {
    setModalMode(mode);
  
    console.log("OPEN MODAL RAW TPO:", tpo);
  
    if (mode === "edit" && (!tpo || !tpo.id)) {
      console.error("INVALID TPO PASSED:", tpo);
      return;
    }
  
    setFormData({
      id: tpo?.id || null,
      instituteName: tpo?.instituteName || "",
      tpoName: tpo?.tpoName || "",
      email: tpo?.email || "",
      status: tpo?.status || "New"
    });
  
    setIsModalOpen(true);
  };

  // 3. Handle Save (Create or Update)
  const handleSave = async () => {
    console.log("FORM DATA:", formData);
    try {
      if (modalMode === "edit") {
        if (!formData.id) {
          console.error("Missing ID:", formData);
          return;
        }
  
        await updateAdminTPO(formData.id, formData);
      } else {
        await createAdminTPO(formData);
      }
  
      fetchTPOs();
      setIsModalOpen(false);
  
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  // 4. Handle Delete
  const handleDelete = async (id) => {
    if (!id) {
      console.error("Missing ID in delete:", id);
      return;
    }
  
    if (window.confirm("Are you sure?")) {
      await deleteAdminTPO(id);
      fetchTPOs();
    }
  };

  // Animation Variants
  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } };

  // Helper for Status UI
  const getStatusColor = (status) => {
    if(status.includes('Active')) return 'bg-green-100 text-green-700 border-green-200';
    if(status.includes('Pending')) return 'bg-orange-100 text-orange-700 border-orange-200';
    if(status.includes('Inactive')) return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  // 3. Improved Search Filter (Checks Name, TPO, Email, and Status)
  const filteredTPOs = tpos.filter(tpo => {
    if (!searchQuery) return true;
    const searchString = `${tpo.instituteName} ${tpo.tpoName} ${tpo.email} ${tpo.status} ${tpo.assignedInterns?.map(i => i.studentId).join(' ')}`.toLowerCase();
    return searchString.includes(searchQuery.toLowerCase());
  });

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
        
        {/* 4. Connected Global Header Search */}
        <AdminHeader 
          toggleSidebar={() => setIsMobileSidebarOpen(true)} 
          activeTab="Institute TPOs" 
          onSearch={(val) => setSearchQuery(val)} 
        />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 relative z-10 custom-scrollbar">
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-7xl mx-auto space-y-6">
            
            {/* Header Actions */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-[#224D59]">Registered Institutes</h2>
                <p className="text-[#384022]/70 font-medium text-sm mt-1">Manage College TPOs and their registered students.</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#224D59]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  <input 
                    type="text" 
                    placeholder="Search institutes or TPOs..." 
                    className="w-full bg-white border border-[#224D59]/10 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[#B8CC34] focus:ring-2 focus:ring-[#B8CC34]/20 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                {/* 5. Added Bulk Import Button */}
                <button 
                  onClick={() => navigate('/admin/bulk/import')}
                  className="px-5 py-2.5 rounded-xl bg-white border border-[#224D59]/10 text-[#224D59] font-bold text-sm hover:bg-[#F5F7F2] shadow-sm hover:shadow transition-all flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2 text-[#224D59]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                  </svg>
                  Bulk Import
                </button>

                <button 
                  onClick={() => openModal('add')}
                  className="px-5 py-2.5 rounded-xl bg-[#224D59] text-white font-bold text-sm hover:bg-[#1A3A43] shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                  Add Institute
                </button>
              </div>
            </motion.div>

            {/* API Loading State */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                 <div className="w-12 h-12 border-4 border-[#B8CC34]/30 border-t-[#B8CC34] rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <motion.div variants={itemVariants} className="hidden md:block bg-white/80 backdrop-blur-xl border border-[#224D59]/10 rounded-3xl shadow-sm overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#224D59]/5 border-b border-[#224D59]/10">
                        <th className="py-4 px-6 text-xs font-extrabold text-[#224D59] uppercase tracking-wider">Institute Name</th>
                        <th className="py-4 px-6 text-xs font-extrabold text-[#224D59] uppercase tracking-wider">TPO Contact</th>
                        <th className="py-4 px-6 text-xs font-extrabold text-[#224D59] uppercase tracking-wider">Status</th>
                        <th className="py-4 px-6 text-xs font-extrabold text-[#224D59] uppercase tracking-wider text-center">Students Reg.</th>
                        <th className="py-4 px-6 text-xs font-extrabold text-[#224D59] uppercase tracking-wider">Assign Intern</th>
                        <th className="py-4 px-6 text-xs font-extrabold text-[#224D59] uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#224D59]/5">
                    {filteredTPOs
  .filter(tpo => tpo?.id)
  .map((tpo) => (
                        <tr key={tpo.id} className="hover:bg-[#F5F7F2]/50 transition-colors group">
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#224D59] to-[#1A3A43] text-[#B8CC34] font-black flex items-center justify-center mr-3 shadow-sm">
                              {(tpo.instituteName?.[0] || '?').toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-[#224D59]">{tpo.instituteName}</p>
                                <p className="text-xs font-medium text-[#384022]/50">Last Active: {tpo.lastActive}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <p className="text-sm font-bold text-[#224D59]">{tpo.tpoName}</p>
                            <p className="text-xs font-medium text-[#384022]/70">{tpo.email}</p>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(tpo.status)}`}>
                              {tpo.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span className="text-lg font-black text-[#224D59]">{tpo.studentsRegistered}</span>
                          </td>
                          <td className="py-4 px-6">
                            <button 
                              onClick={() => {
                                setSelectedTpoForAssign(tpo);
                                setIsAssignModalOpen(true);
                                fetchInterns();
                              }}
                              className="px-4 py-2 bg-[#B8CC34] text-[#224D59] text-xs font-black rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                              Manage
                            </button>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => {
                                  setSelectedTpoForDetail(tpo);
                                  setIsDetailsModalOpen(true);
                                }}
                                className="px-3 py-1 bg-[#224D59] text-white text-[10px] font-bold rounded-lg hover:bg-[#1A3A43] transition-all"
                              >
                                View Details
                              </button>
                              <button  onClick={() => openModal('edit', tpo)} className="p-1.5 text-[#224D59]/60 hover:text-[#224D59] hover:bg-[#F5F7F2] rounded-lg transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                              </button>
                              <button   onClick={() => tpo?.id && handleDelete(tpo.id)}className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                  {filteredTPOs.map((tpo) => (
                    <motion.div key={tpo.id} variants={itemVariants} className="bg-white/80 backdrop-blur-xl border border-[#224D59]/10 rounded-2xl p-4 shadow-sm relative">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#224D59] to-[#1A3A43] text-[#B8CC34] font-black flex items-center justify-center mr-3 shadow-sm text-lg">
                          {(tpo.instituteName?.[0] || '?').toUpperCase()}
                          </div>
                          <div>
                            <p className="text-base font-bold text-[#224D59] leading-tight">{tpo.instituteName}</p>
                            <span className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${getStatusColor(tpo.status)}`}>
                              {tpo.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-[#F5F7F2] p-3 rounded-xl border border-[#224D59]/5 mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <p className="text-[10px] uppercase font-bold text-[#384022]/50">TPO Contact</p>
                            <p className="text-xs font-semibold text-[#224D59]">{tpo.tpoName}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] uppercase font-bold text-[#384022]/50">Students</p>
                            <p className="text-sm font-black text-[#224D59]">{tpo.studentsRegistered}</p>
                          </div>
                        </div>
                        <p className="text-[11px] font-medium text-[#224D59]/70 flex items-center mt-1 pt-2 border-t border-[#224D59]/5">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                          {tpo.email}
                        </p>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <button 
                          onClick={() => {
                            setSelectedTpoForDetail(tpo);
                            setIsDetailsModalOpen(true);
                          }}
                          className="text-xs font-bold text-[#224D59] hover:text-[#B8CC34] transition-colors"
                        >
                          View Details
                        </button>
                        <div className="flex space-x-2">
                          <button onClick={() => {
  console.log("TPO PASSED TO MODAL:", tpo);
  openModal('edit', tpo);
}}className="p-2 text-[#224D59] bg-[#F5F7F2] hover:bg-[#E8EFE9] rounded-lg transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                          </button>
                          <button onClick={() => handleDelete(tpo.id)} className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          </button>
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

      {/* 🚀 ADD/EDIT MODAL (Handles API Saving) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#224D59]/40 backdrop-blur-sm"
              onClick={() => !isSaving && setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-xl relative z-10 overflow-hidden border border-white/20"
            >
              <div className="bg-gradient-to-r from-[#224D59] to-[#1A3A43] p-6 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-extrabold tracking-wide">
                    {modalMode === 'add' ? 'Register New Institute' : 'Edit Institute Profile'}
                  </h3>
                  <p className="text-xs text-[#B8CC34] font-medium opacity-80">Manage College & TPO Details</p>
                </div>
                <button disabled={isSaving} onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-[#B8CC34] bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-all disabled:opacity-50">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
              
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-[#224D59] uppercase tracking-wider mb-1.5">College / Institute Name</label>
                  <input 
                    type="text" 
                    value={formData.instituteName}
                    onChange={(e) => setFormData({...formData, instituteName: e.target.value})}
                    className="w-full bg-[#F5F7F2] border border-[#224D59]/10 rounded-xl px-4 py-3 text-sm text-[#224D59] outline-none focus:border-[#B8CC34] focus:ring-2 focus:ring-[#B8CC34]/20 transition-all" 
                    placeholder="e.g. Delhi Technological University" 
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-[#224D59] uppercase tracking-wider mb-1.5">TPO Name</label>
                    <input 
                      type="text" 
                      value={formData.tpoName}
                      // value={formData.status}
                      onChange={(e) => setFormData({...formData, tpoName: e.target.value})}
                      className="w-full bg-[#F5F7F2] border border-[#224D59]/10 rounded-xl px-4 py-3 text-sm text-[#224D59] outline-none focus:border-[#B8CC34] focus:ring-2 focus:ring-[#B8CC34]/20 transition-all" 
                      placeholder="e.g. Dr. Arvind Sharma" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#224D59] uppercase tracking-wider mb-1.5">Official Email</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-[#F5F7F2] border border-[#224D59]/10 rounded-xl px-4 py-3 text-sm text-[#224D59] outline-none focus:border-[#B8CC34] focus:ring-2 focus:ring-[#B8CC34]/20 transition-all" 
                      placeholder="tpo@college.edu" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#224D59] uppercase tracking-wider mb-1.5">Account Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full bg-[#F5F7F2] border border-[#224D59]/10 rounded-xl px-4 py-3 text-sm text-[#224D59] outline-none focus:border-[#B8CC34] focus:ring-2 focus:ring-[#B8CC34]/20 transition-all appearance-none cursor-pointer"
                  >
                   <option value="New">🆕 New</option>
                   <option value="Contacted">📞 Contacted</option>
                  <option value="Follow-up Required">🔁 Follow-up Required</option>
                  <option value="Converted">✅ Converted</option>
                  </select>
                </div>

                <div className="pt-4 flex space-x-3 border-t border-[#224D59]/10">
                  <button disabled={isSaving} onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl border border-[#224D59]/20 text-[#224D59] font-bold text-sm hover:bg-[#F5F7F2] transition-colors disabled:opacity-50">
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 py-3 rounded-xl bg-[#224D59] text-white font-bold text-sm hover:bg-[#1A3A43] shadow-[0_5px_15px_rgba(34,77,89,0.3)] transition-all flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      modalMode === 'add' ? 'Register Institute' : 'Save Changes'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
 
      {/* 🚀 DETAILS MODAL */}
      <AnimatePresence>
        {isDetailsModalOpen && selectedTpoForDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsDetailsModalOpen(false)} 
              className="absolute inset-0 bg-[#224D59]/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-[#224D59] to-[#1A3A43] text-white flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#B8CC34] text-[#224D59] font-black flex items-center justify-center text-xl shadow-lg">
                    {selectedTpoForDetail.instituteName[0]}
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold">{selectedTpoForDetail.instituteName}</h3>
                    <p className="text-[#B8CC34] text-xs font-bold">{selectedTpoForDetail.tpoName} • {selectedTpoForDetail.email}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                {/* Assigned Interns Section */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-4 bg-[#B8CC34] rounded-full"></div>
                    <h4 className="text-sm font-black text-[#224D59] uppercase tracking-wider">Assigned Interns</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedTpoForDetail.assignedInterns?.length > 0 ? (
                      selectedTpoForDetail.assignedInterns.map((intern, idx) => (
                        <div key={idx} className="p-3 rounded-2xl bg-[#F5F7F2] border border-[#224D59]/5 flex flex-col gap-1">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-black text-[#224D59]">{intern.name}</span>
                            <span className="px-2 py-0.5 bg-[#B8CC34] text-[#224D59] text-[9px] font-black rounded-md">{intern.studentId}</span>
                          </div>
                          <span className="text-[10px] text-[#384022]/60 font-medium">{intern.email}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-[#384022]/40 font-medium italic italic ml-2">No interns assigned yet.</p>
                    )}
                  </div>
                </section>

                {/* Interaction History Section */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-4 bg-[#224D59] rounded-full"></div>
                    <h4 className="text-sm font-black text-[#224D59] uppercase tracking-wider">Interaction History</h4>
                  </div>
                  <div className="space-y-4">
                    {selectedTpoForDetail.interactions?.length > 0 ? (
                      [...selectedTpoForDetail.interactions].reverse().map((it, idx) => (
                        <div key={idx} className="relative pl-6 pb-4 border-l-2 border-[#224D59]/10 last:border-0 last:pb-0">
                          <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-[#B8CC34] shadow-[0_0_10px_rgba(184,204,52,0.5)]"></div>
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-[10px] font-black text-[#224D59]">{it.internName || it.internId?.name || `ID: ${it.studentId}`}</span>
                            <span className="text-[10px] text-[#384022]/40 font-bold">
                              {new Date(it.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className="p-3 rounded-2xl bg-white border border-[#224D59]/8 shadow-sm">
                            <p className="text-xs text-[#224D59] font-medium leading-relaxed italic">"{it.note}"</p>
                            <div className="mt-2 flex items-center gap-2">
                              <span className="px-2 py-0.5 bg-[#224D59]/5 text-[#224D59] text-[8px] font-black uppercase tracking-wider rounded-md border border-[#224D59]/10">
                                Mode: {it.contactMethod || "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-[#384022]/40 font-medium italic ml-2">No notes recorded yet.</p>
                    )}
                  </div>
                </section>
              </div>

              {/* Footer */}
              <div className="p-4 bg-[#F5F7F2] border-t border-[#224D59]/8 flex justify-end">
                <button 
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="px-6 py-2 rounded-xl bg-[#224D59] text-white font-bold text-sm hover:shadow-lg transition-all"
                >
                  Close View
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
 
      {/* 🚀 ASSIGN INTERN MODAL */}
      <AnimatePresence>
        {isAssignModalOpen && selectedTpoForAssign && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsAssignModalOpen(false)} 
              className="absolute inset-0 bg-[#224D59]/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              {/* Header */}
              <div className="p-6 bg-[#224D59] text-white flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-extrabold">Manage Assignments</h3>
                  <p className="text-white/60 text-xs font-bold mt-0.5">{selectedTpoForAssign.instituteName}</p>
                </div>
                <button 
                  onClick={() => setIsAssignModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
 
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {/* Currently Assigned */}
                <div className="p-4 bg-[#F5F7F2]/50 border-b border-[#224D59]/10">
                   <h4 className="text-[10px] font-black text-[#224D59]/40 uppercase tracking-widest mb-3">Currently Assigned</h4>
                   <div className="flex flex-wrap gap-2">
                      {selectedTpoForAssign.assignedInterns?.length > 0 ? (
                        selectedTpoForAssign.assignedInterns.map((intern, idx) => (
                          <div key={idx} className="flex items-center gap-2 pl-3 pr-1.5 py-1.5 bg-[#224D59] text-white rounded-xl text-xs font-bold shadow-sm">
                             <span>{intern.name} ({intern.studentId})</span>
                             <button 
                                onClick={() => handleUnassign(intern._id)}
                                className="w-5 h-5 rounded-lg bg-red-500/20 text-red-200 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all"
                             >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                             </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-[#384022]/40 font-medium italic">No interns assigned yet.</p>
                      )}
                   </div>
                </div>
 
                {/* Search & List */}
                <div className="p-4 flex flex-col flex-1 min-h-0">
                   <div className="relative mb-4">
                      <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#224D59]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                      <input 
                        type="text" 
                        placeholder="Search for an intern to assign..." 
                        className="w-full bg-[#F5F7F2] border border-[#224D59]/10 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[#B8CC34] focus:ring-2 focus:ring-[#B8CC34]/20 transition-all font-semibold"
                        value={assignSearchQuery}
                        onChange={(e) => setAssignSearchQuery(e.target.value)}
                      />
                   </div>
 
                   <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                      {allInterns
                        .filter(i => {
                          const query = assignSearchQuery.toLowerCase();
                          return i.name?.toLowerCase().includes(query) || i.studentId?.toLowerCase().includes(query);
                        })
                        .map((intern) => {
                          const isAlreadyAssigned = selectedTpoForAssign.assignedInterns?.some(ai => ai._id === intern._id);
                          return (
                            <div key={intern._id} className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${isAlreadyAssigned ? 'bg-[#F5F7F2] border-[#224D59]/5 opacity-60' : 'bg-white border-[#224D59]/10 hover:border-[#B8CC34] hover:shadow-sm'}`}>
                               <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-[#B8CC34]/20 text-[#224D59] font-black flex items-center justify-center text-xs">
                                     {(intern.name || "?")[0]}
                                  </div>
                                  <div>
                                     <p className="text-sm font-bold text-[#224D59]">{intern.name}</p>
                                     <p className="text-[10px] font-black text-[#384022]/40 tracking-wider uppercase">{intern.studentId} • {intern.branch}</p>
                                  </div>
                               </div>
                               {!isAlreadyAssigned && (
                                 <button 
                                   onClick={() => handleAssign(intern._id)}
                                   className="px-4 py-1.5 bg-[#B8CC34] text-[#224D59] text-[10px] font-black uppercase rounded-lg hover:shadow-md transition-all active:scale-95"
                                 >
                                   Assign
                                 </button>
                               )}
                            </div>
                          );
                        })
                      }
                   </div>
                </div>
              </div>
 
              {/* Footer */}
              <div className="p-4 bg-[#F5F7F2] border-t border-[#224D59]/10 flex justify-end">
                <button 
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-6 py-2 rounded-xl bg-[#224D59] text-white font-bold text-sm hover:shadow-lg transition-all"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default TPOsPage;