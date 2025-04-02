
import React from 'react';

const MapLegend: React.FC = () => {
  return (
    <div className="absolute bottom-4 left-4 glass-panel p-3 text-xs">
      <div className="text-white mb-2 font-semibold">Status Legend</div>
      <div className="flex items-center space-x-2 mb-1">
        <span className="w-3 h-3 rounded-full bg-green-400"></span>
        <span className="text-gray-200">On Time</span>
      </div>
      <div className="flex items-center space-x-2 mb-1">
        <span className="w-3 h-3 rounded-full bg-amber-400"></span>
        <span className="text-gray-200">In Transit</span>
      </div>
      <div className="flex items-center space-x-2 mb-1">
        <span className="w-3 h-3 rounded-full bg-red-400 error-flicker"></span>
        <span className="text-gray-200">Delayed</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="w-3 h-3 rounded-full bg-blue-400"></span>
        <span className="text-gray-200">Destination</span>
      </div>
    </div>
  );
};

export default MapLegend;
