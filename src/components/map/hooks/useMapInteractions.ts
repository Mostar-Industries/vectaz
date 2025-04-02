
import { useState, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { Route } from '@/types/deeptrack';
import { CountryMarker } from '../types';
import { 
  createRouteMarkers, 
  createCountryMarkers, 
  createCountryPopup, 
  clearMarkers 
} from '../utils/MapMarkers';
import { spinGlobe } from '../utils/MapInitializer';

export const useMapInteractions = (
  mapRef: React.MutableRefObject<mapboxgl.Map | null>,
  routes: Route[],
  countries: CountryMarker[],
  onRouteClick?: (routeIndex: number | null) => void,
  onCountryClick?: (country: string) => void
) => {
  const [userInteracting, setUserInteracting] = useState(false);
  const [spinEnabled] = useState(true);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const countryMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const spinIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Add markers when routes change
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Clear existing markers
    clearMarkers(markersRef.current);
    markersRef.current = [];
    
    // Add new markers
    markersRef.current = createRouteMarkers(
      mapRef.current,
      routes,
      onRouteClick
    );

    return () => {
      clearMarkers(markersRef.current);
      markersRef.current = [];
    };
  }, [routes, mapRef.current, onRouteClick]);

  // Add country markers when countries change
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Clear existing country markers
    clearMarkers(countryMarkersRef.current);
    countryMarkersRef.current = [];
    
    // Create a popup handler
    const handlePopup = (country: CountryMarker) => {
      // Close any existing popup
      if (popupRef.current) {
        popupRef.current.remove();
      }
      
      // Create a new popup
      popupRef.current = createCountryPopup(mapRef.current!, country);
      return popupRef.current;
    };
    
    // Add new markers
    countryMarkersRef.current = createCountryMarkers(
      mapRef.current,
      countries,
      onCountryClick,
      handlePopup
    );

    return () => {
      clearMarkers(countryMarkersRef.current);
      countryMarkersRef.current = [];
      
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }
    };
  }, [countries, mapRef.current, onCountryClick]);

  // Setup globe spinning interval
  useEffect(() => {
    const startGlobeSpin = () => {
      if (spinIntervalRef.current) {
        clearInterval(spinIntervalRef.current);
      }
      
      spinIntervalRef.current = setInterval(() => {
        if (mapRef.current) {
          spinGlobe(mapRef.current, userInteracting, spinEnabled);
        }
      }, 1000);
    };
    
    if (mapRef.current) {
      startGlobeSpin();
    }
    
    return () => {
      if (spinIntervalRef.current) {
        clearInterval(spinIntervalRef.current);
        spinIntervalRef.current = null;
      }
    };
  }, [mapRef.current, userInteracting, spinEnabled]);

  return {
    setUserInteracting,
    popupRef,
    clearAllMarkers: () => {
      clearMarkers(markersRef.current);
      clearMarkers(countryMarkersRef.current);
      markersRef.current = [];
      countryMarkersRef.current = [];
      
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }
    }
  };
};
