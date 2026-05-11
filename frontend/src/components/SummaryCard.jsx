// Removed LucideIcon import as it is a TS type, not a value
const SummaryCard = ({ title, amount, icon: Icon, colorClass, bgColorClass }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
      <div>
        <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
        <p className={`text-3xl font-bold ${colorClass}`}>
          ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
      <div className={`p-4 rounded-xl ${bgColorClass}`}>
        <Icon className={`w-8 h-8 ${colorClass}`} />
      </div>
    </div>
  );
};

export default SummaryCard;
