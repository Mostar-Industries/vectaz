
import { useState, useMemo, useEffect, useCallback } from 'react';
import { getDestinationMarkers, getRandomStatus } from '@/utils/mapUtils';
import { Route } from '@/types/deeptrack';

export const useMapMarkers = (routes: Route[]) => {
  const [countryMarkers, setCountryMarkers] = useState<Array<{
    name: string;
    coordinates: [number, number];
    status: string;
  }>>([]);
  
  // Memoize marker initialization to avoid recalculation
  const markers = useMemo(() => 
    getDestinationMarkers().map(country => ({
      ...country,
      status: getRandomStatus()
    }))
  , []);
  
  // Set country markers using the memoized value - with useCallback
  useEffect(() => {
    setCountryMarkers(markers);
  }, [markers]);

  // Limit routes to 3 most recent for performance - memoized with deep dependency check
  const limitedRoutes = useMemo(() => 
    routes.slice(0, 3), 
    // Use a stringified version to ensure proper dependency tracking for complex objects
    [JSON.stringify(routes.map(route => route.origin.name + route.destination.name))]
  );

  return {
    countryMarkers,
    limitedRoutes
  };
};
