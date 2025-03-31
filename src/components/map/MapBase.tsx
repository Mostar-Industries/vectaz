
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapBaseProps {
  children?: React.ReactNode;
  isLoading?: boolean;
  onMapLoaded?: (map: mapboxgl.Map) => void;
  onMapLoadedState?: (loaded: boolean) => void;
}

const MapBase: React.FC<MapBaseProps> = ({ 
  children, 
  isLoading = false, 
  onMapLoaded, 
  onMapLoadedState 
}) => {
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
      if (onMapLoadedState) onMapLoadedState(true);
      if (onMapLoaded && map.current) onMapLoaded(map.current);
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
  }, [isLoading, onMapLoaded, onMapLoadedState]);

  return (
    <div className="relative h-full w-full bg-slate-900">
      <div ref={mapContainerRef} className="absolute inset-0" />
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            map: map.current,
            mapLoaded
          });
        }
        return child;
      })}
    </div>
  );
};

export default MapBase;
