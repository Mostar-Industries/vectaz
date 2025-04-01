import React from 'react';
interface StatsOverlayProps {
  routesCount: number;
}
const StatsOverlay: React.FC<StatsOverlayProps> = ({
  routesCount
}) => {
  return <>
      {/* Map overlay with route count */}
      <div className="absolute bottom-4 left-4 pointer-events-none z-10">
        <div className="text-xs glassmorphism-card px-3 py-2 rounded-md shadow-sm border border-mostar-light-blue/30">
          <div className="font-semibold text-cyber-blue">Routes: {routesCount}</div>
          <div className="mt-1 flex items-center gap-2">
            <span className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-[#1A1F2C] mr-1 border border-mostar-blue/40"></span>
              Origins
            </span>
            <span className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-[#D946EF] mr-1 shadow-neon-magenta"></span>
              Destinations
            </span>
          </div>
        </div>
      </div>
      
      {/* Floating stat cards */}
      <div className="absolute top-4 left-4 space-y-3 z-10\n">
        <div className="glassmorphism-card p-3 rounded-md shadow-md border border-mostar-light-blue/30 max-w-xs">
          <h3 className="font-bold mb-2 text-sm text-cyber-blue">Active Shipments</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-muted-foreground">In Transit:</span> <span className="text-foreground">42</span>
            </div>
            <div>
              <span className="text-muted-foreground">Delayed:</span> <span className="text-red-400">7</span>
            </div>
            <div>
              <span className="text-muted-foreground">On Schedule:</span> <span className="text-mostar-green">35</span>
            </div>
            <div>
              <span className="text-muted-foreground">Early:</span> <span className="text-cyan-400">5</span>
            </div>
          </div>
        </div>
        
        <div className="glassmorphism-card p-3 rounded-md shadow-md border border-mostar-light-blue/30 max-w-xs">
          <h3 className="font-bold mb-2 text-sm text-cyber-blue">Top Performing Forwarders</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span>DHL</span>
              <span className="text-mostar-green">94% On-Time</span>
            </div>
            <div className="flex justify-between">
              <span>Kuehne Nagel</span>
              <span className="text-mostar-green">91% On-Time</span>
            </div>
            <div className="flex justify-between">
              <span>Kenya Airways</span>
              <span className="text-amber-500">86% On-Time</span>
            </div>
          </div>
        </div>
      </div>
    </>;
};
export default StatsOverlay;