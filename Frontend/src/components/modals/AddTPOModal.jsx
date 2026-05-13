import api from "../../utils/api";
import { useState } from "react";
import { Icons } from "/src/components/dashboard/Sidebar.jsx";

const AddTPOModal = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({
    instituteName: "",
    tpoName: "",
    phone: "",
    email: "",
    status: "New",
    contactMethod: "Email",
    followUpDate: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // POST /api/intern/tpos
      const { data } = await api.post("/intern/tpos", form);
      onAdd(data.tpo);
      onClose();
    } catch (err) {
      console.error("Failed to add TPO:", err);
      alert("Failed to add TPO: " + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#224D59]/30 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-[0_25px_60px_rgba(34,77,89,0.2)] w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5 border-b border-[#224D59]/8 bg-[#F5F7F2] rounded-t-3xl">
          <div>
            <h3 className="text-base font-extrabold text-[#224D59]">
              Add New TPO
            </h3>
            <p className="text-xs text-[#384022]/50 mt-0.5 font-semibold">
              Fill in the details to create a new lead
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white border border-[#224D59]/10 flex items-center justify-center text-[#384022]/50 hover:text-[#224D59] transition-colors"
          >
            <Icons.Close />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Institute Name */}
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-[9px] font-black text-[#384022]/50 uppercase tracking-[0.12em]">
                Institute Name *
              </label>
              <input
                required
                type="text"
                value={form.instituteName}
                onChange={(e) => setForm({ ...form, instituteName: e.target.value })}
                placeholder="e.g. IIT Bombay"
                className="w-full px-4 py-3 rounded-xl border border-[#224D59]/15 bg-[#F5F7F2] text-sm font-bold text-[#224D59] focus:outline-none focus:border-[#B8CC34] focus:ring-2 focus:ring-[#B8CC34]/20 transition-all"
              />
            </div>

            {/* TPO Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black text-[#384022]/50 uppercase tracking-[0.12em]">
                TPO Name
              </label>
              <input
                type="text"
                value={form.tpoName}
                onChange={(e) => setForm({ ...form, tpoName: e.target.value })}
                placeholder="Full Name"
                className="w-full px-4 py-3 rounded-xl border border-[#224D59]/15 bg-[#F5F7F2] text-sm font-bold text-[#224D59] focus:outline-none focus:border-[#B8CC34] focus:ring-2 focus:ring-[#B8CC34]/20 transition-all"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black text-[#384022]/50 uppercase tracking-[0.12em]">
                Phone Number
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Contact Number"
                className="w-full px-4 py-3 rounded-xl border border-[#224D59]/15 bg-[#F5F7F2] text-sm font-bold text-[#224D59] focus:outline-none focus:border-[#B8CC34] focus:ring-2 focus:ring-[#B8CC34]/20 transition-all"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-[9px] font-black text-[#384022]/50 uppercase tracking-[0.12em]">
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="tpo@institute.edu"
                className="w-full px-4 py-3 rounded-xl border border-[#224D59]/15 bg-[#F5F7F2] text-sm font-bold text-[#224D59] focus:outline-none focus:border-[#B8CC34] focus:ring-2 focus:ring-[#B8CC34]/20 transition-all"
              />
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black text-[#384022]/50 uppercase tracking-[0.12em]">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#224D59]/15 bg-[#F5F7F2] text-sm font-bold text-[#224D59] focus:outline-none focus:border-[#B8CC34] focus:ring-2 focus:ring-[#B8CC34]/20 transition-all"
              >
                {[
                  "New",
                  "Not Contacted",
                  "Contacted",
                  "Follow-up Required",
                  "Converted",
                  "Rejected"
                ].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Contact Method */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black text-[#384022]/50 uppercase tracking-[0.12em]">
                Contact Method
              </label>
              <select
                value={form.contactMethod}
                onChange={(e) => setForm({ ...form, contactMethod: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#224D59]/15 bg-[#F5F7F2] text-sm font-bold text-[#224D59] focus:outline-none focus:border-[#B8CC34] focus:ring-2 focus:ring-[#B8CC34]/20 transition-all"
              >
                {["Email", "Phone", "Both"].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Follow-up Date */}
            <div className={`flex flex-col gap-1.5 sm:col-span-2 ${form.status !== "Follow-up Required" && "opacity-50"}`}>
              <label className="text-[9px] font-black text-[#384022]/50 uppercase tracking-[0.12em]">
                Follow-up Date {form.status === "Follow-up Required" && "*"}
              </label>
              <input
                required={form.status === "Follow-up Required"}
                type="date"
                value={form.followUpDate}
                onChange={(e) => setForm({ ...form, followUpDate: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#224D59]/15 bg-[#F5F7F2] text-sm font-bold text-[#224D59] focus:outline-none focus:border-[#B8CC34] focus:ring-2 focus:ring-[#B8CC34]/20 transition-all"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-black text-[#384022]/50 uppercase tracking-[0.12em]">
              Initial Notes
            </label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Add any initial thoughts or notes..."
              className="w-full px-4 py-3 rounded-xl border border-[#224D59]/15 bg-[#F5F7F2] text-sm text-[#224D59] placeholder-[#384022]/25 resize-none focus:outline-none focus:border-[#B8CC34] focus:ring-2 focus:ring-[#B8CC34]/20 transition-all font-medium"
            />
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-[#224D59]/12 bg-[#F5F7F2] text-sm font-bold text-[#384022]/60 hover:bg-[#E8EFE9] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#224D59] to-[#1A3A43] text-white text-sm font-bold hover:shadow-[0_8px_20px_rgba(34,77,89,0.3)] transition-all duration-300 disabled:opacity-60"
            >
              {saving ? "Creating..." : "Create TPO"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTPOModal;
