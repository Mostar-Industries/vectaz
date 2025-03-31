
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import MapContainer from './map/MapContainer';
import RouteInfoPanel from './map/RouteInfoPanel';
import StatsOverlay from './map/StatsOverlay';
import { Route } from '@/types/deeptrack';

interface MapVisualizerProps {
  routes: Route[];
  isLoading?: boolean;
  className?: string;
}

const MapVisualizer: React.FC<MapVisualizerProps> = ({ routes, isLoading = false, className }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeRoute, setActiveRoute] = useState<number | null>(null);

  const handleMapLoaded = () => {
    setMapLoaded(true);
  };

  const handleRouteClick = (routeIndex: number | null) => {
    setActiveRoute(routeIndex);
  };

  return (
    <div className={cn("relative h-full w-full", className)}>
      <MapContainer 
        routes={routes} 
        isLoading={isLoading} 
        onMapLoaded={handleMapLoaded}
        onRouteClick={handleRouteClick}
      />
      
      {mapLoaded && routes.length > 0 && (
        <>
          {/* Route info panel */}
          {activeRoute !== null && (
            <RouteInfoPanel 
              route={routes[activeRoute]} 
              onClose={() => setActiveRoute(null)}
            />
          )}
          
          {/* Stats overlay */}
          <StatsOverlay routesCount={routes.length} />
        </>
      )}
    </div>
  );
};

export default MapVisualizer;
