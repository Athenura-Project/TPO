import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from '../../components/admin/Sidebar'; 
import AdminHeader from '../../components/admin/Header';   
import { uploadAdminBulkFile } from '../../api/adminApi';

const BulkImportPage = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Upload States
  const [importType, setImportType] = useState('interns'); // 'interns' | 'institutes'
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  
  // Progress States: 'idle' -> 'uploading' -> 'validating' -> 'success'
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [importResult, setImportResult] = useState({ inserted: 0 });

  const fileInputRef = useRef(null);

  // Drag & Drop Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    // Check if file is CSV or Excel
    if (droppedFile && (droppedFile.name.endsWith('.csv') || droppedFile.name.endsWith('.xlsx'))) {
      setFile(droppedFile);
    } else {
      alert("Bhai, sirf CSV ya XLSX file hi upload kar sakte ho!");
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setError('');
      setFile(selectedFile);
    }
  };

  const startImport = async () => {
    if (!file) return;

    setError('');
    setImportResult({ inserted: 0 });
    setUploadStatus('uploading');
    setProgress(0);

    let current = 0;
    const interval = setInterval(() => {
      current = Math.min(current + 10, 90);
      setProgress(current);
    }, 200);

    try {
      const result = await uploadAdminBulkFile(file);
      clearInterval(interval);
      setProgress(100);
      setUploadStatus('validating');
      setImportResult({ inserted: result?.inserted ?? 0 });
      setTimeout(() => {
        setUploadStatus('success');
      }, 600);
    } catch (err) {
      clearInterval(interval);
      setProgress(0);
      setUploadStatus('idle');
      setError(err.message || 'Upload failed');
    }
  };

  const resetUpload = () => {
    setFile(null);
    setUploadStatus('idle');
    setProgress(0);
    setError('');
    setImportResult({ inserted: 0 });
  };

  // Animations
  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } };

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
        <AdminHeader toggleSidebar={() => setIsMobileSidebarOpen(true)} activeTab="Bulk Import" />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 relative z-10 custom-scrollbar pb-32">
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-4xl mx-auto space-y-6">
            
            {/* Page Header */}
            <motion.div variants={itemVariants} className="mb-8">
              <h2 className="text-2xl font-extrabold text-[#224D59]">Bulk Data Import</h2>
              <p className="text-[#384022]/70 font-medium text-sm mt-1">Upload CSV or Excel sheets to rapidly add thousands of records.</p>
            </motion.div>

            {error && (
              <motion.div variants={itemVariants} className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </motion.div>
            )}

            {/* 🚀 MAIN UPLOAD CARD */}
            <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-xl border border-[#224D59]/10 rounded-3xl shadow-lg overflow-hidden relative">
              
              {/* Step 1: Data Type Selection */}
              <div className="p-6 border-b border-[#224D59]/10 bg-[#F5F7F2]/50">
                <h3 className="text-sm font-extrabold text-[#224D59] uppercase tracking-wider mb-4">1. What are you importing?</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className={`flex-1 flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${importType === 'interns' ? 'border-[#B8CC34] bg-white shadow-md' : 'border-[#224D59]/10 bg-transparent hover:bg-white/50'} ${uploadStatus !== 'idle' ? 'opacity-50 pointer-events-none' : ''}`}>
                    <input type="radio" name="importType" value="interns" checked={importType === 'interns'} onChange={() => setImportType('interns')} className="hidden" />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${importType === 'interns' ? 'border-[#B8CC34]' : 'border-[#224D59]/30'}`}>
                      {importType === 'interns' && <div className="w-2.5 h-2.5 bg-[#B8CC34] rounded-full"></div>}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#224D59]">Student / Interns</p>
                      <p className="text-[10px] text-[#384022]/60 mt-0.5">Import student details, branches, and statuses</p>
                    </div>
                  </label>
                  
                  <label className={`flex-1 flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${importType === 'institutes' ? 'border-[#B8CC34] bg-white shadow-md' : 'border-[#224D59]/10 bg-transparent hover:bg-white/50'} ${uploadStatus !== 'idle' ? 'opacity-50 pointer-events-none' : ''}`}>
                    <input type="radio" name="importType" value="institutes" checked={importType === 'institutes'} onChange={() => setImportType('institutes')} className="hidden" />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${importType === 'institutes' ? 'border-[#B8CC34]' : 'border-[#224D59]/30'}`}>
                      {importType === 'institutes' && <div className="w-2.5 h-2.5 bg-[#B8CC34] rounded-full"></div>}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#224D59]">Partner Institutes / TPOs</p>
                      <p className="text-[10px] text-[#384022]/60 mt-0.5">Import company names, HR contacts, and emails</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Step 2: File Upload Zone */}
              <div className="p-6 sm:p-10">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-extrabold text-[#224D59] uppercase tracking-wider">2. Upload File</h3>
                  <button className="text-xs font-bold text-[#668824] hover:text-[#B8CC34] flex items-center transition-colors">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    Download Sample Template
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {/* IDLE STATE: Drag & Drop Area */}
                  {uploadStatus === 'idle' && (
                    <motion.div 
                      key="idle"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${isDragging ? 'border-[#B8CC34] bg-[#B8CC34]/5 scale-[1.02]' : file ? 'border-[#224D59] bg-[#224D59]/5' : 'border-[#224D59]/20 bg-gray-50 hover:bg-[#F5F7F2]'}`}
                    >
                      <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".csv, .xlsx" className="hidden" />
                      
                      {file ? (
                        <>
                          <div className="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center mb-4 text-[#B8CC34]">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          </div>
                          <p className="text-lg font-extrabold text-[#224D59]">{file.name}</p>
                          <p className="text-xs font-medium text-[#384022]/60 mt-1">{(file.size / 1024).toFixed(2)} KB • Click to change file</p>
                        </>
                      ) : (
                        <>
                          <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-[#224D59]/40">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                          </div>
                          <p className="text-base font-bold text-[#224D59]">Click to browse or drag file here</p>
                          <p className="text-xs font-medium text-[#384022]/50 mt-2">Supports .CSV, .XLSX files up to 10MB</p>
                        </>
                      )}
                    </motion.div>
                  )}

                  {/* UPLOADING / VALIDATING STATE */}
                  {(uploadStatus === 'uploading' || uploadStatus === 'validating') && (
                    <motion.div key="uploading" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full bg-[#F5F7F2] rounded-2xl p-8 border border-[#224D59]/10">
                      <div className="flex justify-between items-end mb-3">
                        <div>
                          <p className="text-sm font-extrabold text-[#224D59]">
                            {uploadStatus === 'uploading' ? 'Uploading Data...' : 'Validating Records...'}
                          </p>
                          <p className="text-[10px] font-bold text-[#384022]/50 mt-1">{file?.name}</p>
                        </div>
                        <span className="text-xl font-black text-[#B8CC34]">{progress}%</span>
                      </div>
                      <div className="w-full h-3 bg-white rounded-full overflow-hidden shadow-inner border border-[#224D59]/5">
                        <motion.div className="h-full bg-gradient-to-r from-[#224D59] to-[#B8CC34]" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.2 }} />
                      </div>
                    </motion.div>
                  )}

                  {/* SUCCESS / SUMMARY STATE */}
                  {uploadStatus === 'success' && (
                    <motion.div key="success" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
                      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6 flex items-start">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex-shrink-0 flex items-center justify-center text-white shadow-md mr-4">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <div className="w-full">
                          <h4 className="text-base font-extrabold text-green-800">Validation Successful!</h4>
                          <p className="text-xs font-medium text-green-700/80 mt-1">Your file has been scanned and is ready for import.</p>
                          
                          <div className="grid grid-cols-2 gap-4 mt-5">
                            <div className="bg-white px-4 py-3 rounded-xl shadow-sm border border-green-100 flex justify-between items-center">
                              <div>
                                <p className="text-[10px] uppercase font-bold text-gray-500">Valid Records</p>
                                <p className="text-xl font-black text-green-600">{importResult.inserted}</p>
                              </div>
                              <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center text-green-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                              </div>
                            </div>
                            <div className="bg-white px-4 py-3 rounded-xl shadow-sm border border-orange-100 flex justify-between items-center">
                              <div>
                                <p className="text-[10px] uppercase font-bold text-gray-500">Skipped / Failed</p>
                                <p className="text-xl font-black text-orange-500">N/A</p>
                              </div>
                              <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center text-orange-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Actions Footer */}
                <div className="mt-8 pt-6 border-t border-[#224D59]/10 flex justify-end gap-4">
                  {uploadStatus === 'idle' ? (
                    <button 
                      onClick={startImport} 
                      disabled={!file} 
                      className="px-8 py-3 rounded-xl bg-[#224D59] text-white font-extrabold text-sm hover:bg-[#1A3A43] shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                    >
                      Process File
                    </button>
                  ) : uploadStatus === 'success' ? (
                    <>
                      <button 
                        onClick={resetUpload} 
                        className="px-6 py-3 rounded-xl border border-[#224D59]/20 text-[#224D59] font-bold text-sm hover:bg-[#F5F7F2] transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => {
                          resetUpload();
                        }} 
                        className="px-8 py-3 rounded-xl bg-[#B8CC34] text-[#224D59] font-extrabold text-sm hover:shadow-[0_0_20px_rgba(184,204,52,0.5)] transition-all transform hover:-translate-y-0.5"
                      >
                        Confirm Import
                      </button>
                    </>
                  ) : null}
                </div>

              </div>
            </motion.div>

          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default BulkImportPage;
