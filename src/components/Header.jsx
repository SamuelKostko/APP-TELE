import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { TrendingUp, DollarSign, Euro } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function Header() {
  const [time, setTime] = useState(new Date());
  const { finance } = useAppStore();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dayName = format(time, 'EEEE', { locale: es });
  const dateStr = format(time, "d 'de' MMMM 'de' yyyy", { locale: es });
  const timeStr = format(time, 'HH:mm:ss');

  return (
    <header className="tv-header flex items-stretch w-full" style={{ height: '80px' }}>

      {/* === LOGO === */}
      <div
        className="flex items-center px-6 flex-shrink-0"
        style={{ borderRight: '1px solid rgba(255,255,255,0.06)', minWidth: '160px' }}
      >
        <img
          src="/logo.png"
          alt="TAM CARGO"
          className="h-10 object-contain"
          style={{ filter: 'brightness(1.1)' }}
        />
      </div>

      {/* === TASAS DEL DÍA === */}
      <div
        className="flex items-center gap-4 px-6 flex-1"
        style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Label */}
        <div className="flex-shrink-0">
          <p className="tv-section-label mb-0.5">Tasas del Día</p>
          <div className="tv-divider" style={{ width: '60px' }} />
        </div>

        {/* BCV Dólar */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-md flex-shrink-0"
            style={{
              width: '32px', height: '32px',
              background: 'rgba(34,197,94,0.12)',
              border: '1px solid rgba(34,197,94,0.25)',
            }}
          >
            <TrendingUp size={16} color="#22C55E" strokeWidth={2.5} />
          </div>
          <div>
            <p className="tv-section-label leading-none mb-0.5">BCV Dólar</p>
            <p
              className="tabular-nums leading-none font-black"
              style={{ fontSize: '1.3rem', color: '#22C55E', fontFamily: 'Inter' }}
            >
              {finance.bcv}
              <span style={{ fontSize: '0.75rem', color: 'rgba(34,197,94,0.7)', marginLeft: '4px', fontWeight: 600 }}>Bs.</span>
            </p>
          </div>
        </div>

        {/* Separador vertical */}
        <div className="tv-divider-v self-stretch my-4" />

        {/* BCV Euro */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-md flex-shrink-0"
            style={{
              width: '32px', height: '32px',
              background: 'rgba(59,130,246,0.12)',
              border: '1px solid rgba(59,130,246,0.25)',
            }}
          >
            <Euro size={16} color="#3B82F6" strokeWidth={2.5} />
          </div>
          <div>
            <p className="tv-section-label leading-none mb-0.5">BCV Euro</p>
            <p
              className="tabular-nums leading-none font-black"
              style={{ fontSize: '1.3rem', color: '#3B82F6', fontFamily: 'Inter' }}
            >
              {finance.bcvEuro}
              <span style={{ fontSize: '0.75rem', color: 'rgba(59,130,246,0.7)', marginLeft: '4px', fontWeight: 600 }}>Bs.</span>
            </p>
          </div>
        </div>

        {/* Separador vertical */}
        <div className="tv-divider-v self-stretch my-4" />

        {/* USDT */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-md flex-shrink-0"
            style={{
              width: '32px', height: '32px',
              background: 'rgba(245,158,11,0.12)',
              border: '1px solid rgba(245,158,11,0.25)',
            }}
          >
            <DollarSign size={16} color="#F59E0B" strokeWidth={2.5} />
          </div>
          <div>
            <p className="tv-section-label leading-none mb-0.5">USDT</p>
            <p
              className="tabular-nums leading-none font-black"
              style={{ fontSize: '1.3rem', color: '#F59E0B', fontFamily: 'Inter' }}
            >
              {finance.usdt}
              <span style={{ fontSize: '0.75rem', color: 'rgba(245,158,11,0.7)', marginLeft: '4px', fontWeight: 600 }}>Bs.</span>
            </p>
          </div>
        </div>
      </div>

      {/* === RELOJ Y FECHA === */}
      <div
        className="flex flex-col items-end justify-center px-6 flex-shrink-0 text-right"
        style={{ minWidth: '220px' }}
      >
        {/* Hora */}
        <div
          className="tabular-nums font-black leading-none"
          style={{
            fontSize: '2.2rem',
            fontFamily: 'Rajdhani, Inter, sans-serif',
            color: '#FFFFFF',
            letterSpacing: '-0.01em',
          }}
        >
          {timeStr}
        </div>
        {/* Fecha */}
        <div style={{ marginTop: '4px' }}>
          <span
            className="capitalize font-semibold"
            style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter' }}
          >
            {dayName}, {dateStr}
          </span>
        </div>
      </div>

    </header>
  );
}
