import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function Header() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="flex justify-between items-center w-full px-10 py-6 glass-panel border-brand-red/20 rounded-2xl mb-8">
      {/* Logo Section */}
      <div className="flex items-center gap-4">
        <img 
          src="/logo.png" 
          alt="TAM CARGO Logo" 
          className="h-20 object-contain drop-shadow-[0_0_15px_rgba(190,22,34,0.3)] bg-white/10 px-4 py-2 rounded-xl"
        />
      </div>

      {/* Clock Section */}
      <div className="text-right flex flex-col items-end">
        <div className="text-6xl font-black text-white tracking-tight tabular-nums drop-shadow-lg">
          {format(time, 'HH:mm:ss')}
        </div>
        <div className="text-xl text-slate-300 font-medium capitalize mt-1">
          {format(time, "EEEE, d 'de' MMMM", { locale: es })}
        </div>
      </div>
    </header>
  );
}
