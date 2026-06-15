import Header from '../components/Header';
import { useAppStore } from '../store/useAppStore';
import { Anchor, Clock, CheckCircle, CheckSquare, Check, Ship, Calendar, AlarmClock } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState, useEffect, useRef } from 'react';

/* ─────────────────────────────────── */
/* STATUS CONFIG                        */
/* ─────────────────────────────────── */
const statusConfig = {
  'En tránsito': {
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.1)',
    border: '#F59E0B',
    borderFaint: 'rgba(245,158,11,0.25)',
    icon: Clock,
    dotColor: '#F59E0B',
  },
  'Programado': {
    color: '#9090A4',
    bg: 'rgba(144,144,164,0.08)',
    border: '#9090A4',
    borderFaint: 'rgba(144,144,164,0.2)',
    icon: Anchor,
    dotColor: '#9090A4',
  },
  'En puerto': {
    color: '#22C55E',
    bg: 'rgba(34,197,94,0.1)',
    border: '#22C55E',
    borderFaint: 'rgba(34,197,94,0.25)',
    icon: CheckCircle,
    dotColor: '#22C55E',
  },
};

/* ─────────────────────────────────── */
/* TICKER COMPONENT                    */
/* ─────────────────────────────────── */
function TickerBar() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeStr = format(time, "HH:mm:ss 'hs'");
  const dateStr = format(time, "EEEE d 'de' MMMM 'de' yyyy", { locale: es });

  const segments = [
    { label: 'HORA', value: timeStr },
    { label: 'FECHA', value: dateStr },
    { label: 'SISTEMA', value: 'En línea' },
  ];

  // Duplicar para loop continuo
  const allSegments = [...segments, ...segments, ...segments];

  return (
    <div className="ticker-bar flex items-center" style={{ height: '44px', flexShrink: 0 }}>
      {/* Label estático */}
      <div
        className="flex items-center justify-center flex-shrink-0 h-full px-5"
        style={{
          background: '#BE1622',
          minWidth: '140px',
          gap: '8px',
        }}
      >
        <AlarmClock size={14} color="white" strokeWidth={2.5} />
        <span
          style={{
            fontFamily: 'Inter',
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'white',
          }}
        >
          EN VIVO
        </span>
      </div>

      {/* Contenido animado */}
      <div className="overflow-hidden flex-1 h-full flex items-center">
        <div className="ticker-content">
          {allSegments.map((seg, idx) => (
            <div key={idx} className="flex items-center gap-3 flex-shrink-0">
              <span
                style={{
                  fontFamily: 'Inter',
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  color: 'rgba(255,255,255,0.3)',
                  textTransform: 'uppercase',
                }}
              >
                {seg.label}
              </span>
              <span
                style={{
                  fontFamily: 'Inter',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.75)',
                  textTransform: 'none',
                }}
              >
                {seg.value}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.12)', marginLeft: '24px' }}>◆</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────── */
/* SHIPS TABLE                          */
/* ─────────────────────────────────── */
function ShipsTable({ ships }) {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Table Header */}
      <div
        className="grid gap-4 px-5 mb-2"
        style={{
          gridTemplateColumns: '40px 1fr 180px 180px 180px',
          paddingBottom: '10px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {['#', 'BUQUE', 'ESTADO', 'ETA', 'LLEGADA'].map((h) => (
          <span
            key={h}
            style={{
              fontFamily: 'Inter',
              fontSize: '0.6rem',
              fontWeight: 700,
              letterSpacing: '0.18em',
              color: 'rgba(255,255,255,0.28)',
              textTransform: 'uppercase',
            }}
          >
            {h}
          </span>
        ))}
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-2 flex-1 overflow-hidden">
        {ships.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Ship size={48} color="rgba(255,255,255,0.1)" style={{ margin: '0 auto 12px' }} />
              <p style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'Inter', fontSize: '1rem' }}>
                No hay buques programados
              </p>
            </div>
          </div>
        ) : (
          ships.map((ship, idx) => {
            const conf = statusConfig[ship.status] || statusConfig['Programado'];
            const Icon = conf.icon;
            const formattedDate = ship.eta
              ? format(parseISO(ship.eta), "d 'de' MMMM", { locale: es })
              : 'Por definir';
            const formattedDay = ship.eta
              ? format(parseISO(ship.eta), 'EEEE', { locale: es })
              : '';

            return (
              <div
                key={ship.id}
                className="ship-row grid items-center gap-4 px-5"
                style={{
                  gridTemplateColumns: '40px 1fr 180px 180px 180px',
                  borderLeftColor: conf.border,
                  paddingTop: '14px',
                  paddingBottom: '14px',
                  animationDelay: `${idx * 0.06}s`,
                }}
              >
                {/* Index */}
                <span
                  style={{
                    fontFamily: 'Rajdhani, sans-serif',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.2)',
                  }}
                >
                  {String(idx + 1).padStart(2, '0')}
                </span>

                {/* Name */}
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: conf.bg,
                      border: `1px solid ${conf.borderFaint}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={18} color={conf.color} strokeWidth={2} />
                  </div>
                  <span
                    style={{
                      fontFamily: 'Rajdhani, sans-serif',
                      fontSize: '1.45rem',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      lineHeight: 1,
                    }}
                  >
                    {ship.name}
                  </span>
                </div>

                {/* Status Badge */}
                <div>
                  <div
                    className="status-badge"
                    style={{
                      background: conf.bg,
                      border: `1px solid ${conf.borderFaint}`,
                      color: conf.color,
                    }}
                  >
                    <div
                      className="status-badge-dot"
                      style={{ background: conf.dotColor }}
                    />
                    {ship.status}
                  </div>
                </div>

                {/* ETA Date */}
                <div>
                  <p
                    style={{
                      fontFamily: 'Inter',
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      lineHeight: 1.2,
                      textTransform: 'none',
                    }}
                  >
                    {formattedDate}
                  </p>
                  {formattedDay && (
                    <p
                      style={{
                        fontFamily: 'Inter',
                        fontSize: '0.7rem',
                        color: 'rgba(255,255,255,0.35)',
                        marginTop: '2px',
                        letterSpacing: '0.04em',
                        textTransform: 'none',
                      }}
                    >
                      {formattedDay}
                    </p>
                  )}
                </div>

                {/* Arrival indicator */}
                <div
                  style={{
                    fontFamily: 'Inter',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.3)',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  {ship.destination || '—'}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────── */
/* TODO LIST                            */
/* ─────────────────────────────────── */
function TodoList({ todos }) {
  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      {todos.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'Inter', fontSize: '0.9rem' }}>
            Sin tareas pendientes
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 flex-1 overflow-hidden">
          {todos.map((todo, idx) => (
            <div
              key={todo.id}
              className={`todo-item ${todo.completed ? 'completed' : ''}`}
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '5px',
                    border: `2px solid ${todo.completed ? '#22C55E' : 'rgba(255,255,255,0.2)'}`,
                    background: todo.completed ? 'rgba(34,197,94,0.15)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  {todo.completed && <Check size={12} color="#22C55E" strokeWidth={3} />}
                </div>
                <span
                  style={{
                    fontFamily: 'Inter',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: todo.completed ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.85)',
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    lineHeight: 1.4,
                  }}
                >
                  {todo.text}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────── */
/* SECTION HEADER HELPER               */
/* ─────────────────────────────────── */
function SectionTitle({ icon: Icon, label, count, accentColor = '#FFFFFF' }) {
  return (
    <div className="flex items-center justify-between mb-4 flex-shrink-0">
      <div className="flex items-center gap-3">
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: `${accentColor}15`,
            border: `1px solid ${accentColor}30`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={16} color={accentColor} strokeWidth={2.5} />
        </div>
        <span
          className="tv-section-title"
          style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.9)' }}
        >
          {label}
        </span>
      </div>
      {count !== undefined && (
        <div
          style={{
            background: `${accentColor}18`,
            border: `1px solid ${accentColor}30`,
            borderRadius: '100px',
            padding: '3px 12px',
            fontFamily: 'Inter',
            fontSize: '0.7rem',
            fontWeight: 700,
            color: accentColor,
            letterSpacing: '0.05em',
          }}
        >
          {count} {count === 1 ? 'item' : 'items'}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────── */
/* MAIN DASHBOARD                       */
/* ─────────────────────────────────── */
export default function DashboardTV() {
  const { ships, todos, settings } = useAppStore();

  const pendingTodos = todos.filter(t => !t.completed);
  const doneTodos = todos.filter(t => t.completed);
  const sortedTodos = [...pendingTodos, ...doneTodos];

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #0E0E12 0%, #141418 50%, #0A0A0F 100%)',
        overflow: 'hidden',
      }}
    >
      {/* ── HEADER ── */}
      <Header />

      {/* ── BODY ── */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: settings.showTodos ? '1fr 320px' : '1fr',
          gap: '20px',
          padding: '20px 24px',
          overflow: 'hidden',
          minHeight: 0,
        }}
      >
        {/* ── LEFT: SHIPS ── */}
        <div
          className="tv-panel tv-panel-accent-success flex flex-col"
          style={{ padding: '20px 24px', overflow: 'hidden' }}
        >
          <SectionTitle
            icon={Ship}
            label="Próximos Arribos — ETA"
            count={ships.length}
            accentColor="#22C55E"
          />
          <div className="tv-divider mb-4 flex-shrink-0" />
          <ShipsTable ships={ships} />
        </div>

        {/* ── RIGHT: TODOS ── */}
        {settings.showTodos && (
          <div
            className="tv-panel flex flex-col"
            style={{
              padding: '20px 24px',
              overflow: 'hidden',
              borderTop: '3px solid rgba(190,22,34,0.7)',
            }}
          >
            <SectionTitle
              icon={CheckSquare}
              label="Tareas del Día"
              count={pendingTodos.length > 0 ? pendingTodos.length : undefined}
              accentColor="#BE1622"
            />
            <div className="tv-divider mb-4 flex-shrink-0" />
            <TodoList todos={sortedTodos} />
          </div>
        )}
      </div>

      {/* ── TICKER ── */}
      <TickerBar />
    </div>
  );
}
