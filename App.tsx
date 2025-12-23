
import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardViewer } from './components/DashboardViewer';
import { SettingsModal } from './components/SettingsModal';
import { Dashboard } from './types';

const STORAGE_KEY = 'pbi_hub_dashboards';

const App: React.FC = () => {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Load dashboards from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setDashboards(parsed);
        if (parsed.length > 0) {
          setSelectedId(parsed[0].id);
        }
      } catch (e) {
        console.error("Error loading dashboards", e);
      }
    } else {
      // Default initial dashboards
      const defaults: Dashboard[] = [
        { 
          id: '1', 
          name: 'Demo: Financial Report', 
          url: 'https://app.powerbi.com/view?r=eyJrIjoiYTMxMGZkNzUtZWRhMy00ZDJiLTgxYmUtN2Y1ZDJmYjA5ZGM3IiwidCI6IjYxYjU1MjU4LTQwZGYtNDhlNy1hOWM4LWRlZTMxMThhM2IzZSIsImMiOjEwfQ%3D%3D',
          createdAt: Date.now() 
        },
        { 
          id: '2', 
          name: 'Demo: Sales Overview', 
          url: 'https://app.powerbi.com/view?r=eyJrIjoiNjA3YjI3MjEtMmIxYy00ZjYyLThlZjktYWE0YmRiYTU2ZmJiIiwidCI6IjYxYjU1MjU4LTQwZGYtNDhlNy1hOWM4LWRlZTMxMThhM2IzZSIsImMiOjEwfQ%3D%3D',
          createdAt: Date.now() + 1 
        }
      ];
      setDashboards(defaults);
      setSelectedId(defaults[0].id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    }
  }, []);

  const handleAddDashboard = (name: string, url: string) => {
    const newDashboard: Dashboard = {
      id: crypto.randomUUID(),
      name,
      url,
      createdAt: Date.now()
    };
    const updated = [...dashboards, newDashboard];
    setDashboards(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    if (!selectedId) setSelectedId(newDashboard.id);
  };

  const handleDeleteDashboard = (id: string) => {
    const updated = dashboards.filter(d => d.id !== id);
    setDashboards(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    if (selectedId === id) {
      setSelectedId(updated.length > 0 ? updated[0].id : null);
    }
  };

  const selectedDashboard = dashboards.find(d => d.id === selectedId);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-100">
      {/* Sidebar Component */}
      <Sidebar 
        dashboards={dashboards}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header - Mobile Visible */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-gray-800 truncate px-4">
            {selectedDashboard?.name || 'Power BI Hub'}
          </h1>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-hidden relative">
          {selectedDashboard ? (
            <DashboardViewer url={selectedDashboard.url} name={selectedDashboard.name} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-500">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">No hay tableros configurados</h2>
                <p className="mb-6">Comienza agregando un enlace de Power BI publicado a la web.</p>
                <button 
                  onClick={() => setIsSettingsOpen(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Configurar Tableros
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal 
          dashboards={dashboards}
          onClose={() => setIsSettingsOpen(false)}
          onAdd={handleAddDashboard}
          onDelete={handleDeleteDashboard}
        />
      )}
    </div>
  );
};

export default App;
