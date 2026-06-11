import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Settings, Plus, Trash2, Home, Save, CheckSquare, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminPanel() {
  const { ships, finance, todos, settings, addShip, removeShip, updateFinance, addTodo, toggleTodo, removeTodo, updateSettings } = useAppStore();
  
  const [bcvInput, setBcvInput] = useState(finance.bcv);
  const [usdtInput, setUsdtInput] = useState(finance.usdt);

  const [newShipName, setNewShipName] = useState('');
  const [newShipStatus, setNewShipStatus] = useState('Programado');
  const [newShipEta, setNewShipEta] = useState('');

  const [newTodo, setNewTodo] = useState('');

  const handleSaveFinance = (e) => {
    e.preventDefault();
    updateFinance({ bcv: bcvInput, usdt: usdtInput });
    alert('Tasas actualizadas correctamente');
  };

  const handleAddShip = (e) => {
    e.preventDefault();
    if (!newShipName || !newShipEta) return;
    addShip({
      name: newShipName,
      status: newShipStatus,
      eta: newShipEta
    });
    setNewShipName('');
    setNewShipStatus('Programado');
    setNewShipEta('');
  };

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!newTodo) return;
    addTodo(newTodo);
    setNewTodo('');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700">
          <div className="flex items-center gap-4">
            <Settings size={32} className="text-brand-red" />
            <div>
              <h1 className="text-2xl font-bold text-white">Panel de Administración</h1>
              <p className="text-slate-400 text-sm">Gestiona la información de la pantalla de TV en tiempo real.</p>
            </div>
          </div>
          <Link to="/" className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors font-medium text-white">
            <Home size={20} />
            Ver Pantalla
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Tasas Financieras */}
          <div className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-brand-success rounded-full"></span>
              Tasas del Día
            </h2>
            <form onSubmit={handleSaveFinance} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Tasa BCV (Bs.)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  value={bcvInput} 
                  onChange={(e) => setBcvInput(e.target.value)} 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-red"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Tasa USDT (Bs.)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  value={usdtInput} 
                  onChange={(e) => setUsdtInput(e.target.value)} 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-red"
                  required
                />
              </div>
              <button type="submit" className="w-full flex items-center justify-center gap-2 bg-brand-success hover:bg-brand-success/80 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                <Save size={20} />
                Guardar Tasas
              </button>
            </form>
          </div>

          {/* Agregar Barco */}
          <div className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-brand-warning rounded-full"></span>
              Agregar Arribo (ETA)
            </h2>
            <form onSubmit={handleAddShip} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Nombre del Barco o Viaje</label>
                <input 
                  type="text" 
                  value={newShipName} 
                  onChange={(e) => setNewShipName(e.target.value)} 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-red uppercase"
                  placeholder="Ej. MSC ALINA"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Estado</label>
                <select 
                  value={newShipStatus} 
                  onChange={(e) => setNewShipStatus(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-red"
                >
                  <option value="Programado">Programado</option>
                  <option value="En tránsito">En tránsito</option>
                  <option value="En puerto">En puerto</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Fecha Estimada (ETA)</label>
                <input 
                  type="date" 
                  value={newShipEta} 
                  onChange={(e) => setNewShipEta(e.target.value)} 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-red [color-scheme:dark]"
                  required
                />
              </div>
              <button type="submit" className="w-full flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-red/80 text-brand-dark font-bold py-2 px-4 rounded-lg transition-colors">
                <Plus size={20} />
                Agregar a la Lista
              </button>
            </form>
          </div>

        </div>

        {/* Lista de Barcos Actuales */}
        <div className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-brand-red rounded-full"></span>
            Barcos en Pantalla ({ships.length})
          </h2>
          
          <div className="space-y-3">
            {ships.length === 0 ? (
              <p className="text-slate-400 text-center py-4">No hay barcos agregados.</p>
            ) : (
              ships.map(ship => (
                <div key={ship.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-900 p-4 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors">
                  <div className="mb-2 sm:mb-0">
                    <p className="font-bold text-white uppercase">{ship.name}</p>
                    <div className="flex gap-4 text-sm text-slate-400 mt-1">
                      <span>Estado: <span className="font-semibold text-slate-300">{ship.status}</span></span>
                      <span>ETA: <span className="font-semibold text-slate-300">{ship.eta}</span></span>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeShip(ship.id)}
                    className="flex items-center justify-center gap-2 text-brand-danger hover:bg-brand-danger/10 px-3 py-2 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                    <span className="sm:hidden">Eliminar</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Tareas / To-Do List */}
        <div className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <CheckSquare className="text-brand-success" size={24} />
              Tareas del Día (To-Do)
            </h2>
            <button
              onClick={() => updateSettings({ showTodos: !settings.showTodos })}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${
                settings.showTodos 
                  ? 'bg-brand-success/20 text-brand-success hover:bg-brand-success/30' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {settings.showTodos ? <Eye size={18} /> : <EyeOff size={18} />}
              {settings.showTodos ? 'Visible en TV' : 'Oculto en TV'}
            </button>
          </div>

          <form onSubmit={handleAddTodo} className="flex gap-2 mb-6">
            <input 
              type="text" 
              value={newTodo} 
              onChange={(e) => setNewTodo(e.target.value)} 
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-success"
              placeholder="Ej. Enviar reporte de Aduanas..."
              required
            />
            <button type="submit" className="bg-brand-success hover:bg-brand-success/80 text-white font-bold py-2 px-6 rounded-lg transition-colors">
              Añadir
            </button>
          </form>
          
          <div className="space-y-2">
            {todos.length === 0 ? (
              <p className="text-slate-400 text-center py-4">No hay tareas pendientes.</p>
            ) : (
              todos.map(todo => (
                <div key={todo.id} className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${todo.completed ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-900 border-slate-700/50'}`}>
                  <label className="flex items-center gap-4 cursor-pointer flex-1">
                    <input 
                      type="checkbox" 
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id, todo.completed)}
                      className="w-5 h-5 rounded border-slate-600 text-brand-success focus:ring-brand-success bg-slate-800"
                    />
                    <span className={`text-lg font-medium transition-all ${todo.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                      {todo.text}
                    </span>
                  </label>
                  <button 
                    onClick={() => removeTodo(todo.id)}
                    className="text-brand-danger hover:bg-brand-danger/10 p-2 rounded-lg transition-colors ml-4"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
