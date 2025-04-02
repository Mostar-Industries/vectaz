
import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Route } from '@/types/deeptrack';
import { getDestinationMarkers, getRandomStatus } from '@/utils/mapUtils';

export const useMapVisualization = (routes: Route[]) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeRoute, setActiveRoute] = useState<number | null>(null);
  const [is3DMode, setIs3DMode] = useState(false);
  const [countryMarkers, setCountryMarkers] = useState<Array<{
    name: string;
    coordinates: [number, number];
    status: string;
  }>>([]);
  const mapContainerRef = useRef<any>(null);
  const { toast } = useToast();
  
  // Memoize country markers initialization to avoid recalculation
  useEffect(() => {
    const markers = useMemo(() => 
      getDestinationMarkers().map(country => ({
        ...country,
        status: getRandomStatus()
      }))
    , []);
    
    setCountryMarkers(markers);
  }, []);

  // Limit routes to 3 most recent for performance - memoized
  const limitedRoutes = useMemo(() => routes.slice(0, 3), [routes]);

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
    
    if (routeIndex !== null && limitedRoutes[routeIndex]) {
      showRouteInfoOnMap(limitedRoutes[routeIndex], routeIndex);
    }
  }, [limitedRoutes]);
  
  const handleCountryClick = useCallback((countryName: string) => {
    toast({
      title: `${countryName} Selected`,
      description: `Viewing destination country: ${countryName}`,
      duration: 3000,
    });
  }, [toast]);
  
  // Zoom control handlers with useCallback
  const handleZoomIn = useCallback(() => {
    if (mapContainerRef.current?.mapRef?.current) {
      const map = mapContainerRef.current.mapRef.current;
      map.zoomIn({ duration: 500 });
    }
  }, []);
  
  const handleZoomOut = useCallback(() => {
    if (mapContainerRef.current?.mapRef?.current) {
      const map = mapContainerRef.current.mapRef.current;
      map.zoomOut({ duration: 500 });
    }
  }, []);
  
  const handleResetView = useCallback(() => {
    if (mapContainerRef.current?.mapRef?.current) {
      const map = mapContainerRef.current.mapRef.current;
      map.flyTo({
        center: [0, 20],
        zoom: 2,
        pitch: 40,
        bearing: 0,
        duration: 1500
      });
      
      toast({
        title: "View Reset",
        description: "Map view has been reset to the initial position.",
        duration: 2000,
      });
    }
  }, [toast]);
  
  // Memoize the showRouteInfoOnMap function to prevent recreation on each render
  const showRouteInfoOnMap = useCallback((route: Route, index: number) => {
    const { origin, destination, weight, deliveryStatus } = route;
    
    const riskScore = Math.floor(Math.random() * 10) + 1;
    const resilienceScore = Math.floor(Math.random() * 30) + 70;
    
    let statusComment = '';
    if (deliveryStatus === 'Delivered') {
      statusComment = 'Right on schedule. Someone deserves a raise.';
    } else if (deliveryStatus === 'In Transit') {
      statusComment = 'Somewhere between here and there. Probably.';
    } else {
      statusComment = 'This package has seen more countries than Anthony Bourdain. Status: Lost in transit.';
    }
    
    const popupContent = `
      <div class="route-info p-3">
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-bold text-[#00FFD1] flex items-center">
            <span>Route Details</span>
          </h3>
          <span class="${
            deliveryStatus === 'Delivered' ? 'text-green-400' : 
            deliveryStatus === 'In Transit' ? 'text-amber-400' : 'text-red-400'
          } text-xs font-medium flex items-center">
            <span class="mr-1">${deliveryStatus}</span>
            ${deliveryStatus !== 'Delivered' ? '<span class="error-flicker">●</span>' : ''}
          </span>
        </div>
        
        <div class="space-y-2 text-sm">
          <div>
            <span class="text-gray-400">Origin:</span> ${origin.name}
          </div>
          <div>
            <span class="text-gray-400">Destination:</span> ${destination.name}
          </div>
          <div>
            <span class="text-gray-400">Shipment:</span> #${1000 + index}
          </div>
          <div>
            <span class="text-gray-400">Total Weight:</span> ${weight} kg
          </div>
          
          <div class="grid grid-cols-2 gap-x-2 gap-y-1 text-xs pt-2 border-t border-[#00FFD1]/10">
            <div class="flex items-center">
              <span class="text-green-400 mr-1">⦿</span>
              <span class="text-gray-400">Resilience:</span>
              <span class="ml-1 text-green-400">${resilienceScore}%</span>
            </div>
            <div class="flex items-center">
              <span class="text-yellow-400 mr-1">⚡</span>
              <span class="text-gray-400">Risk:</span>
              <span class="ml-1 ${riskScore > 7 ? 'text-red-400' : riskScore > 4 ? 'text-amber-400' : 'text-green-400'}">
                ${riskScore}/10
              </span>
            </div>
          </div>
          
          <div class="pt-2 text-xs italic text-gray-300">
            "${statusComment}"
          </div>
        </div>
      </div>
    `;
    
    if (mapContainerRef.current?.jumpToLocation) {
      mapContainerRef.current.jumpToLocation(destination.lat, destination.lng, destination.name);
      mapContainerRef.current.showInfoAtLocation(destination.lat, destination.lng, popupContent);
    }
  }, []);

  const handleJumpToLocation = useCallback((lat: number, lng: number, name: string) => {
    if (mapContainerRef.current?.jumpToLocation) {
      mapContainerRef.current.jumpToLocation(lat, lng, name);
    }
  }, []);

  const handleShipmentSelect = useCallback((shipment: Route, index: number) => {
    showRouteInfoOnMap(shipment, index);
    setActiveRoute(index);
  }, [showRouteInfoOnMap]);

  const toggle3DMode = useCallback(() => {
    setIs3DMode(prev => !prev);
    if (mapContainerRef.current?.toggleTerrain) {
      mapContainerRef.current.toggleTerrain(!is3DMode);
      
      toast({
        title: is3DMode ? "2D Mode" : "3D Terrain View",
        description: is3DMode ? "Switched to flat map view" : "Behold your empire in 3D glory!",
        duration: 2000,
      });
    }
  }, [is3DMode, toast]);

  return {
    mapLoaded,
    activeRoute,
    is3DMode,
    countryMarkers,
    limitedRoutes,
    mapContainerRef,
    handleMapLoaded,
    handleRouteClick,
    handleCountryClick,
    handleShipmentSelect,
    toggle3DMode,
    handleZoomIn,
    handleZoomOut,
    handleResetView
  };
};
