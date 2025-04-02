
import { useState, useMemo, useEffect } from 'react';
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
  
  // Set country markers using the memoized value
  useEffect(() => {
    setCountryMarkers(markers);
  }, [markers]);

  // Limit routes to 3 most recent for performance - memoized
  const limitedRoutes = useMemo(() => routes.slice(0, 3), [routes]);

  return {
    countryMarkers,
    limitedRoutes
  };
};
