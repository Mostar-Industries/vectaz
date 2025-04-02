
import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { Loader } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapContainerProps, MapContainerRef } from './types';
import { initializeMap, setupMapEnvironment, setupGlobeRotation } from './utils/MapInitializer';
import { useMapInteractions } from './hooks/useMapInteractions';

// Using forwardRef to properly handle the ref
const MapContainer = forwardRef<MapContainerRef, MapContainerProps>(({ 
  routes, 
  countries = [],
  isLoading = false, 
  onMapLoaded, 
  onRouteClick,
  onCountryClick
}, ref) => {
  const [mapInitialized, setMapInitialized] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  
  // Use custom hook for map interactions
  const { setUserInteracting, clearAllMarkers } = useMapInteractions(
    mapRef,
    routes,
    countries,
    onRouteClick,
    onCountryClick
  );
  
  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    // Method to jump to a specific location on the map
    jumpToLocation: (lat: number, lng: number, name: string) => {
      console.log(`Jumping to location: ${name} at [${lat}, ${lng}]`);
      if (mapRef.current) {
        // Fly to the location with a smoother animation and closer zoom
        mapRef.current.flyTo({
          center: [lng, lat],
          zoom: 8,
          essential: true,
          duration: 2500,
          pitch: 60,
          bearing: Math.random() * 60 - 30 // Random bearing for visual interest
        });
      }
    },
    
    // Method to toggle terrain
    toggleTerrain: (show3D: boolean) => {
      if (mapRef.current) {
        if (show3D) {
          mapRef.current.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
        } else {
          mapRef.current.setTerrain(null);
        }
      }
    },
    
    // Method to show info at a location
    showInfoAtLocation: (lat: number, lng: number, content: string) => {
      if (mapRef.current) {
        const popup = new mapboxgl.Popup({
          closeButton: true,
          className: 'destination-popup',
          maxWidth: '300px'
        })
          .setLngLat([lng, lat])
          .setHTML(content)
          .addTo(mapRef.current);
      }
    }
  }));

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || isLoading || mapRef.current) return;
    
    // Create a new map instance
    const map = initializeMap(mapContainerRef.current);
    mapRef.current = map;

    // Setup event handlers
    map.on('load', () => {
      console.log('Mapbox map loaded');
      
      // Setup map environment (atmosphere, fog, terrain)
      setupMapEnvironment(map);

      // Setup globe rotation and user interaction
      setupGlobeRotation(map, setUserInteracting);

      setMapInitialized(true);
      if (onMapLoaded) onMapLoaded();
    });
    
    // Cleanup function
    return () => {
      clearAllMarkers();
      
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isLoading, onMapLoaded]);

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
