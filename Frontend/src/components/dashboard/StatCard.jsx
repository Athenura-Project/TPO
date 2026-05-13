const StatCard = ({ label, value, sub, subColor, accentBg, icon }) => (
  <div className="bg-white border border-[#224D59]/8 rounded-2xl p-5 flex flex-col gap-3 hover:shadow-[0_8px_25px_rgba(34,77,89,0.08)] transition-all duration-300 hover:-translate-y-0.5 group">
    <div className="flex items-center justify-between">
      <span className="text-[9px] font-black text-[#384022]/40 uppercase tracking-[0.12em]">
        {label}
      </span>
      <span className={`w-8 h-8 rounded-xl flex items-center justify-center ${accentBg}`}>
        {icon}
      </span>
    </div>

    <span className="text-4xl font-extrabold text-[#224D59]">
      {value}
    </span>

    <span className={`text-xs font-semibold ${subColor}`}>
      {sub}
    </span>
  </div>
);

export default StatCard;