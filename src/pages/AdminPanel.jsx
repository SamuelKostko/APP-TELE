import { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  Settings, Plus, Trash2, Home, Save,
  CheckSquare, Eye, EyeOff, Ship, TrendingUp,
  DollarSign, Check, X, Anchor, Clock, CheckCircle,
  LayoutDashboard, ArrowUp, ArrowDown, ArrowLeftRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

/* ─── Status config ─────────────────────────── */
const STATUS_OPTIONS = [
  { value: 'Programado',   label: 'Programado',   color: '#9090A4', icon: Anchor      },
  { value: 'En tránsito',  label: 'En tránsito',  color: '#F59E0B', icon: Clock       },
  { value: 'En puerto',    label: 'En puerto',     color: '#22C55E', icon: CheckCircle },
];

/* ─── Reusable input styles ─────────────────── */
const inputClass = `
  w-full rounded-lg px-4 py-2.5 text-sm font-medium text-white
  bg-[#16161C] border border-[rgba(255,255,255,0.08)]
  focus:outline-none focus:border-[rgba(255,255,255,0.25)]
  placeholder:text-[rgba(255,255,255,0.2)]
  transition-colors
`.trim();

const selectClass = `
  w-full rounded-lg px-4 py-2.5 text-sm font-medium text-white
  bg-[#16161C] border border-[rgba(255,255,255,0.08)]
  focus:outline-none focus:border-[rgba(255,255,255,0.25)]
  transition-colors appearance-none cursor-pointer
`.trim();

/* ─── Section Card ──────────────────────────── */
function SectionCard({ accentColor = '#fff', title, icon: Icon, children }) {
  return (
    <div
      style={{
        background: '#1E1E26',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '14px',
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      }}
    >
      {/* Top accent line */}
      <div style={{ height: '3px', background: accentColor }} />

      {/* Header */}
      <div
        style={{
          padding: '18px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div
          style={{
            width: '34px', height: '34px',
            borderRadius: '8px',
            background: `${accentColor}18`,
            border: `1px solid ${accentColor}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon size={17} color={accentColor} strokeWidth={2.5} />
        </div>
        <span
          style={{
            fontFamily: 'Rajdhani, Inter, sans-serif',
            fontSize: '1rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.9)',
          }}
        >
          {title}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: '20px 24px' }}>
        {children}
      </div>
    </div>
  );
}

/* ─── Form Label ────────────────────────────── */
function FieldLabel({ children }) {
  return (
    <label
      style={{
        display: 'block',
        fontFamily: 'Inter',
        fontSize: '0.65rem',
        fontWeight: 700,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.35)',
        marginBottom: '6px',
      }}
    >
      {children}
    </label>
  );
}

/* ─── Primary Button ────────────────────────── */
function PrimaryButton({ color = '#22C55E', icon: Icon, children, type = 'button', onClick }) {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        background: color,
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        padding: '10px 20px',
        fontFamily: 'Inter',
        fontSize: '0.82rem',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'opacity 0.15s, transform 0.1s',
      }}
      onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
      onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.98)'; }}
      onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      {Icon && <Icon size={16} strokeWidth={2.5} />}
      {children}
    </button>
  );
}

/* ─── MAIN COMPONENT ────────────────────────── */
export default function AdminPanel() {
  const {
    ships, finance, todos, settings,
    addShip, removeShip, updateFinance,
    addTodo, toggleTodo, removeTodo, updateSettings,
  } = useAppStore();

  const [bcvInput, setBcvInput]         = useState(finance.bcv);
  const [bcvEuroInput, setBcvEuroInput] = useState(finance.bcvEuro);
  const [usdtInput, setUsdtInput]       = useState(finance.usdt);
  const [newShipName, setNewShipName]   = useState('');
  const [newShipStatus, setNewShipStatus] = useState('Programado');
  const [newShipEta, setNewShipEta]     = useState('');
  const [newTodo, setNewTodo]           = useState('');
  const [savedFlash, setSavedFlash]     = useState(false);

  // Sincronizar inputs cuando Firebase actualiza los valores
  useEffect(() => {
    setBcvInput(finance.bcv);
    setBcvEuroInput(finance.bcvEuro);
    setUsdtInput(finance.usdt);
  }, [finance.bcv, finance.bcvEuro, finance.usdt]);

  const handleSaveFinance = (e) => {
    e.preventDefault();
    updateFinance({ bcv: bcvInput, bcvEuro: bcvEuroInput, usdt: usdtInput });
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  };

  const verticalOrder = settings.verticalOrder || ['header', 'content', 'ticker'];
  const contentOrder = settings.contentOrder || ['ships', 'todos'];

  const handleMoveVertical = (idx, direction) => {
    const newArr = [...verticalOrder];
    if (direction === 'up' && idx > 0) {
      [newArr[idx - 1], newArr[idx]] = [newArr[idx], newArr[idx - 1]];
      updateSettings({ ...settings, verticalOrder: newArr });
    }
    if (direction === 'down' && idx < newArr.length - 1) {
      [newArr[idx + 1], newArr[idx]] = [newArr[idx], newArr[idx + 1]];
      updateSettings({ ...settings, verticalOrder: newArr });
    }
  };

  const handleSwapContent = () => {
    updateSettings({ ...settings, contentOrder: [...contentOrder].reverse() });
  };

  const handleAddShip = (e) => {
    e.preventDefault();
    if (!newShipName || !newShipEta) return;
    addShip({ name: newShipName.toUpperCase(), status: newShipStatus, eta: newShipEta });
    setNewShipName('');
    setNewShipStatus('Programado');
    setNewShipEta('');
  };

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    addTodo(newTodo.trim());
    setNewTodo('');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0E0E12 0%, #141418 60%, #0A0A0F 100%)',
        fontFamily: 'Inter, system-ui, sans-serif',
        color: '#E8E8F0',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      {/* ── TOP NAV ── */}
      <div
        style={{
          background: 'rgba(20,20,26,0.98)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '0 32px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        {/* Left: Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '36px', height: '36px',
              borderRadius: '9px',
              background: 'rgba(190,22,34,0.15)',
              border: '1px solid rgba(190,22,34,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Settings size={18} color="#BE1622" strokeWidth={2.5} />
          </div>
          <div>
            <p
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: '1rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#fff',
                lineHeight: 1,
                marginBottom: '2px',
              }}
            >
              Panel de Administración
            </p>
            <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', lineHeight: 1 }}>
              Gestión en tiempo real · TAM CARGO
            </p>
          </div>
        </div>

        {/* Right: Ver pantalla */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            borderRadius: '8px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.75)',
            textDecoration: 'none',
            fontSize: '0.8rem',
            fontWeight: 600,
            letterSpacing: '0.05em',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}
        >
          <Home size={15} strokeWidth={2.5} />
          Ver Pantalla TV
        </Link>
      </div>

      {/* ── BODY ── */}
      <div
        style={{
          maxWidth: '960px',
          margin: '0 auto',
          padding: '32px 24px 64px',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
        }}
      >

        {/* ROW 1: Tasas + Agregar barco */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

          {/* Tasas */}
          <SectionCard accentColor="#22C55E" title="Tasas del Día" icon={TrendingUp}>
            <form onSubmit={handleSaveFinance} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <FieldLabel>Tasa BCV Dólar (Bs.)</FieldLabel>
                <input
                  type="number"
                  step="0.01"
                  value={bcvInput}
                  onChange={e => setBcvInput(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <FieldLabel>Tasa BCV Euro (Bs.)</FieldLabel>
                <input
                  type="number"
                  step="0.01"
                  value={bcvEuroInput}
                  onChange={e => setBcvEuroInput(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <FieldLabel>Tasa USDT (Bs.)</FieldLabel>
                <input
                  type="number"
                  step="0.01"
                  value={usdtInput}
                  onChange={e => setUsdtInput(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div style={{ marginTop: '4px' }}>
                <PrimaryButton
                  type="submit"
                  color={savedFlash ? '#16A34A' : '#22C55E'}
                  icon={savedFlash ? Check : Save}
                >
                  {savedFlash ? '¡Guardado!' : 'Guardar Tasas'}
                </PrimaryButton>
              </div>
            </form>
          </SectionCard>

          {/* Agregar barco */}
          <SectionCard accentColor="#F59E0B" title="Agregar Arribo (ETA)" icon={Ship}>
            <form onSubmit={handleAddShip} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <FieldLabel>Nombre del Buque / Viaje</FieldLabel>
                <input
                  type="text"
                  value={newShipName}
                  onChange={e => setNewShipName(e.target.value)}
                  className={inputClass}
                  placeholder="Ej. MSC ALINA"
                  required
                  style={{ textTransform: 'uppercase' }}
                />
              </div>
              <div>
                <FieldLabel>Estado</FieldLabel>
                <select
                  value={newShipStatus}
                  onChange={e => setNewShipStatus(e.target.value)}
                  className={selectClass}
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel>Fecha Estimada (ETA)</FieldLabel>
                <input
                  type="date"
                  value={newShipEta}
                  onChange={e => setNewShipEta(e.target.value)}
                  className={inputClass}
                  required
                  style={{ colorScheme: 'dark' }}
                />
              </div>
              <div style={{ marginTop: '4px' }}>
                <PrimaryButton type="submit" color="#F59E0B" icon={Plus}>
                  Agregar a la Lista
                </PrimaryButton>
              </div>
            </form>
          </SectionCard>
        </div>

        {/* ROW 2: Lista de barcos */}
        <SectionCard accentColor="#BE1622" title={`Buques en Pantalla (${ships.length})`} icon={Ship}>
          {ships.length === 0 ? (
            <div
              style={{
                padding: '32px',
                textAlign: 'center',
                color: 'rgba(255,255,255,0.2)',
                fontSize: '0.9rem',
              }}
            >
              No hay buques agregados aún.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Table header */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 160px 140px 40px',
                  gap: '16px',
                  padding: '0 14px 8px',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                {['BUQUE', 'ESTADO', 'ETA', ''].map((h, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      letterSpacing: '0.16em',
                      color: 'rgba(255,255,255,0.25)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {h}
                  </span>
                ))}
              </div>

              {/* Rows */}
              {ships.map(ship => {
                const conf = STATUS_OPTIONS.find(s => s.value === ship.status) || STATUS_OPTIONS[0];
                const eta = ship.eta
                  ? format(parseISO(ship.eta), "d 'de' MMMM, yyyy", { locale: es })
                  : 'Por definir';
                return (
                  <div
                    key={ship.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 160px 140px 40px',
                      gap: '16px',
                      alignItems: 'center',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.025)',
                      borderLeft: `3px solid ${conf.color}`,
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.025)'; }}
                  >
                    {/* Name */}
                    <span
                      style={{
                        fontFamily: 'Rajdhani, sans-serif',
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: '#fff',
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {ship.name}
                    </span>

                    {/* Status */}
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '3px 10px',
                        borderRadius: '4px',
                        background: `${conf.color}15`,
                        border: `1px solid ${conf.color}30`,
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: conf.color,
                        width: 'fit-content',
                      }}
                    >
                      <div
                        style={{
                          width: '6px', height: '6px',
                          borderRadius: '50%',
                          background: conf.color,
                        }}
                      />
                      {ship.status}
                    </div>

                    {/* ETA */}
                    <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.3 }}>
                      {eta}
                    </span>

                    {/* Delete */}
                    <button
                      onClick={() => removeShip(ship.id)}
                      title="Eliminar"
                      style={{
                        width: '32px', height: '32px',
                        borderRadius: '7px',
                        border: '1px solid rgba(239,68,68,0.2)',
                        background: 'rgba(239,68,68,0.07)',
                        color: '#EF4444',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        flexShrink: 0,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.18)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.07)'; }}
                    >
                      <Trash2 size={14} strokeWidth={2.5} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>

        {/* ROW 3: Tareas */}
        <SectionCard accentColor="#BE1622" title="Tareas del Día" icon={CheckSquare}>
          {/* Header extra: toggle visibilidad */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <button
              onClick={() => updateSettings({ showTodos: !settings.showTodos })}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                padding: '6px 14px',
                borderRadius: '7px',
                border: `1px solid ${settings.showTodos ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)'}`,
                background: settings.showTodos ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.05)',
                color: settings.showTodos ? '#22C55E' : 'rgba(255,255,255,0.4)',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {settings.showTodos ? <Eye size={14} strokeWidth={2.5} /> : <EyeOff size={14} strokeWidth={2.5} />}
              {settings.showTodos ? 'Visible en TV' : 'Oculto en TV'}
            </button>
          </div>

          {/* Add todo form */}
          <form
            onSubmit={handleAddTodo}
            style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}
          >
            <input
              type="text"
              value={newTodo}
              onChange={e => setNewTodo(e.target.value)}
              className={inputClass}
              placeholder="Ej. Enviar reporte de Aduanas..."
              required
              style={{ flex: 1 }}
            />
            <button
              type="submit"
              style={{
                flexShrink: 0,
                padding: '0 20px',
                borderRadius: '8px',
                background: '#BE1622',
                color: '#fff',
                border: 'none',
                fontFamily: 'Inter',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
            >
              <Plus size={15} strokeWidth={2.5} />
              Añadir
            </button>
          </form>

          {/* Todo list */}
          {todos.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '0.85rem' }}>
              No hay tareas pendientes.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {todos.map(todo => (
                <div
                  key={todo.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    background: todo.completed ? 'rgba(255,255,255,0.015)' : 'rgba(255,255,255,0.03)',
                    borderLeft: `3px solid ${todo.completed ? '#22C55E' : 'rgba(255,255,255,0.08)'}`,
                    transition: 'all 0.15s',
                    opacity: todo.completed ? 0.55 : 1,
                  }}
                >
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleTodo(todo.id, todo.completed)}
                    style={{
                      width: '22px', height: '22px',
                      borderRadius: '6px',
                      border: `2px solid ${todo.completed ? '#22C55E' : 'rgba(255,255,255,0.2)'}`,
                      background: todo.completed ? 'rgba(34,197,94,0.15)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer',
                      flexShrink: 0,
                      transition: 'all 0.15s',
                    }}
                  >
                    {todo.completed && <Check size={12} color="#22C55E" strokeWidth={3} />}
                  </button>

                  {/* Text */}
                  <span
                    style={{
                      flex: 1,
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      color: todo.completed ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.85)',
                      textDecoration: todo.completed ? 'line-through' : 'none',
                    }}
                  >
                    {todo.text}
                  </span>

                  {/* Delete */}
                  <button
                    onClick={() => removeTodo(todo.id)}
                    title="Eliminar"
                    style={{
                      width: '30px', height: '30px',
                      borderRadius: '7px',
                      border: '1px solid rgba(239,68,68,0.15)',
                      background: 'rgba(239,68,68,0.05)',
                      color: '#EF4444',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer',
                      flexShrink: 0,
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.18)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.05)'; }}
                  >
                    <X size={13} strokeWidth={2.5} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* ROW 4: Configuración de Diseño (Layout) */}
        <SectionCard accentColor="#3B82F6" title="Distribución de Pantalla (Layout)" icon={LayoutDashboard}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Vertical Order */}
            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Orden Vertical General
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {verticalOrder.map((id, idx) => (
                  <div
                    key={id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '8px',
                    }}
                  >
                    <span style={{ fontWeight: 600, textTransform: 'capitalize', color: '#fff' }}>
                      {id === 'header' ? 'Cabecera (Tasas/Reloj)' : id === 'content' ? 'Contenido Central (Arribos/Tareas)' : 'Noticias (Ticker)'}
                    </span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => handleMoveVertical(idx, 'up')}
                        disabled={idx === 0}
                        style={{
                          width: '28px', height: '28px', borderRadius: '6px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: idx === 0 ? 'rgba(255,255,255,0.02)' : 'rgba(59,130,246,0.1)',
                          color: idx === 0 ? 'rgba(255,255,255,0.2)' : '#3B82F6',
                          border: 'none', cursor: idx === 0 ? 'default' : 'pointer',
                        }}
                      >
                        <ArrowUp size={16} />
                      </button>
                      <button
                        onClick={() => handleMoveVertical(idx, 'down')}
                        disabled={idx === verticalOrder.length - 1}
                        style={{
                          width: '28px', height: '28px', borderRadius: '6px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: idx === verticalOrder.length - 1 ? 'rgba(255,255,255,0.02)' : 'rgba(59,130,246,0.1)',
                          color: idx === verticalOrder.length - 1 ? 'rgba(255,255,255,0.2)' : '#3B82F6',
                          border: 'none', cursor: idx === verticalOrder.length - 1 ? 'default' : 'pointer',
                        }}
                      >
                        <ArrowDown size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Swap */}
            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Orden del Contenido Central
              </p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '24px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px dashed rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  justifyContent: 'center'
                }}
              >
                <div style={{ flex: 1, textAlign: 'center', padding: '16px', background: 'rgba(34,197,94,0.1)', color: '#22C55E', borderRadius: '8px', fontWeight: 700 }}>
                  {contentOrder[0] === 'ships' ? 'Próximos Arribos' : 'Tareas del Día'}
                </div>
                
                <button
                  onClick={handleSwapContent}
                  style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: '#3B82F6', color: '#fff', border: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', flexShrink: 0, boxShadow: '0 4px 12px rgba(59,130,246,0.4)'
                  }}
                  title="Intercambiar orden"
                >
                  <ArrowLeftRight size={20} />
                </button>

                <div style={{ flex: 1, textAlign: 'center', padding: '16px', background: 'rgba(190,22,34,0.1)', color: '#BE1622', borderRadius: '8px', fontWeight: 700 }}>
                  {contentOrder[1] === 'ships' ? 'Próximos Arribos' : 'Tareas del Día'}
                </div>
              </div>
              <p style={{ marginTop: '16px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
                El elemento de la izquierda toma el lado principal de la pantalla.
              </p>
            </div>
          </div>
        </SectionCard>

      </div>
    </div>
  );
}
