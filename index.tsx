
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// --- TYPES ---
interface Dashboard {
  id: string;
  name: string;
  url: string;
  createdAt: number;
}

const STORAGE_KEY = 'pbi_hub_dashboards_v2';

// --- COMPONENTS ---

// 1. Dashboard Viewer
const DashboardViewer: React.FC<{ url: string; name: string }> = ({ url, name }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
  }, [url]);

  return (
    <div className="w-full h-full bg-white relative flex flex-col">
      <div className="hidden md:flex items-center px-6 py-4 border-b border-gray-100 bg-white shadow-sm z-10">
        <h2 className="text-xl font-bold text-gray-800 truncate">{name}</h2>
      </div>

      <div className="flex-1 relative bg-gray-100">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 z-20">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-gray-500 text-sm font-medium">Cargando reporte de Power BI...</p>
          </div>
        )}
        <iframe
          title={name}
          className="w-full h-full border-none shadow-inner"
          src={url}
          onLoad={() => setIsLoading(false)}
          allowFullScreen={true}
        />
      </div>
    </div>
  );
};

// 2. Sidebar
const Sidebar: React.FC<{
  dashboards: Dashboard[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onOpenSettings: () => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}> = ({ dashboards, selectedId, onSelect, onOpenSettings, isOpen, toggleSidebar }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm" onClick={toggleSidebar} />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">Hub PBI</h1>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 ml-2">Mis Reportes</p>
          {dashboards.map((dash) => (
            <button
              key={dash.id}
              onClick={() => { onSelect(dash.id); if (window.innerWidth < 768) toggleSidebar(); }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl transition-all group
                ${selectedId === dash.id 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                  : 'text-gray-600 hover:bg-gray-50'}
              `}
            >
              <span className={`w-2 h-2 rounded-full ${selectedId === dash.id ? 'bg-white' : 'bg-gray-300'}`}></span>
              <span className="truncate text-sm font-medium">{dash.name}</span>
            </button>
          ))}
          {dashboards.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-4">No hay reportes cargados.</p>
          )}
        </nav>

        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <button 
            onClick={onOpenSettings}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 bg-white rounded-xl text-gray-700 hover:bg-gray-900 hover:text-white transition-all shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span className="font-semibold text-xs">Administrar Reportes</span>
          </button>
        </div>
      </aside>
    </>
  );
};

// 3. Settings Modal
const SettingsModal: React.FC<{
  dashboards: Dashboard[];
  onClose: () => void;
  onAdd: (name: string, url: string) => void;
  onDelete: (id: string) => void;
}> = ({ dashboards, onClose, onAdd, onDelete }) => {
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!newName.trim() || !newUrl.trim()) {
      setError('Por favor, completa ambos campos.');
      return;
    }
    const isPbi = newUrl.includes('app.powerbi.com');
    if (!isPbi) {
      setError('La URL debe ser un enlace de Power BI válido.');
      return;
    }
    onAdd(newName.trim(), newUrl.trim());
    setNewName('');
    setNewUrl('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-gray-900/40 animate-fade-in">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-scale-up">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">Panel de Configuración</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">✕</button>
        </div>
        
        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          <form onSubmit={handleSubmit} className="space-y-4 bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
            <h4 className="text-sm font-bold text-blue-800 uppercase tracking-widest">Añadir Nuevo Tablero</h4>
            <input 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              placeholder="Ej: Reporte de Operaciones"
              value={newName} onChange={e => setNewName(e.target.value)}
            />
            <input 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              placeholder="Pegue aquí el enlace de publicación..."
              value={newUrl} onChange={e => setNewUrl(e.target.value)}
            />
            {error && <p className="text-red-500 text-xs font-medium">{error}</p>}
            <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
              Guardar Tablero
            </button>
          </form>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-2">Tableros Actuales</h4>
            {dashboards.map(d => (
              <div key={d.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all">
                <div className="truncate flex-1">
                  <p className="font-bold text-gray-900 text-sm truncate">{d.name}</p>
                  <p className="text-[10px] text-gray-400 truncate">{d.url}</p>
                </div>
                <button onClick={() => onDelete(d.id)} className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-gray-50 text-right">
          <button onClick={onClose} className="px-8 py-2 bg-white border border-gray-300 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-100 transition-all">Cerrar</button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP ---
const App: React.FC = () => {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setDashboards(parsed);
        if (parsed.length > 0) setSelectedId(parsed[0].id);
      } catch (e) { console.error(e); }
    } else {
      // Datos de ejemplo
      const defaults: Dashboard[] = [
        { id: '1', name: 'Demo: Financial Report', url: 'https://app.powerbi.com/view?r=eyJrIjoiYTMxMGZkNzUtZWRhMy00ZDJiLTgxYmUtN2Y1ZDJmYjA5ZGM3IiwidCI6IjYxYjU1MjU4LTQwZGYtNDhlNy1hOWM4LWRlZTMxMThhM2IzZSIsImMiOjEwfQ%3D%3D', createdAt: Date.now() }
      ];
      setDashboards(defaults);
      setSelectedId(defaults[0].id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    }
  }, []);

  const handleAdd = (name: string, url: string) => {
    const fresh = { id: Math.random().toString(36).substr(2, 9), name, url, createdAt: Date.now() };
    const updated = [...dashboards, fresh];
    setDashboards(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    if (!selectedId) setSelectedId(fresh.id);
  };

  const handleDelete = (id: string) => {
    const updated = dashboards.filter(d => d.id !== id);
    setDashboards(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    if (selectedId === id) setSelectedId(updated.length > 0 ? updated[0].id : null);
  };

  const selected = dashboards.find(d => d.id === selectedId);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 text-gray-900">
      <Sidebar 
        dashboards={dashboards} selectedId={selectedId} onSelect={setSelectedId}
        onOpenSettings={() => setIsSettingsOpen(true)} isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-600 bg-gray-100 rounded-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <h2 className="font-bold truncate px-2">{selected?.name || 'Hub PBI'}</h2>
          <button onClick={() => setIsSettingsOpen(true)} className="p-2 text-blue-600 bg-blue-50 rounded-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
          </button>
        </header>

        <div className="flex-1 overflow-hidden">
          {selected ? (
            <DashboardViewer url={selected.url} name={selected.name} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-10 text-center">
              <div className="w-24 h-24 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Bienvenido a su Hub de Power BI</h2>
              <p className="text-gray-500 max-w-sm mb-8">Comience añadiendo sus enlaces de tableros publicados para visualizarlos de forma centralizada.</p>
              <button onClick={() => setIsSettingsOpen(true)} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 hover:scale-105 transition-all">Configurar Primer Tablero</button>
            </div>
          )}
        </div>
      </main>

      {isSettingsOpen && (
        <SettingsModal 
          dashboards={dashboards} onClose={() => setIsSettingsOpen(false)}
          onAdd={handleAdd} onDelete={handleDelete}
        />
      )}
    </div>
  );
};

// --- MOUNT ---
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
