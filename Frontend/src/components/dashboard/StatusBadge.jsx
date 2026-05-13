export const STATUS_CFG = {
  "New": {
    pill: "bg-blue-50 text-blue-600 border-blue-200",
    dot: "bg-blue-400",
  },
  "Not Contacted": {
    pill: "bg-gray-100 text-gray-600 border-gray-200",
    dot: "bg-gray-400",
  },
  "Contacted": {
    pill: "bg-indigo-100 text-indigo-700 border-indigo-200",
    dot: "bg-indigo-500",
  },
  "Follow-up Required": {
    pill: "bg-yellow-100 text-yellow-700 border-yellow-200",
    dot: "bg-yellow-500",
  },
  "No Response": {
    pill: "bg-red-100 text-red-600 border-red-200",
    dot: "bg-red-500",
  },
  Converted: {
    pill: "bg-green-100 text-green-700 border-green-200",
    dot: "bg-green-500",
  },
  Rejected: {
    pill: "bg-orange-100 text-orange-700 border-orange-200",
    dot: "bg-orange-500",
  },
  Assigned: {
    pill: "bg-purple-100 text-purple-700 border-purple-200",
    dot: "bg-purple-500",
  },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CFG[status] || STATUS_CFG["Not Contacted"];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${cfg.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
};

export default StatusBadge;