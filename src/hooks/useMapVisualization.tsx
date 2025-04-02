
import { useState, useRef } from 'react';
import { Route } from '@/types/deeptrack';
import { useMapMarkers } from './map/useMapMarkers';
import { useMapControls } from './map/useMapControls';
import { useRouteInteractions } from './map/useRouteInteractions';
import { useEventHandlers } from './map/useEventHandlers';

export const useMapVisualization = (routes: Route[]) => {
  const [is3DMode, setIs3DMode] = useState(false);
  const mapContainerRef = useRef<any>(null);
  
  // Use the smaller, focused hooks
  const { countryMarkers, limitedRoutes } = useMapMarkers(routes);
  
  const { 
    mapLoaded, 
    activeRoute, 
    handleMapLoaded, 
    handleCountryClick 
  } = useEventHandlers();
  
  const { 
    handleRouteClick, 
    handleJumpToLocation, 
    handleShipmentSelect 
  } = useRouteInteractions({ 
    limitedRoutes, 
    mapContainerRef 
  });
  
  const { 
    handleZoomIn, 
    handleZoomOut, 
    handleResetView, 
    toggle3DMode 
  } = useMapControls({ 
    mapContainerRef, 
    is3DMode 
  });
  
  // Toggle 3D mode state
  const handleToggle3DMode = () => {
    setIs3DMode(prev => !prev);
    toggle3DMode();
  };
  
  // Combined handleRouteClick that updates state and shows info
  const combinedRouteClick = (routeIndex: number | null) => {
    handleRouteClick(routeIndex);
    if (routeIndex !== null) {
      handleRouteClick(routeIndex);
    }
  };

  return {
    mapLoaded,
    activeRoute,
    is3DMode,
    countryMarkers,
    limitedRoutes,
    mapContainerRef,
    handleMapLoaded,
    handleRouteClick: combinedRouteClick,
    handleCountryClick,
    handleShipmentSelect,
    toggle3DMode: handleToggle3DMode,
    handleZoomIn,
    handleZoomOut,
    handleResetView
  };
};
