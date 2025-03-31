
import React, { useEffect, useRef, useState } from 'react';
import { Loader, MapIcon } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { cn } from '@/lib/utils';
import { Route, MapPoint } from '@/types/deeptrack';

interface MapContainerProps {
  routes: Route[];
  isLoading?: boolean;
  className?: string;
  onMapLoaded: () => void;
  onRouteClick: (routeIndex: number | null) => void;
}

const MapContainer: React.FC<MapContainerProps> = ({ 
  routes, 
  isLoading = false, 
  className, 
  onMapLoaded,
  onRouteClick
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

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
      
      onMapLoaded();
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
  }, [routes, isLoading, onMapLoaded]);

  // Effect to add routes when the map style is loaded and routes change
  useEffect(() => {
    if (!map.current || routes.length === 0) return;
    
    // Add routes to map and set up click handlers
    renderRoutes();
    
    // Click on background resets active route
    map.current?.on('click', (e) => {
      const features = map.current?.queryRenderedFeatures(e.point, {
        layers: routes.map((_, i) => `route-${i}`)
      });
      
      if (!features?.length) {
        onRouteClick(null);
      }
    });
    
  }, [routes, onRouteClick]);

  const renderRoutes = () => {
    if (!map.current) return;
    
    // Clear existing markers and routes if any
    const markers = document.getElementsByClassName('mapboxgl-marker');
    while (markers.length > 0) {
      markers[0].remove();
    }

    // Add each route
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
            'line-color': '#9b87f5',
            'line-width': Math.max(1, route.shipmentCount / 3),
            'line-opacity': 0.7,
            'line-dasharray': [2, 1]
          }
        });
        
        // Add click handler for route
        map.current?.on('click', `route-${index}`, () => {
          onRouteClick(index);
        });
        
      } catch (error) {
        console.error(`Error adding route ${index} to map:`, error);
      }
    });
  };

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
    </div>
  );
};

export default MapContainer;
