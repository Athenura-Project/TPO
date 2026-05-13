import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from '../../components/admin/Sidebar'; 
import AdminHeader from '../../components/admin/Header';   

const AdminProfilePage = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Form States - User Details
  const [formData, setFormData] = useState({
    name: 'Avnish',
    email: 'avnishkumar6871@gmail.com',
    phone: '+91 9835051934',
    role: 'Super Admin',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Generate Initial ('A' for avnish)
  const initials = useMemo(() => {
    const name = formData.name || "Admin";
    return name.charAt(0).toUpperCase();
  }, [formData.name]);

  // Handle Save Actions
  const handleProfileSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    // Mock API Call delay
    setTimeout(() => {
      setSuccessMessage('Profile updated successfully!');
      setIsSaving(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1200);
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    setIsSaving(true);
    // Mock API Call
    setTimeout(() => {
      setSuccessMessage('Password updated!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setIsSaving(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1200);
  };

  // Sleeker Animation Variants
  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const itemVariants = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 25 } } };

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
        {/* Background Decorative Ambient Glows for Premium Depth */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#B8CC34]/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#224D59]/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

        <AdminHeader toggleSidebar={() => setIsMobileSidebarOpen(true)} activeTab="Profile Settings" />

        <div className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-12 relative z-10 custom-scrollbar">
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-6xl mx-auto space-y-8">
            
            {/* Header & Status Toast */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
              <div>
                <h2 className="text-3xl font-extrabold text-[#224D59] tracking-tight">Account Profile</h2>
                <p className="text-[#384022]/70 font-medium text-base mt-1.5">Manage your personal details and security settings.</p>
              </div>
              
              <AnimatePresence>
                {successMessage && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className="bg-[#B8CC34]/20 text-[#668824] px-5 py-3 rounded-2xl text-sm font-bold flex items-center shadow-sm border border-[#B8CC34]/30"
                  >
                    <svg className="w-4 h-4 mr-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                    {successMessage}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              
              {/* Left Column: Profile Card */}
              <motion.div variants={itemVariants} className="xl:col-span-1 space-y-6">
                <div className="bg-white/90 backdrop-blur-xl border border-[#224D59]/5 rounded-3xl p-8 shadow-[0_10px_40px_-15px_rgba(34,77,89,0.08)] flex flex-col items-center text-center relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-[#224D59] to-[#1A3A43]"></div>
                  
                  {/* Avatar Matching image brand feel with modern glow */}
                  <div className="relative mt-8 mb-5">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#224D59] to-[#1A3A43] flex items-center justify-center border-[6px] border-white shadow-xl relative z-10 transition-transform duration-300 group-hover:scale-105">
                      <span className="text-[#B8CC34] text-5xl font-extrabold">{initials}</span>
                    </div>
                    <div className="absolute inset-0 rounded-full bg-[#B8CC34]/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-[#224D59] tracking-tight transition-colors group-hover:text-[#668824]">{formData.name}</h3>
                  <p className="text-base font-medium text-[#384022]/60 mt-1 mb-8">{formData.email}</p>
                  
                  <div className="w-full border-t border-[#224D59]/5 pt-6 space-y-4">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-sm font-semibold text-[#384022]/50 uppercase tracking-wider">Role</span>
                      <span className="text-sm font-bold bg-[#B8CC34]/20 text-[#668824] px-4 py-1.5 rounded-full border border-[#B8CC34]/30 inline-block">{formData.role}</span>
                    </div>
                  </div>
                </div>

                {/* Account Status Card */}
                <div className="bg-[#224D59] rounded-3xl p-7 shadow-lg text-white relative overflow-hidden group">
                   <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-[#B8CC34]/20 rounded-full blur-[40px] pointer-events-none transition-transform duration-500 group-hover:scale-125"></div>
                   <h4 className="text-sm font-bold text-white/80 mb-5 uppercase tracking-wider">Account Info</h4>
                   <div className="space-y-3.5">
                     <div className="flex justify-between items-center border-b border-white/10 pb-3.5">
                       <span className="text-base text-white/70">Status</span>
                       <span className="text-base font-bold text-[#B8CC34]">🟢 Active (Verified)</span>
                     </div>
                     <div className="flex justify-between items-center pb-1">
                       <span className="text-base text-white/70">Last Login</span>
                       <span className="text-base font-bold text-white">Just Now</span>
                     </div>
                   </div>
                </div>
              </motion.div>

              {/* Right Column: Forms */}
              <motion.div variants={itemVariants} className="xl:col-span-2 space-y-8">
                
                {/* Personal Information Form */}
                <div className="bg-white/90 backdrop-blur-xl border border-[#224D59]/5 rounded-3xl p-8 sm:p-10 shadow-[0_10px_40px_-15px_rgba(34,77,89,0.08)]">
                  <h3 className="text-xl font-bold text-[#224D59] mb-8 tracking-tight pb-2 border-b-2 border-[#B8CC34]/30 inline-block">Personal Information</h3>
                  
                  <form onSubmit={handleProfileSave} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-7">
                      <div>
                        <label className="block text-xs font-bold text-[#384022] uppercase tracking-wider mb-2.5">Display Name</label>
                        <input 
                          type="text" 
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-[#F5F7F2] border border-[#224D59]/10 rounded-xl px-5 py-3.5 text-base font-medium text-[#224D59] outline-none focus:border-[#B8CC34] focus:ring-2 focus:ring-[#B8CC34]/20 focus:bg-white transition-all" 
                          required
                        />
                      </div>
                      
                      {/* 🔥 Locked Email Field 🔥 */}
                      <div>
                        <label className="block text-xs font-bold text-[#384022]/60 uppercase tracking-wider mb-2.5 flex items-center">
                          <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                          Email Address (Locked)
                        </label>
                        <input 
                          type="email" 
                          value={formData.email}
                          readOnly
                          disabled
                          className="w-full bg-[#E8EFE9] border border-[#224D59]/10 rounded-xl px-5 py-3.5 text-base font-medium text-[#8B9990] outline-none cursor-not-allowed" 
                        />
                      </div>

                      {/* 🔥 Locked Phone Field 🔥 */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-[#384022]/60 uppercase tracking-wider mb-2.5 flex items-center">
                          <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                          Phone Number (Locked)
                        </label>
                        <input 
                          type="text" 
                          value={formData.phone}
                          readOnly
                          disabled
                          className="w-full bg-[#E8EFE9] border border-[#224D59]/10 rounded-xl px-5 py-3.5 text-base font-medium text-[#8B9990] outline-none cursor-not-allowed" 
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end pt-5">
                      <button 
                        type="submit"
                        disabled={isSaving}
                        className="px-8 py-3 rounded-xl bg-[#224D59] text-white font-bold text-base hover:bg-[#1A3A43] transition-all hover:-translate-y-1 hover:shadow-lg disabled:opacity-70 flex items-center"
                      >
                        {isSaving ? (
                          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2.5"></span>
                        ) : null}
                        {isSaving ? 'Updating...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Security & Password Form */}
                <div className="bg-white/90 backdrop-blur-xl border border-[#224D59]/5 rounded-3xl p-8 sm:p-10 shadow-[0_10px_40px_-15px_rgba(34,77,89,0.08)]">
                  <h3 className="text-xl font-bold text-[#224D59] mb-8 tracking-tight pb-2 border-b-2 border-[#B8CC34]/30 inline-block">Security</h3>
                  
                  <form onSubmit={handlePasswordSave} className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-[#384022] uppercase tracking-wider mb-2.5">Current Password</label>
                      <input 
                        type="password" 
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        className="w-full bg-[#F5F7F2] border border-[#224D59]/10 rounded-xl px-5 py-3.5 text-base text-[#224D59] outline-none focus:border-[#B8CC34] focus:ring-2 focus:ring-[#B8CC34]/20 focus:bg-white transition-all" 
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-7">
                      <div>
                        <label className="block text-xs font-bold text-[#384022] uppercase tracking-wider mb-2.5">New Password</label>
                        <input 
                          type="password" 
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                          className="w-full bg-[#F5F7F2] border border-[#224D59]/10 rounded-xl px-5 py-3.5 text-base text-[#224D59] outline-none focus:border-[#B8CC34] focus:ring-2 focus:ring-[#B8CC34]/20 focus:bg-white transition-all" 
                          placeholder="••••••••"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#384022] uppercase tracking-wider mb-2.5">Confirm Password</label>
                        <input 
                          type="password" 
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          className="w-full bg-[#F5F7F2] border border-[#224D59]/10 rounded-xl px-5 py-3.5 text-base text-[#224D59] outline-none focus:border-[#B8CC34] focus:ring-2 focus:ring-[#B8CC34]/20 focus:bg-white transition-all" 
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end pt-5">
                      {/* Secondary action button feel with sleek border */}
                      <button 
                        type="submit"
                        disabled={isSaving}
                        className="px-8 py-3 rounded-xl bg-transparent border-2 border-[#224D59]/20 text-[#224D59] font-bold text-base hover:bg-[#F5F7F2] hover:border-[#224D59]/40 transition-all disabled:opacity-70 flex items-center"
                      >
                        {isSaving ? 'Processing...' : 'Update Password'}
                      </button>
                    </div>
                  </form>
                </div>

              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminProfilePage;