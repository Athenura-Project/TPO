const Navbar = ({ user, unreadCount, setActivePage }) => {
  return (
    <header className="sticky top-0 z-40 bg-white h-14 flex items-center justify-between px-6 border-b border-[#224D59]/10">

  {/* LEFT: Logo / Title */}
  <div
    onClick={() => setActivePage("dashboard")}
    className="text-sm font-extrabold text-[#224D59] cursor-pointer"
  >
    <div className="flex items-center h-10">
    <img
      src="/Logo.png"
      alt="Logo"
      className="h-full w-auto object-contain opacity-90 hover:opacity-100 transition duration-300"
    />
  </div>
  </div>

  {/* RIGHT: Actions */}
  <div className="flex items-center gap-4">

    {/* Notifications */}
    <button
      onClick={() => setActivePage("notifications")}
      className="relative w-9 h-9 rounded-xl flex items-center justify-center border border-[#224D59]/10 hover:bg-[#F5F7F2] transition"
    >
      {/* Bell Icon */}
      <svg className="w-4 h-4 text-[#224D59]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1"
        />
      </svg>

      {/* Unread badge */}
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 text-[9px] font-bold bg-[#B8CC34] text-[#224D59] px-1.5 py-0.5 rounded-full">
          {unreadCount}
        </span>
      )}
    </button>

    {/* User Avatar */}
    <div className="w-9 h-9 rounded-xl bg-[#224D59] text-white flex items-center justify-center text-xs font-bold">
      {(user?.name || "IN")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()}
    </div>

  </div>
</header>
  );
};

export default Navbar;