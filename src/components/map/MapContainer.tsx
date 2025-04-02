
import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef, useMemo } from 'react';
import { Route } from '@/types/deeptrack';
import { Loader } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface CountryMarker {
  name: string;
  coordinates: [number, number];
  status?: string;
}

interface MapContainerProps {
  routes: Route[];
  countries?: CountryMarker[];
  isLoading?: boolean;
  onMapLoaded?: () => void;
  onRouteClick?: (routeIndex: number | null) => void;
  onCountryClick?: (country: string) => void;
}

// Set the Mapbox access token directly (best for development)
// In production, this should come from environment variables
mapboxgl.accessToken = 'pk.eyJ1IjoiYWthbmltbzEiLCJhIjoiY2x4czNxbjU2MWM2eTJqc2gwNGIwaWhkMSJ9.jSwZdyaPa1dOHepNU5P71g';

// Using forwardRef to properly handle the ref
const MapContainer = forwardRef<any, MapContainerProps>(({ 
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
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const countryMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const spinIntervalRef = useRef<number | null>(null);
  
  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    // Method to jump to a specific location on the map
    jumpToLocation: (lat: number, lng: number, name: string) => {
      console.log(`Jumping to location: ${name} at [${lat}, ${lng}]`);
      if (mapRef.current) {
        // Close any existing popup
        if (popupRef.current) {
          popupRef.current.remove();
        }
        
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
        // Close any existing popup
        if (popupRef.current) {
          popupRef.current.remove();
        }
        
        // Create a new popup
        popupRef.current = new mapboxgl.Popup({
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
    
    // Create a new map instance - directly using the token set above
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

      // Add terrain source only if it doesn't already exist
      if (!map.getSource('mapbox-dem')) {
        map.addSource('mapbox-dem', {
          'type': 'raster-dem',
          'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
          'tileSize': 512,
          'maxzoom': 14
        });
      }

      setMapInitialized(true);
      if (onMapLoaded) onMapLoaded();
      
      // Add markers for each route and country
      addRouteMarkers();
      addCountryMarkers();
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
    spinIntervalRef.current = spinInterval;

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
      if (spinIntervalRef.current) {
        clearInterval(spinIntervalRef.current);
        spinIntervalRef.current = null;
      }
      
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      
      // Clear all markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      
      countryMarkersRef.current.forEach(marker => marker.remove());
      countryMarkersRef.current = [];
      
      // Remove any popups
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }
    };
  }, [isLoading, onMapLoaded]);

  // Add markers when routes change
  useEffect(() => {
    if (mapInitialized && mapRef.current) {
      addRouteMarkers();
    }
  }, [routes, mapInitialized]);

  // Add country markers when countries change
  useEffect(() => {
    if (mapInitialized && mapRef.current) {
      addCountryMarkers();
    }
  }, [countries, mapInitialized]);

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

  // Function to add markers for each country - memoized to improve performance
  const addCountryMarkers = () => {
    if (!mapRef.current) return;
    
    // Clear existing country markers
    countryMarkersRef.current.forEach(marker => marker.remove());
    countryMarkersRef.current = [];
    
    // Add new markers for each country
    countries.forEach((country) => {
      const { name, coordinates, status } = country;
      
      // Create marker element
      const markerEl = document.createElement('div');
      markerEl.className = 'marker-container country-marker';
      
      // Inner marker with status color if available
      const innerMarker = document.createElement('div');
      const statusClass = status === 'Delivered' ? 'green' : 
                          status === 'In Transit' ? 'yellow' : 
                          status === 'Delayed' ? 'red' : 'blue';
      
      innerMarker.className = `marker-inner country ${statusClass}`;
      
      // Pulse effect for countries
      const pulseEffect = document.createElement('div');
      pulseEffect.className = `marker-pulse ${statusClass}`;
      innerMarker.appendChild(pulseEffect);
      
      markerEl.appendChild(innerMarker);
      
      // Create and add the marker to the map
      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat([coordinates[1], coordinates[0]])
        .addTo(mapRef.current);
      
      // Click handler for the marker
      markerEl.addEventListener('click', () => {
        if (onCountryClick) onCountryClick(name);
        
        // Show a simple popup for the country
        if (mapRef.current) {
          // Close any existing popup
          if (popupRef.current) {
            popupRef.current.remove();
          }
          
          // Create a new popup
          popupRef.current = new mapboxgl.Popup({
            closeButton: true,
            className: 'country-popup',
            maxWidth: '250px'
          })
            .setLngLat([coordinates[1], coordinates[0]])
            .setHTML(`
              <div class="country-info p-2">
                <h3 class="font-bold text-primary">${name}</h3>
                <p class="text-sm mt-1">Destination country</p>
              </div>
            `)
            .addTo(mapRef.current);
        }
      });
      
      // Store reference to the marker
      countryMarkersRef.current.push(marker);
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
