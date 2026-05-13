const ProgressBar = ({ label, pct, barClass }) => (
  <div className="flex flex-col gap-2">
    <div className="flex justify-between">
      <span className="text-xs font-semibold text-[#384022]/60">
        {label}
      </span>
      <span className="text-xs font-bold text-[#224D59]">
        {pct}%
      </span>
    </div>

    <div className="h-2 bg-[#F5F7F2] rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full ${barClass}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  </div>
);

export default ProgressBar;