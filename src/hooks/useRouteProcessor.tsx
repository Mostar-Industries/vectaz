
import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (isDataLoaded && shipmentData.length > 0) {
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
        shipmentCount: 1,
        deliveryStatus: shipment.delivery_status
      }));
      
      setRoutes(mapRoutes);
    }
  }, [isDataLoaded, shipmentData]);

  return { routes };
};

export default useRouteProcessor;
