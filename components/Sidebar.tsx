
import React from 'react';
import { Dashboard } from '../types.ts';

interface SidebarProps {
  dashboards: Dashboard[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onOpenSettings: () => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  dashboards, 
  selectedId, 
  onSelect, 
  onOpenSettings,
  isOpen,
  toggleSidebar
}) => {
  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-30 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-6h2v6zm0-8h-2V7h2v1z"/></svg>
              </div>
              <h1 className="text-xl font-bold text-gray-800">Hub PBI</h1>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {dashboards.map((dash) => (
              <button
                key={dash.id}
                onClick={() => {
                  onSelect(dash.id);
                  if (window.innerWidth < 768) toggleSidebar();
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 text-left rounded-xl transition-all
                  ${selectedId === dash.id 
                    ? 'bg-blue-50 text-blue-700 font-semibold' 
                    : 'text-gray-600 hover:bg-gray-50'}
                `}
              >
                <span className="truncate text-sm">{dash.name}</span>
              </button>
            ))}
          </div>

          <div className="p-4 border-t border-gray-100">
            <button 
              onClick={onOpenSettings}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 rounded-xl text-gray-700 hover:bg-blue-600 hover:text-white transition-all"
            >
              <span className="font-medium text-sm">Configuración</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
