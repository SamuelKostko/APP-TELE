import { TrendingUp, DollarSign } from 'lucide-react';

export default function FinanceCard({ label, value, type }) {
  const isBCV = type === 'bcv';

  return (
    <div className="glass-panel rounded-2xl p-6 flex items-center gap-6 transform transition-transform hover:scale-105 border-slate-700/50 hover:border-brand-red/50">
      <div className={`p-4 rounded-xl ${isBCV ? 'bg-brand-success/20 text-brand-success' : 'bg-brand-red/20 text-brand-red'}`}>
        {isBCV ? <TrendingUp size={40} strokeWidth={2.5} /> : <DollarSign size={40} strokeWidth={2.5} />}
      </div>
      <div>
        <h3 className="text-slate-400 text-lg font-bold uppercase tracking-wider mb-1">{label}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-black text-white tabular-nums tracking-tight">
            {value}
          </span>
          <span className="text-xl font-bold text-slate-400">Bs.</span>
        </div>
      </div>
    </div>
  );
}
