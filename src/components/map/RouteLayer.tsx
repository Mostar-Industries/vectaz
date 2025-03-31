
import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Route } from '../MapVisualizer';

interface RouteLayerProps {
  map: mapboxgl.Map | null;
  routes: Route[];
  mapLoaded: boolean;
}

const RouteLayer: React.FC<RouteLayerProps> = ({ map, routes, mapLoaded }) => {
  const [routesAdded, setRoutesAdded] = useState(false);

  // Effect to add routes when the map style is loaded and routes change
  useEffect(() => {
    if (!mapLoaded || !map || routes.length === 0) return;
    
    console.log('Map loaded and routes available, adding routes to map');
    
    // To prevent multiple attempts to add the same routes
    if (routesAdded) {
      console.log('Routes already added, clearing existing markers and routes');
      // Clear existing markers
      const markers = document.getElementsByClassName('mapboxgl-marker');
      while (markers.length > 0) {
        markers[0].remove();
      }
      
      // Clear existing routes
      routes.forEach((_, index) => {
        if (map.getLayer(`route-${index}`)) {
          map.removeLayer(`route-${index}`);
        }
        if (map.getSource(`route-${index}`)) {
          map.removeSource(`route-${index}`);
        }
      });
    }
    
    // Wait a short time to ensure the style is fully loaded
    const timer = setTimeout(() => {
      if (!map.isStyleLoaded()) {
        console.log("Map style not fully loaded yet, waiting for style.load event");
        
        // Set up one-time event listener for style.load
        const styleLoadHandler = () => {
          addRoutesToMap();
          map.off('style.load', styleLoadHandler);
        };
        
        map.on('style.load', styleLoadHandler);
        return;
      }
      
      addRoutesToMap();
    }, 100);
    
    function addRoutesToMap() {
      try {
        // Add routes
        routes.forEach((route, index) => {
          // Add origin marker
          new mapboxgl.Marker({
            color: '#1A1F2C',
            scale: 0.7
          })
            .setLngLat([route.origin.lng, route.origin.lat])
            .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(route.origin.name))
            .addTo(map);
          
          // Add destination marker
          new mapboxgl.Marker({
            color: '#D946EF',
            scale: 0.7
          })
            .setLngLat([route.destination.lng, route.destination.lat])
            .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(route.destination.name))
            .addTo(map);
          
          // Add a line connecting origin and destination
          try {
            if (map.isStyleLoaded()) {
              map.addSource(`route-${index}`, {
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
              
              map.addLayer({
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
                  'line-opacity': 0.7
                }
              });
            } else {
              console.warn('Map style not fully loaded yet, skipping route line addition');
            }
          } catch (error) {
            console.error(`Error adding route ${index} to map:`, error);
          }
        });
        
        setRoutesAdded(true);
      } catch (error) {
        console.error('Error adding routes to map:', error);
      }
    }
    
    return () => clearTimeout(timer);
  }, [routes, mapLoaded, routesAdded, map]);

  return null; // This is a logic-only component
};

export default RouteLayer;
