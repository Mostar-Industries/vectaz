
import React from 'react';

interface MapControlsProps {
  routesCount: number;
  dataSource?: string;
  validated?: boolean;
}

const MapControls: React.FC<MapControlsProps> = ({ 
  routesCount, 
  dataSource = 'deeptrack_3.csv',
  validated = true
}) => {
  return (
    <>
      {/* Map overlay with route count */}
      <div className="absolute bottom-4 left-4 pointer-events-none">
        <div className="text-xs bg-background/80 backdrop-blur-sm px-3 py-2 rounded-md shadow-sm border border-border">
          <div className="font-semibold">Routes: {routesCount}</div>
          <div className="mt-1 flex items-center gap-2">
            <span className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-[#1A1F2C] mr-1"></span>
              Origins
            </span>
            <span className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-[#D946EF] mr-1"></span>
              Destinations
            </span>
          </div>
        </div>
      </div>
      
      {/* Validation badge */}
      <div className="absolute top-4 right-4 pointer-events-none">
        <div className={`text-xs ${validated ? 'bg-green-600/80 text-white' : 'bg-red-600/80 text-white'} backdrop-blur-sm px-3 py-2 rounded-md shadow-sm`}>
          <div className="font-semibold">{validated ? 'Data Validated' : 'Validation Failed'}</div>
          <div className="text-xs opacity-80">Source: {dataSource}</div>
        </div>
      </div>
    </>
  );
};

export default MapControls;
