
import React, { useEffect, useRef, useState } from 'react';
import { Loader, Map as MapIcon, Info, AlertTriangle } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { cn } from '@/lib/utils';

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
  className?: string;
}

const MapVisualizer: React.FC<MapVisualizerProps> = ({ routes, isLoading = false, className }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeRoute, setActiveRoute] = useState<number | null>(null);

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

    // Add atmosphere and fog effects when the style is fully loaded
    map.current.on('style.load', () => {
      console.log('Map style loaded');
      
      // Add fog effect
      map.current?.setFog({
        color: 'rgb(20, 20, 30)',
        'high-color': 'rgb(40, 40, 70)',
        'horizon-blend': 0.2,
      });
      
      setMapLoaded(true);
    });

    // Rotation animation settings
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

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [routes, isLoading]);

  // Effect to add routes when the map style is loaded and routes change
  useEffect(() => {
    if (!mapLoaded || !map.current || routes.length === 0) return;
    
    console.log('Map loaded and routes available, adding routes to map');
    
    // Clear existing markers and routes if any
    const markers = document.getElementsByClassName('mapboxgl-marker');
    while (markers.length > 0) {
      markers[0].remove();
    }
    
    // Add routes
    routes.forEach((route, index) => {
      // Remove existing source and layer if they exist
      if (map.current?.getSource(`route-${index}`)) {
        if (map.current?.getLayer(`route-${index}`)) {
          map.current.removeLayer(`route-${index}`);
        }
        map.current.removeSource(`route-${index}`);
      }
      
      // Add origin marker
      new mapboxgl.Marker({
        color: '#1A1F2C',
        scale: 0.7
      })
        .setLngLat([route.origin.lng, route.origin.lat])
        .setPopup(new mapboxgl.Popup({ 
          offset: 25,
          className: 'bg-background/90 backdrop-blur-sm p-2 border border-border/50 rounded-md shadow-lg'
        }).setHTML(`
          <div>
            <h3 class="font-bold">${route.origin.name}</h3>
            <p class="text-xs">Origin</p>
            <p class="text-xs mt-1">Weight: ${route.weight} kg</p>
          </div>
        `))
        .addTo(map.current!);
      
      // Add destination marker
      new mapboxgl.Marker({
        color: '#D946EF',
        scale: 0.7
      })
        .setLngLat([route.destination.lng, route.destination.lat])
        .setPopup(new mapboxgl.Popup({ 
          offset: 25,
          className: 'bg-background/90 backdrop-blur-sm p-2 border border-border/50 rounded-md shadow-lg'
        }).setHTML(`
          <div>
            <h3 class="font-bold">${route.destination.name}</h3>
            <p class="text-xs">Destination</p>
            <p class="text-xs mt-1">Shipments: ${route.shipmentCount}</p>
          </div>
        `))
        .addTo(map.current!);
      
      // Add a line connecting origin and destination
      try {
        map.current?.addSource(`route-${index}`, {
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
        
        map.current?.addLayer({
          id: `route-${index}`,
          type: 'line',
          source: `route-${index}`,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': activeRoute === index ? '#D946EF' : '#9b87f5',
            'line-width': Math.max(1, route.shipmentCount / 3),
            'line-opacity': activeRoute === null || activeRoute === index ? 0.7 : 0.2,
            'line-dasharray': [2, 1]
          }
        });
        
        // Add click handler for route
        map.current?.on('click', `route-${index}`, () => {
          setActiveRoute(index);
        });
        
      } catch (error) {
        console.error(`Error adding route ${index} to map:`, error);
      }
    });
    
    // Click on background resets active route
    map.current?.on('click', (e) => {
      const features = map.current?.queryRenderedFeatures(e.point, {
        layers: routes.map((_, i) => `route-${i}`)
      });
      
      if (!features?.length) {
        setActiveRoute(null);
      }
    });
    
  }, [routes, mapLoaded, activeRoute]);

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center bg-slate-900 h-full w-full", className)}>
        <div className="flex flex-col items-center gap-2">
          <Loader className="h-8 w-8 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading map data...</p>
        </div>
      </div>
    );
  }

  if (!routes.length) {
    return (
      <div className={cn("flex items-center justify-center bg-slate-900 h-full w-full", className)}>
        <div className="flex flex-col items-center gap-4">
          <MapIcon className="h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">No route data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative h-full w-full bg-slate-900", className)}>
      <div ref={mapContainerRef} className="absolute inset-0" />
      
      {/* Map overlay with route count */}
      <div className="absolute bottom-4 left-4 pointer-events-none z-10">
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
      
      {/* Info panel for active route */}
      {activeRoute !== null && (
        <div className="absolute top-4 right-4 pointer-events-none z-10">
          <div className="bg-background/80 backdrop-blur-sm p-3 rounded-md shadow-lg border border-border max-w-xs">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold flex items-center">
                <Info className="h-4 w-4 mr-1" />
                Route Details
              </h3>
              <button 
                className="pointer-events-auto h-5 w-5 rounded-full bg-background/50 flex items-center justify-center"
                onClick={() => setActiveRoute(null)}
              >
                ×
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Origin:</span> {routes[activeRoute].origin.name}
              </div>
              <div>
                <span className="text-muted-foreground">Destination:</span> {routes[activeRoute].destination.name}
              </div>
              <div>
                <span className="text-muted-foreground">Shipments:</span> {routes[activeRoute].shipmentCount}
              </div>
              <div>
                <span className="text-muted-foreground">Total Weight:</span> {routes[activeRoute].weight} kg
              </div>
              <div className="pt-2 flex items-center">
                <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
                <span className="text-xs">Medium risk level on this route</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
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
    </div>
  );
};

export default MapVisualizer;
