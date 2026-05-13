import api from "../../utils/api";
import { STATUS_CFG } from "../../utils/constants";
import { useState } from "react";
import { Icons } from "/src/components/dashboard/Sidebar.jsx";

const EditModal = ({ tpo, onClose, onSave }) => {
  const [form, setForm] = useState({
    status: tpo.status,
    followUpDate: tpo.followUpDate
    ? new Date(tpo.followUpDate).toISOString().split("T")[0]
    : "",
    notes: "",
    contactMethod: tpo.contactMethod || "Email",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {

      const payload = {
        status: form.status,
        followUpDate: form.followUpDate,
        notes: form.notes,
        contactMethod: form.contactMethod,
      };

      

      // PUT /api/intern/tpos/:id
      const { data } = await api.put(`/intern/tpos/${tpo._id}`,payload);
      onSave(data.tpo);
      onClose();
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#224D59]/30 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-[0_25px_60px_rgba(34,77,89,0.2)] w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#224D59]/8 bg-[#F5F7F2] rounded-t-3xl">
          <div>
            <h3 className="text-base font-extrabold text-[#224D59]">
              Update TPO
            </h3>
            <p className="text-xs text-[#384022]/50 mt-0.5 font-semibold">
            {tpo.instituteName}
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
            <div className="flex gap-2">
              {["Email", "Phone", "Both"].map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setForm({ ...form, contactMethod: m })}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all duration-200 ${
                    form.contactMethod === m
                      ? "bg-[#224D59] text-white border-[#224D59] shadow-md"
                      : "bg-[#F5F7F2] text-[#384022]/60 border-[#224D59]/10 hover:border-[#224D59]/30"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
 
          {/* Follow-up Date (Only if Follow-up Required) */}
          {form.status === "Follow-up Required" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black text-[#384022]/50 uppercase tracking-[0.12em]">
                Follow-up Date
              </label>
              <input
                type="date"
                value={form.followUpDate}
                onChange={(e) =>
                  setForm({ ...form, followUpDate: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-[#224D59]/15 bg-[#F5F7F2] text-sm font-bold text-[#224D59] focus:outline-none focus:border-[#B8CC34] focus:ring-2 focus:ring-[#B8CC34]/20 transition-all"
              />
            </div>
          )}

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-black text-[#384022]/50 uppercase tracking-[0.12em]">
              New Note / Interaction
            </label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Add any notes about this lead..."
              className="w-full px-4 py-3 rounded-xl border border-[#224D59]/15 bg-[#F5F7F2] text-sm text-[#224D59] placeholder-[#384022]/25 resize-none focus:outline-none focus:border-[#B8CC34] focus:ring-2 focus:ring-[#B8CC34]/20 transition-all font-medium"
            />
          </div>
          {/* Interaction History */}
          {tpo.interactions && tpo.interactions.length > 0 && (
            <div className="flex flex-col gap-1.5 mt-2">
              <label className="text-[9px] font-black text-[#384022]/50 uppercase tracking-[0.12em]">
                Interaction History
              </label>
              <div className="max-h-32 overflow-y-auto pr-1 flex flex-col gap-2">
                {[...tpo.interactions].reverse().map((it, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-[#F5F7F2] border border-[#224D59]/5 text-[11px]">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-black text-[#224D59]">{it.internName || it.internId?.name || `ID: ${it.studentId || "N/A"}`}</span>
                      <span className="text-[10px] text-[#384022]/40 font-bold">
                        {new Date(it.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[#384022]/70 font-medium italic">"{it.note}"</p>
                    <div className="mt-1 text-[9px] font-black text-[#B8CC34] uppercase tracking-wider">
                      Mode: {it.contactMethod || "Unknown"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-1">
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
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;