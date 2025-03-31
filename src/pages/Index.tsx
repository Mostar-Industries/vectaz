
import React, { useEffect, useState } from 'react';
import { useBaseDataStore } from '@/store/baseState';
import MapVisualizer from '@/components/MapVisualizer';
import IconNavigation from '@/components/IconNavigation';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const { isDataLoaded, shipmentData } = useBaseDataStore();
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    if (isDataLoaded) {
      // Process shipment data into routes for the map
      const mapRoutes = shipmentData.map(shipment => ({
        origin: {
          lat: shipment.origin_latitude,
          lng: shipment.origin_longitude,
          name: shipment.origin_country,
          isOrigin: true
        },
        destination: {
          lat: shipment.destination_latitude,
          lng: shipment.destination_longitude,
          name: shipment.destination_country,
          isOrigin: false
        },
        weight: shipment.weight_kg,
        shipmentCount: 1
      }));
      
      setRoutes(mapRoutes);
      
      // Notify user that system is ready
      toast({
        title: "DeepCAL Ready",
        description: "System initialized successfully with verified data.",
      });
    }
  }, [isDataLoaded, shipmentData]);

  return (
    <div className="h-screen w-full overflow-hidden relative">
      {/* Full-screen map */}
      <div className="absolute inset-0">
        <MapVisualizer routes={routes} isLoading={!isDataLoaded} />
      </div>
      
      {/* App name in top left */}
      <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm py-2 px-4 rounded-lg shadow-md z-10 border border-border">
        <h1 className="text-xl font-bold">DeepCAL</h1>
      </div>
      
      {/* Icon Navigation in center top */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <IconNavigation />
      </div>
    </div>
  );
};

export default Index;
