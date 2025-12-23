
import React, { useState } from 'react';
import { Dashboard } from '../types.ts';

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

    if (!newName.trim() || !newUrl.trim()) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    
    const isPowerBiUrl = newUrl.includes('app.powerbi.com/view') || newUrl.includes('app.powerbi.com/reportEmbed');
    
    if (!isPowerBiUrl) {
      setError('La URL debe ser un enlace válido de Power BI.');
      return;
    }

    onAdd(newName.trim(), newUrl.trim());
    setNewName('');
    setNewUrl('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Configuración</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-6 rounded-xl">
            <input 
              type="text" value={newName} onChange={(e) => setNewName(e.target.value)} 
              placeholder="Nombre del Tablero" className="w-full px-4 py-2 border rounded-lg"
            />
            <input 
              type="url" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} 
              placeholder="URL de Power BI" className="w-full px-4 py-2 border rounded-lg"
            />
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg">Añadir</button>
          </form>
          <div className="space-y-3">
            {dashboards.map((dash) => (
              <div key={dash.id} className="flex items-center justify-between p-4 border rounded-xl">
                <div className="truncate pr-4">
                  <h4 className="font-semibold text-gray-900">{dash.name}</h4>
                  <p className="text-xs text-gray-400 truncate">{dash.url}</p>
                </div>
                <button onClick={() => onDelete(dash.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">Borrar</button>
              </div>
            ))}
          </div>
        </div>
        <div className="p-6 border-t bg-gray-50 text-right">
          <button onClick={onClose} className="px-6 py-2 bg-white border rounded-lg text-sm font-semibold">Cerrar</button>
        </div>
      </div>
    </div>
  );
};
