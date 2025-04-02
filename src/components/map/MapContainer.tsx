
import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { Loader } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapContainerProps, MapContainerRef } from './types';
import { initializeMap, setupMapEnvironment, setupGlobeRotation } from './utils/MapInitializer';
import { useMapInteractions } from './hooks/useMapInteractions';
import { useMapRef } from './hooks/useMapRef';

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
  
  // Custom hook to manage map ref and exposed methods
  const { mapRef, jumpToLocation, toggleTerrain, showInfoAtLocation } = useMapRef();
  
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
    jumpToLocation,
    toggleTerrain,
    showInfoAtLocation
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
