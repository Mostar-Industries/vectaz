
import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { Route } from '@/types/deeptrack';
import { Loader } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  
  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    // Method to jump to a specific location on the map
    jumpToLocation: (lat: number, lng: number, name: string) => {
      console.log(`Jumping to location: ${name} at [${lat}, ${lng}]`);
      if (mapRef.current) {
        mapRef.current.flyTo({
          center: [lng, lat],
          zoom: 5,
          essential: true,
          duration: 2000
        });
        
        // Optional: show a popup at the location
        new mapboxgl.Popup({
          closeButton: false,
          className: 'destination-popup'
        })
          .setLngLat([lng, lat])
          .setHTML(`<div><strong>${name}</strong></div>`)
          .addTo(mapRef.current);
      }
    }
  }));

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || isLoading) return;

    // Set the access token for Mapbox
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWthbmltbzEiLCJhIjoiY2x4czNxbjU2MWM2eTJqc2gwNGIwaWhkMSJ9.jSwZdyaPa1dOHepNU5P71g';
    
    // Create a new map instance
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/akanimo1/cm8bw23rp00i501sbgbr258r0',
      center: [0, 20], // Center on Africa
      zoom: 2,
      pitch: 40,
      bearing: 0,
      projection: 'globe'
    });

    mapRef.current = map;

    // Add navigation controls
    map.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Setup event handlers
    map.on('load', () => {
      console.log('Mapbox map loaded');
      
      // Add atmosphere and fog for a more realistic globe view
      map.setFog({
        color: 'rgb(15, 20, 30)', // sky color
        'high-color': 'rgb(25, 35, 60)',
        'horizon-blend': 0.2,
        'space-color': 'rgb(5, 10, 20)',
        'star-intensity': 0.6
      });

      setMapInitialized(true);
      if (onMapLoaded) onMapLoaded();
      
      // Add markers for each route
      addRouteMarkers();
    });

    // Setup automatic rotation (optional)
    const secondsPerRevolution = 180;
    const maxSpinZoom = 5;
    let userInteracting = false;
    let spinEnabled = true;

    function spinGlobe() {
      if (!mapRef.current || !spinEnabled || userInteracting) return;
      
      const zoom = mapRef.current.getZoom();
      if (zoom > maxSpinZoom) return;
      
      const distancePerSecond = 360 / secondsPerRevolution;
      const center = mapRef.current.getCenter();
      center.lng -= distancePerSecond / 60;
      
      mapRef.current.easeTo({
        center,
        duration: 1000,
        easing: (n) => n
      });
    }

    const spinInterval = setInterval(spinGlobe, 1000);

    map.on('mousedown', () => {
      userInteracting = true;
    });
    
    map.on('mouseup', () => {
      userInteracting = false;
    });
    
    map.on('dragstart', () => {
      userInteracting = true;
    });
    
    map.on('dragend', () => {
      userInteracting = false;
    });
    
    map.on('touchstart', () => {
      userInteracting = true;
    });
    
    map.on('touchend', () => {
      userInteracting = false;
    });
    
    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      
      // Clear all markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      
      clearInterval(spinInterval);
    };
  }, [isLoading, onMapLoaded]);

  // Add markers when routes change
  useEffect(() => {
    if (mapInitialized && mapRef.current) {
      addRouteMarkers();
    }
  }, [routes, mapInitialized]);

  // Function to add markers for each route
  const addRouteMarkers = () => {
    if (!mapRef.current) return;
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    // Add new markers for each route
    routes.forEach((route, index) => {
      const { destination } = route;
      
      // Create marker element
      const markerEl = document.createElement('div');
      markerEl.className = 'marker-container';
      
      // Inner marker with status color
      const innerMarker = document.createElement('div');
      const statusClass = route.deliveryStatus === 'Delivered' ? 'green' : 
                          route.deliveryStatus === 'In Transit' ? 'yellow' : 'red';
      innerMarker.className = `marker-inner destination ${statusClass}`;
      
      // Pulse effect
      const pulseEffect = document.createElement('div');
      pulseEffect.className = `marker-pulse ${statusClass}`;
      innerMarker.appendChild(pulseEffect);
      
      markerEl.appendChild(innerMarker);
      
      // Create and add the marker to the map
      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat([destination.lng, destination.lat])
        .addTo(mapRef.current);
      
      // Click handler for the marker
      markerEl.addEventListener('click', () => {
        if (onRouteClick) onRouteClick(index);
      });
      
      // Store reference to the marker
      markersRef.current.push(marker);
    });
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#0c1220] to-[#162037]">
          <div className="flex flex-col items-center gap-3">
            <Loader className="w-8 h-8 text-primary animate-spin" />
            <p className="text-primary/80 text-sm">Initializing secure map environment...</p>
          </div>
        </div>
      ) : (
        <div ref={mapContainerRef} className="absolute inset-0" />
      )}
    </div>
  );
});

MapContainer.displayName = 'MapContainer';

export default MapContainer;
