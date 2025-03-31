
import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import MapContainer from './map/MapContainer';
import RouteInfoPanel from './map/RouteInfoPanel';
import StatsOverlay from './map/StatsOverlay';
import ShipmentHologram from './map/ShipmentHologram';
import { Route } from '@/types/deeptrack';
import './map/map-styles.css';

interface MapVisualizerProps {
  routes: Route[];
  isLoading?: boolean;
  className?: string;
}

const MapVisualizer: React.FC<MapVisualizerProps> = ({ routes, isLoading = false, className }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeRoute, setActiveRoute] = useState<number | null>(null);
  const mapContainerRef = useRef<any>(null);

  const handleMapLoaded = () => {
    setMapLoaded(true);
  };

  const handleRouteClick = (routeIndex: number | null) => {
    setActiveRoute(routeIndex);
  };

  const handleJumpToLocation = (lat: number, lng: number, name: string) => {
    // Access the map instance's jumpToLocation method through ref
    if (mapContainerRef.current?.jumpToLocation) {
      mapContainerRef.current.jumpToLocation(lat, lng, name);
    }
  };

  return (
    <div className={cn("relative h-full w-full", className)}>
      <MapContainer 
        routes={routes} 
        isLoading={isLoading} 
        onMapLoaded={handleMapLoaded}
        onRouteClick={handleRouteClick}
        ref={mapContainerRef}
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
          
          {/* Holographic shipment list */}
          <ShipmentHologram 
            onJumpToLocation={handleJumpToLocation}
          />
          
          {/* Stats overlay */}
          <StatsOverlay routesCount={routes.length} />
        </>
      )}
    </div>
  );
};

export default MapVisualizer;
