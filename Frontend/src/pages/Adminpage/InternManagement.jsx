import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from '../../components/admin/Sidebar'; 
import AdminHeader from '../../components/admin/Header';   
import { createAdminIntern, getAdminInterns } from '../../api/adminApi';

const InternsPage = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    branch: 'B.Tech CSE',
    status: 'Active',
  });

  const [interns, setInterns] = useState([]);

  const fetchInterns = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getAdminInterns();
      setInterns(data?.interns || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch interns');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInterns();
  }, []);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  // Helper function for status colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'Placed': return 'bg-green-100 text-green-700 border-green-200';
      case 'Active': return 'bg-[#B8CC34]/20 text-[#668824] border-[#B8CC34]/30';
      case 'Pending': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const normalizedInterns = interns.map((intern) => ({
    id: intern?._id || intern?.id,
    name: intern?.name || 'N/A',
    email: intern?.email || 'N/A',
    branch: intern?.branch || intern?.department || 'N/A',
    status: intern?.status || 'Active',
    tpo: intern?.tpo || intern?.assignedTPO?.companyName || 'Unassigned',
  }));

  const filteredInterns = normalizedInterns.filter((intern) =>
    [intern.name, intern.email, intern.branch, intern.tpo]
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      branch: 'B.Tech CSE',
      status: 'Active',
    });
  };

  const handleAddIntern = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError('Name, email and password are required to add intern');
      return;
    }

    setIsSaving(true);
    setError('');
    try {
      await createAdminIntern(formData);
      setIsModalOpen(false);
      resetForm();
      await fetchInterns();
    } catch (err) {
      setError(err.message || 'Failed to add intern');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F5F7F2] font-sans overflow-hidden selection:bg-[#B8CC34] selection:text-[#224D59]">
      
      {/* 🚀 SIDEBAR */}
      <div className="flex-none h-full z-40 transition-all duration-300 hidden lg:block">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-[#224D59]/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div 
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden shadow-2xl"
            >
              <AdminSidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 🚀 MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#B8CC34]/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
        
        <AdminHeader toggleSidebar={() => setIsMobileSidebarOpen(true)} />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 relative z-10 custom-scrollbar">
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-7xl mx-auto space-y-6">
            
            {/* Page Header & Actions */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-[#224D59]">Intern Management</h2>
                <p className="text-[#384022]/70 font-medium text-sm mt-1">Manage, add, or update intern details.</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#224D59]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  <input 
                    type="text" 
                    placeholder="Search interns..." 
                    className="w-full bg-white border border-[#224D59]/10 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[#B8CC34] focus:ring-2 focus:ring-[#B8CC34]/20 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#224D59] text-white font-bold text-sm hover:bg-[#1A3A43] shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                  Add Intern
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

            {/* Desktop Table View (Hidden on mobile) */}
            {!isLoading && (
            <motion.div variants={itemVariants} className="hidden md:block bg-white/80 backdrop-blur-xl border border-[#224D59]/10 rounded-3xl shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#224D59]/5 border-b border-[#224D59]/10">
                    <th className="py-4 px-6 text-xs font-extrabold text-[#224D59] uppercase tracking-wider">Intern Name</th>
                    <th className="py-4 px-6 text-xs font-extrabold text-[#224D59] uppercase tracking-wider">Branch</th>
                    <th className="py-4 px-6 text-xs font-extrabold text-[#224D59] uppercase tracking-wider">Status</th>
                    <th className="py-4 px-6 text-xs font-extrabold text-[#224D59] uppercase tracking-wider">Assigned TPO</th>
                    <th className="py-4 px-6 text-xs font-extrabold text-[#224D59] uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#224D59]/5">
                  {filteredInterns.map((intern) => (
                    <tr key={intern.id} className="hover:bg-[#F5F7F2]/50 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="w-9 h-9 rounded-full bg-[#B8CC34]/20 text-[#224D59] font-bold flex items-center justify-center mr-3">
                            {intern.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#224D59]">{intern.name}</p>
                            <p className="text-xs font-medium text-[#384022]/60">{intern.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-[#384022]/80">{intern.branch}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(intern.status)}`}>
                          {intern.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-[#384022]/80">{intern.tpo}</td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 text-[#224D59]/60 hover:text-[#224D59] hover:bg-[#F5F7F2] rounded-lg transition-colors" title="Edit">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                          </button>
                          <button className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
            )}

            {/* Mobile Card View (Visible only on mobile) */}
            <div className="md:hidden space-y-4">
              {!isLoading && filteredInterns.map((intern) => (
                <motion.div key={intern.id} variants={itemVariants} className="bg-white/80 backdrop-blur-xl border border-[#224D59]/10 rounded-2xl p-4 shadow-sm relative">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-[#B8CC34]/20 text-[#224D59] font-bold flex items-center justify-center mr-3">
                        {intern.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#224D59]">{intern.name}</p>
                        <p className="text-xs font-medium text-[#384022]/60">{intern.email}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${getStatusColor(intern.status)}`}>
                      {intern.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-4 bg-[#F5F7F2] p-3 rounded-xl border border-[#224D59]/5">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-[#384022]/50">Branch</p>
                      <p className="text-xs font-semibold text-[#224D59]">{intern.branch}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-[#384022]/50">Assigned TPO</p>
                      <p className="text-xs font-semibold text-[#224D59]">{intern.tpo}</p>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 border-t border-[#224D59]/5 pt-3">
                    <button className="flex items-center px-3 py-1.5 text-xs font-bold text-[#224D59] bg-[#F5F7F2] hover:bg-[#E8EFE9] rounded-lg transition-colors">
                      <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      Edit
                    </button>
                    <button className="flex items-center px-3 py-1.5 text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                      <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

          </motion.div>
        </div>
      </main>

      {/* 🚀 ADD/EDIT MODAL (Premium Glassmorphism) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#224D59]/40 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden border border-white/20"
            >
              <div className="bg-[#224D59] p-6 text-white flex justify-between items-center">
                <h3 className="text-lg font-extrabold tracking-wide">Add New Intern</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#224D59] uppercase tracking-wider mb-1">Full Name</label>
                  <input
                    type="text"
                    className="w-full bg-[#F5F7F2] border border-[#224D59]/10 rounded-xl px-4 py-2.5 text-sm text-[#224D59] outline-none focus:border-[#B8CC34] focus:ring-2 focus:ring-[#B8CC34]/20 transition-all"
                    placeholder="e.g. Rahul Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#224D59] uppercase tracking-wider mb-1">Email Address</label>
                  <input
                    type="email"
                    className="w-full bg-[#F5F7F2] border border-[#224D59]/10 rounded-xl px-4 py-2.5 text-sm text-[#224D59] outline-none focus:border-[#B8CC34] focus:ring-2 focus:ring-[#B8CC34]/20 transition-all"
                    placeholder="rahul@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#224D59] uppercase tracking-wider mb-1">Phone</label>
                  <input
                    type="text"
                    className="w-full bg-[#F5F7F2] border border-[#224D59]/10 rounded-xl px-4 py-2.5 text-sm text-[#224D59] outline-none focus:border-[#B8CC34] focus:ring-2 focus:ring-[#B8CC34]/20 transition-all"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#224D59] uppercase tracking-wider mb-1">Temporary Password</label>
                  <input
                    type="password"
                    className="w-full bg-[#F5F7F2] border border-[#224D59]/10 rounded-xl px-4 py-2.5 text-sm text-[#224D59] outline-none focus:border-[#B8CC34] focus:ring-2 focus:ring-[#B8CC34]/20 transition-all"
                    placeholder="At least 6 chars"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#224D59] uppercase tracking-wider mb-1">Branch</label>
                    <select
                      className="w-full bg-[#F5F7F2] border border-[#224D59]/10 rounded-xl px-4 py-2.5 text-sm text-[#224D59] outline-none focus:border-[#B8CC34] transition-all"
                      value={formData.branch}
                      onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    >
                      <option>B.Tech CSE</option>
                      <option>B.Tech IT</option>
                      <option>B.Tech ECE</option>
                      <option>MCA</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#224D59] uppercase tracking-wider mb-1">Status</label>
                    <select
                      className="w-full bg-[#F5F7F2] border border-[#224D59]/10 rounded-xl px-4 py-2.5 text-sm text-[#224D59] outline-none focus:border-[#B8CC34] transition-all"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option>Active</option>
                      <option>Pending</option>
                      <option>Placed</option>
                    </select>
                  </div>
                </div>
                <div className="pt-4 flex space-x-3">
                  <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl bg-[#F5F7F2] text-[#224D59] font-bold text-sm hover:bg-[#E8EFE9] transition-colors">
                    Cancel
                  </button>
                  <button
                    onClick={handleAddIntern}
                    disabled={isSaving}
                    className="flex-1 py-3 rounded-xl bg-[#B8CC34] text-[#224D59] font-bold text-sm hover:shadow-[0_0_15px_rgba(184,204,52,0.4)] transition-all disabled:opacity-70"
                  >
                    {isSaving ? 'Saving...' : 'Save Intern'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default InternsPage;
