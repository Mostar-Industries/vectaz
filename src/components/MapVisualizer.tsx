
import React, { useEffect, useRef, useState } from 'react';
import { Loader, Map as MapIcon } from 'lucide-react';

interface MapPoint {
  lat: number;
  lng: number;
  name: string;
  isOrigin: boolean;
}

interface Route {
  origin: MapPoint;
  destination: MapPoint;
  weight: number;
  shipmentCount: number;
}

interface MapVisualizerProps {
  routes: Route[];
  isLoading?: boolean;
}

const MapVisualizer: React.FC<MapVisualizerProps> = ({ routes, isLoading = false }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current || isLoading) return;

    // This is a placeholder for the actual map implementation
    // In a real application, this would integrate with a mapping library like Mapbox
    const loadMap = () => {
      // Simulate map loading
      setTimeout(() => {
        setMapLoaded(true);
      }, 800);
    };

    loadMap();
  }, [routes, isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center bg-slate-100 h-full w-full">
        <div className="flex flex-col items-center gap-2">
          <Loader className="h-8 w-8 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading map data...</p>
        </div>
      </div>
    );
  }

  if (!routes.length) {
    return (
      <div className="flex items-center justify-center bg-slate-100 h-full w-full">
        <div className="flex flex-col items-center gap-4">
          <MapIcon className="h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">No route data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-slate-100">
      <div ref={mapContainerRef} className="absolute inset-0">
        {!mapLoaded ? (
          <div className="flex items-center justify-center h-full">
            <Loader className="h-6 w-6 text-primary animate-spin" />
          </div>
        ) : (
          <div className="h-full w-full relative">
            {/* This would be replaced with actual map rendering */}
            <svg className="h-full w-full absolute inset-0">
              {routes.map((route, index) => (
                <g key={index}>
                  {/* Simplified route line visualization */}
                  <line
                    x1={`${(route.origin.lng + 180) / 360 * 100}%`}
                    y1={`${(90 - route.origin.lat) / 180 * 100}%`}
                    x2={`${(route.destination.lng + 180) / 360 * 100}%`}
                    y2={`${(90 - route.destination.lat) / 180 * 100}%`}
                    stroke="#9b87f5"
                    strokeWidth={Math.max(1, route.shipmentCount / 2)}
                    strokeOpacity="0.7"
                  />
                  
                  {/* Origin point */}
                  <circle
                    cx={`${(route.origin.lng + 180) / 360 * 100}%`}
                    cy={`${(90 - route.origin.lat) / 180 * 100}%`}
                    r={5}
                    fill="#1A1F2C"
                    stroke="#fff"
                    strokeWidth="1"
                  />
                  
                  {/* Destination point */}
                  <circle
                    cx={`${(route.destination.lng + 180) / 360 * 100}%`}
                    cy={`${(90 - route.destination.lat) / 180 * 100}%`}
                    r={4}
                    fill="#D946EF"
                    stroke="#fff"
                    strokeWidth="1"
                  />
                </g>
              ))}
            </svg>
            
            {/* Map overlay with route count */}
            <div className="absolute bottom-4 right-4 pointer-events-none">
              <div className="text-xs bg-background/80 backdrop-blur-sm px-3 py-2 rounded-md shadow-sm border border-border">
                <div className="font-semibold">Routes: {routes.length}</div>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default MapVisualizer;
