
import { useState, useCallback, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useMapErrors } from './useMapErrors';

export const useEventHandlers = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeRoute, setActiveRoute] = useState<number | null>(null);
  const { toast } = useToast();
  const { handleMapError } = useMapErrors();

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
    }),
    mapLoadError: {
      title: "Map Load Error",
      description: "Unable to load the map. Please refresh the page or try again later.",
      duration: 8000,
      variant: 'destructive' as const,
    }
  }), []);

  const handleMapLoaded = useCallback(() => {
    try {
      setMapLoaded(true);
      toast(toastMessages.mapLoaded);
    } catch (error) {
      handleMapError(
        "EVENT_LOAD_FAIL", 
        "Failed to handle map loaded event", 
        error
      );
    }
  }, [toast, toastMessages, handleMapError]);

  const handleRouteClick = useCallback((routeIndex: number | null) => {
    try {
      setActiveRoute(routeIndex);
    } catch (error) {
      handleMapError(
        "EVENT_ROUTE_CLICK_FAIL", 
        "Failed to handle route click", 
        error
      );
    }
  }, [handleMapError]);
  
  const handleCountryClick = useCallback((countryName: string) => {
    try {
      toast(toastMessages.countrySelected(countryName));
    } catch (error) {
      handleMapError(
        "EVENT_COUNTRY_CLICK_FAIL", 
        "Failed to handle country click", 
        error
      );
    }
  }, [toast, toastMessages, handleMapError]);

  return {
    mapLoaded,
    activeRoute,
    handleMapLoaded,
    handleRouteClick,
    handleCountryClick
  };
};
