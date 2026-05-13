import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { bulkAssignTPOsToIntern, getAdminTPOs } from '../../api/adminApi';

const BulkAssignTPOsModal = ({ isOpen, onClose, intern, onAssignComplete }) => {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [allTPOs, setAllTPOs] = useState([]);
    const [selectedTPOs, setSelectedTPOs] = useState(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const [selectAll, setSelectAll] = useState(false);

    // Fetch all TPOs when modal opens
    useEffect(() => {
        if (isOpen && intern) {
            fetchAllTPOs();
        }
    }, [isOpen, intern]);

    const fetchAllTPOs = async () => {
        setFetching(true);
        try {
            const response = await getAdminTPOs();
            console.log("Fetched TPOs for bulk assign:", response);
            
            let tpoList = [];
            if (response?.tpos) {
                tpoList = response.tpos;
            } else if (response?.data?.tpos) {
                tpoList = response.data.tpos;
            } else if (Array.isArray(response)) {
                tpoList = response;
            } else if (response?.data && Array.isArray(response.data)) {
                tpoList = response.data;
            }
            
            // Get already assigned TPO IDs for this intern
            const alreadyAssignedIds = intern?.tpoIds?.map(id => id.toString()) || [];
            
            // 🔥 FILTER: Only show TPOs with ZERO students registered AND not already assigned
            const availableTPOs = tpoList.filter(tpo => {
                const tpoId = tpo._id || tpo.id;
                const studentsCount = tpo.studentsRegistered || 0;
                const isAlreadyAssigned = alreadyAssignedIds.includes(tpoId?.toString());
                
                // Only include TPOs that have 0 students AND are not already assigned to this intern
                return studentsCount === 0 && !isAlreadyAssigned;
            });
            
            console.log(`Found ${availableTPOs.length} TPOs with 0 students`);
            setAllTPOs(availableTPOs);
            
            // Reset selections when TPOs change
            setSelectedTPOs(new Set());
            setSelectAll(false);
            
        } catch (error) {
            console.error("Failed to fetch TPOs:", error);
        } finally {
            setFetching(false);
        }
    };

    const handleToggleTPO = (tpoId) => {
        const newSelected = new Set(selectedTPOs);
        if (newSelected.has(tpoId)) {
            newSelected.delete(tpoId);
        } else {
            newSelected.add(tpoId);
        }
        setSelectedTPOs(newSelected);
        setSelectAll(newSelected.size === allTPOs.length && allTPOs.length > 0);
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedTPOs(new Set());
        } else {
            setSelectedTPOs(new Set(allTPOs.map(tpo => tpo._id || tpo.id)));
        }
        setSelectAll(!selectAll);
    };

    const handleAssign = async () => {
        if (selectedTPOs.size === 0) {
            alert("Please select at least one TPO to assign");
            return;
        }

        setLoading(true);
        try {
            const response = await bulkAssignTPOsToIntern({
                internId: intern._id,
                tpoIds: Array.from(selectedTPOs)
            });
            
            if (response.success) {
                alert(`✅ Successfully assigned ${selectedTPOs.size} TPO(s) to ${intern.name}`);
                onAssignComplete?.();
                onClose();
            } else {
                alert(response.message || "Assignment failed. Please try again.");
            }
        } catch (error) {
            console.error("Assignment error:", error);
            alert(error.response?.data?.message || "Failed to assign TPOs. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const filteredTPOs = allTPOs.filter(tpo => {
        const instituteName = (tpo.instituteName || tpo.companyName || "").toLowerCase();
        const tpoName = (tpo.tpoName || tpo.contactPerson || "").toLowerCase();
        const email = (tpo.email || "").toLowerCase();
        const query = searchQuery.toLowerCase();
        
        return instituteName.includes(query) || tpoName.includes(query) || email.includes(query);
    });

    if (!intern) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-[#224D59]/60 backdrop-blur-sm"
                        onClick={() => !loading && onClose()}
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
                    >
                        {/* Header */}
                        <div className="p-6 bg-gradient-to-r from-[#224D59] to-[#1A3A43] text-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-extrabold">Bulk Assign TPOs</h3>
                                    <p className="text-sm text-[#B8CC34] mt-1">
                                        Assigning to: <span className="font-bold">{intern?.name}</span>
                                    </p>
                                    <p className="text-xs text-white/60">{intern?.email} • {intern?.studentId}</p>
                                </div>
                                <button
                                    onClick={() => !loading && onClose()}
                                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                    disabled={loading}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Info Banner - Updated to show zero-student TPOs only */}
                        <div className="mx-6 mt-4 p-3 bg-[#B8CC34]/10 rounded-xl border border-[#B8CC34]/20">
                            <div className="flex items-center gap-2 text-sm text-[#224D59]">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span className="font-medium">Showing TPOs with 0 registered students</span>
                            </div>
                            <p className="text-xs text-[#384022]/70 mt-1 ml-7">
                                Only TPOs that haven't been assigned to any student are available for assignment.
                            </p>
                        </div>

                        {/* Search & Select All */}
                        <div className="p-4 border-b border-[#224D59]/10 bg-[#F5F7F2]">
                            <div className="relative mb-3">
                                <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#224D59]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search TPOs by institute, contact, or email..."
                                    className="w-full bg-white border border-[#224D59]/10 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[#B8CC34] focus:ring-2 focus:ring-[#B8CC34]/20 transition-all"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    disabled={fetching}
                                />
                            </div>

                            {allTPOs.length > 0 && (
                                <label className="flex items-center cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={selectAll}
                                        onChange={handleSelectAll}
                                        className="w-4 h-4 rounded border-[#224D59]/20 text-[#B8CC34] focus:ring-[#B8CC34] focus:ring-offset-0"
                                    />
                                    <span className="ml-2 text-xs font-bold text-[#224D59] uppercase tracking-wider">
                                        Select All Available TPOs ({allTPOs.length})
                                    </span>
                                </label>
                            )}
                        </div>

                        {/* TPO List */}
                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                            {fetching ? (
                                <div className="flex justify-center items-center h-40">
                                    <div className="w-8 h-8 border-3 border-[#B8CC34]/30 border-t-[#B8CC34] rounded-full animate-spin"></div>
                                </div>
                            ) : filteredTPOs.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F5F7F2] flex items-center justify-center">
                                        <svg className="w-8 h-8 text-[#224D59]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                                        </svg>
                                    </div>
                                    <p className="text-[#384022]/60 font-medium">
                                        {searchQuery ? "No matching TPOs found" : "No available TPOs with 0 students"}
                                    </p>
                                    <p className="text-xs text-[#384022]/40 mt-1">
                                        {searchQuery ? "Try a different search term" : "All TPOs already have students assigned"}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {filteredTPOs.map((tpo) => {
                                        const tpoId = tpo._id || tpo.id;
                                        const instituteName = tpo.instituteName || tpo.companyName || "N/A";
                                        const contactName = tpo.tpoName || tpo.contactPerson || "N/A";
                                        
                                        return (
                                            <label
                                                key={tpoId}
                                                className={`flex items-start p-3 rounded-xl border cursor-pointer transition-all ${
                                                    selectedTPOs.has(tpoId)
                                                        ? 'bg-[#B8CC34]/10 border-[#B8CC34]'
                                                        : 'bg-white border-[#224D59]/10 hover:border-[#224D59]/30'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedTPOs.has(tpoId)}
                                                    onChange={() => handleToggleTPO(tpoId)}
                                                    className="mt-0.5 w-4 h-4 rounded border-[#224D59]/20 text-[#B8CC34] focus:ring-[#B8CC34] focus:ring-offset-0"
                                                />
                                                <div className="ml-3 flex-1">
                                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                                        <div>
                                                            <p className="text-sm font-bold text-[#224D59]">{instituteName}</p>
                                                            <p className="text-xs text-[#384022]/60 mt-0.5">
                                                                TPO: {contactName} • {tpo.email || 'No email'}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {/* Show Zero Students Badge */}
                                                            <span className="px-2 py-1 rounded-lg text-[9px] font-black bg-purple-100 text-purple-700">
                                                                🆓 0 Students
                                                            </span>
                                                            <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                                                                tpo.status === 'Converted' 
                                                                    ? 'bg-green-100 text-green-700' 
                                                                    : tpo.status === 'Contacted'
                                                                    ? 'bg-blue-100 text-blue-700'
                                                                    : 'bg-gray-100 text-gray-600'
                                                            }`}>
                                                                {tpo.status || 'New'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {tpo.studentsRegistered !== undefined && (
                                                        <p className="text-[10px] text-[#384022]/50 mt-1">
                                                            📊 {tpo.studentsRegistered} student(s) registered - Available for assignment
                                                        </p>
                                                    )}
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Selected Count Bar */}
                        {selectedTPOs.size > 0 && (
                            <div className="px-4 py-2 bg-[#B8CC34]/20 border-t border-[#B8CC34]/30">
                                <p className="text-xs font-bold text-[#224D59]">
                                    ✓ {selectedTPOs.size} TPO(s) selected for assignment
                                </p>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="p-4 bg-[#F5F7F2] border-t border-[#224D59]/8 flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                disabled={loading}
                                className="px-6 py-2 rounded-xl border border-[#224D59]/20 text-[#224D59] font-bold text-sm hover:bg-white transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAssign}
                                disabled={loading || selectedTPOs.size === 0}
                                className="px-6 py-2 rounded-xl bg-[#B8CC34] text-[#224D59] font-bold text-sm hover:bg-[#A5B82E] shadow-md transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-[#224D59]/30 border-t-[#224D59] rounded-full animate-spin"></span>
                                        Assigning...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        Assign {selectedTPOs.size} TPO(s)
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default BulkAssignTPOsModal;