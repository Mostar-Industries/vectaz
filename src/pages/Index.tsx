
import React, { useEffect, useState, useRef } from 'react';
import { useBaseDataStore } from '@/store/baseState';
import MapVisualizer from '@/components/MapVisualizer';
import { toast } from '@/hooks/use-toast';
import { AppSection } from '@/types/deeptrack';
import AppTabs from '@/components/AppTabs';
import AnalyticsSection from '@/components/AnalyticsSection';
import DeepCALSection from '@/components/DeepCALSection';
import AboutSection from '@/components/AboutSection';
import SettingsSection from '@/components/SettingsSection';
import EntryAnimation from '@/components/EntryAnimation';
import { motion, AnimatePresence } from 'framer-motion';

const Index = () => {
  const { isDataLoaded, shipmentData } = useBaseDataStore();
  const [routes, setRoutes] = useState([]);
  const [showEntry, setShowEntry] = useState(true);
  const [activeTab, setActiveTab] = useState<AppSection>('map');

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
  }, [isDataLoaded, shipmentData]);

  const handleEntryComplete = () => {
    setShowEntry(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'map':
        return (
          <motion.div 
            key="map-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-screen w-full"
          >
            <MapVisualizer routes={routes} isLoading={!isDataLoaded} />
          </motion.div>
        );
      case 'analytics':
        return (
          <motion.div 
            key="analytics-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="pt-8 pb-24"
          >
            <AnalyticsSection />
          </motion.div>
        );
      case 'deepcal':
        return (
          <motion.div 
            key="deepcal-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="pt-8 pb-24"
          >
            <DeepCALSection />
          </motion.div>
        );
      case 'about':
        return (
          <motion.div 
            key="about-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="pt-8 pb-24"
          >
            <AboutSection />
          </motion.div>
        );
      case 'settings':
        return (
          <motion.div 
            key="settings-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="pt-8 pb-24"
          >
            <SettingsSection />
          </motion.div>
        );
      default:
        return null;
    }
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
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
        
        {/* App name in top left (visible on all views) */}
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md py-2 px-4 rounded-lg shadow-md z-10 border border-blue-500/30 tech-glow">
          <h1 className="text-xl font-bold neon-text">DeepCAL</h1>
        </div>
        
        {/* Navigation tabs (now at the top) */}
        <AppTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default Index;
