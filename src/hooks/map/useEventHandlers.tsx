
import { useState, useCallback, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useEventHandlers = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeRoute, setActiveRoute] = useState<number | null>(null);
  const { toast } = useToast();

  // Memoize toast messages to avoid recreating objects on each render
  const toastMessages = useMemo(() => ({
    mapLoaded: {
      title: "Map Loaded",
      description: "Tap to rotate the globe and explore destination countries.",
      duration: 5000,
    },
    countrySelected: (countryName: string) => ({
      title: `${countryName} Selected`,
      description: `Viewing destination country: ${countryName}`,
      duration: 3000,
    })
  }), []);

  const handleMapLoaded = useCallback(() => {
    setMapLoaded(true);
    toast(toastMessages.mapLoaded);
  }, [toast, toastMessages]);

  const handleRouteClick = useCallback((routeIndex: number | null) => {
    setActiveRoute(routeIndex);
  }, []);
  
  const handleCountryClick = useCallback((countryName: string) => {
    toast(toastMessages.countrySelected(countryName));
  }, [toast, toastMessages]);

  return {
    mapLoaded,
    activeRoute,
    handleMapLoaded,
    handleRouteClick,
    handleCountryClick
  };
};
