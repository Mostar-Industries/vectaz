
import React from 'react';
import { cn } from '@/lib/utils';
import MapContainer from './map/MapContainer';
import StatsOverlay from './map/StatsOverlay';
import ShipmentHologram from './map/ShipmentHologram';
import { Route } from '@/types/deeptrack';
import './map/map-styles.css';
import { useMapVisualization } from '@/hooks/useMapVisualization';
import MapControls from './map/controls/MapControls';
import MapLegend from './map/controls/MapLegend';
import DestinationsCounter from './map/controls/DestinationsCounter';

interface MapVisualizerProps {
  routes: Route[];
  isLoading?: boolean;
  className?: string;
}

const MapVisualizer: React.FC<MapVisualizerProps> = ({ 
  routes, 
  isLoading = false, 
  className 
}) => {
  const {
    mapLoaded,
    countryMarkers,
    limitedRoutes,
    mapContainerRef,
    is3DMode,
    handleMapLoaded,
    handleRouteClick,
    handleCountryClick,
    handleShipmentSelect,
    toggle3DMode
  } = useMapVisualization(routes);

  return (
    <div className={cn("relative h-full w-full", className)}>
      <MapContainer 
        routes={limitedRoutes} 
        countries={countryMarkers}
        isLoading={isLoading} 
        onMapLoaded={handleMapLoaded}
        onRouteClick={handleRouteClick}
        onCountryClick={handleCountryClick}
        ref={mapContainerRef}
      />
      
      {mapLoaded && (
        <>
          {limitedRoutes.length > 0 && (
            <ShipmentHologram 
              shipments={limitedRoutes}
              onSelect={handleShipmentSelect}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 w-80 max-h-[320px]"
            />
          )}
          
          <StatsOverlay routesCount={limitedRoutes.length} />
          
          <MapControls 
            is3DMode={is3DMode} 
            toggle3DMode={toggle3DMode} 
          />
          
          <MapLegend />
          
          <DestinationsCounter count={countryMarkers.length} />
        </>
      )}
    </div>
  );
};

export default MapVisualizer;
