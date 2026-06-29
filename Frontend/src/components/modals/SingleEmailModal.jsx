import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';

const SingleEmailModal = ({ isOpen, onClose, tpo, onComplete }) => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [emailStatus, setEmailStatus] = useState({});

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    };

    const handleSendEmails = async () => {
        if (!subject.trim()) {
            alert("Please enter a subject");
            return;
        }
        
        if (!message.trim()) {
            alert("Please enter a message");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('subject', subject);
            formData.append('message', message);
            formData.append('tpoId', tpo._id);
            
            files.forEach(file => {
                formData.append('attachments', file);
            });

            const response = await api.post('/intern/send-email', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                alert(response.data.message);
                onComplete?.();
                onClose();
            } else {
                alert(response.data.message || "Failed to send emails");
            }
        } catch (error) {
            console.error("Email error:", error);
            alert(error.response?.data?.message || "Failed to send email");
        } finally {
            setLoading(false);
        }
    };

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
                        <div className="p-6 bg-gradient-to-r from-[#224D59] to-[#1A3A43] text-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-extrabold">Send Email</h3>
                                    <p className="text-sm text-[#B8CC34] mt-1">
                                        Sending to {tpo?.instituteName}
                                    </p>
                                </div>
                                <button
                                    onClick={() => !loading && onClose()}
                                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-5">
                            {/* Selected TPO Preview */}
                            <div className="bg-[#F5F7F2] rounded-xl p-4">
                                <p className="text-xs font-bold text-[#224D59] uppercase tracking-wider mb-2">
                                    Recipient:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {tpo && (
                                        <span className="px-2 py-1 bg-white rounded-lg text-xs font-medium text-[#224D59]">
                                            {tpo.instituteName}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Subject Input */}
                            <div>
                                <label className="block text-xs font-bold text-[#224D59] uppercase tracking-wider mb-1.5">
                                    Email Subject <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="w-full bg-[#F5F7F2] border border-[#224D59]/10 rounded-xl px-4 py-3 text-sm text-[#224D59] outline-none focus:border-[#B8CC34] focus:ring-2 focus:ring-[#B8CC34]/20 transition-all"
                                    placeholder="e.g., TPO Collaboration Opportunity"
                                />
                            </div>

                            {/* Message Input */}
                            <div>
                                <label className="block text-xs font-bold text-[#224D59] uppercase tracking-wider mb-1.5">
                                    Email Message <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows={8}
                                    className="w-full bg-[#F5F7F2] border border-[#224D59]/10 rounded-xl px-4 py-3 text-sm text-[#224D59] outline-none focus:border-[#B8CC34] focus:ring-2 focus:ring-[#B8CC34]/20 transition-all resize-none"
                                    placeholder="Write your message here..."
                                />
                            </div>

                            {/* PDF Attachments Info / Input */}
                            <div className="bg-[#B8CC34]/10 rounded-xl p-4 border border-[#B8CC34]/20">
                                <div className="flex items-center gap-2 text-sm text-[#224D59] mb-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                                    </svg>
                                    <span className="font-medium">Attach Files:</span>
                                </div>
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                    className="ml-7 text-xs text-[#384022]/70 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#224D59] file:text-white hover:file:bg-[#1A3A43] cursor-pointer"
                                />
                                {files.length > 0 && (
                                    <div className="mt-3 ml-7 flex flex-wrap gap-2">
                                        {files.map((file, index) => (
                                            <span key={index} className="px-2 py-1 bg-white rounded text-[10px] text-[#224D59] border border-[#224D59]/10">
                                                {file.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-4 bg-[#F5F7F2] border-t border-[#224D59]/8 flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                disabled={loading}
                                className="px-6 py-2 rounded-xl border border-[#224D59]/20 text-[#224D59] font-bold text-sm hover:bg-white transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSendEmails}
                                disabled={loading || !subject.trim() || !message.trim()}
                                className="px-6 py-2 rounded-xl bg-[#B8CC34] text-[#224D59] font-bold text-sm hover:bg-[#A5B82E] shadow-md transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-[#224D59]/30 border-t-[#224D59] rounded-full animate-spin"></span>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                        </svg>
                                        Send Email
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

export default SingleEmailModal;