
import React, { useEffect, useRef, useState } from 'react';
import { Loader, Map as MapIcon } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current || isLoading) return;

    // Initialize Mapbox with the provided API key
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWthbmltbzEiLCJhIjoiY2x4czNxbjU2MWM2eTJqc2gwNGIwaWhkMSJ9.jSwZdyaPa1dOHepNU5P71g';
    
    map.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      projection: 'globe',
      zoom: 1.5,
      center: [20, 10],
      pitch: 40,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'bottom-right'
    );

    // Add atmosphere and fog effects
    map.current.on('style.load', () => {
      setMapLoaded(true);
      
      // Add fog effect
      map.current?.setFog({
        color: 'rgb(20, 20, 30)',
        'high-color': 'rgb(40, 40, 70)',
        'horizon-blend': 0.2,
      });
      
      // Add routes to map when map style is loaded
      if (routes.length > 0) {
        addRoutesToMap();
      }
    });

    // Rotation animation
    const secondsPerRevolution = 240;
    const maxSpinZoom = 5;
    const slowSpinZoom = 3;
    let userInteracting = false;
    let spinEnabled = true;

    // Auto-rotate globe function
    function spinGlobe() {
      if (!map.current) return;
      
      const zoom = map.current.getZoom();
      if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
        let distancePerSecond = 360 / secondsPerRevolution;
        if (zoom > slowSpinZoom) {
          const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
          distancePerSecond *= zoomDif;
        }
        const center = map.current.getCenter();
        center.lng -= distancePerSecond;
        map.current.easeTo({ center, duration: 1000, easing: (n) => n });
      }
    }

    // User interaction handlers
    map.current.on('mousedown', () => {
      userInteracting = true;
    });
    
    map.current.on('dragstart', () => {
      userInteracting = true;
    });
    
    map.current.on('mouseup', () => {
      userInteracting = false;
      spinGlobe();
    });
    
    map.current.on('touchend', () => {
      userInteracting = false;
      spinGlobe();
    });

    map.current.on('moveend', () => {
      spinGlobe();
    });

    // Start the globe spinning
    spinGlobe();

    // Function to add routes to the map
    const addRoutesToMap = () => {
      if (!map.current || !mapLoaded) return;
      
      routes.forEach((route, index) => {
        // Add origin marker
        new mapboxgl.Marker({
          color: '#1A1F2C',
          scale: 0.7
        })
          .setLngLat([route.origin.lng, route.origin.lat])
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(route.origin.name))
          .addTo(map.current!);
        
        // Add destination marker
        new mapboxgl.Marker({
          color: '#D946EF',
          scale: 0.7
        })
          .setLngLat([route.destination.lng, route.destination.lat])
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(route.destination.name))
          .addTo(map.current!);
        
        // Add a line connecting origin and destination
        if (!map.current.getSource(`route-${index}`)) {
          map.current.addSource(`route-${index}`, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: [
                  [route.origin.lng, route.origin.lat],
                  [route.destination.lng, route.destination.lat]
                ]
              }
            }
          });
          
          map.current.addLayer({
            id: `route-${index}`,
            type: 'line',
            source: `route-${index}`,
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#9b87f5',
              'line-width': Math.max(1, route.shipmentCount / 3),
              'line-opacity': 0.7
            }
          });
        }
      });
    };

    // Add routes when they change
    if (routes.length > 0 && mapLoaded) {
      addRoutesToMap();
    }

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [routes, isLoading, mapLoaded]);

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
    <div className="relative h-full w-full bg-slate-900">
      <div ref={mapContainerRef} className="absolute inset-0" />
      
      {/* Map overlay with route count */}
      <div className="absolute bottom-4 left-4 pointer-events-none">
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
  );
};

export default MapVisualizer;
