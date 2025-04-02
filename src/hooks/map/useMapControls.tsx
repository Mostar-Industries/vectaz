
import { useCallback, useMemo, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useMapErrors } from './useMapErrors';

interface MapControlsProps {
  mapContainerRef: React.MutableRefObject<any>;
  is3DMode: boolean;
}

export const useMapControls = ({ mapContainerRef, is3DMode }: MapControlsProps) => {
  const { toast } = useToast();
  const { handleMapError } = useMapErrors();
  const [isControlsEnabled, setIsControlsEnabled] = useState(true);
  
  // Memoize toast messages
  const toastMessages = useMemo(() => ({
    viewReset: {
      title: "View Reset",
      description: "Map view has been reset to the initial position.",
      duration: 2000,
    },
    terrainToggle: (is3D: boolean) => ({
      title: is3D ? "2D Mode" : "3D Terrain View",
      description: is3D ? "Switched to flat map view" : "Behold your empire in 3D glory!",
      duration: 2000,
    }),
    controlError: {
      title: "Map Control Error",
      description: "Unable to perform the requested map operation.",
      duration: 3000,
      variant: 'destructive' as const,
    }
  }), []);
  
  // Memoize map options for flyTo
  const resetViewOptions = useMemo(() => ({
    center: [0, 20] as [number, number],
    zoom: 2,
    pitch: 40,
    bearing: 0,
    duration: 1500
  }), []);
  
  // Zoom control handlers with useCallback
  const handleZoomIn = useCallback(() => {
    if (!isControlsEnabled) return;
    
    try {
      if (mapContainerRef.current?.mapRef?.current) {
        const map = mapContainerRef.current.mapRef.current;
        map.zoomIn({ duration: 500 });
      } else {
        throw new Error("Map reference is not available");
      }
    } catch (error) {
      handleMapError("CONTROL_ZOOM_IN_FAIL", "Failed to zoom in", error);
    }
  }, [mapContainerRef, isControlsEnabled, handleMapError]);
  
  const handleZoomOut = useCallback(() => {
    if (!isControlsEnabled) return;
    
    try {
      if (mapContainerRef.current?.mapRef?.current) {
        const map = mapContainerRef.current.mapRef.current;
        map.zoomOut({ duration: 500 });
      } else {
        throw new Error("Map reference is not available");
      }
    } catch (error) {
      handleMapError("CONTROL_ZOOM_OUT_FAIL", "Failed to zoom out", error);
    }
  }, [mapContainerRef, isControlsEnabled, handleMapError]);
  
  const handleResetView = useCallback(() => {
    if (!isControlsEnabled) return;
    
    try {
      if (mapContainerRef.current?.mapRef?.current) {
        const map = mapContainerRef.current.mapRef.current;
        map.flyTo(resetViewOptions);
        toast(toastMessages.viewReset);
      } else {
        throw new Error("Map reference is not available");
      }
    } catch (error) {
      handleMapError("CONTROL_RESET_VIEW_FAIL", "Failed to reset map view", error);
    }
  }, [mapContainerRef, resetViewOptions, toast, toastMessages, isControlsEnabled, handleMapError]);

  const toggle3DMode = useCallback(() => {
    if (!isControlsEnabled) return;
    
    try {
      if (mapContainerRef.current?.toggleTerrain) {
        mapContainerRef.current.toggleTerrain(!is3DMode);
        toast(toastMessages.terrainToggle(is3DMode));
      } else {
        throw new Error("Terrain toggle function is not available");
      }
    } catch (error) {
      handleMapError("CONTROL_TOGGLE_3D_FAIL", "Failed to toggle 3D terrain", error);
    }
  }, [mapContainerRef, is3DMode, toast, toastMessages, isControlsEnabled, handleMapError]);

  // Enable/disable controls
  const setControlsEnabled = useCallback((enabled: boolean) => {
    setIsControlsEnabled(enabled);
  }, []);

  return {
    handleZoomIn,
    handleZoomOut,
    handleResetView,
    toggle3DMode,
    isControlsEnabled,
    setControlsEnabled
  };
};
