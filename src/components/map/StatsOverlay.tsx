
import React from 'react';

interface StatsOverlayProps {
  routesCount: number;
}

const StatsOverlay: React.FC<StatsOverlayProps> = ({ routesCount }) => {
  return (
    <>
      {/* Map overlay with route count */}
      <div className="absolute bottom-4 left-4 pointer-events-none z-10">
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
      
      {/* Floating stat cards */}
      <div className="absolute top-4 left-4 space-y-3 z-10">
        <div className="bg-background/70 backdrop-blur-sm p-3 rounded-md shadow-lg border border-border max-w-xs">
          <h3 className="font-bold mb-2 text-sm">Active Shipments</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-muted-foreground">In Transit:</span> 42
            </div>
            <div>
              <span className="text-muted-foreground">Delayed:</span> 7
            </div>
            <div>
              <span className="text-muted-foreground">On Schedule:</span> 35
            </div>
            <div>
              <span className="text-muted-foreground">Early:</span> 5
            </div>
          </div>
        </div>
        
        <div className="bg-background/70 backdrop-blur-sm p-3 rounded-md shadow-lg border border-border max-w-xs">
          <h3 className="font-bold mb-2 text-sm">Top Performing Forwarders</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span>DHL</span>
              <span className="text-green-600">94% On-Time</span>
            </div>
            <div className="flex justify-between">
              <span>Kuehne Nagel</span>
              <span className="text-green-600">91% On-Time</span>
            </div>
            <div className="flex justify-between">
              <span>Kenya Airways</span>
              <span className="text-amber-600">86% On-Time</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StatsOverlay;
