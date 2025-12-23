
import React, { useState } from 'react';
import { Dashboard } from '../types';

interface SettingsModalProps {
  dashboards: Dashboard[];
  onClose: () => void;
  onAdd: (name: string, url: string) => void;
  onDelete: (id: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  dashboards, 
  onClose, 
  onAdd, 
  onDelete 
}) => {
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newName.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }
    if (!newUrl.trim()) {
      setError('La URL es obligatoria.');
      return;
    }
    
    // Broadened validation to support both "Publish to Web" and "Internal Embed" links
    const isPowerBiUrl = newUrl.includes('app.powerbi.com/view') || newUrl.includes('app.powerbi.com/reportEmbed');
    
    if (!isPowerBiUrl) {
      setError('La URL debe ser un enlace válido de Power BI (view o reportEmbed).');
      return;
    }

    onAdd(newName.trim(), newUrl.trim());
    setNewName('');
    setNewUrl('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Configuración</h2>
            <p className="text-sm text-gray-500 mt-1">Administra los enlaces de tus tableros de Power BI</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Add New Section */}
          <section>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Agregar Nuevo Tablero</h3>
            <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Tablero</label>
                <input 
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej: Reporte de Ventas 2024"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL de Publicación o Inserción</label>
                <input 
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://app.powerbi.com/reportEmbed?..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                />
                <p className="text-[10px] text-gray-400 mt-1">Soporta enlaces de 'Publicar en la web' y enlaces de 'Insertar en sitio web o portal'.</p>
              </div>
              {error && <p className="text-red-500 text-xs font-medium">{error}</p>}
              <button 
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-md shadow-blue-200 transition-all text-sm"
              >
                Añadir al Listado
              </button>
            </form>
          </section>

          {/* Current List Section */}
          <section>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Tableros Actuales</h3>
            {dashboards.length === 0 ? (
              <p className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                No hay tableros configurados todavía.
              </p>
            ) : (
              <div className="space-y-3">
                {dashboards.map((dash) => (
                  <div 
                    key={dash.id} 
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-all"
                  >
                    <div className="min-w-0 pr-4">
                      <h4 className="font-semibold text-gray-900 truncate">{dash.name}</h4>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{dash.url}</p>
                    </div>
                    <button 
                      onClick={() => onDelete(dash.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                      title="Eliminar"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-all text-sm"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
