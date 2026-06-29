import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import BulkEmailModal from "../components/modals/BulkEmailModal";
import SingleEmailModal from "../components/modals/SingleEmailModal";

// Components
import StatCard from "../components/dashboard/StatCard";
import StatusBadge, { STATUS_CFG } from "../components/dashboard/StatusBadge";
import ProgressBar from "../components/dashboard/ProgressBar";
import EditModal from "../components/modals/EditModal";
import AddTPOModal from "../components/modals/AddTPOModal";
import Navbar from "../components/dashboard/Navbar";
import Sidebar, { Icons } from "../components/dashboard/Sidebar";

const InternDashboard = () => {
  const navigate = useNavigate();

  // ✅ Decode user from JWT
  const user = (() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return { name: "Intern" };
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return { name: "Intern" };
    }
  })();

  const [tpos, setTpos] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [editingTPO, setEditingTPO] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activePage, setActivePage] = useState("dashboard");
  const [selectedTPOsForEmail, setSelectedTPOsForEmail] = useState([]);
  const [isBulkEmailModalOpen, setIsBulkEmailModalOpen] = useState(false);
  const [isSingleEmailModalOpen, setIsSingleEmailModalOpen] = useState(false);
  const [selectedTPOForEmail, setSelectedTPOForEmail] = useState(null);
  const [emailStatus, setEmailStatus] = useState({});

  // Fetch all data 
  const fetchAll = useCallback(async () => {
    try {
      const [tpoRes, notifRes, perfRes] = await Promise.all([
        api.get("/intern/tpos"),
        api.get("/intern/notifications"),
        api.get("/intern/performance"),
      ]);
      const fetchedTpos = tpoRes?.data?.tpos || [];
      const fetchedNotifications = notifRes?.data?.notifications || [];

      setTpos(fetchedTpos);
      setNotifications(fetchedNotifications);
      setUnreadCount(fetchedNotifications.filter((n) => !n.isRead).length);
      setPerformance(perfRes.data);
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const fetchEmailStatus = useCallback(async () => {
    try {
      const response = await api.get("/intern/email-status");
      if (response.data.success) {
        const statusMap = {};
        response.data.data.forEach(item => {
          statusMap[item.id] = item;
        });
        setEmailStatus(statusMap);
      }
    } catch (err) {
      console.error("Error fetching email status:", err);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    fetchEmailStatus();
    // Poll notifications every 30 seconds as per the spec
    const interval = setInterval(async () => {
      try {
        const { data } = await api.get("/intern/notifications?unread=true");
        const fetchedNotifications = data?.notifications || [];
        setNotifications(fetchedNotifications);
        setUnreadCount(fetchedNotifications.filter((n) => !n.isRead).length);
      } catch (err) {
        console.error("Error fetching unread notifications:", err);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchAll, fetchEmailStatus]);

  // Derived stats 
  const stats = {
    assigned: tpos.length,
    contacted: tpos.filter((t) => t.status !== "Not Contacted").length,
    converted: tpos.filter((t) => t.status === "Converted").length,
    dueToday: tpos.filter((t) => {
      if (!t.followUpDate) return false;
      return (
        new Date(t.followUpDate).toDateString() === new Date().toDateString()
      );
    }).length,
  };

  const conversionPct =
    stats.assigned > 0
      ? Math.round((stats.converted / stats.assigned) * 100)
      : 0;
  const contactPct =
    stats.assigned > 0
      ? Math.round((stats.contacted / stats.assigned) * 100)
      : 0;
  const followupPct = performance
    ? performance.total > 0
      ? Math.round((performance.converted / performance.total) * 100)
      : 0
    : 0;

  // Helpers 
  const isOverdue = (d) =>
    d &&
    new Date(d) < new Date() &&
    new Date(d).toDateString() !== new Date().toDateString();

  const fmtDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      })
      : "—";

  const greet = () => {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  };

  // Handlers 
  const handleTPOSaved = (updated) =>
    setTpos((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));

  const handleTPOAdded = (newTPO) => setTpos((prev) => [newTPO, ...prev]);

  const handleMarkRead = async (id) => {
    try {
      await api.put(`/intern/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter((n) => !n.isRead);
    await Promise.all(
      unread.map((n) => api.put(`/intern/notifications/${n._id}/read`)),
    );
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  // Delete TPO handler
  const handleDeleteTPO = async (tpoId) => {
    if (!confirm("Are you sure you want to delete this TPO? This action cannot be undone.")) {
      return;
    }

    try {
      await api.delete(`/intern/tpos/${tpoId}`);
      setTpos((prev) => prev.filter((t) => t._id !== tpoId));
    } catch (err) {
      console.error("Error deleting TPO:", err);
      alert("Failed to delete TPO: " + (err.response?.data?.message || err.message));
    }
  };

  // Send single email handler
  const handleSendSingleEmail = (tpo) => {
    if (!tpo.email) {
      alert("This TPO doesn't have an email address");
      return;
    }
    setSelectedTPOForEmail(tpo);
    setIsSingleEmailModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const FILTERS = [
    "All",
    "New",
    "Not Contacted",
    "Contacted",
    "Follow-up Required",
    "No Response",
    "Converted",
    "Rejected",
  ];
  
  const filteredTpos =
    activeFilter === "All"
      ? tpos
      : tpos.filter((t) => t.status === activeFilter);

  // Loading screen 
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7F2] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-4 border-[#B8CC34]/20" />
            <div className="absolute inset-0 rounded-full border-4 border-t-[#224D59] animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-sm font-extrabold text-[#224D59]">
              Loading Dashboard
            </p>
            <p className="text-xs text-[#384022]/40 mt-1 font-semibold">
              Fetching your TPO data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Render 
  return (
    <div className="min-h-screen bg-[#F5F7F2] flex flex-col font-sans selection:bg-[#224D59] selection:text-[#F5F7F2]">
      {/* TOP NAVBAR */}
      <Navbar
        user={user}
        unreadCount={unreadCount}
        setActivePage={setActivePage}
      />
      
      <div className="flex flex-1">
        {/* SIDEBAR */}
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
          unreadCount={unreadCount}
          stats={stats}
          setShowAddModal={setShowAddModal}
          user={user}
          onLogout={handleLogout}
        />
        
        {/* MAIN CONTENT */}
        <main className="flex-1 p-5 lg:p-7 flex flex-col gap-6 min-w-0 overflow-x-hidden">
          {/* DASHBOARD */}
          {activePage === "dashboard" && (
            <>
              {/* Page header */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h1 className="text-xl font-extrabold text-[#224D59] tracking-tight">
                    {greet()}, {(user.name || "Intern").split(" ")[0]} 👋
                  </h1>
                  <p className="text-xs text-[#384022]/40 mt-1 font-semibold">
                    {new Date().toLocaleDateString("en-IN", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                    {stats.dueToday > 0 && (
                      <span className="ml-2 text-[#668824] font-extrabold">
                        · {stats.dueToday} follow-up
                        {stats.dueToday > 1 ? "s" : ""} due today
                      </span>
                    )}
                  </p>
                </div>
                
                {/* Bulk Email Button */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      if (tpos.length === 0) {
                        alert("No TPOs available to email");
                        return;
                      }
                      setSelectedTPOsForEmail(tpos);
                      setIsBulkEmailModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#B8CC34] to-[#A5B82E] text-[#224D59] text-sm font-bold rounded-xl hover:shadow-[0_8px_20px_rgba(184,204,52,0.3)] transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                    </svg>
                    Bulk Email All
                  </button>
                </div>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  label="Assigned"
                  value={stats.assigned}
                  sub="Total leads assigned"
                  subColor="text-blue-500"
                  accentBg="bg-blue-50 text-blue-500"
                  icon={<Icons.TPO />}
                />
                <StatCard
                  label="Contacted"
                  value={stats.contacted}
                  sub={`${contactPct}% of assigned`}
                  subColor="text-[#384022]/40"
                  accentBg="bg-[#F5F7F2] text-[#384022]/40"
                  icon={<Icons.Chart />}
                />
                <StatCard
                  label="Converted"
                  value={stats.converted}
                  sub={`${conversionPct}% conversion rate`}
                  subColor="text-[#224D59] font-extrabold"
                  accentBg="bg-[#224D59]/10 text-[#224D59]"
                  icon={<Icons.Dashboard />}
                />
                <StatCard
                  label="Due Today"
                  value={stats.dueToday}
                  sub="Follow-ups pending"
                  subColor="text-[#668824] font-extrabold"
                  accentBg="bg-[#B8CC34]/20 text-[#668824]"
                  icon={<Icons.Calendar />}
                />
              </div>

              {/* Two column layout */}
              <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">
                {/* TPO Table */}
                <div className="bg-white rounded-2xl border border-[#224D59]/8 overflow-hidden shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-[#224D59]/8 bg-[#F5F7F2]/60">
                    <h2 className="text-sm font-extrabold text-[#224D59]">
                      My TPO Leads
                    </h2>
                    <div className="flex flex-wrap gap-1.5">
                      {FILTERS.map((f) => (
                        <button
                          key={f}
                          onClick={() => setActiveFilter(f)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all duration-200 ${activeFilter === f
                              ? "bg-[#224D59] text-white border-[#224D59] shadow-sm"
                              : "bg-white text-[#384022]/50 border-[#224D59]/10 hover:border-[#224D59]/30"
                            }`}
                        >
                          {f === "Follow-up Required" ? "Follow-up" : f}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-[#F5F7F2]/40">
                          <th className="text-left text-[9px] font-black text-[#384022]/35 uppercase tracking-[0.1em] px-5 py-3">
                            College / Contact
                          </th>
                          <th className="text-left text-[9px] font-black text-[#384022]/35 uppercase tracking-[0.1em] px-5 py-3">
                            Phone
                          </th>
                          <th className="text-left text-[9px] font-black text-[#384022]/35 uppercase tracking-[0.1em] px-5 py-3">
                            Method
                          </th>
                          <th className="text-left text-[9px] font-black text-[#384022]/35 uppercase tracking-[0.1em] px-5 py-3">
                            Status
                          </th>
                          <th className="text-left text-[9px] font-black text-[#384022]/35 uppercase tracking-[0.1em] px-5 py-3">
                            Follow-up
                          </th>
                          <th className="text-left text-[9px] font-black text-[#384022]/35 uppercase tracking-[0.1em] px-5 py-3">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTpos.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center py-16">
                              <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 rounded-2xl bg-[#F5F7F2] border border-[#224D59]/8 flex items-center justify-center text-[#384022]/25">
                                  <Icons.TPO />
                                </div>
                                <p className="text-sm font-bold text-[#384022]/35">
                                  No TPOs found
                                </p>
                                <button
                                  onClick={() => setShowAddModal(true)}
                                  className="text-xs font-bold text-[#668824] hover:text-[#224D59] transition-colors mt-1"
                                >
                                  + Add your first TPO
                                </button>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          filteredTpos.map((tpo) => (
                            <tr
                              key={tpo._id}
                              className="border-t border-[#224D59]/5 hover:bg-[#F5F7F2]/40 transition-colors group"
                            >
                              <td className="px-5 py-3.5">
                                <p className="text-sm font-bold text-[#224D59]">
                                  {tpo.instituteName}
                                </p>
                                <p className="text-xs text-[#384022]/40 mt-0.5 font-semibold">
                                  {tpo.tpoName || "—"}
                                </p>
                              </td>
                              <td className="px-5 py-3.5">
                                <span className="text-xs font-bold text-[#224D59]">
                                  {tpo.phone || "—"}
                                </span>
                              </td>
                              <td className="px-5 py-3.5">
                                <span className="text-xs font-bold text-[#384022]/40 bg-[#F5F7F2] px-2 py-1 rounded-lg border border-[#224D59]/8">
                                  {tpo.contactMethod || "Email"}
                                </span>
                              </td>
                              <td className="px-5 py-3.5">
                                <StatusBadge status={tpo.status} />
                              </td>
                              <td className="px-5 py-3.5">
                                <span
                                  className={`text-xs font-bold ${isOverdue(tpo.followUpDate) &&
                                      tpo.status !== "Converted"
                                      ? "text-red-500"
                                      : "text-[#384022]/35"
                                    }`}
                                >
                                  {fmtDate(tpo.followUpDate)}
                                  {isOverdue(tpo.followUpDate) &&
                                    tpo.status !== "Converted" &&
                                    " ⚠"}
                                </span>
                              </td>
                              <td className="px-5 py-3.5">
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {/* Email Button */}
                                  <button
                                    onClick={() => handleSendSingleEmail(tpo)}
                                    disabled={!emailStatus[tpo._id]?.canSendEmail}
                                    className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all duration-200 ${
                                      emailStatus[tpo._id]?.canSendEmail
                                        ? "border-[#B8CC34]/30 bg-[#B8CC34]/10 text-[#668824] hover:text-[#224D59] hover:border-[#B8CC34]"
                                        : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                                    }`}
                                    title={emailStatus[tpo._id]?.lastEmailSent ? `Last email sent: ${new Date(emailStatus[tpo._id].lastEmailSent).toLocaleDateString()}` : "Send email"}
                                  >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                    </svg>
                                  </button>

                                  {/* Edit Button */}
                                  <button
                                    onClick={() => setEditingTPO(tpo)}
                                    className="w-7 h-7 rounded-lg border border-[#224D59]/12 bg-white flex items-center justify-center text-[#384022]/40 hover:text-[#224D59] hover:border-[#224D59]/25 transition-all duration-200"
                                    title="Edit TPO"
                                  >
                                    <Icons.Edit />
                                  </button>

                                  {/* Delete Button */}
                                  <button
                                    onClick={() => handleDeleteTPO(tpo._id)}
                                    className="w-7 h-7 rounded-lg border border-red-200/50 bg-red-50 flex items-center justify-center text-red-500/60 hover:text-red-600 hover:border-red-300 hover:bg-red-100 transition-all duration-200"
                                    title="Delete TPO"
                                  >
                                    <Icons.Delete />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right panel */}
                <div className="flex flex-col gap-5">
                  {/* Performance card */}
                  <div className="bg-white rounded-2xl border border-[#224D59]/8 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-[#224D59]/8 bg-[#F5F7F2]/60">
                      <h2 className="text-sm font-extrabold text-[#224D59]">
                        Performance
                      </h2>
                    </div>
                    <div className="p-5 flex flex-col gap-4">
                      <ProgressBar
                        label="Conversion rate"
                        pct={conversionPct}
                        barClass="bg-gradient-to-r from-[#224D59] to-[#668824]"
                      />
                      <ProgressBar
                        label="Follow-up completion"
                        pct={followupPct}
                        barClass="bg-[#B8CC34]"
                      />
                      <ProgressBar
                        label="Contact rate"
                        pct={contactPct}
                        barClass="bg-[#224D59]/50"
                      />

                      {/* Mini bar chart */}
                      <div className="mt-2 pt-4 border-t border-[#224D59]/8">
                        <p className="text-[9px] text-[#384022]/30 font-black uppercase tracking-[0.12em] mb-3">
                          Weekly activity
                        </p>
                        <div className="flex items-end gap-1.5 h-14">
                          {[35, 52, 28, 65, 44, 58, 40].map((h, i) => (
                            <div
                              key={i}
                              className="flex flex-col items-center gap-1 flex-1"
                            >
                              <div
                                className={`w-full rounded-sm transition-colors ${i === 3 ? "bg-[#B8CC34]" : "bg-[#224D59]/15 hover:bg-[#224D59]/30"}`}
                                style={{ height: `${h}px` }}
                              />
                              <span className="text-[8px] text-[#384022]/25 font-bold">
                                {["M", "T", "W", "T", "F", "S", "S"][i]}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notifications preview */}
                  <div className="bg-white rounded-2xl border border-[#224D59]/8 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-[#224D59]/8 bg-[#F5F7F2]/60">
                      <h2 className="text-sm font-extrabold text-[#224D59]">
                        Notifications
                      </h2>
                      <button
                        onClick={() => setActivePage("notifications")}
                        className="text-[10px] font-extrabold text-[#668824] hover:text-[#224D59] transition-colors"
                      >
                        View all →
                      </button>
                    </div>
                    <div>
                      {notifications.slice(0, 4).length === 0 ? (
                        <p className="text-xs text-[#384022]/30 text-center py-8 font-semibold">
                          No notifications
                        </p>
                      ) : (
                        notifications.slice(0, 4).map((n) => {
                          const dot =
                            {
                              assignment: "bg-[#224D59]",
                              followup: "bg-[#B8CC34]",
                              performance: "bg-blue-400",
                              announcement: "bg-[#384022]/25",
                            }[n.type] || "bg-[#384022]/25";
                          return (
                            <div
                              key={n._id}
                              onClick={() => !n.isRead && handleMarkRead(n._id)}
                              className={`flex gap-3 px-5 py-3.5 border-b border-[#224D59]/5 last:border-0 transition-colors cursor-pointer
                                ${!n.isRead ? "bg-[#F5F7F2]/70 hover:bg-[#E8EFE9]/50" : "hover:bg-[#F5F7F2]/30"}`}
                            >
                              <span
                                className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${dot}`}
                              />
                              <div className="min-w-0">
                                <p
                                  className={`text-xs leading-relaxed ${!n.isRead ? "text-[#224D59] font-bold" : "text-[#384022]/50 font-medium"}`}
                                >
                                  {n.message}
                                </p>
                                <p className="text-[10px] text-[#384022]/25 mt-0.5 font-semibold">
                                  {new Date(n.createdAt).toLocaleDateString(
                                    "en-IN",
                                    { day: "2-digit", month: "short" },
                                  )}
                                </p>
                              </div>
                              {!n.isRead && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#B8CC34] flex-shrink-0 mt-2" />
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* NOTIFICATIONS PAGE */}
          {activePage === "notifications" && (
            <>
              <div className="flex items-end justify-between">
                <div>
                  <h1 className="text-xl font-extrabold text-[#224D59] tracking-tight">
                    Notifications
                  </h1>
                  <p className="text-xs text-[#384022]/40 mt-1 font-semibold">
                    {unreadCount} unread message{unreadCount !== 1 ? "s" : ""}
                  </p>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs font-extrabold text-[#668824] hover:text-[#224D59] transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-[#224D59]/8 shadow-sm overflow-hidden">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center gap-3 py-20">
                    <div className="w-14 h-14 rounded-2xl bg-[#F5F7F2] border border-[#224D59]/8 flex items-center justify-center text-[#384022]/20">
                      <Icons.Bell />
                    </div>
                    <p className="text-sm font-bold text-[#384022]/35">
                      No notifications yet
                    </p>
                  </div>
                ) : (
                  notifications.map((n) => {
                    const typeMap = {
                      assignment: {
                        dot: "bg-[#224D59]",
                        label: "Assignment",
                        lc: "bg-[#224D59]/10 text-[#224D59]",
                      },
                      followup: {
                        dot: "bg-[#B8CC34]",
                        label: "Follow-up",
                        lc: "bg-[#B8CC34]/20 text-[#668824]",
                      },
                      performance: {
                        dot: "bg-blue-400",
                        label: "Performance",
                        lc: "bg-blue-50 text-blue-600",
                      },
                      announcement: {
                        dot: "bg-[#384022]/25",
                        label: "Announcement",
                        lc: "bg-[#F5F7F2] text-[#384022]/50",
                      },
                    };
                    const tc = typeMap[n.type] || typeMap.announcement;
                    return (
                      <div
                        key={n._id}
                        onClick={() => !n.isRead && handleMarkRead(n._id)}
                        className={`flex items-start gap-4 px-6 py-4 border-b border-[#224D59]/5 last:border-0 transition-colors cursor-pointer
                          ${!n.isRead ? "bg-[#F5F7F2]/80 hover:bg-[#E8EFE9]/50" : "hover:bg-[#F5F7F2]/30"}`}
                      >
                        <span
                          className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${tc.dot}`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span
                              className={`text-[9px] font-black uppercase tracking-[0.1em] px-2 py-0.5 rounded-full ${tc.lc}`}
                            >
                              {tc.label}
                            </span>
                            {!n.isRead && (
                              <span className="text-[9px] font-black text-[#668824]">
                                NEW
                              </span>
                            )}
                          </div>
                          <p
                            className={`text-sm leading-relaxed ${!n.isRead ? "font-bold text-[#224D59]" : "font-medium text-[#384022]/55"}`}
                          >
                            {n.message}
                          </p>
                          <p className="text-[10px] text-[#384022]/25 mt-1 font-semibold">
                            {new Date(n.createdAt).toLocaleDateString("en-IN", {
                              weekday: "short",
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        {!n.isRead && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkRead(n._id);
                            }}
                            className="text-[10px] font-bold text-[#384022]/25 hover:text-[#224D59] transition-colors flex-shrink-0 mt-1"
                          >
                            Mark read
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}

          {/* PERFORMANCE PAGE */}
          {activePage === "performance" && (
            <>
              <div>
                <h1 className="text-xl font-extrabold text-[#224D59] tracking-tight">
                  Performance
                </h1>
                <p className="text-xs text-[#384022]/40 mt-1 font-semibold">
                  Your TPO conversion metrics
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    label: "Conversion Rate",
                    value: `${conversionPct}%`,
                    sub: `${stats.converted} of ${stats.assigned} converted`,
                    color: "text-[#224D59]",
                  },
                  {
                    label: "Follow-up Completion",
                    value: `${followupPct}%`,
                    sub: "Completed follow-ups",
                    color: "text-[#668824]",
                  },
                  {
                    label: "Contact Rate",
                    value: `${contactPct}%`,
                    sub: `${stats.contacted} of ${stats.assigned} contacted`,
                    color: "text-blue-600",
                  },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="bg-white rounded-2xl border border-[#224D59]/8 p-6 shadow-sm hover:shadow-[0_8px_25px_rgba(34,77,89,0.08)] transition-all duration-300"
                  >
                    <p className="text-[9px] font-black text-[#384022]/35 uppercase tracking-[0.12em] mb-3">
                      {m.label}
                    </p>
                    <p
                      className={`text-5xl font-extrabold tracking-tight ${m.color}`}
                    >
                      {m.value}
                    </p>
                    <p className="text-xs text-[#384022]/40 font-semibold mt-2">
                      {m.sub}
                    </p>
                  </div>
                ))}
              </div>

              {/* Status breakdown */}
              <div className="bg-white rounded-2xl border border-[#224D59]/8 p-6 shadow-sm">
                <h2 className="text-sm font-extrabold text-[#224D59] mb-6">
                  Status Breakdown
                </h2>
                <div className="flex flex-col gap-5">
                  {Object.entries(STATUS_CFG).map(([status, cfg]) => {
                    const count = tpos.filter(
                      (t) => t.status === status,
                    ).length;
                    const pct =
                      stats.assigned > 0
                        ? Math.round((count / stats.assigned) * 100)
                        : 0;
                    return (
                      <div key={status} className="flex items-center gap-4">
                        <div className="w-36 flex-shrink-0">
                          <StatusBadge status={status} />
                        </div>
                        <div className="flex-1 h-2 bg-[#F5F7F2] rounded-full overflow-hidden border border-[#224D59]/5">
                          <div
                            className={`h-full rounded-full ${cfg.dot} transition-all duration-700`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-[#384022]/40 w-6 text-right">
                          {count}
                        </span>
                        <span className="text-xs font-bold text-[#384022]/25 w-8 text-right">
                          {pct}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* MY TPOS / FOLLOW-UPS PAGE */}
          {(activePage === "tpos" || activePage === "followups") && (
            <>
              <div className="flex items-end justify-between">
                <div>
                  <h1 className="text-xl font-extrabold text-[#224D59] tracking-tight">
                    {activePage === "tpos" ? "My TPOs" : "Follow-ups"}
                  </h1>
                  <p className="text-xs text-[#384022]/40 mt-1 font-semibold">
                    {activePage === "followups"
                      ? `${tpos.filter((t) => t.status === "Follow-up Required").length} pending follow-ups`
                      : `${tpos.length} total leads`}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      if (tpos.length === 0) {
                        alert("No TPOs available to email");
                        return;
                      }
                      setSelectedTPOsForEmail(tpos);
                      setIsBulkEmailModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#B8CC34] to-[#A5B82E] text-[#224D59] text-sm font-bold rounded-xl hover:shadow-[0_8px_20px_rgba(184,204,52,0.3)] transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                    </svg>
                    Bulk Email
                  </button>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#224D59] to-[#1A3A43] text-white text-sm font-bold rounded-xl hover:shadow-[0_8px_20px_rgba(34,77,89,0.3)] transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <Icons.Add /> Add TPO
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#224D59]/8 overflow-hidden shadow-sm">
                {activePage === "tpos" && (
                  <div className="flex flex-wrap gap-1.5 px-5 py-4 border-b border-[#224D59]/8 bg-[#F5F7F2]/60">
                    {FILTERS.map((f) => (
                      <button
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all duration-200 ${activeFilter === f
                            ? "bg-[#224D59] text-white border-[#224D59] shadow-sm"
                            : "bg-white text-[#384022]/50 border-[#224D59]/10 hover:border-[#224D59]/30"
                          }`}
                      >
                        {f === "Follow-up Required" ? "Follow-up" : f}
                      </button>
                    ))}
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#F5F7F2]/40">
                        <th className="text-left text-[9px] font-black text-[#384022]/30 uppercase tracking-[0.1em] px-5 py-3">
                          College / Contact
                        </th>
                        <th className="text-left text-[9px] font-black text-[#384022]/30 uppercase tracking-[0.1em] px-5 py-3">
                          Phone
                        </th>
                        <th className="text-left text-[9px] font-black text-[#384022]/30 uppercase tracking-[0.1em] px-5 py-3">
                          Email
                        </th>
                        <th className="text-left text-[9px] font-black text-[#384022]/30 uppercase tracking-[0.1em] px-5 py-3">
                          Method
                        </th>
                        <th className="text-left text-[9px] font-black text-[#384022]/30 uppercase tracking-[0.1em] px-5 py-3">
                          Status
                        </th>
                        <th className="text-left text-[9px] font-black text-[#384022]/30 uppercase tracking-[0.1em] px-5 py-3">
                          Follow-up
                        </th>
                        <th className="text-left text-[9px] font-black text-[#384022]/30 uppercase tracking-[0.1em] px-5 py-3">
                          Notes
                        </th>
                        <th className="text-left text-[9px] font-black text-[#384022]/30 uppercase tracking-[0.1em] px-5 py-3">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(activePage === "followups"
                        ? tpos.filter((t) => t.status === "Follow-up Required")
                        : filteredTpos
                      ).map((tpo) => (
                        <tr
                          key={tpo._id}
                          className="border-t border-[#224D59]/5 hover:bg-[#F5F7F2]/40 transition-colors group"
                        >
                          <td className="px-5 py-3.5">
                            <p className="text-sm font-bold text-[#224D59]">
                              {tpo.instituteName}
                            </p>
                            <p className="text-xs text-[#384022]/40 mt-0.5 font-semibold">
                              {tpo.tpoName || "—"}
                            </p>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="text-xs font-bold text-[#224D59]">
                              {tpo.phone || "—"}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-xs text-[#384022]/40 font-semibold">
                            {tpo.email || "—"}
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="text-xs font-bold text-[#384022]/40 bg-[#F5F7F2] px-2 py-1 rounded-lg border border-[#224D59]/8">
                              {tpo.contactMethod || "Email"}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <StatusBadge status={tpo.status} />
                          </td>
                          <td className="px-5 py-3.5">
                            <span
                              className={`text-xs font-bold ${isOverdue(tpo.followUpDate) && tpo.status !== "Converted" ? "text-red-500" : "text-[#384022]/35"}`}
                            >
                              {fmtDate(tpo.followUpDate)}
                              {isOverdue(tpo.followUpDate) &&
                                tpo.status !== "Converted" &&
                                " ⚠"}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 max-w-[140px]">
                            <p className="text-xs text-[#384022]/35 font-medium truncate">
                              {tpo.notes || "—"}
                            </p>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {/* Email Button */}
                              <button
                                onClick={() => handleSendSingleEmail(tpo)}
                                disabled={!emailStatus[tpo._id]?.canSendEmail}
                                className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all duration-200 ${
                                  emailStatus[tpo._id]?.canSendEmail
                                    ? "border-[#B8CC34]/30 bg-[#B8CC34]/10 text-[#668824] hover:text-[#224D59] hover:border-[#B8CC34]"
                                    : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                                }`}
                                title={emailStatus[tpo._id]?.lastEmailSent ? `Last email sent: ${new Date(emailStatus[tpo._id].lastEmailSent).toLocaleDateString()}` : "Send email"}
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                </svg>
                              </button>

                              {/* Edit Button */}
                              <button
                                onClick={() => setEditingTPO(tpo)}
                                className="w-7 h-7 rounded-lg border border-[#224D59]/12 bg-white flex items-center justify-center text-[#384022]/35 hover:text-[#224D59] hover:border-[#224D59]/25 transition-all duration-200"
                                title="Edit TPO"
                              >
                                <Icons.Edit />
                              </button>

                              {/* Delete Button */}
                              <button
                                onClick={() => handleDeleteTPO(tpo._id)}
                                className="w-7 h-7 rounded-lg border border-red-200/50 bg-red-50 flex items-center justify-center text-red-500/60 hover:text-red-600 hover:border-red-300 hover:bg-red-100 transition-all duration-200"
                                title="Delete TPO"
                              >
                                <Icons.Delete />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* MODALS */}
      {editingTPO && (
        <EditModal
          tpo={editingTPO}
          onClose={() => setEditingTPO(null)}
          onSave={handleTPOSaved}
        />
      )}
      {showAddModal && (
        <AddTPOModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleTPOAdded}
        />
      )}

      {/* BULK EMAIL MODAL */}
      <BulkEmailModal
        isOpen={isBulkEmailModalOpen}
        onClose={() => {
          setIsBulkEmailModalOpen(false);
          setSelectedTPOsForEmail([]);
        }}
        selectedTPOs={selectedTPOsForEmail}
        onComplete={() => {
          fetchEmailStatus();
          fetchAll();
        }}
      />

      <SingleEmailModal
        isOpen={isSingleEmailModalOpen}
        onClose={() => {
          setIsSingleEmailModalOpen(false);
          setSelectedTPOForEmail(null);
        }}
        tpo={selectedTPOForEmail}
        onComplete={fetchEmailStatus}
      />
    </div>
  );
};

export default InternDashboard;