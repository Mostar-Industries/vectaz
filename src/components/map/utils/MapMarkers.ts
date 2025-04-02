
import mapboxgl from 'mapbox-gl';
import { Route } from '@/types/deeptrack';
import { CountryMarker } from '../types';

/**
 * Creates markers for routes on the map
 */
export const createRouteMarkers = (
  map: mapboxgl.Map,
  routes: Route[],
  onRouteClick?: (routeIndex: number | null) => void
): mapboxgl.Marker[] => {
  const markers: mapboxgl.Marker[] = [];
  
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
      .addTo(map);
    
    // Click handler for the marker
    if (onRouteClick) {
      markerEl.addEventListener('click', () => {
        onRouteClick(index);
      });
    }
    
    // Store reference to the marker
    markers.push(marker);
  });

  return markers;
};

/**
 * Creates markers for countries on the map
 */
export const createCountryMarkers = (
  map: mapboxgl.Map,
  countries: CountryMarker[],
  onCountryClick?: (country: string) => void,
  createPopup?: (country: CountryMarker) => mapboxgl.Popup
): mapboxgl.Marker[] => {
  const markers: mapboxgl.Marker[] = [];
  
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
      .addTo(map);
    
    // Click handler for the marker
    if (onCountryClick) {
      markerEl.addEventListener('click', () => {
        onCountryClick(name);
        
        if (createPopup) {
          const popup = createPopup(country);
          // Popup will automatically add itself to the map
        }
      });
    }
    
    // Store reference to the marker
    markers.push(marker);
  });

  return markers;
};

/**
 * Creates a default country popup
 */
export const createCountryPopup = (
  map: mapboxgl.Map,
  country: CountryMarker
): mapboxgl.Popup => {
  return new mapboxgl.Popup({
    closeButton: true,
    className: 'country-popup',
    maxWidth: '250px'
  })
    .setLngLat([country.coordinates[1], country.coordinates[0]])
    .setHTML(`
      <div class="country-info p-2">
        <h3 class="font-bold text-primary">${country.name}</h3>
        <p class="text-sm mt-1">Destination country</p>
      </div>
    `)
    .addTo(map);
};

/**
 * Removes all markers from the map
 */
export const clearMarkers = (markers: mapboxgl.Marker[]): void => {
  markers.forEach(marker => marker.remove());
};
