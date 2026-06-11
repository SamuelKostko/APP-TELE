import Header from '../components/Header';
import FinanceCard from '../components/FinanceCard';
import { useAppStore } from '../store/useAppStore';
import { Anchor, Clock, CheckCircle, CheckSquare } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const statusConfig = {
  'En tránsito': { color: 'text-brand-warning', bg: 'bg-brand-warning/10', border: 'border-brand-warning/30', icon: Clock },
  'Programado': { color: 'text-brand-red', bg: 'bg-brand-red/10', border: 'border-brand-red/30', icon: Anchor },
  'En puerto': { color: 'text-brand-success', bg: 'bg-brand-success/10', border: 'border-brand-success/30', icon: CheckCircle },
};

export default function DashboardTV() {
  const { ships, finance, todos, settings } = useAppStore();

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-brand-dark to-brand-darker p-8 overflow-hidden flex flex-col">
      <Header />

      <div className="grid grid-cols-12 gap-8 flex-1">
        {/* Left Side: Finance & Main Info */}
        <div className="col-span-4 flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-white/80 uppercase tracking-widest pl-2 border-l-4 border-brand-red">
              Tasas del Día
            </h2>
            <FinanceCard label="Tasa BCV Oficial" value={finance.bcv} type="bcv" />
            <FinanceCard label="Tasa USDT" value={finance.usdt} type="usdt" />
          </div>

          {settings.showTodos && (
            <div className="glass-panel rounded-2xl p-6 mt-4 flex-1 flex flex-col border-brand-success/20">
              <h2 className="text-2xl font-bold text-white/80 uppercase tracking-widest pl-2 border-l-4 border-brand-success mb-6 flex items-center gap-3">
                <CheckSquare className="text-brand-success" size={28} />
                Tareas del Día
              </h2>
              
              <div className="flex-1 flex flex-col gap-3 overflow-hidden">
                {todos.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center">
                    <span className="text-xl text-slate-500 font-medium">No hay tareas pendientes</span>
                  </div>
                ) : (
                  todos.map(todo => (
                    <div key={todo.id} className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center border-2 flex-shrink-0 ${todo.completed ? 'bg-brand-success border-brand-success' : 'border-slate-500'}`}>
                        {todo.completed && <CheckSquare size={16} className="text-brand-dark" />}
                      </div>
                      <span className={`text-xl font-medium leading-tight ${todo.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                        {todo.text}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Ships ETA */}
        <div className="col-span-8 flex flex-col">
          <h2 className="text-2xl font-bold text-white/80 uppercase tracking-widest pl-2 border-l-4 border-brand-success mb-6">
            Próximos Arribos (ETA)
          </h2>
          
          <div className="flex-1 flex flex-col gap-4">
            {ships.length === 0 ? (
              <div className="flex-1 flex items-center justify-center glass-panel rounded-2xl">
                <span className="text-2xl text-slate-500 font-medium">No hay barcos programados</span>
              </div>
            ) : (
              ships.map((ship) => {
                const conf = statusConfig[ship.status] || statusConfig['Programado'];
                const Icon = conf.icon;
                const formattedDate = ship.eta ? format(parseISO(ship.eta), "d 'de' MMMM", { locale: es }) : 'Por definir';

                return (
                  <div key={ship.id} className={`glass-panel rounded-2xl p-6 flex items-center justify-between border-l-8 ${conf.border.replace('border-', 'border-l-')}`}>
                    <div className="flex items-center gap-6">
                      <div className={`p-4 rounded-full ${conf.bg} ${conf.color}`}>
                        <Icon size={40} />
                      </div>
                      <div>
                        <h3 className="text-3xl font-black text-white tracking-wide uppercase">
                          {ship.name}
                        </h3>
                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider ${conf.bg} ${conf.color}`}>
                          {ship.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">
                        Llegada Estimada
                      </p>
                      <p className="text-4xl font-black text-white capitalize drop-shadow-md">
                        {formattedDate}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
