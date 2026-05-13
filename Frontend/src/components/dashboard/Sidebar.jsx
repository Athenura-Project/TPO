
const storageUser = (() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return { name: "Intern" };
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return { name: "Intern" };
    }
  })();

const initials = (storageUser.name || "IN")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export const Icons = {
  Dashboard: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
      />
    </svg>
  ),
  TPO: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  ),
  Add: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        d="M12 4v16m8-8H4"
      />
    </svg>
  ),
  Bell: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    </svg>
  ),
  Chart: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  ),
  Edit: () => (
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  ),
  Delete: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  ),
  Close: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  ),
  Logout: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
    </svg>
  ),
  Calendar: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  ),
};

const Sidebar = ({ activePage, setActivePage, unreadCount, stats, setShowAddModal, user ,onLogout}) => {
  return (
       <aside className="hidden md:flex w-56 flex-col bg-white border-r border-[#224D59]/8 py-6 gap-1 flex-shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
          <p className="text-[9px] font-black text-[#384022]/25 uppercase tracking-[0.14em] px-5 mb-1">
            Main
          </p>

          {[
            { key: "dashboard", label: "Dashboard", Ic: Icons.Dashboard },
            { key: "tpos", label: "My TPOs", Ic: Icons.TPO },
            { key: "add",           label: "Add TPO",        Ic: Icons.Add       },
            { key: "followups", label: "Follow-ups", Ic: Icons.Calendar },
            { key: "performance", label: "Performance", Ic: Icons.Chart },
            { key: "notifications", label: "Notifications", Ic: Icons.Bell },
          ].map(({ key, label, Ic }) => (
            <button
              key={key}
              onClick={() =>
                key === "add" ? setShowAddModal(true) : setActivePage(key)
              }
              className={`relative flex items-center gap-3 mx-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 text-left
                ${
                  activePage === key
                    ? "bg-[#224D59] text-white shadow-[0_4px_12px_rgba(34,77,89,0.25)]"
                    : "text-[#384022]/55 hover:bg-[#F5F7F2] hover:text-[#224D59]"
                }`}
            >
              {activePage === key && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#B8CC34] rounded-r-full" />
              )}
              <Ic />
              {label}
              {key === "notifications" && unreadCount > 0 && (
                <span className="ml-auto w-4 h-4 bg-[#B8CC34] text-[#224D59] text-[9px] font-black rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
              {key === "followups" && stats.dueToday > 0 && (
                <span className="ml-auto w-4 h-4 bg-red-400 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                  {stats.dueToday}
                </span>
              )}
            </button>
          ))}
              {/* User card + Back + Logout at bottom */}
<div className="mt-auto mx-3 flex flex-col gap-2">

  {/* Back button */}
  <button
    onClick={() => window.history.back()}
    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#384022]/50 hover:bg-[#F5F7F2] hover:text-[#224D59] transition-all duration-200"
  >
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
    </svg>
    Go Back
  </button>

  {/* User card */}
  <div className="p-3 rounded-xl bg-[#F5F7F2] border border-[#224D59]/8">
    <div className="flex items-center gap-2.5">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#224D59] to-[#668824] flex items-center justify-center text-[10px] font-black text-[#B8CC34] flex-shrink-0">
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold text-[#224D59] truncate">{user?.name || "Intern"}</p>
        <p className="text-[10px] text-[#384022]/35 font-semibold">Intern</p>
      </div>
    </div>
  </div>

  {/* Logout button */}
  <button
    onClick={onLogout}
    className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-xl border border-red-200 bg-red-50 text-xs font-bold text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200"
  >
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
    </svg>
    Logout
  </button>

</div>
        </aside>
  );
};


export default Sidebar;