
import React, { useEffect, useState, useRef } from 'react';
import { useBaseDataStore } from '@/store/baseState';
import MapVisualizer from '@/components/MapVisualizer';
import { useToast } from '@/hooks/use-toast';
import { AppSection } from '@/types/deeptrack';
import AppTabs from '@/components/AppTabs';
import AnalyticsSection from '@/components/AnalyticsSection';
import DeepCALSection from '@/components/DeepCALSection';
import AboutSection from '@/components/AboutSection';
import SettingsSection from '@/components/SettingsSection';
import EntryAnimation from '@/components/EntryAnimation';
import { motion, AnimatePresence } from 'framer-motion';
import { DecisionMatrix } from '@/components';

const Index = () => {
  const { isDataLoaded, shipmentData } = useBaseDataStore();
  const [routes, setRoutes] = useState([]);
  const [showEntry, setShowEntry] = useState(true);
  const [activeTab, setActiveTab] = useState<AppSection>('map');
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
      
      // Enhanced notification with sound effect
      const notificationSound = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU...'); // Base64 audio would go here
      notificationSound.volume = 0.5;
      try {
        notificationSound.play().catch(e => console.log('Audio not allowed yet by browser'));
      } catch (e) {
        console.log('Audio playback error:', e);
      }
      
      // Notify user that system is ready with enhanced toast
      toast({
        title: "DeepCAL Ready",
        description: "System initialized successfully with verified data. Your supply chain has a PhD now.",
        duration: 5000,
      });
    }
  }, [isDataLoaded, shipmentData, toast]);

  const handleEntryComplete = () => {
    setShowEntry(false);
  };

  // Handle 404 (Konami code) Easter egg
  useEffect(() => {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          // Activate pirate mode
          toast({
            title: "🏴‍☠️ Pirates of the Caribbean Mode Activated",
            description: "Yarr! Your shipments be sailing the seven seas now, matey!",
            duration: 5000,
          });
          
          // Add pirate hat to the logo
          const logo = document.querySelector('.app-logo');
          if (logo) {
            const pirateHat = document.createElement('div');
            pirateHat.className = 'absolute -top-8 left-1/2 transform -translate-x-1/2 text-3xl';
            pirateHat.textContent = '🏴‍☠️';
            logo.appendChild(pirateHat);
          }
          
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toast]);

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

  // Custom 404 page for navigation errors
  const render404 = () => (
    <div className="flex flex-col items-center justify-center h-screen bg-[#0A1A2F] text-white">
      <div className="text-[#00FFD1] text-8xl font-bold mb-4">404</div>
      <div className="text-xl mb-6">This page is more missing than SR_24-029. Try again?</div>
      <img src="/lovable-uploads/lost-parcel.gif" alt="Lost Parcel" className="w-80 h-80 object-contain mb-8" />
      <button 
        onClick={() => setActiveTab('map')}
        className="px-6 py-3 bg-[#00FFD1]/20 border border-[#00FFD1]/50 rounded-lg text-[#00FFD1] hover:bg-[#00FFD1]/30 transition-colors"
      >
        Back to Known Territory
      </button>
    </div>
  );

  if (showEntry) {
    return <EntryAnimation onComplete={handleEntryComplete} />;
  }

  return (
    <div className="h-screen w-full overflow-x-hidden relative tech-bg">
      <div className="absolute inset-0 bg-[#0A1A2F] z-0"></div>
      <div className="tech-grid absolute inset-0 z-0"></div>
      <div className="network-lines absolute inset-0 z-0"></div>
      
      {/* Ambient particle effect */}
      <div className="absolute inset-0 z-0 opacity-30">
        {Array(20).fill(0).map((_, i) => (
          <div 
            key={i}
            className="absolute bg-[#00FFD1] rounded-full opacity-30"
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 20 + 10}s`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        ))}
      </div>
      
      {/* Application content */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
        
        {/* App name in top right with enhanced styling */}
        <div className="app-logo absolute top-4 right-4 bg-[#0A1A2F]/80 backdrop-blur-md py-2 px-4 rounded-lg shadow-md z-10 border border-[#00FFD1]/30 shadow-[0_0_15px_rgba(0,255,209,0.2)]">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00FFD1] to-blue-300">DeepCAL</h1>
        </div>
        
        {/* Navigation tabs (at the top) */}
        <AppTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default Index;
