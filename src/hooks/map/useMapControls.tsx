
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface MapControlsProps {
  mapContainerRef: React.MutableRefObject<any>;
  is3DMode: boolean;
}

export const useMapControls = ({ mapContainerRef, is3DMode }: MapControlsProps) => {
  const { toast } = useToast();
  
  // Zoom control handlers with useCallback
  const handleZoomIn = useCallback(() => {
    if (mapContainerRef.current?.mapRef?.current) {
      const map = mapContainerRef.current.mapRef.current;
      map.zoomIn({ duration: 500 });
    }
  }, [mapContainerRef]);
  
  const handleZoomOut = useCallback(() => {
    if (mapContainerRef.current?.mapRef?.current) {
      const map = mapContainerRef.current.mapRef.current;
      map.zoomOut({ duration: 500 });
    }
  }, [mapContainerRef]);
  
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
  }, [mapContainerRef, toast]);

  const toggle3DMode = useCallback(() => {
    if (mapContainerRef.current?.toggleTerrain) {
      mapContainerRef.current.toggleTerrain(!is3DMode);
      
      toast({
        title: is3DMode ? "2D Mode" : "3D Terrain View",
        description: is3DMode ? "Switched to flat map view" : "Behold your empire in 3D glory!",
        duration: 2000,
      });
    }
  }, [mapContainerRef, is3DMode, toast]);

  return {
    handleZoomIn,
    handleZoomOut,
    handleResetView,
    toggle3DMode
  };
};
