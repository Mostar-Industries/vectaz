
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
  const [activeMarkers, setActiveMarkers] = useState<mapboxgl.Marker[]>([]);

  // Jump to location function that can be called externally
  const jumpToLocation = (lat: number, lng: number, name: string) => {
    if (!map.current) return;
    
    // Fly to the location with animation
    map.current.flyTo({
      center: [lng, lat],
      zoom: 6,
      pitch: 60,
      bearing: Math.random() * 60 - 30, // Random bearing for dynamic feel
      duration: 2000,
      essential: true
    });
    
    // Highlight the marker by finding it and creating a pulse effect
    const markers = document.getElementsByClassName('mapboxgl-marker');
    for (let i = 0; i < markers.length; i++) {
      const marker = markers[i] as HTMLElement;
      // Remove any existing highlight classes
      marker.classList.remove('marker-highlight');
      
      // Check if this marker corresponds to the location we jumped to
      const markerInstance = activeMarkers[i];
      if (markerInstance && Math.abs(markerInstance.getLngLat().lat - lat) < 0.01 && 
          Math.abs(markerInstance.getLngLat().lng - lng) < 0.01) {
        // Add highlight class
        marker.classList.add('marker-highlight');
        
        // Create a temporary popup
        new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          className: 'destination-popup'
        })
          .setLngLat([lng, lat])
          .setHTML(`
            <div class="flex flex-col items-center">
              <span class="text-sm font-bold">${name}</span>
              <span class="text-xs">Destination Point</span>
            </div>
          `)
          .addTo(map.current!)
          .addClassName('animate-fade-in');
          
        // Remove popup after 4 seconds
        setTimeout(() => {
          const popups = document.getElementsByClassName('destination-popup');
          if (popups.length > 0) {
            popups[0].remove();
          }
        }, 4000);
      }
    }
  };

  // Expose jumpToLocation method to parent components
  useEffect(() => {
    if (!map.current) return;
    
    // Add jumpToLocation to the map object so it can be accessed by parent components
    (map.current as any).jumpToLocation = jumpToLocation;
  }, [routes]);

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

    // Clear active markers array
    setActiveMarkers([]);
    const newMarkers: mapboxgl.Marker[] = [];

    // Add each route
    routes.forEach((route, index) => {
      // Remove existing source and layer if they exist
      if (map.current?.getSource(`route-${index}`)) {
        if (map.current?.getLayer(`route-${index}`)) {
          map.current.removeLayer(`route-${index}`);
        }
        map.current.removeSource(`route-${index}`);
      }
      
      // Create custom origin marker element
      const originEl = document.createElement('div');
      originEl.className = 'origin-marker';
      originEl.innerHTML = `
        <div class="marker-inner origin">
          <div class="marker-pulse"></div>
        </div>
      `;
      
      // Add origin marker
      const originMarker = new mapboxgl.Marker({
        element: originEl
      })
        .setLngLat([route.origin.lng, route.origin.lat])
        .setPopup(new mapboxgl.Popup({ 
          offset: 25,
          className: 'bg-background/90 backdrop-blur-sm p-2 border border-border/50 rounded-md shadow-lg custom-popup'
        }).setHTML(`
          <div>
            <h3 class="font-bold">${route.origin.name}</h3>
            <p class="text-xs">Origin</p>
            <p class="text-xs mt-1">Weight: ${route.weight} kg</p>
          </div>
        `))
        .addTo(map.current!);
      
      newMarkers.push(originMarker);
      
      // Get marker color based on delivery status
      const getMarkerColor = () => {
        const status = route.deliveryStatus?.toLowerCase() || '';
        if (status === 'delivered') return 'green'; // Green for delivered
        if (status === 'in transit' || status === 'pending') return 'yellow'; // Yellow for en route/pending
        return 'red'; // Red for not delivered/failed/other statuses
      };
      
      // Create custom destination marker element
      const destEl = document.createElement('div');
      destEl.className = 'destination-marker';
      destEl.innerHTML = `
        <div class="marker-inner destination ${getMarkerColor()}">
          <div class="marker-pulse ${getMarkerColor()}"></div>
        </div>
      `;
      
      // Add destination marker with color based on delivery status
      const destMarker = new mapboxgl.Marker({
        element: destEl
      })
        .setLngLat([route.destination.lng, route.destination.lat])
        .setPopup(new mapboxgl.Popup({ 
          offset: 25,
          className: 'bg-background/90 backdrop-blur-sm p-2 border border-border/50 rounded-md shadow-lg custom-popup'
        }).setHTML(`
          <div>
            <h3 class="font-bold">${route.destination.name}</h3>
            <p class="text-xs">Destination</p>
            <p class="text-xs mt-1">Status: ${route.deliveryStatus || 'Unknown'}</p>
            <p class="text-xs mt-1">Shipments: ${route.shipmentCount}</p>
          </div>
        `))
        .addTo(map.current!);
      
      newMarkers.push(destMarker);

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
    
    // Update active markers
    setActiveMarkers(newMarkers);
  };
  
  // Method to expose jumpToLocation to parent component
  React.useImperativeHandle(
    React.createRef(),
    () => ({
      jumpToLocation
    }),
    []
  );

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
