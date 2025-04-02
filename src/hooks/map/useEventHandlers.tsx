
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useEventHandlers = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeRoute, setActiveRoute] = useState<number | null>(null);
  const { toast } = useToast();

  const handleMapLoaded = useCallback(() => {
    setMapLoaded(true);
    
    toast({
      title: "Map Loaded",
      description: "Tap to rotate the globe and explore destination countries.",
      duration: 5000,
    });
  }, [toast]);

  const handleRouteClick = useCallback((routeIndex: number | null) => {
    setActiveRoute(routeIndex);
  }, []);
  
  const handleCountryClick = useCallback((countryName: string) => {
    toast({
      title: `${countryName} Selected`,
      description: `Viewing destination country: ${countryName}`,
      duration: 3000,
    });
  }, [toast]);

  return {
    mapLoaded,
    activeRoute,
    handleMapLoaded,
    handleRouteClick,
    handleCountryClick
  };
};
