
import React, { useState, useRef, useCallback } from 'react';
import { Loader, Map as MapIcon, Navigation } from 'lucide-react';
import MapBase from './map/MapBase';
import RouteLayer from './map/RouteLayer';
import MapControls from './map/MapControls';
import { Route } from './map/types';
import { Button } from './ui/button';
import { animateRouteLine } from './map/utils/mapAnimations';

export type { MapPoint } from './map/types';
export type { Route } from './map/types';

interface MapVisualizerProps {
  routes: Route[];
  isLoading?: boolean;
  dataSource?: string;
  validated?: boolean;
}

const MapVisualizer: React.FC<MapVisualizerProps> = ({
  routes,
  isLoading = false,
  dataSource = 'deeptrack_3.csv',
  validated = true
}) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  
  // Function to handle map loaded event
  const handleMapLoaded = useCallback((map: mapboxgl.Map) => {
    mapRef.current = map;
  }, []);
  
  // Function to animate a random route
  const animateRandomRoute = useCallback(() => {
    if (!mapRef.current || routes.length === 0) return;
    
    const randomRouteIndex = Math.floor(Math.random() * routes.length);
    const route = routes[randomRouteIndex];
    
    // First fly to the route origin
    (window as any).flyToLocation(
      [route.origin.lng, route.origin.lat],
      3.5,  // zoom
      0,    // bearing
      60    // pitch
    );
    
    // After a delay, animate the route
    setTimeout(() => {
      animateRouteLine(
        mapRef.current as mapboxgl.Map,
        [
          [route.origin.lng, route.origin.lat],
          [route.destination.lng, route.destination.lat]
        ],
        '#9b87f5'
      );
    }, 2000);
  }, [routes]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center bg-slate-900 h-full w-full">
        <div className="flex flex-col items-center gap-2">
          <Loader className="h-8 w-8 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading map data...</p>
        </div>
      </div>
    );
  }

  if (!routes.length) {
    return (
      <div className="flex items-center justify-center bg-slate-900 h-full w-full">
        <div className="flex flex-col items-center gap-4">
          <MapIcon className="h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">No route data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <MapBase 
        isLoading={isLoading} 
        onMapLoadedState={setMapLoaded}
        onMapLoaded={handleMapLoaded}
      >
        {(map, isMapLoaded) => {
          if (isMapLoaded && map) {
            return <RouteLayer map={map} routes={routes} mapLoaded={isMapLoaded} />;
          }
          return null;
        }}
        <MapControls 
          routesCount={routes.length} 
          dataSource={dataSource}
          validated={validated}
        />
      </MapBase>
      
      {/* Animation control button */}
      <div className="absolute bottom-4 left-4 z-10">
        <Button 
          variant="outline" 
          className="bg-slate-800 hover:bg-slate-700 border-slate-600"
          onClick={animateRandomRoute}
          disabled={!mapLoaded || routes.length === 0}
        >
          <Navigation className="mr-2 h-4 w-4" />
          Animate Random Route
        </Button>
      </div>
    </div>
  );
};

export default MapVisualizer;
