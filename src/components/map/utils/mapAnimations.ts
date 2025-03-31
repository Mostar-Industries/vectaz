
import mapboxgl from 'mapbox-gl';

/**
 * Smoothly transitions the map view to the specified coordinates.
 *
 * @param map - The Mapbox map instance.
 * @param coordinates - The [lng, lat] to fly to.
 * @param zoom - Optional zoom level (default 12).
 * @param bearing - Optional bearing (default 0).
 * @param pitch - Optional pitch (default 0).
 */
export function jumpToLocation(
  map: mapboxgl.Map,
  coordinates: [number, number],
  zoom: number = 12,
  bearing: number = 0,
  pitch: number = 0
) {
  map.flyTo({
    center: coordinates,
    zoom: zoom,
    bearing: bearing,
    pitch: pitch,
    speed: 1.2, // animation speed; tweak as needed
    curve: 1.42, // smoothness factor
    easing: (t: number) => t
  });
}

/**
 * Animates a marker along the given route coordinates.
 *
 * @param map - The Mapbox map instance.
 * @param routeCoords - Array of [lng, lat] coordinates representing the route.
 * @param color - Optional marker color (default "red").
 * @param onComplete - Optional callback when animation completes.
 */
export function animateRouteLine(
  map: mapboxgl.Map,
  routeCoords: [number, number][],
  color: string = "red",
  onComplete?: () => void
) {
  // Create the traveling marker at the starting point.
  const marker = new mapboxgl.Marker({ color })
    .setLngLat(routeCoords[0])
    .addTo(map);

  let currentStep = 0;
  const totalSteps = routeCoords.length;

  function stepAnimation() {
    // Update marker position.
    marker.setLngLat(routeCoords[currentStep]);
    currentStep++;

    if (currentStep < totalSteps) {
      // For a smoother animation, using requestAnimationFrame
      requestAnimationFrame(stepAnimation);
    } else {
      console.log("Animation complete!");
      if (onComplete) onComplete();
    }
  }

  requestAnimationFrame(stepAnimation);
  
  // Return the marker instance to allow for later removal if needed
  return marker;
}
