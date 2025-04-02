
import { useState, useEffect, useMemo } from 'react';
import { useBaseDataStore } from '@/store/baseState';

interface Route {
  origin: {
    lat: number;
    lng: number;
    name: string;
    isOrigin: boolean;
  };
  destination: {
    lat: number;
    lng: number;
    name: string;
    isOrigin: boolean;
  };
  weight: number;
  shipmentCount: number;
  deliveryStatus: string;
}

export const useRouteProcessor = () => {
  const { isDataLoaded, shipmentData } = useBaseDataStore();
  const [routes, setRoutes] = useState<Route[]>([]);

  // Use useMemo to process data only when dependencies change
  const processedRoutes = useMemo(() => {
    if (!isDataLoaded || shipmentData.length === 0) {
      return [];
    }
    
    // Process shipment data into routes for the map
    return shipmentData.map(shipment => ({
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
      shipmentCount: 1,
      deliveryStatus: shipment.delivery_status
    }));
  }, [isDataLoaded, shipmentData]);

  useEffect(() => {
    setRoutes(processedRoutes);
  }, [processedRoutes]);

  return { routes };
};

export default useRouteProcessor;
