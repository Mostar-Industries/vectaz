
import React, { useEffect, useState } from 'react';
import { useBaseDataStore } from '@/store/baseState';
import MapVisualizer from '@/components/MapVisualizer';
import { useToast } from '@/hooks/use-toast';
import AppTabs from '@/components/AppTabs';
import EntryAnimation from '@/components/EntryAnimation';
import { motion } from 'framer-motion';
import IconNavigation from '@/components/IconNavigation';

const Index = () => {
  const { isDataLoaded, shipmentData } = useBaseDataStore();
  const [routes, setRoutes] = useState([]);
  const [showEntry, setShowEntry] = useState(true);
  const { toast } = useToast();

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
        shipmentCount: 1,
        deliveryStatus: shipment.delivery_status
      }));
      
      setRoutes(mapRoutes);
      
      // Notify user that system is ready
      toast({
        title: "DeepCAL Ready",
        description: "System initialized successfully with verified data.",
      });
    }
  }, [isDataLoaded, shipmentData, toast]);

  const handleEntryComplete = () => {
    setShowEntry(false);
  };

  if (showEntry) {
    return <EntryAnimation onComplete={handleEntryComplete} />;
  }

  return (
    <div className="h-screen w-full overflow-x-hidden relative tech-bg">
      <div className="tech-grid absolute inset-0 z-0"></div>
      <div className="network-lines absolute inset-0 z-0"></div>
      
      {/* Application content */}
      <div className="relative z-10">
        <motion.div 
          key="map-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="h-screen w-full"
        >
          <MapVisualizer routes={routes} isLoading={!isDataLoaded} />
        </motion.div>
        
        {/* App name in top right */}
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md py-2 px-4 rounded-lg shadow-md z-10 border border-blue-500/30 tech-glow">
          <h1 className="text-xl font-bold neon-text">DeepCAL</h1>
        </div>
        
        {/* Bottom navigation */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <IconNavigation />
        </div>
        
        {/* Navigation tabs (at the top) */}
        <AppTabs />
      </div>
    </div>
  );
};

export default Index;
