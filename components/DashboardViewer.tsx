
import React, { useState, useEffect } from 'react';

interface DashboardViewerProps {
  url: string;
  name: string;
}

export const DashboardViewer: React.FC<DashboardViewerProps> = ({ url, name }) => {
  const [isLoading, setIsLoading] = useState(true);

  // When the URL changes, show the loader again
  useEffect(() => {
    setIsLoading(true);
  }, [url]);

  return (
    <div className="w-full h-full bg-white relative flex flex-col">
      {/* Title Bar (Desktop Only) */}
      <div className="hidden md:flex items-center px-6 py-4 border-b border-gray-100 bg-white">
        <h2 className="text-xl font-semibold text-gray-800 truncate">{name}</h2>
      </div>

      <div className="flex-1 relative bg-gray-50">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 z-10 transition-opacity">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">Cargando tablero...</p>
          </div>
        )}
        <iframe
          title={name}
          className="w-full h-full border-none"
          src={url}
          onLoad={() => setIsLoading(false)}
          allowFullScreen={true}
          loading="lazy"
        />
      </div>
    </div>
  );
};
