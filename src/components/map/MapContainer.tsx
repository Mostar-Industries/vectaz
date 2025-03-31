
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Route } from '@/types/deeptrack';
import { Loader } from 'lucide-react';

interface MapContainerProps {
  routes: Route[];
  isLoading?: boolean;
  onMapLoaded?: () => void;
  onRouteClick?: (routeIndex: number | null) => void;
}

// Using forwardRef to properly handle the ref
const MapContainer = forwardRef<any, MapContainerProps>(({ 
  routes, 
  isLoading = false, 
  onMapLoaded, 
  onRouteClick 
}, ref) => {
  const [mapInitialized, setMapInitialized] = useState(false);
  
  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    // Method to jump to a specific location on the map
    jumpToLocation: (lat: number, lng: number, name: string) => {
      console.log(`Jumping to location: ${name} at [${lat}, ${lng}]`);
      // Implementation depends on the map library used
      // This would center the map on the given coordinates and possibly show a popup
    }
  }));

  useEffect(() => {
    // Initialize map (would use a real map library in production)
    const initMap = async () => {
      // Simulate map loading
      setTimeout(() => {
        setMapInitialized(true);
        if (onMapLoaded) onMapLoaded();
      }, 1000);
    };
    
    initMap();
  }, [onMapLoaded]);

  // Here you would render your actual map with markers for each route
  return (
    <div className="relative w-full h-full bg-gradient-to-b from-[#0c1220] to-[#162037] overflow-hidden">
      {isLoading || !mapInitialized ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader className="w-8 h-8 text-primary animate-spin" />
            <p className="text-primary/80 text-sm">Initializing secure map environment...</p>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0">
          {/* Mock map representation for prototype - would be replaced by actual map library */}
          <div className="w-full h-full relative p-4">
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/40">
              <div className="text-xs uppercase tracking-wider">DeepTrack Global Logistics Network</div>
            </div>
            
            {/* Render routes and markers here */}
            {routes.map((route, index) => (
              <div 
                key={index}
                className="absolute cursor-pointer"
                style={{ 
                  left: `${((route.destination_longitude + 180) / 360) * 100}%`, 
                  top: `${((90 - route.destination_latitude) / 180) * 100}%`
                }}
                onClick={() => onRouteClick && onRouteClick(index)}
              >
                <div className={`marker-inner destination ${route.delivery_status === 'Delivered' ? 'green' : route.delivery_status === 'In Transit' ? 'yellow' : 'red'}`}>
                  <div className={`marker-pulse ${route.delivery_status === 'Delivered' ? 'green' : route.delivery_status === 'In Transit' ? 'yellow' : 'red'}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

MapContainer.displayName = 'MapContainer';

export default MapContainer;
