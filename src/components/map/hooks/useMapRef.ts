
import { useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';

export const useMapRef = () => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  
  // Method to jump to a specific location on the map with useCallback
  const jumpToLocation = useCallback((lat: number, lng: number, name: string) => {
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
  }, []);
  
  // Method to toggle terrain with useCallback
  const toggleTerrain = useCallback((show3D: boolean) => {
    if (mapRef.current) {
      if (show3D) {
        mapRef.current.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
      } else {
        mapRef.current.setTerrain(null);
      }
    }
  }, []);
  
  // Method to show info at a location with useCallback
  const showInfoAtLocation = useCallback((lat: number, lng: number, content: string) => {
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
  }, []);

  return {
    mapRef,
    jumpToLocation,
    toggleTerrain,
    showInfoAtLocation
  };
};
